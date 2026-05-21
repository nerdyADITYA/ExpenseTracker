const { google } = require("googleapis");
const { encrypt, decrypt } = require("../utils/cryptoHelper");
const { parseEmail } = require("../utils/emailParser");
const PendingTransaction = require("../models/PendingTransaction");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const BankAccount = require("../models/BankAccount");

const matchBank = (userBankName, detectedBankName) => {
  if (!userBankName || !detectedBankName) return false;
  let u = userBankName.toLowerCase().trim();
  let d = detectedBankName.toLowerCase().trim();

  // Normalize SBI/State Bank of India
  if (u.includes("sbi") || u.includes("state bank of india")) {
    u = "sbi";
  }
  if (d.includes("sbi") || d.includes("state bank of india")) {
    d = "sbi";
  }

  return u.includes(d) || d.includes(u);
};

// Initialize Google OAuth2 Client
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
};

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

/**
 * Generates OAuth authentication url.
 * @param {string} state 
 */
const getAuthUrl = (state) => {
  const oAuth2Client = getOAuth2Client();
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force consent screen to retrieve refresh token
    state: state,
  });
};

/**
 * Exchanges auth code for tokens.
 */
const getTokens = async (code) => {
  const oAuth2Client = getOAuth2Client();
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
};

/**
 * Returns a refreshed Google OAuth2 client. Updates database user credentials if tokens refresh.
 */
const getFreshClient = async (user) => {
  const oAuth2Client = getOAuth2Client();
  
  const accessToken = decrypt(user.gmailAccessToken);
  const refreshToken = decrypt(user.gmailRefreshToken);

  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Set up event listener to automatically save newly refreshed tokens
  oAuth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      user.gmailAccessToken = encrypt(tokens.access_token);
      if (tokens.expiry_date) {
        user.gmailTokenExpiresAt = new Date(tokens.expiry_date);
      }
      await user.save();
      console.log(`Tokens automatically updated in DB for User ID: ${user.id}`);
    }
  });

  // Check and refresh token if expired
  await oAuth2Client.getAccessToken();

  return oAuth2Client;
};

/**
 * Extracts plain text body from a Gmail message payload.
 */
const getMessageBody = (messagePayload) => {
  if (!messagePayload) return "";
  let body = "";

  const plainParts = [];
  const htmlParts = [];

  const findParts = (part) => {
    if (part.parts) {
      part.parts.forEach(findParts);
    } else {
      if (part.mimeType === "text/plain") {
        plainParts.push(part);
      } else if (part.mimeType === "text/html") {
        htmlParts.push(part);
      }
    }
  };

  findParts(messagePayload);

  // 1. Prefer plain text parts
  if (plainParts.length > 0) {
    body = plainParts.map((p) => {
      if (p.body && p.body.data) {
        return Buffer.from(p.body.data, "base64").toString("utf8");
      }
      return "";
    }).join("\n");
  } 
  // 2. Fallback to HTML parts, stripping tags for cleaner text
  else if (htmlParts.length > 0) {
    body = htmlParts.map((p) => {
      if (p.body && p.body.data) {
        const html = Buffer.from(p.body.data, "base64").toString("utf8");
        return html
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // remove css styles
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // remove javascript
          .replace(/<[^>]+>/g, " ") // remove html tags
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " "); // collapse whitespace
      }
      return "";
    }).join("\n");
  } 
  // 3. Ultimate fallback to top-level body
  else if (messagePayload.body && messagePayload.body.data) {
    body = Buffer.from(messagePayload.body.data, "base64").toString("utf8");
  }

  return body;
};

/**
 * Check if a Gmail message ID has already been parsed and exists in database tables.
 */
const checkEmailExists = async (userId, emailId) => {
  const pending = await PendingTransaction.findOne({ where: { userId, emailId } });
  if (pending) return true;

  const expense = await Expense.findOne({ where: { userId, emailId } });
  if (expense) return true;

  const income = await Income.findOne({ where: { userId, emailId } });
  if (income) return true;

  return false;
};

/**
 * Fetch recent emails matching search filters and parse transactions into staging table.
 */
const syncEmails = async (user) => {
  if (!user.gmailConnected) return { success: false, message: "Gmail not connected" };

  try {
    const authClient = await getFreshClient(user);
    const gmail = google.gmail({ version: "v1", auth: authClient });

    // Fetch user bank accounts for resolution
    const userAccounts = await BankAccount.findAll({ where: { userId: user.id } });

    // Filter recent 2 days bank messages (saves time/bandwidth, covers hourly syncs)
    const query = "subject:(debited OR credited OR transaction OR payment OR alert OR transfer OR txn OR update) newer_than:2d";
    
    const response = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 20,
    });

    const messages = response.data.messages || [];
    let importedCount = 0;

    // 1. Identify which emails are already imported (do database checks in parallel)
    const checkExistsPromises = messages.map(async (msg) => {
      const exists = await checkEmailExists(user.id, msg.id);
      return exists ? null : msg;
    });
    
    const newMessages = (await Promise.all(checkExistsPromises)).filter(Boolean);

    // 2. Limit processing to a maximum of 10 concurrent requests to prevent rate limiting or timeouts
    const messagesToFetch = newMessages.slice(0, 10);

    if (messagesToFetch.length === 0) {
      return { success: true, imported: 0 };
    }

    // 3. Retrieve all full email message details in parallel
    const fetchPromises = messagesToFetch.map(async (msg) => {
      try {
        const msgDetails = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });
        return msgDetails.data;
      } catch (err) {
        console.error(`Failed to fetch message details for ID ${msg.id}:`, err);
        return null;
      }
    });

    const fetchedMessages = (await Promise.all(fetchPromises)).filter(Boolean);

    // 4. Parse messages and write to DB
    for (const msgData of fetchedMessages) {
      const emailId = msgData.id;
      const bodyText = getMessageBody(msgData.payload);
      if (!bodyText) continue;

      // Run parsing rules
      const parsedTx = parseEmail(bodyText);
      if (!parsedTx) continue;

      // Resolve bank account mapping
      let bankAccountId = null;
      const detectedBankName = parsedTx.detectedBankName;
      const detectedAccountNumber = parsedTx.detectedAccountNumber;

      if (detectedBankName) {
        // Find user accounts of this bank
        const matchingBankAccounts = userAccounts.filter(acc => 
          matchBank(acc.bankName, detectedBankName)
        );

        if (matchingBankAccounts.length > 0) {
          // Double validation: bank name + account number (last 4 digits matching)
          if (detectedAccountNumber) {
            const doubleMatched = matchingBankAccounts.find(acc => 
              acc.accountNumber && acc.accountNumber.trim().endsWith(detectedAccountNumber)
            );
            if (doubleMatched) {
              bankAccountId = doubleMatched.id;
            }
          }

          // Fallback check: if double validation didn't match, and there's exactly one user bank account registered for this bank
          if (!bankAccountId && matchingBankAccounts.length === 1) {
            bankAccountId = matchingBankAccounts[0].id;
          }
        }
      }

      // Determine date from message header
      let dateVal = new Date();
      const headers = msgData.payload.headers || [];
      const dateHeader = headers.find((h) => h.name.toLowerCase() === "date");
      if (dateHeader) {
        dateVal = new Date(dateHeader.value);
      }

      // Store in staging table
      await PendingTransaction.create({
        userId: user.id,
        amount: parsedTx.amount,
        type: parsedTx.type,
        merchant: parsedTx.merchant || "Unknown Merchant",
        date: dateVal,
        emailId: emailId,
        rawText: bodyText,
        status: "pending",
        bankAccountId,
        detectedBankName,
        detectedAccountNumber,
      });

      importedCount++;
    }

    return { success: true, imported: importedCount };
  } catch (error) {
    console.error(`Error syncing emails for user ${user.id}:`, error);
    throw error;
  }
};

module.exports = {
  getAuthUrl,
  getTokens,
  syncEmails,
};

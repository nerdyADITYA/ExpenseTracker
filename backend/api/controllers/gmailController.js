const User = require("../models/User");
const PendingTransaction = require("../models/PendingTransaction");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { getAuthUrl, getTokens, syncEmails } = require("../services/gmailService");
const { encrypt } = require("../utils/cryptoHelper");

/**
 * Returns OAuth authorization URL
 */
exports.getGmailAuthUrl = (req, res) => {
  try {
    const userId = req.user.id;
    // Pass User ID in OAuth state so callback knows who authorized
    const url = getAuthUrl(String(userId));
    res.json({ url });
  } catch (error) {
    console.error("Error generating Gmail auth URL:", error);
    res.status(500).json({ message: "Server error generating auth URL" });
  }
};

const getClientRedirectUrl = (req) => {
  const clientUrls = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(url => url.trim()) : [];
  if (clientUrls.length === 0) return "";
  if (clientUrls.length === 1) return clientUrls[0];
  
  const host = req.get("host") || "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const localUrl = clientUrls.find(url => url.includes("localhost") || url.includes("127.0.0.1"));
    if (localUrl) return localUrl;
  }
  return clientUrls[0];
};

/**
 * OAuth2 redirect callback target
 */
exports.gmailCallback = async (req, res) => {
  const { code, state: userIdStr } = req.query;

  if (!code || !userIdStr) {
    return res.status(400).send("Invalid OAuth response. Missing code or state.");
  }

  const userId = parseInt(userIdStr);
  const clientRedirectUrl = getClientRedirectUrl(req);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send("User not found during Gmail authorization callback.");
    }

    // Exchange authorization code for tokens
    const tokens = await getTokens(code);

    if (!tokens.refresh_token && !user.gmailRefreshToken) {
      // Sometimes refresh token is omitted if consent was already given in the past.
      // Re-trigger auth url but with prompt=consent if refresh_token is missing.
      return res.redirect(
        `${clientRedirectUrl}/dashboard?gmail_connect=error&reason=consent_missing`
      );
    }

    // Save encrypted tokens to the database
    user.gmailAccessToken = encrypt(tokens.access_token);
    if (tokens.refresh_token) {
      user.gmailRefreshToken = encrypt(tokens.refresh_token);
    }
    if (tokens.expiry_date) {
      user.gmailTokenExpiresAt = new Date(tokens.expiry_date);
    }
    user.gmailConnected = true;
    await user.save();

    console.log(`User ${userId} successfully connected Gmail account.`);

    // Trigger initial email sync to load recent transactions immediately
    try {
      await syncEmails(user);
    } catch (syncError) {
      console.error("Failed initial email sync after authorization:", syncError);
    }

    // Redirect user back to frontend dashboard
    res.redirect(`${clientRedirectUrl}/dashboard?gmail_connect=success`);
  } catch (error) {
    console.error("Error in Gmail OAuth callback:", error);
    res.redirect(`${clientRedirectUrl}/dashboard?gmail_connect=failed`);
  }
};


/**
 * Disconnects Gmail account and purges pending staging items
 */
exports.disconnectGmail = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear Gmail credentials
    user.gmailConnected = false;
    user.gmailAccessToken = null;
    user.gmailRefreshToken = null;
    user.gmailTokenExpiresAt = null;
    await user.save();

    // Clean up staging table for unapproved items (we delete them since user has disconnected)
    await PendingTransaction.destroy({
      where: { userId, status: "pending" },
    });

    res.json({ message: "Gmail disconnected and pending staging queue cleared successfully" });
  } catch (error) {
    console.error("Error disconnecting Gmail:", error);
    res.status(500).json({ message: "Server Error disconnecting Gmail" });
  }
};

/**
 * Gets Gmail connection status
 */
exports.getGmailStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ connected: user ? user.gmailConnected : false });
  } catch (error) {
    res.status(500).json({ message: "Server error checking Gmail connection status" });
  }
};

/**
 * Lists pending transactions
 */
exports.getPendingTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await PendingTransaction.findAll({
      where: { userId, status: "pending" },
      order: [["date", "DESC"]],
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    res.status(500).json({ message: "Server Error fetching pending transactions" });
  }
};

/**
 * Manually trigger email sync
 */
exports.triggerManualSync = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.gmailConnected) {
      return res.status(400).json({ message: "Gmail account not connected" });
    }

    const syncResult = await syncEmails(user);
    res.json({ message: "Email sync completed successfully", count: syncResult.imported });
  } catch (error) {
    console.error("Manual sync failed:", error);
    res.status(500).json({ message: "Sync failed", error: error.message });
  }
};

/**
 * Approves a transaction and copies it into active lists
 */
exports.approveTransaction = async (req, res) => {
  const userId = req.user.id;
  const pendingId = req.params.id;
  const { amount, type, categoryOrSource, date, merchant } = req.body;
  const bankAccountId = req.headers["x-bank-account-id"];

  try {
    const pendingTx = await PendingTransaction.findOne({
      where: { id: pendingId, userId, status: "pending" },
    });

    if (!pendingTx) {
      return res.status(404).json({ message: "Pending transaction not found" });
    }

    if (!bankAccountId) {
      return res.status(400).json({ message: "Bank account selection is required !!!" });
    }

    // Capture values, allowing overrides from the user's edit inputs
    const finalAmount = amount || pendingTx.amount;
    const finalType = type || pendingTx.type;
    const finalDate = date ? new Date(date) : pendingTx.date;
    const finalLabel = categoryOrSource || merchant || pendingTx.merchant || "Imported Email";

    if (finalType === "expense") {
      await Expense.create({
        userId,
        amount: finalAmount,
        category: finalLabel,
        date: finalDate,
        icon: "", // Use default icon
        entrySource: "email",
        emailId: pendingTx.emailId,
        rawText: pendingTx.rawText,
        bankAccountId,
      });
    } else {
      await Income.create({
        userId,
        amount: finalAmount,
        source: finalLabel, // Mapped to the source field in Income
        date: finalDate,
        icon: "", // Use default icon
        entrySource: "email",
        emailId: pendingTx.emailId,
        rawText: pendingTx.rawText,
        bankAccountId,
      });
    }

    // Set pending status to approved (we keep the entry in the pending table to preserve emailId unique validation constraint)
    pendingTx.status = "approved";
    await pendingTx.save();

    res.json({ message: "Transaction approved and saved successfully" });
  } catch (error) {
    console.error("Error approving transaction:", error);
    res.status(500).json({ message: "Server Error approving transaction" });
  }
};

/**
 * Dismisses/deletes a pending transaction
 */
exports.deletePendingTransaction = async (req, res) => {
  const userId = req.user.id;
  const pendingId = req.params.id;

  try {
    const pendingTx = await PendingTransaction.findOne({
      where: { id: pendingId, userId, status: "pending" },
    });

    if (!pendingTx) {
      return res.status(404).json({ message: "Pending transaction not found" });
    }

    // Mark as deleted so it doesn't pop up again (preserving emailId unique index)
    pendingTx.status = "deleted";
    await pendingTx.save();

    res.json({ message: "Transaction dismissed successfully" });
  } catch (error) {
    console.error("Error dismissing transaction:", error);
    res.status(500).json({ message: "Server Error dismissing transaction" });
  }
};

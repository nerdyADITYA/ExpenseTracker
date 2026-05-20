/**
 * Clean and normalize email body text.
 * @param {string} text 
 * @returns {string}
 */
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .replace(/\s+/g, " ") // replace multiple spaces/newlines with a single space
    .replace(/=0D/g, "")   // remove email encoding noise
    .replace(/=0A/g, "")
    .trim();
};

/**
 * Helper to clean and format merchant name
 */
const cleanMerchant = (merchant) => {
  if (!merchant) return "Unknown Merchant";
  return merchant
    .replace(/^UPI-/i, "")
    .replace(/ref\s*(?:no)?\.?\s*\d+/i, "")
    .replace(/^\bVPA\b\s*/i, "")
    .trim();
};

/**
 * Parser for ICICI Bank email alerts.
 */
const parseICICI = (text) => {
  const amountMatch = text.match(/(?:debited|credited)\s+with\s+(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)/i) || 
                      text.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)\s+(?:debited|credited)/i);
  if (!amountMatch) return null;
  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
  
  const type = text.toLowerCase().includes("debited") ? "expense" : "income";
  
  let merchant = null;
  const merchantMatch = text.match(/Info:\s*([^.]+)/i) || text.match(/to\s+VPA\s+([^.]+)/i);
  if (merchantMatch) {
    merchant = cleanMerchant(merchantMatch[1]);
  }

  return { amount, type, merchant };
};

/**
 * Parser for HDFC Bank email alerts.
 */
const parseHDFC = (text) => {
  const amountMatch = text.match(/(?:payment\s+of|Rs\.?|INR|₹)\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{2})?)/i) ||
                      text.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)\s+(?:debited|credited)/i);
  if (!amountMatch) return null;
  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

  const isDebit = text.toLowerCase().includes("debited") || 
                  text.toLowerCase().includes("payment") || 
                  text.toLowerCase().includes("spent") || 
                  text.toLowerCase().includes("made a");
  const type = isDebit ? "expense" : "income";

  let merchant = null;
  
  // If it's a credit, try to find "Sender: ...", "Payer: ...", "Source: ..." first
  if (type === "income") {
    const senderMatch = text.match(/(?:sender|payer|source|from):\s*(.*?)(?:\s+(?:[a-z]\.|(?:upi|ref|reference|no|balance|ending|date)\b)|\.(?:\s|$)|$)/i);
    if (senderMatch) {
      merchant = cleanMerchant(senderMatch[1]);
    }
  }

  // Fallback to "to..." or "towards..." (used for debits or general formats)
  if (!merchant) {
    const merchantMatch = text.match(/(?:to|towards)\s+(?:VPA\s+)?(.*?)(?:\s+on|\s+at|\s+date|\s+via|\b\d|\.(?:\s|$)|$)/i);
    if (merchantMatch) {
      merchant = cleanMerchant(merchantMatch[1]);
    }
  }

  return { amount, type, merchant };
};

/**
 * Parser for SBI Bank email alerts.
 */
const parseSBI = (text) => {
  const amountMatch = text.match(/(?:debited|credited)\s+by\s+(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)/i) ||
                      text.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)\s+(?:debited|credited)/i);
  if (!amountMatch) return null;
  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

  const type = text.toLowerCase().includes("debited") ? "expense" : "income";

  let merchant = null;
  const merchantMatch = text.match(/by\s+UPI\s+Ref\s+([^\s]+)/i) || text.match(/transfer\s+to\s+([^\s]+)/i);
  if (merchantMatch) {
    merchant = cleanMerchant(merchantMatch[1]);
  }

  return { amount, type, merchant };
};

/**
 * Fallback parser for generic formats.
 */
const parseGeneric = (text) => {
  const amountMatch = text.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)/i);
  if (!amountMatch) return null;
  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));

  const isDebit = /\b(debited|spent|paid|payment|withdrawn|sent|transfer(red)?\s+to)\b/i.test(text);
  const type = isDebit ? "expense" : "income";

  let merchant = null;
  
  // If it's a credit, try to find "Sender: ...", "Payer: ...", "Source: ..." first
  if (type === "income") {
    const senderMatch = text.match(/(?:sender|payer|source|from):\s*(.*?)(?:\s+(?:[a-z]\.|(?:upi|ref|reference|no|balance|ending|date)\b)|\.(?:\s|$)|$)/i);
    if (senderMatch) {
      merchant = cleanMerchant(senderMatch[1]);
    }
  }

  // Fallback to general merchant parsing
  if (!merchant) {
    const merchantMatch = text.match(/(?:paid\s+to|transfer(?:red)?\s+to|at|info:|towards)\s*(?:VPA\s+)?(.*?)(?:\s+on|\s+at|\s+date|\s+via|\b\d|\.(?:\s|$)|$)/i);
    if (merchantMatch) {
      merchant = cleanMerchant(merchantMatch[1]);
    }
  }

  return { amount, type, merchant };
};

/**
 * Main email parser entry point.
 * @param {string} rawText 
 * @returns {object|null}
 */
const parseEmail = (rawText) => {
  if (!rawText) return null;

  const text = normalizeText(rawText);
  let parsed = null;

  // Call the appropriate parser based on keywords in the body
  if (/icici/i.test(text)) {
    parsed = parseICICI(text);
  } else if (/hdfc/i.test(text)) {
    parsed = parseHDFC(text);
  } else if (/sbi/i.test(text)) {
    parsed = parseSBI(text);
  }

  // Fallback to generic parsing if bank-specific logic failed or didn't run
  if (!parsed) {
    parsed = parseGeneric(text);
  }

  return parsed;
};

module.exports = { parseEmail };

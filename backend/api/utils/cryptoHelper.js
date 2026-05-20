const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = process.env.GMAIL_ENCRYPTION_KEY;

/**
 * Encrypts cleartext using AES-256-CBC.
 * @param {string} text 
 * @returns {string} iv:ciphertext format
 */
function encrypt(text) {
  if (!text) return null;
  if (!ENCRYPTION_KEY) {
    throw new Error("GMAIL_ENCRYPTION_KEY is not defined in environment variables.");
  }
  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypts ciphertext in iv:ciphertext format.
 * @param {string} text 
 * @returns {string} cleartext
 */
function decrypt(text) {
  if (!text) return null;
  if (!ENCRYPTION_KEY) {
    throw new Error("GMAIL_ENCRYPTION_KEY is not defined in environment variables.");
  }
  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };

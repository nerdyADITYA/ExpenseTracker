const express = require("express");
const {
  getGmailAuthUrl,
  gmailCallback,
  getGmailStatus,
  disconnectGmail,
  getPendingTransactions,
  triggerManualSync,
  approveTransaction,
  deletePendingTransaction,
} = require("../controllers/gmailController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// OAuth routes
router.get("/auth-url", protect, getGmailAuthUrl);
router.get("/callback", gmailCallback); // Public endpoint for Google redirection
router.post("/disconnect", protect, disconnectGmail);
router.get("/status", protect, getGmailStatus);

// Pending transactions routes
router.get("/pending", protect, getPendingTransactions);
router.post("/sync", protect, triggerManualSync);
router.post("/approve/:id", protect, approveTransaction);
router.delete("/pending/:id", protect, deletePendingTransaction);

module.exports = router;

const express = require("express");
const { addBankAccount, getBankAccounts, deleteBankAccount } = require("../controllers/bankAccountController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", protect, addBankAccount);
router.get("/get", protect, getBankAccounts);
router.delete("/:id", protect, deleteBankAccount);

module.exports = router;

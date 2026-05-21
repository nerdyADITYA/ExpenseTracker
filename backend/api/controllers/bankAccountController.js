const BankAccount = require("../models/BankAccount");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { fn, col } = require("sequelize");

// Add Bank Account
exports.addBankAccount = async (req, res) => {
    const userId = req.user.id;
    const { bankName, accountNumber, accountHolderName, accountType, initialBalance } = req.body;

    if (!bankName || !accountNumber) {
        return res.status(400).json({ message: "Bank name and account number are required!" });
    }

    try {
        // Check if this is the first bank account of the user
        const existingCount = await BankAccount.count({ where: { userId } });

        const newAccount = await BankAccount.create({
            userId,
            bankName,
            accountNumber,
            accountHolderName: accountHolderName || null,
            accountType: accountType || "Savings",
            initialBalance: parseFloat(initialBalance || 0),
        });

        // If it's their first bank account, map legacy transactions to it
        if (existingCount === 0) {
            console.log(`First bank account created for user ${userId}. Mapping legacy transactions to account ${newAccount.id}.`);
            
            // Map legacy expenses (where bankAccountId is NULL or not set)
            await Expense.update(
                { bankAccountId: newAccount.id },
                { where: { userId, bankAccountId: null } }
            );

            // Map legacy incomes (where bankAccountId is NULL or not set)
            await Income.update(
                { bankAccountId: newAccount.id },
                { where: { userId, bankAccountId: null } }
            );
        }

        res.status(201).json(newAccount);
    } catch (error) {
        console.error("Error adding bank account:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Bank Accounts with current balance calculated dynamically
exports.getBankAccounts = async (req, res) => {
    const userId = req.user.id;

    try {
        const accounts = await BankAccount.findAll({
            where: { userId },
            order: [["createdAt", "ASC"]],
        });

        const results = [];
        for (let account of accounts) {
            // Sum incomes for this account
            const totalIncomeArr = await Income.findAll({
                where: { userId, bankAccountId: account.id },
                attributes: [[fn("SUM", col("amount")), "total"]],
                raw: true,
            });
            const totalIncome = parseFloat(totalIncomeArr[0]?.total || 0);

            // Sum expenses for this account
            const totalExpenseArr = await Expense.findAll({
                where: { userId, bankAccountId: account.id },
                attributes: [[fn("SUM", col("amount")), "total"]],
                raw: true,
            });
            const totalExpense = parseFloat(totalExpenseArr[0]?.total || 0);

            // currentBalance = initialBalance + totalIncome - totalExpense
            const currentBalance = parseFloat(account.initialBalance) + totalIncome - totalExpense;

            results.push({
                ...account.toJSON(),
                currentBalance,
            });
        }

        res.json(results);
    } catch (error) {
        console.error("Error getting bank accounts:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Bank Account and cascade delete mapped transactions
exports.deleteBankAccount = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const account = await BankAccount.findOne({ where: { id, userId } });
        if (!account) {
            return res.status(404).json({ message: "Bank account not found" });
        }

        // Cascade delete mapped transactions to ensure consistency
        await Income.destroy({ where: { userId, bankAccountId: id } });
        await Expense.destroy({ where: { userId, bankAccountId: id } });

        await account.destroy();

        res.json({ message: "Bank account and all associated transactions deleted successfully" });
    } catch (error) {
        console.error("Error deleting bank account:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

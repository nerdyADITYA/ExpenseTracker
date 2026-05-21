const Income = require("../models/Income")
const Expense = require("../models/Expense")
const BankAccount = require("../models/BankAccount")
const { Op, fn, col } = require("sequelize")

//Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id
        const bankAccountId = req.headers["x-bank-account-id"]

        let whereClause = { userId };
        if (bankAccountId) {
            whereClause.bankAccountId = bankAccountId;
        }

        // Fetch initial balance
        let initialBalance = 0;
        console.log("[Dashboard] Request from User ID:", userId);
        console.log("[Dashboard] x-bank-account-id header:", bankAccountId);
        
        if (bankAccountId) {
            const bankAccount = await BankAccount.findOne({ where: { id: bankAccountId, userId } });
            initialBalance = bankAccount ? parseFloat(bankAccount.initialBalance || 0) : 0;
            console.log("[Dashboard] Found specific bank account:", bankAccount ? bankAccount.id : "null", "with initialBalance:", initialBalance);
        } else {
            const allAccounts = await BankAccount.findAll({ where: { userId } });
            initialBalance = allAccounts.reduce((sum, acc) => sum + parseFloat(acc.initialBalance || 0), 0);
            console.log("[Dashboard] No specific account header. Summed all accounts initialBalance:", initialBalance);
        }

        // Append log to api_debug.log
        try {
            const fs = require("fs");
            const path = require("path");
            const logMsg = `${new Date().toISOString()} - User: ${userId}, Header Bank ID: ${bankAccountId}, Found Initial Balance: ${initialBalance}\n`;
            fs.appendFileSync(path.join(__dirname, "../../api_debug.log"), logMsg);
        } catch (e) {
            console.error("Log write failed", e);
        }

        //Fetch total income and expense
        const totalIncomeArr = await Income.findAll({
            where: whereClause,
            attributes: [[fn('SUM', col('amount')), 'total']],
            raw: true
        })
        const totalIncome = parseFloat(totalIncomeArr[0]?.total || 0)

        const totalExpenseArr = await Expense.findAll({
            where: whereClause,
            attributes: [[fn('SUM', col('amount')), 'total']],
            raw: true
        })
        const totalExpense = parseFloat(totalExpenseArr[0]?.total || 0)

        //Get income transcations in the last 60 days
        const last60DaysIncomeTransactions = await Income.findAll({
            where: {
                ...whereClause,
                date: { [Op.gte]: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
            },
            order: [['date', 'DESC']]
        })

        //Get total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)

        //Get expense Transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.findAll({
            where: {
                ...whereClause,
                date: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
            order: [['date', 'DESC']]
        })

        //Get total Expenses for last 30 days
        const expenseLast30Days = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)

        //fetch last 5 transactions(income+expense)
        const recentIncomes = await Income.findAll({
            where: whereClause,
            order: [['date', 'DESC']],
            limit: 5
        })

        const recentExpenses = await Expense.findAll({
            where: whereClause,
            order: [['date', 'DESC']],
            limit: 5
        })

        const lastTransactions = [
            ...recentIncomes.map(txn => ({ ...txn.toJSON(), type: "income" })),
            ...recentExpenses.map(txn => ({ ...txn.toJSON(), type: "expense" }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)) //sort latest first

        //Final response
        res.json({
            totalBalance: initialBalance + totalIncome - totalExpense,
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60daysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions.slice(0, 10),
        })
    }
    catch (error) {
        console.error("Dashboard error:", error)
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
const Income = require("../models/Income")
const Expense = require("../models/Expense")
const { Op, fn, col } = require("sequelize")

//Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id

        //Fetch total income and expense
        const totalIncomeArr = await Income.findAll({
            where: { userId },
            attributes: [[fn('SUM', col('amount')), 'total']],
            raw: true
        })
        const totalIncome = parseFloat(totalIncomeArr[0]?.total || 0)

        const totalExpenseArr = await Expense.findAll({
            where: { userId },
            attributes: [[fn('SUM', col('amount')), 'total']],
            raw: true
        })
        const totalExpense = parseFloat(totalExpenseArr[0]?.total || 0)

        //Get income transcations in the last 60 days
        const last60DaysIncomeTransactions = await Income.findAll({
            where: {
                userId,
                date: { [Op.gte]: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
            },
            order: [['date', 'DESC']]
        })

        //Get total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)

        //Get expense Transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.findAll({
            where: {
                userId,
                date: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
            order: [['date', 'DESC']]
        })

        //Get total Expenses for last 30 days
        const expenseLast30Days = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0)

        //fetch last 5 transactions(income+expense)
        const recentIncomes = await Income.findAll({
            where: { userId },
            order: [['date', 'DESC']],
            limit: 5
        })

        const recentExpenses = await Expense.findAll({
            where: { userId },
            order: [['date', 'DESC']],
            limit: 5
        })

        const lastTransactions = [
            ...recentIncomes.map(txn => ({ ...txn.toJSON(), type: "income" })),
            ...recentExpenses.map(txn => ({ ...txn.toJSON(), type: "expense" }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)) //sort latest first

        //Final response
        res.json({
            totalBalance: totalIncome - totalExpense,
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
const Income = require("../models/Income")
const Expense = require("../models/Expense")
const {isValidObjectId,Types} = require("mongoose")

//Dashboard Data
exports.getDashboardData = async(req,res) =>{
    try{
        const userId = req.user.id
        const userObjectId = new Types.ObjectId(String(userId))

        //Fetch total income and expense
        const totalIncome = await Income.aggregate([
            { $match: {userId: userObjectId}},
            { $group: {_id: null,total: {$sum: "$amount"}}},
        ])

        console.log("Total income",{totalIncome,userId:isValidObjectId(userId)})

        const totalExpense = await Expense.aggregate([
            { $match: {userId: userObjectId}},
            { $group: {_id: null,total: {$sum: "$amount"}}},
        ])

        //Get income transcations in the last 30 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: {$gte: new Date(Date.now() - 60*24*60*60*1000)},
        }).sort({date: -1})

        //Get total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum,transaction)=>sum+transaction.amount,0) 

        //Get expense Transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: {$gte: new Date(Date.now() - 30*24*60*60*1000)},
        }).sort({date: -1})

        //Get total Expenses for last 30 days
        const expenseLast30Days = last30DaysExpenseTransactions.reduce((sum,transaction)=>sum+transaction.amount,0)
        
        //fetch lasst 5 transactions(income+expense)
        const lastTransactions = [
            ...(await Income.find({userId}).sort({date:-1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({userId}).sort({date:-1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a,b) => b.date - a.date) //sort latest first

        //Final response
        res.json({
            totalBalance:
            (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total ||0,
            last30DaysExpenses:{
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60daysIncome:{
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        })
    }
    catch(error){
        res.status(500).json({message:"Server Error",error})
        console.log(error)
    }
}
const xlsx = require("xlsx")
const Expense = require("../models/Expense")

//Add Expense source
exports.addExpense = async(req,res) => {
    const userId = req.user.id

    try{
        const {icon,category,amount,date} = req.body

        //validation: check for missing fields
        if (!category || !amount || !date){
            return res.status(400).json({message:"All fields are required !!!"})
        }
        const newExpense = await Expense.create({
            userId, icon, category, amount, date: new Date(date)
        })

        res.status(200).json(newExpense)
    }
    catch (error){
        console.error("Error adding expense:", error)
        res.status(500).json({message:"Server error"})
    }
}

//Get all Expense source
const { Op } = require("sequelize");

exports.getAllExpense = async(req,res) => {
    const userId = req.user.id
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const offset = (page - 1) * limit;

    try{
        let whereClause = { userId };

        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const { count, rows } = await Expense.findAndCountAll({
            where: whereClause,
            order: [['date', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        })

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: rows
        })
    }
    catch (error){
        console.error("Error getting expenses:", error)
        res.status(500).json({message:"Server Error"})
    }
}

//Delete Expense source
exports.deleteExpense = async(req,res) => {
    try{
        const deleted = await Expense.destroy({
            where: { id: req.params.id }
        })
        if (deleted) {
            res.json({message:"Expense deleted successfully"})
        } else {
            res.status(404).json({message:"Expense not found"})
        }
    }
    catch(error){
        console.error("Error deleting expense:", error)
        res.status(500).json({message:"Server Error"})
    }
}

//Download Excel
exports.downloadExpenseExcel = async(req,res) => {
    const userId = req.user.id
    try{
        const expense = await Expense.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        })

        //Prepare data for excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }))

        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(wb,ws,"Expense")
        xlsx.writeFile(wb,"expenseDetails.xlsx")
        res.download("expenseDetails.xlsx")
    }
    catch(error){
        console.error("Error downloading expense excel:", error)
        res.status(500).json({message:"Server Error"})
    }
}

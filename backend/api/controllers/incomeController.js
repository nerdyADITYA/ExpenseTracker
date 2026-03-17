const xlsx = require("xlsx")
const Income = require("../models/Income")

//Add Income source
exports.addIncome = async(req,res) => {
    const userId = req.user.id

    try{
        const {icon,source,amount,date} = req.body

        //validation: check for missing fields
        if (!source || !amount || !date){
            return res.status(400).json({message:"All fields are required !!!"})
        }
        const newIncome = await Income.create({
            userId, icon, source, amount, date: new Date(date)
        })

        res.status(200).json(newIncome)
    }
    catch (error){
        console.error("Error adding income:", error)
        res.status(500).json({message:"Server error"})
    }
}

//Get all Income source
const { Op } = require("sequelize");

exports.getAllIncome = async(req,res) => {
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

        const { count, rows } = await Income.findAndCountAll({
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
        console.error("Error getting income:", error)
        res.status(500).json({message:"Server Error"})
    }
}

//Delete Income source
exports.deleteIncome = async(req,res) => {
    try{
        const deleted = await Income.destroy({
            where: { id: req.params.id }
        })
        if (deleted) {
            res.json({message:"Income deleted successfully"})
        } else {
            res.status(404).json({message:"Income not found"})
        }
    }
    catch(error){
        console.error("Error deleting income:", error)
        res.status(500).json({message:"Server Error"})
    }
}

//Download Excel
exports.downloadIncomeExcel = async(req,res) => {
    const userId = req.user.id
    try{
        const income = await Income.findAll({
            where: { userId },
            order: [['date', 'DESC']]
        })

        //Prepare data for excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }))

        const wb = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(wb,ws,"Income")
        xlsx.writeFile(wb,"incomeDetails.xlsx")
        res.download("incomeDetails.xlsx")
    }
    catch(error){
        console.error("Error downloading income excel:", error)
        res.status(500).json({message:"Server Error"})
    }
}

import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'
import { addThousandsSeparator } from '../../utils/helper'

const COLORS = ["#875CF5","#FA2C37","#FF6900"]

const FinanceOverview = ({totalBalance,totalIncome,totalExpense}) => {

    const balanceData = [
        {name:"Total Balance",amount:totalBalance},
        {name:"Total Expenses",amount:totalExpense},
        {name:"Total Income",amount:totalIncome},
    ]

    return <div className="card">
        <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold">Financial Overview</h5>
        </div>

        <CustomPieChart
            data = {balanceData}
            label = "Total Balance"
            totalAmount = {`$${addThousandsSeparator(totalBalance)}`}
            colors = {COLORS}
            showTextAnchor
        />
    </div>
}

export default FinanceOverview
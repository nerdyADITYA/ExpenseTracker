import React from 'react'

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-700">
                <p className="text-xs font-semibold text-purple-400 mb-1">{payload[0].name}</p>
                <p className="text-sm text-slate-300">
                    Amount: <span className="text-sm font-medium text-white">₹{payload[0].value}</span>
                </p>
            </div>
        )
    }
    return null
}

export default CustomTooltip
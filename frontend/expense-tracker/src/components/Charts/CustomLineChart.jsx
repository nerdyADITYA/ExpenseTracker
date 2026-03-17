import React from 'react'
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart, LineChart, Tooltip } from "recharts"

const CustomLineChart = ({ data }) => {

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-700">
                    <p className="text-xs font-semibold text-purple-400 mb-1">{payload[0].payload.category}</p>
                    <p className="text-sm text-slate-300">
                        Amount: <span className="text-sm font-medium text-white">₹{payload[0].payload.amount}</span>
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="bg-transparent">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />
                    <Tooltip content={<CustomTooltip />} cursor={{stroke: '#a855f7', strokeWidth: 1}} />

                    <Area type="monotone" dataKey="amount" stroke="#875cf5" fill="url(#incomeGradient)" strokeWidth={3} dot={{ r: 3, fill: "#ab8df8" }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomLineChart
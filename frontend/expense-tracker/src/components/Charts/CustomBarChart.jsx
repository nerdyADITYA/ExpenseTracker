import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts"


const CustomBarChart = ({data}) => {

    //Function to alternate colors
    const getBarColor = (index) => {
        return index % 2 === 0 ? "#875cf5" : "#cfbefb"
    }

    const CustomTooltip = ({active,payload}) => {
        if(active && payload && payload.length){
            return (
                <div className="bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-700">
                    <p className="text-xs font-semibold text-purple-400 mb-1">{payload[0].payload.category}</p>
                    <p className="text-sm text-slate-300">
                        Amount: <span className="text-sm font-medium text-white">₹{payload[0].payload.amount}</ span>  
                    </p>
                </div>
            )
        }
        return null
    }

    return (
    <div className="bg-transparent mt-6">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid stroke="none"/>

                <XAxis dataKey="month" tick={{ fontSize:12, fill:"#94a3b8" }} stroke="none"/>
                <YAxis tick={{ fontSize:12, fill:"#94a3b8" }} stroke="none"/>

                <Tooltip content={CustomTooltip} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}/>

                <Bar
                    dataKey="amount"
                    fill="#FF8042"
                    radius = {[10,10,0,0]}
                    activeDot = {{ r:8,fill:"yellow" }}
                    activeStyle = {{ fill:"green" }}
                >
                    {data.map((entry,index) => (
                        <Cell key={index} fill={getBarColor(index)}/>
                    ))}
                </Bar>

            </BarChart>
        </ResponsiveContainer>
    </div>
    )
}

export default CustomBarChart
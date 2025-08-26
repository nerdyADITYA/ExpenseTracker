import React from 'react'
import CustomTooltip from './CustomTooltip'
import CustomLegend from './CustomLegend'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
    return (
        <ResponsiveContainer width="100%" height={380}>
            <PieChart>
                <Pie 
                    data={data} 
                    dataKey="amount" 
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={100}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip content={CustomTooltip} />
                <Legend 
                    // content={CustomLegend}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                />

                {showTextAnchor && (
                    <g> {/* CHANGED: Wrapped text elements in group for better structure */}
                        <text
                            x="50%"
                            y="50%"
                            dy={-20} // CHANGED: Adjusted vertical offset (previously -25)
                            textAnchor="middle"
                            fill="#666"
                            fontSize="16px"
                            fontWeight="500"
                            dominantBaseline="middle" // ADDED: Critical for vertical centering
                        >
                            {label}
                        </text>
                        <text
                            x="50%"
                            y="50%"
                            dy={20} // CHANGED: Adjusted vertical offset (previously 8)
                            textAnchor="middle"
                            fill="#333"
                            fontSize="28px"
                            fontWeight="600"
                            dominantBaseline="middle" // ADDED: Critical for vertical centering
                        >
                            {totalAmount}
                        </text>
                    </g>
                )}
            </PieChart>
        </ResponsiveContainer>
    )
}

export default CustomPieChart
import React from 'react'
import {
    LuUtensils,
    LuTrendingUp,
    LuTrendingDown,
    LuTrash2,
} from "react-icons/lu"

const TransactionInfoCard = ({title,icon,date,amount,type,hideDeleteBtn,onDelete}) => {

    const getAmountStyles = () =>
        type === "income" ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"

    return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-slate-700/50 transition-all">
        <div className="w-12 h-12 flex items-center justify-center text-xl text-purple-400 bg-slate-800 rounded-full border border-slate-700">
            {icon ? (
                <img src={icon} alt={title} className="w-6 h-6"/>
            ):(
                <LuUtensils/>
            )}
        </div>

        <div className="flex-1 flex items-center justify-between">
            <div>
                <p className="text-sm text-white font-medium">{title}</p>
                <p className="text-xs text-slate-400 mt-1">{date}</p>
            </div>
            <div className="flex items-center gap-2">
                {!hideDeleteBtn && (
                    <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={onDelete}>
                        <LuTrash2 size={18}/>
                    </button>
                )}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
                    <h6 className="text-xs font-medium">
                        {type === "income" ? "+" : "-"} ₹{amount}
                    </h6>
                    {type === "income" ? <LuTrendingUp/> : <LuTrendingDown/>}
                </div>
            </div>
        </div>
    </div>
    )
}

export default TransactionInfoCard
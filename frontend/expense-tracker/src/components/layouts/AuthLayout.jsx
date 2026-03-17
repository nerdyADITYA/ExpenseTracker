import React from 'react'
import image from '../../assets/images/image.png'
import { LuTrendingUpDown } from 'react-icons/lu'

const AuthLayout = ({ children }) => {
    return <div className="flex bg-slate-900 min-h-screen">
        <div className="w-screen h-screen lg:w-[60vw] px-4 lg:px-12 pt-8 pb-12 flex flex-col">
            <h2 className="text-lg font-medium text-white mb-6">Expense Tracker</h2>
            <div className="flex-1 flex flex-col justify-center">
                {children}
            </div>
        </div>

        <div className="hidden lg:block w-[40vw] h-screen bg-slate-800 bg-auth-bg-image bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative border-l border-slate-700">
            <div className="w-48 h-48 rounded-[40px] bg-purple-600/20 blur-3xl absolute -top-7 -left-5 " />
            <div className="w-48 h-48 rounded-[40px] border-[20px] border-fuchsia-600/20 blur-2xl absolute top-[30%] -right-10" />
            <div className="w-48 h-48 rounded-[40px] bg-violet-500/20 blur-3xl absolute -bottom-7 -left-5" />

            <div className='grid grid-cols-1 z-20'>
                <StatsInfoCard icon={<LuTrendingUpDown />} label="Track your Income and Expenses" value="430,000" color="bg-primary" />

            </div>

            <img src={image} alt="Image" className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15" />
        </div>

    </div>
}

export default AuthLayout


const StatsInfoCard = ({ icon, label, value, color }) => {
    return <div className="flex gap-6 bg-slate-800/50 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-700/50 z-10">
        <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
            {icon}
        </div>
        <div>
            <h6 className="text-slate-400 text-sm mb-1">{label}</h6>
            <span className="text-[20px] text-white font-semibold">₹{value}</span>
        </div>
    </div>
}
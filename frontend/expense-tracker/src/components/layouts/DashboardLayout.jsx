import React, { useContext } from 'react'
import SideMenu from './SideMenu'
import Navbar from './Navbar'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { LuLock } from 'react-icons/lu'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user, bankAccounts, loadingBanks } = useContext(UserContext)
    const navigate = useNavigate()

    const isPageBlocked = bankAccounts.length === 0 && ["Dashboard", "Income", "Expense"].includes(activeMenu);

    return (
        <div className="flex">
            <SideMenu activeMenu={activeMenu} />
            <div className="flex-1 bg-slate-950 flex flex-col min-h-screen">
                <Navbar activeMenu={activeMenu} />
                <div className="p-6 flex-1 flex flex-col">
                    {loadingBanks ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : isPageBlocked ? (
                        <div className="flex-1 flex items-center justify-center p-4">
                            <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
                                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <LuLock size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Bank Account Required</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    To access your Dashboard, Income, and Expense details, you need to configure a bank account. 
                                    Please set up at least one account to start tracking your finances.
                                </p>
                                <button
                                    onClick={() => navigate("/banks")}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] transition-all duration-200"
                                >
                                    Set up Bank Account
                                </button>
                            </div>
                        </div>
                    ) : (
                        user && children
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
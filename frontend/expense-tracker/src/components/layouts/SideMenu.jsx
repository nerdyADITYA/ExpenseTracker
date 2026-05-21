import React, { useContext } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from "react-router-dom"
import CharAvatar from '../Cards/CharAvatar'
import { LuChevronLeft, LuChevronRight, LuWallet } from 'react-icons/lu'
import { getProfileImageUrl } from '../../utils/helper'

const SideMenu = ({ activeMenu }) => {

    const { user, clearUser, bankAccounts, activeBankAccount, setActiveBankAccount, sidebarCollapsed, toggleSidebar } = useContext(UserContext)
    const navigate = useNavigate()

    const handleClick = (route, label) => {
        if (route === "logout") {
            handleLogout()
            return
        }
        
        // If no bank account is set up, block Dashboard, Income, and Expense pages
        if (bankAccounts.length === 0 && ["Dashboard", "Income", "Expense"].includes(label)) {
            return;
        }
        
        navigate(route)
    }

    const handleLogout = () => {
        localStorage.clear()
        sessionStorage.clear()
        clearUser()
        navigate("/login")
    };

    return <div className={`h-[calc(100vh-61px)] bg-slate-900 border-r border-slate-800 flex flex-col sticky top-[61px] z-20 transition-all duration-300 ${sidebarCollapsed ? 'w-20 p-3' : 'w-64 p-5'}`}>
        
        {/* Toggle Collapse Button */}
        <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'justify-end'} mb-2`}>
            <button 
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/20 text-slate-400 hover:text-white border border-slate-700 hover:border-purple-500/30 transition-all duration-200 cursor-pointer"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {sidebarCollapsed ? <LuChevronRight size={18} /> : <LuChevronLeft size={18} />}
            </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 mt-1 mb-6">
            {user?.profileImageUrl ? (
                <img 
                    src={getProfileImageUrl(user.profileImageUrl)} 
                    alt="Profile image" 
                    className={`rounded-full border-2 border-purple-500/30 transition-all duration-300 ${sidebarCollapsed ? 'w-10 h-10' : 'w-20 h-20'}`} 
                />
            ) : (
                <CharAvatar 
                    fullName={user?.fullName} 
                    width={sidebarCollapsed ? 'w-10' : 'w-20'} 
                    height={sidebarCollapsed ? 'h-10' : 'h-20'} 
                    style={sidebarCollapsed ? 'text-xs' : 'text-xl'} 
                />
            )}
            {!sidebarCollapsed && <h5 className="text-white font-medium leading-6 truncate max-w-[200px]">{user?.fullName || ""}</h5>}
        </div>

        {/* Bank Account Selector under User Name */}
        {bankAccounts.length > 0 && (
            sidebarCollapsed ? (
                <div className="flex justify-center mb-6 text-slate-400 cursor-help" title={`Active Account: ${activeBankAccount?.bankName} (***${activeBankAccount?.accountNumber?.slice(-4)})`}>
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 hover:text-purple-400 transition-all duration-200">
                        <LuWallet size={20} />
                    </div>
                </div>
            ) : (
                <div className="w-full px-2 mb-6">
                    <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Active Account</label>
                    <select
                        value={activeBankAccount?.id || ""}
                        onChange={(e) => {
                            const selected = bankAccounts.find(acc => String(acc.id) === String(e.target.value));
                            if (selected) setActiveBankAccount(selected);
                        }}
                        className="w-full bg-slate-800 border border-slate-700/60 rounded-lg py-1.5 px-2.5 text-xs text-slate-200 outline-none focus:border-purple-500/50 transition-all duration-200"
                    >
                        {bankAccounts.map((acc) => (
                            <option key={acc.id} value={acc.id} className="bg-slate-900 text-slate-200">
                                {acc.bankName} (***{acc.accountNumber?.slice(-4)})
                            </option>
                        ))}
                    </select>
                </div>
            )
        )}

        <div className="flex-1 flex flex-col gap-1.5">
            {SIDE_MENU_DATA.map((item, index) => {
                const isBlocked = bankAccounts.length === 0 && ["Dashboard", "Income", "Expense"].includes(item.label);
                
                return (
                    <button
                        key={`menu_${index}`}
                        className={`w-full flex items-center transition-all duration-200 ${
                            sidebarCollapsed 
                                ? "justify-center py-3 px-0 rounded-lg" 
                                : "gap-4 py-3 px-6 rounded-lg"
                        } ${
                            isBlocked 
                                ? "opacity-30 cursor-not-allowed text-slate-500" 
                                : activeMenu === item.label 
                                    ? "text-white bg-primary" 
                                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                        }`}
                        onClick={() => handleClick(item.path, item.label)}
                        disabled={isBlocked}
                        title={sidebarCollapsed ? item.label : undefined}
                    >
                        <item.icon className="text-xl" />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                )
            })}
        </div>
    </div>
}

export default SideMenu
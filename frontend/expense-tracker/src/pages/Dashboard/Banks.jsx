import React, { useState, useContext, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import Input from '../../components/Inputs/Input'
import Modal from '../../components/Modal'
import DeleteAlert from '../../components/DeleteAlert'
import { LuPlus, LuTrash2, LuCheck, LuWallet, LuShieldAlert } from 'react-icons/lu'
import { useUserAuth } from '../../hooks/useUserAuth'

const Banks = () => {
    useUserAuth()

    const { 
        bankAccounts, 
        activeBankAccount, 
        setActiveBankAccount, 
        fetchBankAccounts 
    } = useContext(UserContext)

    const [openAddModal, setOpenAddModal] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null })
    
    const [newAccount, setNewAccount] = useState({
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        accountType: "Savings",
        initialBalance: ""
    })

    const handleFieldChange = (key, value) => {
        setNewAccount(prev => ({ ...prev, [key]: value }))
    }

    const handleAddAccount = async () => {
        const { bankName, accountNumber, accountHolderName, accountType, initialBalance } = newAccount;

        if (!bankName.trim()) {
            toast.error("Bank name is required.");
            return;
        }
        if (!accountNumber.trim()) {
            toast.error("Account number is required.");
            return;
        }
        if (!accountHolderName.trim()) {
            toast.error("Account holder name is required.");
            return;
        }

        try {
            await axiosInstance.post(API_PATHS.BANK_ACCOUNTS.ADD_ACCOUNT, {
                bankName,
                accountNumber,
                accountHolderName,
                accountType,
                initialBalance: initialBalance ? parseFloat(initialBalance) : 0
            });

            toast.success("Bank account added successfully!");
            setOpenAddModal(false);
            setNewAccount({
                bankName: "",
                accountNumber: "",
                accountHolderName: "",
                accountType: "Savings",
                initialBalance: ""
            });
            fetchBankAccounts();
        } catch (error) {
            console.error("Error adding bank account:", error);
            toast.error(error.response?.data?.message || "Failed to add bank account.");
        }
    }

    const handleDeleteAccount = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.BANK_ACCOUNTS.DELETE_ACCOUNT(id));
            toast.success("Bank account deleted successfully!");
            setOpenDeleteAlert({ show: false, data: null });
            fetchBankAccounts();
        } catch (error) {
            console.error("Error deleting bank account:", error);
            toast.error(error.response?.data?.message || "Failed to delete bank account.");
        }
    }

    return (
        <DashboardLayout activeMenu="Bank Accounts">
            <div className="grow mx-auto max-w-6xl w-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Bank Accounts</h2>
                        <p className="text-slate-400 text-sm mt-1">Manage and switch between your bank accounts</p>
                    </div>
                    <button
                        onClick={() => setOpenAddModal(true)}
                        className="flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium shadow-md transition-all duration-200 active:scale-95"
                    >
                        <LuPlus size={18} />
                        Add Bank Account
                    </button>
                </div>

                {bankAccounts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center shadow-lg">
                        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-4">
                            <LuWallet size={28} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Bank Accounts Found</h3>
                        <p className="text-slate-400 max-w-sm text-sm leading-relaxed mb-6">
                            You must add a bank account before you can start logging transactions or viewing reports.
                        </p>
                        <button
                            onClick={() => setOpenAddModal(true)}
                            className="py-2 px-5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Add Your First Account
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bankAccounts.map((account) => {
                            const isActive = activeBankAccount?.id === account.id;
                            
                            return (
                                <div
                                    key={account.id}
                                    className={`relative group flex flex-col justify-between h-48 rounded-2xl p-6 transition-all duration-300 ${
                                        isActive 
                                            ? "bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-[1.02]" 
                                            : "bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/50 hover:border-slate-600/70"
                                    }`}
                                >
                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <button
                                            onClick={() => setOpenDeleteAlert({ show: true, data: account.id })}
                                            className="p-1.5 bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-lg backdrop-blur-sm transition-all duration-200"
                                            title="Delete Account"
                                        >
                                            <LuTrash2 size={15} />
                                        </button>
                                    </div>

                                    {/* Card Top: Chip and Bank Name */}
                                    <div className="flex justify-between items-start">
                                        {/* Golden EMV card chip visual */}
                                        <div className="w-9 h-7 bg-gradient-to-br from-amber-300 via-yellow-500 to-yellow-600 rounded-md border border-amber-200/20 opacity-80" />
                                        
                                        <div className="text-right pr-6">
                                            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block">BANK</span>
                                            <span className="text-sm font-bold text-white block truncate max-w-[120px]">{account.bankName}</span>
                                        </div>
                                    </div>

                                    {/* Card Middle: Masked Account Number */}
                                    <div className="my-2">
                                        <p className="text-slate-300 tracking-[0.25em] font-mono text-sm">
                                            ••••  ••••  ••••  {account.accountNumber ? account.accountNumber.slice(-4) : "0000"}
                                        </p>
                                    </div>

                                    {/* Card Bottom: Holder Name, Balance, & Type */}
                                    <div className="flex justify-between items-end border-t border-slate-800/40 pt-3">
                                        <div>
                                            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">CARD HOLDER</span>
                                            <span className="text-xs font-medium text-white block truncate max-w-[120px]">{account.accountHolderName || "N/A"}</span>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">BALANCE</span>
                                            <span className="text-base font-bold text-white">
                                                ₹{(account.currentBalance !== undefined ? account.currentBalance : account.initialBalance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Active Switch overlay */}
                                    {!isActive && (
                                        <button
                                            onClick={() => setActiveBankAccount(account)}
                                            className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl backdrop-blur-[1px] transition-opacity duration-300"
                                        >
                                            <span className="py-1.5 px-4 bg-slate-900 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md active:scale-95 transition-all">
                                                Activate Account
                                            </span>
                                        </button>
                                    )}

                                    {isActive && (
                                        <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-slate-950 text-[10px] font-bold py-0.5 px-2 rounded-tr-lg rounded-bl-lg flex items-center gap-1 shadow-md border-t border-r border-emerald-400/20">
                                            <LuCheck size={10} /> ACTIVE
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Add Bank Account Modal */}
            <Modal
                isOpen={openAddModal}
                onClose={() => setOpenAddModal(false)}
                title="Add Bank Account"
            >
                <div className="flex flex-col gap-4">
                    <Input
                        value={newAccount.bankName}
                        onChange={({ target }) => handleFieldChange("bankName", target.value)}
                        label="Bank Name"
                        placeholder="e.g. Chase Bank, HDFC, SBI"
                        type="text"
                    />

                    <Input
                        value={newAccount.accountNumber}
                        onChange={({ target }) => handleFieldChange("accountNumber", target.value)}
                        label="Account Number"
                        placeholder="e.g. 1234567890"
                        type="text"
                    />

                    <Input
                        value={newAccount.accountHolderName}
                        onChange={({ target }) => handleFieldChange("accountHolderName", target.value)}
                        label="Account Holder Name"
                        placeholder="e.g. John Doe"
                        type="text"
                    />

                    <div className="mb-4">
                        <label className="text-[13px] text-slate-400 block mb-1 font-medium">Account Type</label>
                        <select
                            value={newAccount.accountType}
                            onChange={({ target }) => handleFieldChange("accountType", target.value)}
                            className="w-full bg-transparent border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 outline-none focus:border-purple-500/50"
                        >
                            <option value="Savings" className="bg-slate-900">Savings</option>
                            <option value="Current" className="bg-slate-900">Current</option>
                            <option value="Checking" className="bg-slate-900">Checking</option>
                            <option value="Credit Card" className="bg-slate-900">Credit Card</option>
                        </select>
                    </div>

                    <Input
                        value={newAccount.initialBalance}
                        onChange={({ target }) => handleFieldChange("initialBalance", target.value)}
                        label="Initial Balance (₹)"
                        placeholder="e.g. 10000"
                        type="number"
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors"
                            onClick={() => setOpenAddModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                            onClick={handleAddAccount}
                        >
                            Add Account
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                title="Delete Bank Account"
            >
                <div className="flex flex-col items-center text-center p-2">
                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <LuShieldAlert size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Delete Account Confirmation</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Are you sure you want to delete this bank account? 
                        <br />
                        <span className="text-red-400 font-medium">Warning:</span> This will permanently delete all associated income and expense transactions.
                    </p>
                    
                    <div className="flex justify-center gap-3 w-full">
                        <button
                            type="button"
                            className="flex-1 py-2 px-4 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors"
                            onClick={() => setOpenDeleteAlert({ show: false, data: null })}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                            onClick={() => handleDeleteAccount(openDeleteAlert.data)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}

export default Banks

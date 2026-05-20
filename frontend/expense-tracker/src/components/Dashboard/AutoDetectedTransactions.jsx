import React, { useState, useEffect } from 'react'
import { 
    LuCheck, 
    LuX, 
    LuPen, 
    LuRefreshCw, 
    LuChevronDown, 
    LuChevronUp,
    LuMailOpen,
    LuPlus,
    LuTrendingUp,
    LuTrendingDown
} from 'react-icons/lu'
import moment from 'moment'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import Modal from '../Modal'
import Input from '../Inputs/Input'

const AutoDetectedTransactions = ({ onRefresh }) => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const [syncing, setSyncing] = useState(false)
    const [expandedTxId, setExpandedTxId] = useState(null)
    
    // Modal states
    const [editTx, setEditTx] = useState(null)
    const [editForm, setEditForm] = useState({
        amount: '',
        type: 'expense',
        categoryOrSource: '',
        date: ''
    })

    const fetchPendingTransactions = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(API_PATHS.GMAIL.PENDING)
            if (response.data) {
                setTransactions(response.data)
            }
        } catch (error) {
            console.error("Error fetching pending transactions:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSync = async () => {
        setSyncing(true)
        try {
            const response = await axiosInstance.post(API_PATHS.GMAIL.SYNC)
            if (response.data) {
                toast.success(`Sync complete! Detected ${response.data.count} new transaction(s).`)
                fetchPendingTransactions()
                if (onRefresh) onRefresh()
            }
        } catch (error) {
            console.error("Manual sync failed:", error)
            toast.error("Failed to sync emails. Please try again.")
        } finally {
            setSyncing(false)
        }
    }

    const handleApprove = async (tx) => {
        try {
            const response = await axiosInstance.post(API_PATHS.GMAIL.APPROVE(tx.id), {
                amount: tx.amount,
                type: tx.type,
                categoryOrSource: tx.merchant || "Imported Email",
                date: tx.date
            })
            if (response.data) {
                toast.success("Transaction approved successfully!")
                fetchPendingTransactions()
                if (onRefresh) onRefresh()
            }
        } catch (error) {
            console.error("Approval failed:", error)
            toast.error("Failed to approve transaction.")
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await axiosInstance.delete(API_PATHS.GMAIL.DELETE(id))
            if (response.data) {
                toast.success("Transaction alert dismissed.")
                fetchPendingTransactions()
            }
        } catch (error) {
            console.error("Dismissal failed:", error)
            toast.error("Failed to dismiss transaction.")
        }
    }

    const openEditModal = (tx) => {
        setEditTx(tx)
        setEditForm({
            amount: tx.amount,
            type: tx.type,
            categoryOrSource: tx.merchant || '',
            date: moment(tx.date).format("YYYY-MM-DD")
        })
    }

    const handleSaveEdit = async (e) => {
        e.preventDefault()
        if (!editForm.amount || !editForm.categoryOrSource || !editForm.date) {
            toast.error("All fields are required")
            return
        }

        try {
            const response = await axiosInstance.post(API_PATHS.GMAIL.APPROVE(editTx.id), {
                amount: parseFloat(editForm.amount),
                type: editForm.type,
                categoryOrSource: editForm.categoryOrSource,
                date: new Date(editForm.date)
            })
            if (response.data) {
                toast.success("Transaction edited and approved successfully!")
                setEditTx(null)
                fetchPendingTransactions()
                if (onRefresh) onRefresh()
            }
        } catch (error) {
            console.error("Edit and approval failed:", error)
            toast.error("Failed to edit and approve transaction.")
        }
    }

    const toggleEmailExpand = (id) => {
        setExpandedTxId(expandedTxId === id ? null : id)
    }

    useEffect(() => {
        fetchPendingTransactions()
    }, [])

    if (!loading && transactions.length === 0) {
        return (
            <div className="card mt-6">
                <div className="flex items-center justify-between">
                    <h5 className="text-lg font-medium text-white">Auto-detected Transactions</h5>
                    <button 
                        onClick={handleSync}
                        disabled={syncing}
                        className="card-btn flex items-center gap-1.5"
                    >
                        <LuRefreshCw className={syncing ? "animate-spin" : ""} size={14} />
                        <span>Sync Email</span>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <LuMailOpen className="text-slate-500 mb-2" size={32} />
                    <p className="text-sm text-slate-400">No new transaction alerts detected in your email.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h5 className="text-lg font-medium text-white">Auto-detected Transactions</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Found {transactions.length} pending review. Verify and approve them below.</p>
                </div>
                <button 
                    onClick={handleSync}
                    disabled={syncing}
                    className="card-btn flex items-center gap-1.5"
                >
                    <LuRefreshCw className={syncing ? "animate-spin" : ""} size={14} />
                    <span>Sync Email</span>
                </button>
            </div>

            <div className="space-y-3 mt-4 max-h-[380px] overflow-y-auto pr-1">
                {transactions.map((tx) => (
                    <div key={tx.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700/80 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg ${
                                    tx.type === 'income' ? 'bg-green-950/40 text-green-400 border border-green-900/30' : 'bg-red-950/40 text-red-400 border border-red-900/30'
                                }`}>
                                    {tx.type === 'income' ? <LuTrendingUp /> : <LuTrendingDown />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-white">{tx.merchant}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            tx.type === 'income' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                                        }`}>
                                            {tx.type === 'income' ? 'Credit' : 'Debit'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400 block mt-0.5">{moment(tx.date).format("Do MMM YYYY, h:mm a")}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                                <span className={`text-md font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                    {tx.type === 'income' ? '+' : '-'} ₹{tx.amount}
                                </span>
                                
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        onClick={() => openEditModal(tx)}
                                        title="Edit & Approve"
                                        className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg border border-slate-700 cursor-pointer transition-all"
                                    >
                                        <LuPen size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(tx.id)}
                                        title="Dismiss Alert"
                                        className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded-lg border border-slate-700 hover:border-red-900/40 cursor-pointer transition-all"
                                    >
                                        <LuX size={15} />
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(tx)}
                                        title="Approve Transaction"
                                        className="w-8 h-8 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-all"
                                    >
                                        <LuCheck size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Email Source Details */}
                        <div className="mt-2 pt-2 border-t border-slate-800/40">
                            <button 
                                onClick={() => toggleEmailExpand(tx.id)}
                                className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-400 font-medium cursor-pointer"
                            >
                                {expandedTxId === tx.id ? <LuChevronUp size={12} /> : <LuChevronDown size={12} />}
                                <span>{expandedTxId === tx.id ? "Hide raw email details" : "View raw email text"}</span>
                            </button>
                            {expandedTxId === tx.id && (
                                <div className="mt-1.5 p-2 bg-slate-950/40 rounded-lg border border-slate-800/50 text-[11px] text-slate-400 font-mono whitespace-pre-wrap max-h-[100px] overflow-y-auto">
                                    {tx.rawText}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit & Approve Modal */}
            <Modal
                isOpen={!!editTx}
                onClose={() => setEditTx(null)}
                title="Edit & Approve Detected Transaction"
            >
                <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[13px] text-slate-400 block mb-1 font-medium">Type</label>
                            <select 
                                value={editForm.type}
                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                className="w-full text-sm text-white bg-slate-800 rounded px-4 py-3 border border-slate-700 outline-none focus:border-purple-500 transition-all cursor-pointer"
                            >
                                <option value="expense">Expense (Debit)</option>
                                <option value="income">Income (Credit)</option>
                            </select>
                        </div>
                        <Input 
                            label="Amount (₹)"
                            type="number"
                            placeholder="0.00"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        />
                    </div>

                    <Input 
                        label={editForm.type === 'expense' ? 'Category / Merchant' : 'Source / Payer'}
                        type="text"
                        placeholder="e.g. Amazon, Salary, Cafe"
                        value={editForm.categoryOrSource}
                        onChange={(e) => setEditForm({ ...editForm, categoryOrSource: e.target.value })}
                    />

                    <Input 
                        label="Date"
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    />

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                        <button 
                            type="button" 
                            onClick={() => setEditTx(null)}
                            className="px-5 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex items-center gap-1.5 px-6 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-full cursor-pointer transition-all active:scale-[0.98]"
                        >
                            <LuPlus size={16} />
                            <span>Save & Approve</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default AutoDetectedTransactions

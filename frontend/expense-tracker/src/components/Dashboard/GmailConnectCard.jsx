import React, { useState } from 'react'
import { IoLogoGoogle } from 'react-icons/io'
import { LuMail, LuRefreshCw } from 'react-icons/lu'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'

const GmailConnectCard = () => {
    const [loading, setLoading] = useState(false)

    const handleConnect = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(API_PATHS.GMAIL.AUTH_URL)
            if (response.data && response.data.url) {
                window.location.href = response.data.url
            } else {
                toast.error("Failed to generate Gmail authorization link.")
            }
        } catch (error) {
            console.error("Gmail authorization error:", error)
            toast.error("Failed to connect with Gmail. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-2xl text-purple-400 bg-slate-900/50 rounded-xl border border-slate-700/80">
                    <LuMail />
                </div>
                <div>
                    <h4 className="text-md font-semibold text-white">Automate Transaction Tracking</h4>
                    <p className="text-xs text-slate-400 mt-1">Connect your Gmail inbox to automatically discover and list your bank credit/debit alerts.</p>
                </div>
            </div>
            <button 
                onClick={handleConnect}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm px-6 py-2.5 rounded-full transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
                {loading ? (
                    <LuRefreshCw className="animate-spin" size={16} />
                ) : (
                    <IoLogoGoogle size={16} />
                )}
                <span>Connect Gmail</span>
            </button>
        </div>
    )
}

export default GmailConnectCard

import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import InfoCard from '../../components/Cards/InfoCard'
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu'
import {IoMdCard} from "react-icons/io"
import { addThousandsSeparator } from '../../utils/helper'
import RecentTransactions from '../../components/Dashboard/RecentTransactions'
import FinanceOverview from '../../components/Dashboard/FinanceOverview'
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions'
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses'
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart'
import RecentIncome from '../../components/Dashboard/RecentIncome'
import toast from 'react-hot-toast'
import GmailConnectCard from '../../components/Dashboard/GmailConnectCard'
import AutoDetectedTransactions from '../../components/Dashboard/AutoDetectedTransactions'
import { UserContext } from '../../context/UserContext'

const Home = () => {

    useUserAuth()

    const navigate = useNavigate()
    const { activeBankAccount } = useContext(UserContext)

    const[dashboardData,setDashboardData] = useState(null)
    const[loading,setLoading] = useState(false)
    const [isGmailConnected, setIsGmailConnected] = useState(false)
    const latestBankIdRef = useRef(null)

    const fetchGmailStatus = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.GMAIL.STATUS)
            if (response.data) {
                setIsGmailConnected(response.data.connected)
            }
        } catch (error) {
            console.error("Error fetching Gmail status:", error)
        }
    }

    const fetchDashboardData = async (bankId) =>{
        const targetBankId = bankId || activeBankAccount?.id
        if (!targetBankId) return;

        latestBankIdRef.current = targetBankId
        const currentRequestBankId = targetBankId
        setLoading(true)

        try{
            const headers = { "x-bank-account-id": targetBankId }
            const response = await axiosInstance.get(
                `${API_PATHS.DASHBOARD.GET_DATA}`,
                { headers }
            )
            if(latestBankIdRef.current === currentRequestBankId && response.data){
                setDashboardData(response.data)
            }
        }
        catch(error){
            console.error("[Home] Dashboard fetch failed:", error)
            toast.error("Dashboard fetch failed: " + (error.response?.data?.message || error.message));
        }
        finally{
            if (latestBankIdRef.current === currentRequestBankId) {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        fetchDashboardData(activeBankAccount?.id)
        fetchGmailStatus()

        // Check for URL callback params
        const params = new URLSearchParams(window.location.search)
        const gmailConnect = params.get("gmail_connect")
        if (gmailConnect === "success") {
            toast.success("Gmail connected successfully! Auto-sync is active.")
            setIsGmailConnected(true)
            window.history.replaceState({}, document.title, window.location.pathname)
        } else if (gmailConnect === "failed") {
            toast.error("Failed to authorize Gmail account.")
            window.history.replaceState({}, document.title, window.location.pathname)
        }
    return () => {}
    }, [activeBankAccount?.id])
    

    return (
    <DashboardLayout activeMenu = "Dashboard">
        <div className="my-5 w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard 
                icon={<IoMdCard/>}
                label = "Total Balance"
                value = {addThousandsSeparator(dashboardData?.totalBalance || 0)}
                color = "bg-primary"
                />

                <InfoCard 
                icon={<LuWalletMinimal/>}
                label = "Total Income"
                value = {addThousandsSeparator(dashboardData?.totalIncome || 0)}
                color = "bg-orange-500"
                />

                <InfoCard 
                icon={<LuHandCoins/>}
                label = "Total Expense"
                value = {addThousandsSeparator(dashboardData?.totalExpense || 0)}
                color = "bg-red-500"
                />

                
            </div>

            {!isGmailConnected ? (
                <GmailConnectCard />
            ) : (
                <AutoDetectedTransactions onRefresh={fetchDashboardData} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <RecentTransactions
                    transactions = {dashboardData?.recentTransactions}
                    onSeeMore={()=>navigate("/expense")}
                />
                <FinanceOverview
                    totalBalance = {dashboardData?.totalBalance || 0}
                    totalIncome = {dashboardData?.totalIncome || 0}
                    totalExpense = {dashboardData?.totalExpense || 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ExpenseTransactions
                    transactions = {dashboardData?.last30DaysExpenses?.transactions || []}
                    onSeeMore = {()=> navigate("/expense")}
                />
                <Last30DaysExpenses
                    data={dashboardData?.last30DaysExpenses?.transactions || []}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <RecentIncome
                    transactions={dashboardData?.last60daysIncome?.transactions || []}
                    onSeeMore = {()=>navigate("/income")}
                />
                <RecentIncomeWithChart
                    data={dashboardData?.last60daysIncome?.transactions?.slice(0,4) || []}
                    totalIncome={dashboardData?.totalIncome || 0}
                />
            </div>

        </div>
    </DashboardLayout>
    )
}

export default Home
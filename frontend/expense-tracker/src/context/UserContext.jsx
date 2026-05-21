import React, {createContext, useState, useEffect} from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [bankAccounts, setBankAccounts] = useState([])
    const [activeBankAccount, setActiveBankAccount] = useState(null)
    const [loadingBanks, setLoadingBanks] = useState(false)

    //Function to update user data
    const updateUser = (userData) =>{
        setUser(userData)
    }

    //Function to clear user data
    const clearUser = () =>{
        setUser(null)
        setBankAccounts([])
        setActiveBankAccount(null)
        localStorage.removeItem("activeBankAccountId")
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
    }

    const fetchBankAccounts = async () => {
        if (!user) return;
        setLoadingBanks(true)
        try {
            const response = await axiosInstance.get(API_PATHS.BANK_ACCOUNTS.GET_ACCOUNTS)
            if (response.data) {
                setBankAccounts(response.data)
                
                const savedId = localStorage.getItem("activeBankAccountId")
                const matched = response.data.find(acc => String(acc.id) === String(savedId))
                
                if (matched) {
                    setActiveBankAccount(matched)
                } else if (response.data.length > 0) {
                    setActiveBankAccount(response.data[0])
                    localStorage.setItem("activeBankAccountId", response.data[0].id)
                } else {
                    setActiveBankAccount(null)
                    localStorage.removeItem("activeBankAccountId")
                }
            }
        } catch (err) {
            console.error("Failed to fetch bank accounts", err)
        } finally {
            setLoadingBanks(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchBankAccounts()
        }
    }, [user])

    const handleSetActiveBankAccount = (account) => {
        setActiveBankAccount(account)
        if (account) {
            localStorage.setItem("activeBankAccountId", account.id)
        } else {
            localStorage.removeItem("activeBankAccountId")
        }
    }

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("sidebarCollapsed") === "true")

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => {
            const newVal = !prev;
            localStorage.setItem("sidebarCollapsed", String(newVal));
            return newVal;
        });
    };

    return(
        <UserContext.Provider
        value = {{
            user,
            updateUser,
            clearUser,
            bankAccounts,
            activeBankAccount,
            setActiveBankAccount: handleSetActiveBankAccount,
            loadingBanks,
            fetchBankAccounts,
            sidebarCollapsed,
            toggleSidebar
        }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
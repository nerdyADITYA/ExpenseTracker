import axios from "axios"
import { BASE_URL } from "./apiPaths"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if(accessToken){
            if (config.headers.set) {
                config.headers.set("Authorization", `Bearer ${accessToken}`);
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        const activeBankAccountId = localStorage.getItem("activeBankAccountId");
        if (activeBankAccountId) {
            const hasHeader = config.headers.has 
                ? (config.headers.has("x-bank-account-id") || config.headers.has("X-Bank-Account-Id"))
                : (config.headers["x-bank-account-id"] || config.headers["X-Bank-Account-Id"]);
            
            if (!hasHeader) {
                if (config.headers.set) {
                    config.headers.set("x-bank-account-id", activeBankAccountId);
                } else {
                    config.headers["x-bank-account-id"] = activeBankAccountId;
                }
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle common errors globally
        if(error.response){
            if(error.response.status === 401){
                // redirect to login page
                window.location.href = "/login"
            }
            else if(error.response.status === 500){
                console.error("Server error. Please try again later")
            }
        }
        else if(error.code === "ECONNABORTED"){
            console.error("Request timeout. Please try again")
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
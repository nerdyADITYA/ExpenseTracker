import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import { useState,useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import Modal from '../../components/Modal'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import toast from 'react-hot-toast'
import IncomeList from '../../components/Income/IncomeList'
import DeleteAlert from '../../components/DeleteAlert'
import { useUserAuth } from '../../hooks/useUserAuth'

const Income = () => {
    useUserAuth()
    const [incomeData,setIncomeData] = useState([])
    const [loading,setLoading] = useState(false)
    const [openDeleteAlert,setOpenDeleteAlert] = useState({
        show:false,
        data:null
    })
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)

    // Pagination and Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    //Get All Income Details
    const fetchIncomeDetails = async() => {
        if(loading) return

        setLoading(true)

        try{
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...(startDate && { startDate }),
                ...(endDate && { endDate })
            });

            const response = await axiosInstance.get(
                `${API_PATHS.INCOME.GET_ALL_INCOME}?${params.toString()}`
            )

            if(response.data){
                setIncomeData(response.data.data)
                setTotalPages(response.data.totalPages)
            }

        }
        catch(err){
            console.log("Something went wrong. Please try again", err)
        }
        finally{
            setLoading(false)
        }

    }

    // Handle Add Income
    const handleAddIncome = async(income) => {
        const{source,amount,date,icon} = income

        //Validation checks
        if(!source.trim()){
            toast.error("Source is required.")
            return
        }

        if(!amount || isNaN(amount) || Number(amount) <= 0){
            toast.error("Amount should be a valid number greater than 0.")
            return
        }

        if(!date){
            toast.error("Date is required")
            return
        }

        try{
            await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME,{
                source,amount,date,icon
            })

            setOpenAddIncomeModal(false)
            toast.success("Income Added successfully.")
            fetchIncomeDetails()
        }
        catch(error){
            console.error(
                "Error Adding income",
                error.response?.data?.message || error.message
            )
        }
    }

        //Delete Income
        const deleteIncome = async(id) => {
            try{
                await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))

                setOpenDeleteAlert({show:false,data:null})
                toast.success("Income details deleted successfull !")
                fetchIncomeDetails()
            }
            catch(error){
                console.error(
                    "Error deleting Income:",
                    error.response?.data?.message || error.message
                )   
            }
        }

    //Handle download Income details
    const handleDownloadIncomeDetails = async() => {
        try{
            const response = await axiosInstance.get(
                API_PATHS.INCOME.DOWNLOAD_INCOME,
                {
                    responseType:"blob",
                }
            )
            //Create a URL for the blob 
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a");
            link.href = url 
            link.setAttribute("download","income_details.xlsx")
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
        }
        catch(error){
            console.error("Error downloading income details: ",error)
            toast.error("Failed to download income Details. Please Try again")
        }
    }


    useEffect(() => {
        fetchIncomeDetails()
        return () => {}
    }, [currentPage, startDate, endDate])
    

    return (
    <DashboardLayout activeMenu = "Income">
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className=''>
                    <IncomeOverview
                        transactions={incomeData}
                        onAddIncome={()=> setOpenAddIncomeModal(true)}
                    />
                </div>

                <div className="card flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">Start Date</label>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-slate-700 text-white text-sm border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">End Date</label>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-slate-700 text-white text-sm border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>
                    {(startDate || endDate) && (
                        <button 
                            onClick={() => { setStartDate(""); setEndDate(""); }}
                            className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <IncomeList
                    transactions={incomeData}
                    onDelete={(id) =>{
                        setOpenDeleteAlert({show:true,data:id})
                    }}
                    onDownload={handleDownloadIncomeDetails}
                />

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                                currentPage === 1 
                                ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed" 
                                : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600 active:scale-95"
                            }`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-300 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                                currentPage === totalPages 
                                ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed" 
                                : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600 active:scale-95"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={openAddIncomeModal}
                onClose={() => setOpenAddIncomeModal(false)} 
                title="Add Income"
            >
                <AddIncomeForm onAddIncome={handleAddIncome}/>
            </Modal>

            <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({show:false,data:null})}
                title="Delete Income"
            >
                <DeleteAlert
                    content="Are you sure you want to delete this income detail ?"
                    onDelete={() => deleteIncome(openDeleteAlert.data)}
                />
            </Modal>
        </div>
    </DashboardLayout>    
    )
}

export default Income
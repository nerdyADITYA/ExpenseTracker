import React, {useState,useEffect} from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import Modal from "../../components/Modal"
import ExpenseList from '../../components/Expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'


const Expense = () => {
    useUserAuth()

    const [expenseData,setExpenseData] = useState([])
    const [loading,setLoading] = useState(false)
    const [openDeleteAlert,setOpenDeleteAlert] = useState({
        show:false,
        data:null
    })
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)

    // Pagination and Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    //Get All Expense Details
    const fetchExpenseDetails = async() => {
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
                `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}?${params.toString()}`
            )

            if(response.data){
                setExpenseData(response.data.data)
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

    // Handle Add Expense
    const handleAddExpense = async(expense) => {
        const{category,amount,date,icon} = expense

        //Validation checks
        if(!category.trim()){
            toast.error("Category is required.")
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
            await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE,{
                category,amount,date,icon
            })

            setOpenAddExpenseModal(false)
            toast.success("Expense Added successfully.")
            fetchExpenseDetails()
        }
        catch(error){
            console.error(
                "Error Adding expense",
                error.response?.data?.message || error.message
            )
        }
    }

    //Delete Expense
    const deleteExpense = async(id) => {
        try{
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))

            setOpenDeleteAlert({show:false,data:null})
            toast.success("Expense details deleted successfull !")
            fetchExpenseDetails()
        }
        catch(error){
            console.error(
                "Error deleting Expense:",
                error.response?.data?.message || error.message
            )   
        }
    }

    //handle download Expense details
    const handleDownloadExpenseDetails = async() => {
        try{
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
                {
                    responseType:"blob",
                }
            )
            //Create a URL for the blob 
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a");
            link.href = url 
            link.setAttribute("download","expense_details.xlsx")
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
        }
        catch(error){
            console.error("Error downloading Expense details: ",error)
            toast.error("Failed to download expense Details. Please Try again")
        }
    }


    useEffect(() => {
        fetchExpenseDetails()
        return () => {}
    }, [currentPage, startDate, endDate])

    return (
    <DashboardLayout activeMenu = "Expense">
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="">
                    <ExpenseOverview
                        transactions={expenseData}
                        onExpenseIncome = {() => setOpenAddExpenseModal(true)}
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

                <ExpenseList
                    transactions={expenseData}
                    onDelete={(id) => {
                        setOpenDeleteAlert({show:true,data:id})
                    }}
                    onDownload={handleDownloadExpenseDetails}
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
                isOpen={openAddExpenseModal}
                onClose={() => setOpenAddExpenseModal(false)}
                title="Add expense"
            >
                <AddExpenseForm onAddExpense={handleAddExpense} />
            </Modal>
            <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({show:false,data:null})}
                title="Delete Expense"
            >
                <DeleteAlert
                    content="Are you sure you want to delete this expense detail ?"
                    onDelete={() => deleteExpense(openDeleteAlert.data)}
                />
            </Modal>
        </div>
    </DashboardLayout>
    )
}

export default Expense
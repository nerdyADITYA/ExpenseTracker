require("dotenv").config()
// Triggering nodemon reload for .env update
const express = require("express")
const cors = require("cors")
const path = require("path")
const { connectDB } = require("./api/config/db")
const { initCronWorker } = require("./api/utils/cronWorker")
const authRoutes = require("./api/routes/authRoutes")
const incomeRoutes = require("./api/routes/incomeRoutes")
const expenseRoutes = require("./api/routes/expenseRoutes")
const dashboardRoutes = require("./api/routes/dashboardRoutes")
const gmailRoutes = require("./api/routes/gmailRoutes")
const bankAccountRoutes = require("./api/routes/bankAccountRoutes")

const app = express()

// Middleware to handle CORS
const allowedOrigins = process.env.CLIENT_URL 
    ? process.env.CLIENT_URL.split(",").map(o => o.trim()) 
    : "*";

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization","x-bank-account-id"]
    })
)

app.use(express.json())

connectDB()
initCronWorker()

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/income",incomeRoutes)
app.use("/api/v1/expense",expenseRoutes)
app.use("/api/v1/dashboard",dashboardRoutes)
app.use("/api/v1/gmail",gmailRoutes)
app.use("/api/v1/bank-accounts",bankAccountRoutes)

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is awake" })
})

app.use("/uploads",express.static(path.join(__dirname,"api/uploads")))

// Catch-all route for undefined routes
app.get('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something went wrong!' })
})

const PORT = process.env.PORT || 8000

// For Vercel serverless deployment
    app.listen(PORT, () => console.log(`Server Running on port:${PORT}`))

// Export the Express app for Vercel
module.exports = app
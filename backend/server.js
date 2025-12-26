require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const connectDB = require("./api/config/db")
const authRoutes = require("./api/routes/authRoutes")
const incomeRoutes = require("./api/routes/incomeRoutes")
const expenseRoutes = require("./api/routes/expenseRoutes")
const dashboardRoutes = require("./api/routes/dashboardRoutes")

const app = express()

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"]
    })
)

app.use(express.json())

connectDB()

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/income",incomeRoutes)
app.use("/api/v1/expense",expenseRoutes)
app.use("/api/v1/dashboard",dashboardRoutes)

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
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server Running on port:${PORT}`))
}

// Export the Express app for Vercel
module.exports = app
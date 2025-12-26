# 💰 ExpenseTracker - Personal Finance Management Application

A full-stack web application for tracking personal income and expenses with beautiful visualizations and comprehensive financial insights.

![ExpenseTracker](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## 🌟 Features

### 📊 Dashboard Analytics
- **Real-time Financial Overview**: Track total balance, income, and expenses at a glance
- **Interactive Charts**: Visualize your financial data with beautiful pie charts and bar graphs
- **Recent Transactions**: Quick view of your latest financial activities
- **Time-based Insights**: Last 30 days expenses and 60 days income analysis

### 💰 Income Management
- **Add Income Sources**: Record income with categories, amounts, and dates
- **Custom Icons**: Emoji picker for personalizing income categories
- **Excel Export**: Download income data as Excel spreadsheets
- **Income Tracking**: Monitor all income sources with detailed breakdowns

### 💸 Expense Tracking
- **Expense Categories**: Organize expenses by type (food, rent, groceries, etc.)
- **Date-wise Tracking**: Monitor spending patterns over time
- **Quick Actions**: Easy add, edit, and delete operations
- **Export Functionality**: Generate Excel reports for expense analysis

### 🔐 User Authentication
- **Secure Registration**: JWT-based authentication system
- **User Profiles**: Personalized accounts with profile image support
- **Protected Routes**: Secure access to financial data
- **Session Management**: Automatic token refresh and logout

### 📱 Modern UI/UX
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop
- **Robust Mobile Form Layouts**: Vertical-stack layouts for forms ensuring usability on all screen sizes
- **Interactive Components**: Smooth animations and transitions
- **Tailwind CSS**: Modern, utility-first styling (v4)

### 🔄 Advanced Features
- **Profile Image Handling**: 
    - Supports image uploads
    - Dynamic URL handling for production/development environments
    - Optimized blob URL previews
- **Data Visualization**: Charts powered by Recharts library
- **Search & Filter**: Find transactions quickly
- **Bulk Operations**: Manage multiple entries efficiently
- **Real-time Updates**: Instant reflection of changes

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Excel Generation**: xlsx
- **Environment**: dotenv
- **CORS**: CORS middleware for cross-origin requests
- **Deployment**: Vercel (Serverless functions)

### Frontend
- **Framework**: React 19+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4+
- **Routing**: React Router DOM 7+
- **HTTP Client**: Axios with interceptors
- **Charts**: Recharts for data visualization
- **Icons**: React Icons, Lucide React
- **Notifications**: React Hot Toast
- **Emoji Picker**: Custom emoji picker component

### Development Tools
- **Process Manager**: Nodemon (development)
- **Linting**: ESLint
- **Code Formatting**: Prettier (implicit)
- **Version Control**: Git
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ExpenseTracker.git
cd ExpenseTracker
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables
cp .env.example .env

# Edit .env file with your configuration
# MONGO_URI=mongodb://localhost:27017/expensetracker
# JWT_SECRET=your_super_secret_key
# CLIENT_URL=http://localhost:5173
# PORT=8000
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/expense-tracker

# Install dependencies
npm install

# Configure API path logic is handled in src/utils/apiPaths.js
```

### 4. Start the Application
You need to run both the backend and frontend servers. It is recommended to open two separate terminals.

**Terminal 1: Backend**
```bash
cd backend
npm run dev
# Server should start on port 8000 (or as configured)
```

**Terminal 2: Frontend**
```bash
cd frontend/expense-tracker
npm run dev
# Vite server should start (usually port 5173)
```

## 📁 Project Structure

```
ExpenseTracker/
├── backend/
│   ├── api/                     # Vercel serverless entry point
│   ├── config/                  # Configuration files
│   ├── controllers/             # Business logic
│   ├── middleware/              # Express middleware
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── uploads/                 # File upload directory
│   ├── server.js                # Server entry point
│   ├── vercel.json              # Vercel backend config
│   └── package.json
│
└── frontend/expense-tracker/
    ├── public/                  # Static assets
    ├── src/
    │   ├── assets/              # App images/icons
    │   ├── components/          # Reusable components
    │   │   ├── Cards/           # Card components
    │   │   ├── Charts/          # Chart integrations
    │   │   ├── Dashboard/       # Dashboard specific components
    │   │   ├── Expense/         # Expense related components
    │   │   ├── Income/          # Income related components
    │   │   ├── Inputs/          # Custom input components
    │   │   └── layouts/         # Layout wrappers (Auth, Dashboard)
    │   ├── context/             # React Context (User state)
    │   ├── hooks/               # Custom hooks
    │   ├── pages/               # Application pages
    │   ├── utils/               # Helper functions & API paths
    │   ├── App.jsx              # Main App component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global CSS & Tailwind imports
    ├── index.html
    ├── vercel.json              # Vercel frontend config (rewrites)
    ├── package.json
    └── vite.config.js
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/expensetracker

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=8000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

## 📊 API Documentation

### Authentication
```http
POST /api/v1/auth/register     # Register new user
POST /api/v1/auth/login        # Login user
GET  /api/v1/auth/getUser      # Get user profile info
PUT  /api/v1/auth/update-user  # Update user profile
POST /api/v1/auth/upload-image # Upload profile picture
```

### Dashboard
```http
GET /api/v1/dashboard          # Get aggregated dashboard data
```

### Income & Expenses
```http
POST   /api/v1/income/add      # Add income
GET    /api/v1/income/get      # Get all income
DELETE /api/v1/income/:id      # Delete income
POST   /api/v1/expense/add     # Add expense
GET    /api/v1/expense/get     # Get all expenses
DELETE /api/v1/expense/:id     # Delete expense
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based access control.
- **Protected Routes**: Middleware ensures only authenticated users access data.
- **CORS Configuration**: Restricts access to authorized clients.
- **Passord Hashing**: Passwords are never stored in plain text.
- **Environment Variables**: Sensitive configuration is kept out of code.

## 🚀 Deployment

### Backend (Vercel)
The backend is configured for Vercel deployment via `vercel.json` and `api/index.js`.
```bash
cd backend
vercel --prod
```

### Frontend (Vercel/Netlify)
The frontend application includes a `vercel.json` for handling client-side routing (rewrites).
```bash
cd frontend/expense-tracker
vercel --prod
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Aditya Kadia**
- Email: adikadia05@gmail.com
- GitHub: [nerdyADITYA](https://github.com/nerdyADITYA)

<div align="center">
  <p>Made with ❤️ for better financial management</p>
</div>

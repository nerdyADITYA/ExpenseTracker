# 💰 ExpenseTracker - Personal Finance Management Application

A full-stack web application for tracking personal income and expenses with beautiful visualizations and comprehensive financial insights.

![ExpenseTracker](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)
![TiDB Cloud](https://img.shields.io/badge/Database-TiDB%20Cloud-00c288?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## 🌟 Features

### 🏦 Multiple Bank Accounts Management
- **Add Bank Accounts**: Onboard multiple bank accounts with details including Bank Name, Account Number, and custom initials.
- **Scoped Incomes & Expenses**: Track income/expense transactions on a per-account basis. Every transaction maps to a specific bank account.
- **Dynamic Dashboard Metrics**: Calculate balance, total income, total expense, and transaction histories uniquely per bank account.
- **Collapsible Side Navigation Switcher**: Seamlessly switch between bank accounts via a dropdown select element embedded directly in the navbar side menu.
- **Smart Access Lock**: Locks Dashboard, Income, and Expense tabs until the user registers at least one bank account, ensuring reliable data tracking.

### 📧 Automated Gmail Transaction Sync
- **Gmail Inbox Auto-Detection**: Uses Node-Cron to search for bank credit and debit alerts (supports HDFC, ICICI, SBI, and generic bank email templates).
- **Secure Integration**: Connects via official Google OAuth2 with secure, AES-256 encrypted database storage for user OAuth tokens.
- **Interactive Review Staging**: Auto-detected transactions populate a staging card on the dashboard. Users can inspect the raw email details, edit transaction details (amount, category, date, type), delete the alert, or approve it to immediately credit/debit the active bank account.
- **Manual Sync**: Instantly trigger an email scan at any time via the "Sync Email" button on the dashboard.

### 📊 Dashboard Analytics
- **Real-time Financial Overview**: Track total balance, income, and expenses of the active bank account at a glance
- **Interactive Charts**: Visualize account-specific financial data with beautiful pie charts and bar graphs
- **Recent Transactions**: Quick view of latest financial activities mapped to the active bank account
- **Time-based Insights**: Last 30 days expenses and 60 days income analysis

### 💰 Income Management
- **Add Income Sources**: Record income with categories, amounts, and dates mapped to the active bank account
- **Custom Icons**: Emoji picker for personalizing income categories
- **Excel Export**: Download income data for the active bank account as Excel spreadsheets

### 💸 Expense Tracking
- **Expense Categories**: Organize expenses by type (food, rent, groceries, etc.)
- **Date-wise Tracking**: Monitor spending patterns over time
- **Export Functionality**: Generate Excel reports for expense analysis

### 🔐 User Authentication
- **Secure Registration**: JWT-based authentication system
- **User Profiles**: Personalized accounts with profile image support (with smart remote vs local asset path resolution and URL-safe encoding)
- **Protected Routes**: Secure access to financial data
- **Session Management**: Options for persistent sessions (Keep me logged in) or session-only access, automatically clearing on logout.

### 📱 Modern UI/UX
- **Responsive Layout**: Fully responsive side menu navigation with collapsible/expandable sidebar toggle states.
- **Vibrant Modern Dashboard**: Interactive cards, hover tooltips, and micro-animations styled beautifully.
- **Robust Mobile Form Layouts**: Vertical-stack layouts for forms ensuring usability on all screen sizes
- **Tailwind CSS**: Modern, utility-first styling (v4)

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: TiDB Cloud Serverless MySQL (managed via Sequelize ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Excel Generation**: xlsx
- **Cron Jobs**: Node-Cron for scheduled background email syncing
- **Google Client**: Google APIs client library for OAuth2 and Gmail API
- **Cryptography**: Node.js native crypto module (AES-256-CBC) for database encryption of access and refresh tokens
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
- TiDB Cloud Account (or a local MySQL database server)
- Google Cloud Console Developer account (for Gmail API access)
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

# Edit .env file with your configuration (detailed below)
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
# Database (TiDB Cloud Connection details)
TIDB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
TIDB_PORT=4000
TIDB_USER=your_username.root
TIDB_PASSWORD=your_secure_password
TIDB_DATABASE=expense_tracker

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=8000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173

# Gmail Integration Settings
GMAIL_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_google_client_secret
GMAIL_REDIRECT_URI=http://localhost:8000/api/v1/gmail/callback
GMAIL_ENCRYPTION_KEY=your_random_32_byte_hexadecimal_encryption_key
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

### Bank Accounts
```http
POST   /api/v1/bank-accounts/add      # Add bank account
GET    /api/v1/bank-accounts/get      # Get all bank accounts
DELETE /api/v1/bank-accounts/:id      # Delete bank account
```

### Dashboard
```http
GET /api/v1/dashboard          # Get aggregated dashboard data (scoped by headers['x-bank-account-id'])
```

### Income & Expenses
```http
POST   /api/v1/income/add      # Add income (scoped by headers['x-bank-account-id'])
GET    /api/v1/income/get      # Get all income (scoped by headers['x-bank-account-id'])
DELETE /api/v1/income/:id      # Delete income
POST   /api/v1/expense/add     # Add expense (scoped by headers['x-bank-account-id'])
GET    /api/v1/expense/get     # Get all expenses (scoped by headers['x-bank-account-id'])
DELETE /api/v1/expense/:id     # Delete expense
```

### Gmail Syncing & Verification
```http
GET    /api/v1/gmail/auth-url    # Generate Gmail Google OAuth2 consent screen URL
GET    /api/v1/gmail/callback    # Google OAuth callback redirection landing
POST   /api/v1/gmail/disconnect  # Disconnect and revoke Gmail sync
GET    /api/v1/gmail/status      # Get Gmail connectivity state
GET    /api/v1/gmail/pending     # Get all pending parsed transaction entries
POST   /api/v1/gmail/sync        # Manually trigger Gmail email scan
POST   /api/v1/gmail/approve/:id # Approve transaction staging item into ledger
DELETE /api/v1/gmail/pending/:id # Dismiss/Delete transaction staging item
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based access control.
- **Protected Routes**: Middleware ensures only authenticated users access data.
- **CORS Configuration**: Restricts access to authorized clients.
- **Passord Hashing**: Passwords are never stored in plain text.
- **Environment Variables**: Sensitive configuration is kept out of code.
- **AES-256 Token Encryption**: Access and refresh tokens stored in the database are encrypted at rest using a unique 32-byte key to prevent unauthorized access.

## 📧 Gmail Sync Setup Guide

Follow these steps to configure automated transaction alert scanning via Gmail:

### 1. Configure Google Cloud Console Project
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `ExpenseTracker Sync`).
3. Open the **API Library** from the left-hand navigation and search for **Gmail API**. Click **Enable**.
4. Configure the **OAuth Consent Screen**:
   - Set User Type to **External**.
   - Fill in the App Name, support email, and developer contact info.
   - Under **Scopes**, click *Add or Remove Scopes* and add: `https://www.googleapis.com/auth/gmail.readonly` (Read-only access to email messages).
   - Under **Test Users**, add the Gmail accounts you want to test and sync. (Since the app is in "Testing" mode on Google, only listed test accounts can authorize).
5. Generate **OAuth Credentials**:
   - Go to the **Credentials** tab.
   - Click **Create Credentials** -> **OAuth Client ID**.
   - Set Application Type to **Web application**.
   - Add **Authorized JavaScript origins**: `http://localhost:8000` (and production domain if applicable).
   - Add **Authorized redirect URIs**: `http://localhost:8000/api/v1/gmail/callback` (and production callback URL if applicable).
   - Click **Create** and download/copy the client ID and client secret.

### 2. Configure Backend Environment
Set the following variables in your `.env` file:
- `GMAIL_CLIENT_ID`: The client ID copied from Google Console.
- `GMAIL_CLIENT_SECRET`: The client secret copied from Google Console.
- `GMAIL_REDIRECT_URI`: The authorized redirect URI registered with Google (must match exactly).
- `GMAIL_ENCRYPTION_KEY`: A random 32-byte hexadecimal string (e.g., generate one with `openssl rand -hex 32` or similar) to encrypt user tokens at rest.

### 3. Connect and Sync
1. Run the application (`npm run dev` in both backend and frontend).
2. Register/login and navigate to the **Profile** page from the sidebar menu.
3. Click the **Connect Gmail** button. You will be redirected to the secure Google Consent screen.
4. Authorize the requested permissions. After approval, you will be automatically returned to the dashboard.
5. In the background, the server's Node-Cron worker will check for new emails every hour.
6. To pull alerts immediately, click the **Sync Email** button on the dashboard.
7. Verify parsed entries in the **Auto-detected Transactions** staging area, customize transaction details if needed, and hit **Approve** to commit them to your active account ledger!

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

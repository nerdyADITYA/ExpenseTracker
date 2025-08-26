# 💰 ExpenseTracker - Personal Finance Management Application

A full-stack web application for tracking personal income and expenses with beautiful visualizations and comprehensive financial insights.

![ExpenseTracker](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
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
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme Support**: Eye-friendly interface
- **Interactive Components**: Smooth animations and transitions
- **Tailwind CSS**: Modern, utility-first styling

### 🔄 Advanced Features
- **File Upload**: Profile image upload with Multer
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
- **Framework**: React 18+ with Hooks
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
# PORT=5000
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/expense-tracker

# Install dependencies
npm install

# Update API base URL in src/utils/apiPaths.js
# export const BASE_URL = "http://localhost:5000"
```

### 4. Start the Application
```bash
# Start backend server (from backend directory)
npm run dev  # Development mode
# or
npm start    # Production mode

# Start frontend server (from frontend/expense-tracker directory)
npm run dev

# Access the application at http://localhost:5173
```

## 📁 Project Structure

```
ExpenseTracker/
├── backend/
│   ├── api/
│   │   └── index.js                 # Vercel serverless entry point
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── dashboardController.js   # Dashboard data aggregation
│   │   ├── ExpenseController.js     # Expense management
│   │   └── incomeController.js      # Income management
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── uploadMiddleware.js      # File upload handling
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Income.js                # Income schema
│   │   └── Expense.js               # Expense schema
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication routes
│   │   ├── dashboardRoutes.js      # Dashboard routes
│   │   ├── expenseRoutes.js        # Expense routes
│   │   └── incomeRoutes.js         # Income routes
│   ├── uploads/                     # File upload directory
│   ├── server.js                   # Express server setup
│   ├── vercel.json                 # Vercel configuration
│   └── package.json
│
└── frontend/expense-tracker/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── assets/
    │   │   └── images/
    │   ├── components/
    │   │   ├── Cards/               # Reusable card components
    │   │   ├── Charts/              # Chart components
    │   │   ├── Dashboard/           # Dashboard-specific components
    │   │   ├── Expense/             # Expense management components
    │   │   ├── Income/              # Income management components
    │   │   ├── Inputs/              # Form input components
    │   │   └── layouts/             # Layout components
    │   ├── context/
    │   │   └── UserContext.jsx      # Global user state
    │   ├── hooks/
    │   │   └── useUserAuth.jsx      # Authentication hook
    │   ├── pages/
    │   │   ├── Auth/                # Login/Register pages
    │   │   └── Dashboard/           # Dashboard pages
    │   ├── utils/
    │   │   ├── apiPaths.js          # API endpoints
    │   │   ├── axiosInstance.js     # HTTP client configuration
    │   │   ├── data.js              # Static data
    │   │   ├── helper.js            # Utility functions
    │   │   └── uploadImage.js       # Image upload utilities
    │   ├── App.jsx                  # Main App component
    │   ├── main.jsx                 # React entry point
    │   └── index.css                # Global styles
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
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
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

## 📊 API Documentation

### Authentication Endpoints
```http
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login
GET  /api/v1/auth/getUser      # Get user profile
POST /api/v1/auth/upload-image # Upload profile image
```

### Income Endpoints
```http
POST   /api/v1/income/add           # Add new income
GET    /api/v1/income/get           # Get all income
DELETE /api/v1/income/:id           # Delete income by ID
GET    /api/v1/income/downloadexcel # Download Excel report
```

### Expense Endpoints
```http
POST   /api/v1/expense/add           # Add new expense
GET    /api/v1/expense/get           # Get all expenses
DELETE /api/v1/expense/:id           # Delete expense by ID
GET    /api/v1/expense/downloadexcel # Download Excel report
```

### Dashboard Endpoint
```http
GET /api/v1/dashboard  # Get comprehensive dashboard data
```

## 💾 Database Schema

### User Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  profileImageUrl: String,
  timestamps: true
}
```

### Income Model
```javascript
{
  userId: ObjectId (required, ref: User),
  icon: String,
  source: String (required),
  amount: Number (required),
  date: Date (default: now),
  timestamps: true
}
```

### Expense Model
```javascript
{
  userId: ObjectId (required, ref: User),
  icon: String,
  category: String (required),
  amount: Number (required),
  date: Date (default: now),
  timestamps: true
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Server-side data validation
- **File Upload Security**: Multer with file type restrictions
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Vercel (Backend)
```bash
# The backend is configured for Vercel serverless deployment
# vercel.json is already configured

# Deploy to Vercel
vercel --prod
```

### Netlify/Vercel (Frontend)
```bash
# Build the frontend
npm run build

# Deploy the dist folder to your preferred hosting service
```

### Environment Configuration for Production
- Set up MongoDB Atlas for production database
- Configure environment variables in your hosting platform
- Update CORS settings for production domains
- Set up proper error logging and monitoring

## 🎨 UI/UX Highlights

- **Clean Design**: Minimalist interface focusing on usability
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Interactive Charts**: Beautiful data visualization with Recharts
- **Smooth Animations**: Subtle transitions and loading states
- **Color-coded Categories**: Visual distinction for different transaction types
- **Toast Notifications**: User-friendly feedback system
- **Loading States**: Smooth user experience during API calls

## 📈 Performance Optimizations

- **React Hooks**: Efficient state management and re-rendering
- **Axios Interceptors**: Centralized request/response handling
- **Lazy Loading**: Code splitting for better performance
- **Vite Build Tool**: Fast development and optimized production builds
- **MongoDB Indexing**: Optimized database queries
- **Serverless Architecture**: Scalable backend deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Excel download feature requires proper CORS configuration in production
- File upload size is limited to 5MB
- Chart responsiveness needs improvement on very small screens

## 🔮 Future Enhancements

- [ ] Budget planning and tracking
- [ ] Multiple currency support
- [ ] Recurring transactions
- [ ] Bank account integration
- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] Email notifications for budget limits
- [ ] Data backup and restore
- [ ] Multi-user family accounts
- [ ] Investment tracking

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Aditya Kulkarni**
- Email: adi05@gmail.com
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]

## 🙏 Acknowledgments

- React community for excellent documentation
- Tailwind CSS for the amazing utility-first framework
- MongoDB for robust database solutions
- Vercel for seamless deployment experience
- Open source contributors for various packages used

---

<div align="center">
  <p>Made with ❤️ for better financial management</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>

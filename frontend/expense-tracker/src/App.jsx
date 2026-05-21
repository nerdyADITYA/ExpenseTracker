import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Profile from "./pages/Dashboard/Profile";
import Banks from "./pages/Dashboard/Banks";
import PrivacyPolicy from "./pages/Public/PrivacyPolicy";
import TermsOfService from "./pages/Public/TermsOfService";
import UserProvider from "./context/UserContext";
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signUp" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/profile" exact element={<Profile />} />
            <Route path="/banks" exact element={<Banks />} />
            <Route path="/privacy-policy" exact element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" exact element={<TermsOfService />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px"
          },
        }}
      />
    </UserProvider>
  )
}

export default App;

const Root = () => {
  // Check if token exists in LocalStorage or SessionStorage
  const isAuthenticated = !!(localStorage.getItem("token") || sessionStorage.getItem("token"))

  // Redirect to Dashboard if authenticated, otherwise to login 
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}
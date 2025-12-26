import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const{updateUser} = useContext(UserContext)

    const navigate = useNavigate();

    // Handle Login form submit
    const handleLogin = async(e) => {
        e.preventDefault();
        
        // Reset errors
        setEmailError("");
        setPasswordError("");
        setError("");

        let isValid = true;

        if(!email) {
            setEmailError("Please enter Email address");
            isValid = false;
        } else if(!validateEmail(email)) {
            setEmailError("Please enter a valid Email address");
            isValid = false;
        }

        if(!password) {
            setPasswordError("Please enter the Password");
            isValid = false;
        }

        if(!isValid) return;

        // Login Api call

        try{
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            })
            const {token,user} = response.data 

            if(token){
                localStorage.setItem("token",token)
                updateUser(user)
                navigate("/dashboard")
            }
        }
        catch (error){
            if (error.response && error.response.data.message){
                setError(error.response.data.message)
            }
            else if (error.code === 'ECONNREFUSED') {
                setError("Unable to connect to the server. Please check if the backend is running.");
            } else if (error.code === 'ENOTFOUND') {
                setError("Network error. Please check your internet connection.");
            } else if (error.response) {
                setError(`Server error: ${error.response.status} - ${error.response.statusText}`);
            } else {
                console.log(error)
                setError("An unexpected error occurred. Please try again later.")
            }
        } 
    }

    return(
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Welcome Back !</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Please enter your details to log in
                </p>

                <form onSubmit={handleLogin}>
                    <Input 
                        value={email} 
                        onChange={({target}) => setEmail(target.value)} 
                        label="Email Address" 
                        placeholder="john@example.com" 
                        type="text"
                        error={emailError}
                    />

                    <Input 
                        value={password} 
                        onChange={({target}) => setPassword(target.value)} 
                        label="Password" 
                        placeholder="Min 8 Characters" 
                        type="password"
                        error={passwordError}
                    />

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button type="submit" className="btn-primary">LOGIN</button>

                    <p className="text-[13px] text-slate-800 mt-3 ">Don't have an Account?{" "}
                        <Link className="font-medium text-primary underline" to="/signup">Signup</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default Login;
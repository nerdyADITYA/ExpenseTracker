import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const Input = ({ value, onChange, label, placeholder, type, error }) => {
    const [showPassword, setShowPassword] = useState(false)
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    };

    return (
        <div className="mb-4">
            <label className="text-[13px] text-slate-800 block mb-1">{label}</label>
            <div className={`input-box border rounded-md px-3 py-2 flex items-center ${error ? 'border-red-500' : 'border-gray-300'}`}>
                <input 
                    type={type === "password" ? showPassword ? "text" : "password" : type} 
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    value={value}
                    onChange={onChange}
                />

                {type === "password" && (
                    <>
                    {showPassword ? (
                        <FaRegEye
                        size={22}
                        className='text-primary cursor-pointer'
                        onClick={() => toggleShowPassword()}/>
                    ):(
                        <FaRegEyeSlash
                        size={22}
                        className='text-slate-400 cursor-pointer'
                        onClick={()=>toggleShowPassword()}/>
                    )}
                    </>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}

export default Input
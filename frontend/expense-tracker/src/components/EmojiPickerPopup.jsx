import React, { useState } from 'react'
import EmojiPicker from "emoji-picker-react"
import { LuImage,LuX } from 'react-icons/lu'

const EmojiPickerPopup = ({icon,onSelect}) => {

    const[isOpen,setIsOpen] = useState(false)

    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
            <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-slate-800 text-purple-400 rounded-lg border border-slate-700">
                    {icon ? (
                        <img src={icon} alt="icon" className="w-12 h-12" />
                    ):(
                        <LuImage/>
                    )}
                </div>
                <p className="text-slate-300 text-sm font-medium">{icon ? "Change Icon" : "Pick Icon"}</p>
            </div>
            {isOpen && (
                <div className="relative">
                    <button
                        className="w-7 h-7 flex items-center justify-center border border-slate-600 bg-slate-800 text-white rounded-full absolute -top-2 -right-2 z-10 cursor-pointer hover:bg-slate-700 transition-all"
                        onClick={() => setIsOpen(false)}
                    >
                        <LuX/>
                    </button>
                    <EmojiPicker
                        open={isOpen}
                        theme="dark"
                        onEmojiClick={(emoji) => onSelect(emoji?.imageUrl || "")}
                    />  
                </div>
            )}
        </div>
    )
}

export default EmojiPickerPopup
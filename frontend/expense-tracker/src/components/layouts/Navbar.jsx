import React, { useState } from 'react'
import {HiOutlineMenu,HiOutlineX} from "react-icons/hi"
import SideMenu from './SideMenu'

const Navbar = ({activeMenu}) => {

    const [openSideMenu,setOpenSideMenu] = useState(false)

    return (
        <div className="flex gap-5 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md py-4 px-7 sticky top-0 z-30">
            <button className="block lg:hidden text-white" onClick={()=>{
                setOpenSideMenu(!openSideMenu)
            }}>
                {openSideMenu ? (
                    <HiOutlineX className="tex-2xl"/>
                ):(
                    <HiOutlineMenu className="text-2xl"/>
                )}
            </button>

            <h2 className="text-lg font-medium text-white">Expense Tracker</h2>

            {openSideMenu && (
                <div className="fixed top-[61px] -ml-4 bg-slate-900 shadow-xl">
                    <SideMenu activeMenu={activeMenu}/>
                </div>
            )}
        </div>
    )
}

export default Navbar
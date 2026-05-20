
import React, { useContext, useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import uploadImage from '../../utils/uploadImage'
import toast from 'react-hot-toast'

const Profile = () => {
    const { user, updateUser } = useContext(UserContext)

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("") // Keep empty initially
    const [profilePic, setProfilePic] = useState(null)
    const [gmailConnected, setGmailConnected] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [disconnecting, setDisconnecting] = useState(false)

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "")
            setEmail(user.email || "")
            setProfilePic(user.profileImageUrl || null)
            setGmailConnected(user.gmailConnected || false)
        }
    }, [user])

    const handleConnectGmail = async () => {
        setConnecting(true)
        try {
            const response = await axiosInstance.get(API_PATHS.GMAIL.AUTH_URL)
            if (response.data && response.data.url) {
                window.location.href = response.data.url
            } else {
                toast.error("Failed to generate authorization URL")
            }
        } catch (error) {
            console.error("Gmail connect error:", error)
            toast.error("Failed to connect Gmail")
        } finally {
            setConnecting(false)
        }
    }

    const handleDisconnectGmail = async () => {
        if (!window.confirm("Are you sure you want to disconnect your Gmail account and clear pending transaction alerts?")) {
            return
        }
        setDisconnecting(true)
        try {
            const response = await axiosInstance.post(API_PATHS.GMAIL.DISCONNECT)
            if (response.data) {
                toast.success("Gmail disconnected successfully")
                setGmailConnected(false)
                if (user) {
                    updateUser({ ...user, gmailConnected: false })
                }
            }
        } catch (error) {
            console.error("Gmail disconnect error:", error)
            toast.error("Failed to disconnect Gmail")
        } finally {
            setDisconnecting(false)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        if (!fullName) {
            toast.error("Please enter your name")
            return
        }

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email")
            return
        }

        try {
            let profileImageUrl = profilePic

            // If profilePic is a File object, it means it's a new image
            if (profilePic && typeof profilePic === 'object') {
                const imgUploadRes = await uploadImage(profilePic)
                profileImageUrl = imgUploadRes.imageUrl || ""
            }

            const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, {
                fullName,
                email,
                password, // Send password only if user wants to update it
                profileImageUrl
            })

            if (response.data && response.data.user) {
                updateUser(response.data.user)
                toast.success("Profile updated successfully")
                setPassword("") // Clear password field after update
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Failed to update profile")
        }
    }

    return (
        <DashboardLayout activeMenu="Profile">
            <div className='p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 m-5'>
                <h2 className='text-xl font-medium mb-6 text-white'>My Profile</h2>

                <form onSubmit={handleUpdate} className='flex flex-col gap-6'>
                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

                    <div className='grid grid-cols-1 gap-6'>
                        <Input
                            label="Full Name"
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            placeholder="Full Name"
                            type="text"
                        />
                        <Input
                            label="Email Address"
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            placeholder="Email Address"
                            type="text"
                        />
                        <div>
                            <Input
                                label="New Password"
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                placeholder="Leave blank to keep current password"
                                type="password"
                            />
                        </div>
                    </div>

                    <div className='flex justify-end mt-4'>
                        <button type='submit' className='btn-primary px-8 py-2.5 rounded-full'>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Gmail Sync Section */}
            <div className='p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/50 m-5 mt-0'>
                <h2 className='text-xl font-medium mb-3 text-white'>Gmail Automated Sync</h2>
                <p className='text-xs text-slate-400 mb-6'>
                    Configure automatic scanning of bank transaction alerts directly from your Gmail inbox.
                </p>

                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-xl'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-purple-400 border border-slate-700'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.666a2 2 0 012.22 0l8 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5M12 14v.01"></path>
                            </svg>
                        </div>
                        <div>
                            <span className='text-sm text-white font-medium block'>Gmail API Sync Status</span>
                            <div className='flex items-center gap-1.5 mt-0.5'>
                                <span className={`w-2 h-2 rounded-full ${gmailConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
                                <span className='text-xs text-slate-400'>{gmailConnected ? 'Connected' : 'Disconnected'}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        {gmailConnected ? (
                            <button
                                onClick={handleDisconnectGmail}
                                disabled={disconnecting}
                                className='px-6 py-2.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 rounded-full cursor-pointer transition-all active:scale-[0.98]'
                            >
                                Disconnect Account
                            </button>
                        ) : (
                            <button
                                onClick={handleConnectGmail}
                                disabled={connecting}
                                className='px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-full cursor-pointer transition-all active:scale-[0.98]'
                            >
                                Connect Gmail
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Profile

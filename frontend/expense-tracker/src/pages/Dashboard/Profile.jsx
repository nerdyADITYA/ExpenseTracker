
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

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "")
            setEmail(user.email || "")
            setProfilePic(user.profileImageUrl || null)
        }
    }, [user])

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
            <div className='p-6 bg-white rounded-lg shadow-md border border-gray-200/50 m-5'>
                <h2 className='text-xl font-medium mb-6'>My Profile</h2>

                <form onSubmit={handleUpdate} className='flex flex-col gap-6'>
                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                        <div className="col-span-2">
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
        </DashboardLayout>
    )
}

export default Profile

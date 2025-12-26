import React, { useRef, useState, useEffect } from 'react'
import { LuUser, LuUpload, LuTrash } from "react-icons/lu"

const ProfilePhotoSelector = ({ image, setImage }) => {

    const inputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            // Update the image state
            setImage(file)
        }
    }

    const handleRemoveImage = () => {
        setImage(null)
    }

    const onChooseFile = () => {
        inputRef.current.click()
    }

    useEffect(() => {
        if (typeof image === 'string') {
            setPreviewUrl(image)
        }
        else if (image) {
            setPreviewUrl(URL.createObjectURL(image))
        }
        else {
            setPreviewUrl(null)
        }

        return () => {
            if (previewUrl && typeof previewUrl === 'string' && !image) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [image])

    return (<div className="flex justify-center mb-6">
        <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden" />

        {!image ? (
            <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
                <LuUser className="text-4xl text-primary" />

                <button type="button" className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1" onClick={onChooseFile}>
                    <LuUpload />
                </button>
            </div>
        ) : (
            <div className="relative">
                <img src={previewUrl} alt="profile photo" className="w-20 h-20 rounded-full object-cover" />
                <button type="button" className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1" onClick={handleRemoveImage}><LuTrash /></button>
            </div>
        )}
    </div>
    )
}

export default ProfilePhotoSelector
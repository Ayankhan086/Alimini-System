'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Camera, X, Loader2 } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'

interface AvatarViewerProps {
  avatarUrl: string | null | undefined
  initials: string
  fullName: string
  size?: 'sm' | 'lg'
  interactive?: boolean
}

export function AvatarViewer({ avatarUrl, initials, fullName, size = 'lg', interactive = true }: AvatarViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleUploadSuccess = async (result: any) => {
    setIsUpdating(true)
    const newAvatarUrl = result.info.secure_url

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: newAvatarUrl }),
      })

      if (res.ok) {
        router.refresh()
        setIsOpen(false) // Close modal on success
      }
    } catch (error) {
      console.error('Failed to update avatar', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const baseClasses = size === 'lg' 
    ? "w-20 h-20 rounded-full border-[3px] border-yellow-500 bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0 uppercase overflow-hidden relative group"
    : "w-10 h-10 rounded-full bg-[#1a365d] text-white flex items-center justify-center font-bold text-sm uppercase overflow-hidden relative group"
  
  const interactiveClasses = interactive ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
  const circleClasses = `${baseClasses} ${interactiveClasses}`

  return (
    <>
      {/* Thumbnail */}
      <div className={circleClasses} onClick={() => interactive && setIsOpen(true)}>
        {avatarUrl ? (
          <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
        ) : (
          initials
        )}
        {/* Hover Overlay */}
        {interactive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className={size === 'lg' ? "w-1/3 h-1/3 text-white" : "w-1/2 h-1/2 text-white"} />
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-sm w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Display */}
            <div className="w-full aspect-square bg-gray-100 relative flex items-center justify-center border-b border-gray-100">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a365d] text-white">
                  <span className="text-6xl font-bold uppercase tracking-widest">{initials}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-900">{fullName}</h3>
                <p className="text-sm text-gray-500">Profile Picture</p>
              </div>
              
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUploadSuccess}
                options={{
                  maxFiles: 1,
                  clientAllowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
                  cropping: true,
                  croppingAspectRatio: 1,
                }}
              >
                {({ open }) => {
                  return (
                    <Button 
                      onClick={() => open()}
                      disabled={isUpdating}
                      className="w-full bg-[#1a365d] hover:bg-[#12284c] text-white h-11"
                    >
                      {isUpdating ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                      ) : (
                        <><Camera className="w-4 h-4 mr-2" /> Change Picture</>
                      )}
                    </Button>
                  )
                }}
              </CldUploadWidget>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

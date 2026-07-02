// components/profile/user-profile.tsx
'use client'

import { Sidebar } from '@/components/alumni/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { AvatarViewer } from '@/components/profile/avatar-viewer'

function ProfileContent({ initialData }: { initialData: any }) {
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('updated') === 'true') {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Process data for display
  const initials = `${initialData.firstName?.[0] || ''}${initialData.lastName?.[0] || ''}`
  const fullName = `${initialData.firstName} ${initialData.lastName}`
  const jobTitle = initialData.jobTitle || 'Alumni'
  const employer = initialData.currentEmployer ? `at ${initialData.currentEmployer}` : ''
  const location = initialData.city && initialData.country 
    ? `· ${initialData.city}, ${initialData.country}` 
    : ''
  
  // Real Profile Completion Algorithm
  const fieldsToCheck = [
    { key: 'phone' },
    { key: 'cnic' },
    { key: 'currentEmployer' },
    { key: 'jobTitle' },
    { key: 'industry' },
    { key: 'city' },
    { key: 'country' },
    { key: 'linkedinUrl' },
  ]

  let filledCount = 0
  fieldsToCheck.forEach(field => {
    if (initialData[field.key]) {
      filledCount++
    }
  })

  // Add skills check
  if (initialData.skills && initialData.skills.length > 0) {
    filledCount++
  }

  const totalFields = fieldsToCheck.length + 1
  const completionPercentage = Math.round(50 + (filledCount / totalFields) * 50)

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-8 py-5 bg-white shadow-sm border-b border-gray-100 z-10">
        <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
        <div className="flex items-center gap-3">
          <AvatarViewer 
            avatarUrl={initialData.avatarUrl} 
            initials={initials} 
            fullName={fullName} 
            size="sm" 
            interactive={false}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-[1000px] mx-auto space-y-6 pb-20">
          
          {/* Main Banner */}
          <div className="bg-[#1e293b] rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between shadow-md relative overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
              <AvatarViewer 
                avatarUrl={initialData.avatarUrl} 
                initials={initials} 
                fullName={fullName} 
                size="lg" 
              />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white tracking-tight">{fullName}</h1>
                <p className="text-gray-300 text-sm mt-1">{jobTitle} {employer} {location}</p>
                
                {/* Progress Bar */}
                <div className="mt-4 max-w-sm w-full min-w-[300px]">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Profile Completion: {completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-[#334155] rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 relative z-10 self-start md:self-auto">
              <Link href="/profile/edit">
                <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white h-10 px-5 shadow-sm rounded-lg font-medium">
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Information Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Academic Information */}
            <Card className="rounded-xl shadow-sm border-gray-200">
              <CardContent className="p-0">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-[#1a365d] text-sm">Academic Information</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[11px] text-blue-500 mb-1">Degree:</p>
                    <p className="font-semibold text-gray-900 text-sm">{initialData.degreeLevel || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-500 mb-1">Department:</p>
                    <p className="font-semibold text-gray-900 text-sm">{initialData.program || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-500 mb-1">Batch:</p>
                    <p className="font-semibold text-gray-900 text-sm">{initialData.admissionYear} – {initialData.graduationYear}</p>
                  </div>
                  <div></div>
                  <div>
                    <p className="text-[11px] text-blue-500 mb-1">CGPA:</p>
                    <p className="font-semibold text-gray-900 text-sm">{initialData.cgpa || 'N/A'} / 4.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Information */}
            <Card className="rounded-xl shadow-sm border-gray-200">
              <CardContent className="p-0">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-[#1a365d] text-sm">Career Information</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[11px] text-blue-500 mb-1">Employer:</p>
                    <p className="font-semibold text-gray-900 text-sm">{initialData.currentEmployer || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-500 mb-1">Location:</p>
                    <p className="font-semibold text-gray-900 text-sm">{initialData.city && initialData.country ? `${initialData.city}, ${initialData.country}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-500 mb-1">Title:</p>
                    <p className="font-semibold text-gray-900 text-sm">{initialData.jobTitle || 'N/A'}</p>
                  </div>
                  <div></div>
                  <div>
                    <p className="text-[11px] text-blue-500 mb-1">Industry:</p>
                    <p className="font-semibold text-gray-900 text-sm">{initialData.industry || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Skills & Certifications */}
          <Card className="rounded-xl shadow-sm border-gray-200">
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-[#1a365d] text-sm">Skills & Certifications</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-3 mb-5">
                  {initialData.skills && initialData.skills.length > 0 ? (
                    initialData.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-4 py-1.5 bg-[#f1f5f9] text-gray-600 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">No skills added yet.</span>
                  )}
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline" className="h-8 text-xs text-[#1a365d] border-gray-200 hover:bg-gray-50 px-4 rounded-md">
                    + Add Certification / Skill
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
        
        {/* Bottom Success Toast (Fixed) */}
        {showSuccess && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center bg-[#22c55e] text-white px-5 py-3 rounded-lg shadow-xl font-medium text-sm transition-all animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Profile updated successfully!
          </div>
        )}
      </main>
    </div>
  )
}

export function UserProfile({ initialData }: { initialData: any }) {
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar for Alumni */}
      <Sidebar />
      <Suspense fallback={<div className="p-8">Loading profile...</div>}>
        <ProfileContent initialData={initialData} />
      </Suspense>
    </div>
  )
}
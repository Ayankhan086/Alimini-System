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
import { ThemeToggle } from '@/components/theme-toggle'

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
      <header className="flex items-center justify-between px-8 py-5 bg-white dark:bg-[#1a2b4c] shadow-sm border-b border-gray-100 dark:border-[#2a3b5c] z-10 transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">My Profile</h2>
        <div className="flex items-center gap-4">
          <ThemeToggle />
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
        <div className="max-w-[1000px] mx-auto space-y-6 pb-20 anim-fadeInUp">
          
          {/* Main Banner */}
          <div className="glass-card rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between shadow-md relative overflow-hidden transition-colors">
            <div className="flex items-center gap-6 relative z-10">
              <AvatarViewer 
                avatarUrl={initialData.avatarUrl} 
                initials={initials} 
                fullName={fullName} 
                size="lg" 
                priority={true}
              />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">{fullName}</h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm mt-1 transition-colors">{jobTitle} {employer} {location}</p>
                
                {/* Progress Bar */}
                <div className="mt-4 max-w-sm w-full min-w-[300px]">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5 transition-colors">
                    <span>Profile Completion: {completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-[#334155] rounded-full h-1.5 transition-colors">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 relative z-10 self-start md:self-auto">
              <Link href="/profile/edit">
                <Button className="btn btn-primary h-10 px-5 shadow-sm rounded-lg">
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Information Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 delay-100 anim-fadeInUp">
            
            {/* Academic Information */}
            <Card className="rounded-xl shadow-sm border-gray-200 dark:border-slate-800 dark:bg-slate-900 transition-colors card-hover">
              <CardContent className="p-0">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 transition-colors">
                  <h3 className="font-semibold text-[#1a365d] dark:text-[#e6c15c] text-sm transition-colors">Academic Information</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-1 transition-colors">Degree:</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{initialData.degreeLevel || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-1 transition-colors">Department:</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{initialData.program || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-1 transition-colors">Batch:</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{initialData.admissionYear} – {initialData.graduationYear}</p>
                  </div>
                  <div></div>
                  <div>
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-1 transition-colors">CGPA:</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{initialData.cgpa || 'N/A'} / 4.0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Information */}
            <Card className="rounded-xl shadow-sm border-gray-200 dark:border-slate-800 dark:bg-slate-900 transition-colors card-hover">
              <CardContent className="p-0">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 transition-colors">
                  <h3 className="font-semibold text-[#1a365d] dark:text-[#e6c15c] text-sm transition-colors">Career Information</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-1 transition-colors">Employer:</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{initialData.currentEmployer || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-1 transition-colors">Location:</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{initialData.city && initialData.country ? `${initialData.city}, ${initialData.country}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-1 transition-colors">Title:</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{initialData.jobTitle || 'N/A'}</p>
                  </div>
                  <div></div>
                  <div>
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 mb-1 transition-colors">Industry:</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors">{initialData.industry || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Skills & Certifications */}
          <Card className="rounded-xl shadow-sm border-gray-200 dark:border-slate-800 dark:bg-slate-900 transition-colors card-hover delay-200 anim-fadeInUp">
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 transition-colors">
                <h3 className="font-semibold text-[#1a365d] dark:text-[#e6c15c] text-sm transition-colors">Skills & Certifications</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-3 mb-5">
                  {initialData.skills && initialData.skills.length > 0 ? (
                    initialData.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-4 py-1.5 bg-[#f1f5f9] dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500 italic transition-colors">No skills added yet.</span>
                  )}
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline" className="h-8 text-xs text-[#1a365d] dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 px-4 rounded-md transition-colors bg-transparent">
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
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0B0F19] transition-colors">
      {/* Sidebar for Alumni */}
      <Sidebar />
      <Suspense fallback={<div className="p-8 dark:text-white transition-colors">Loading profile...</div>}>
        <ProfileContent initialData={initialData} />
      </Suspense>
    </div>
  )
}
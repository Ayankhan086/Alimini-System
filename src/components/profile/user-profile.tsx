// components/profile/user-profile.tsx
'use client'

import { Sidebar } from '@/components/alumni/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, CheckCircle2 } from 'lucide-react'

export function UserProfile() {
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar for Alumni */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-8 py-5 bg-white shadow-sm border-b border-gray-100 z-10">
          <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1a365d] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              MK
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-[1000px] mx-auto space-y-6 pb-20">
            
            {/* Main Banner */}
            <div className="bg-[#1e293b] rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between shadow-md relative overflow-hidden">
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-full border-[3px] border-yellow-500 bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  SA
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Muhammad Khan</h1>
                  <p className="text-gray-300 text-sm mt-1">Software Engineer at TechCorp Ltd. · Lahore, Pakistan</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 max-w-sm w-full min-w-[300px]">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Profile Completion: 85%</span>
                    </div>
                    <div className="w-full bg-[#334155] rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 relative z-10 self-start md:self-auto">
                <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white h-10 px-5 shadow-sm rounded-lg font-medium">
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
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
                      <p className="font-semibold text-gray-900 text-sm">BS Computer Science</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-blue-500 mb-1">Department:</p>
                      <p className="font-semibold text-gray-900 text-sm">Computer Science</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-blue-500 mb-1">Batch:</p>
                      <p className="font-semibold text-gray-900 text-sm">2019 – 2023</p>
                    </div>
                    <div></div>
                    <div>
                      <p className="text-[11px] text-blue-500 mb-1">CGPA:</p>
                      <p className="font-semibold text-gray-900 text-sm">3.72 / 4.0</p>
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
                      <p className="font-semibold text-gray-900 text-sm">TechCorp Ltd.</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-blue-500 mb-1">Location:</p>
                      <p className="font-semibold text-gray-900 text-sm">Lahore, Pakistan</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-blue-500 mb-1">Title:</p>
                      <p className="font-semibold text-gray-900 text-sm">Software Engineer</p>
                    </div>
                    <div></div>
                    <div>
                      <p className="text-[11px] text-blue-500 mb-1">Industry:</p>
                      <p className="font-semibold text-gray-900 text-sm">Information Technology</p>
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
                    {['React.js', 'Node.js', 'Python', 'AWS', 'Agile', 'UI/UX Design'].map((skill, i) => (
                      <span key={i} className="px-4 py-1.5 bg-[#f1f5f9] text-gray-600 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" className="h-8 text-xs text-[#1a365d] border-gray-200 hover:bg-gray-50 px-4 rounded-md">
                    + Add Certification
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
          
         
        </main>
      </div>
    </div>
  )
}
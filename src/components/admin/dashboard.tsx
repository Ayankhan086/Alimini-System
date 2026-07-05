// components/admin/dashboard.tsx
'use client'

import { Sidebar } from '@/components/admin/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Check,
  X,
} from 'lucide-react'
import dynamic from 'next/dynamic'

import { ThemeToggle } from '@/components/theme-toggle'

// Dynamically import the chart component to reduce initial bundle size 
// and prevent hydration errors with Chart.js
const VerificationChart = dynamic(
  () => import('@/components/admin/verification-chart').then(mod => mod.VerificationChart),
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Loading Chart...</div> }
)

// Mock Data for the prototype based on the image
const verificationRequests = [
  { id: 1, name: 'Ali Khan', email: 'ali@example.com', program: 'BS Computer Science', status: 'Pending' },
  { id: 2, name: 'Sarah Ahmed', email: 'sarah@example.com', program: 'BSc Electrical Eng.', status: 'Pending' },
  { id: 3, name: 'Usman Tariq', email: 'usman@example.com', program: 'BS Software Eng.', status: 'Pending' },
  { id: 4, name: 'Ayesha Malik', email: 'ayesha@example.com', program: 'BS Civil Eng.', status: 'Pending' },
]

export function AdminDashboard() {
  const stats = [
    {
      title: 'Registered Alumni',
      value: '1,245',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Verifications',
      value: '18',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Approved',
      value: '5',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Rejected',
      value: '1,022',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-[#0B0F19] transition-colors">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-[#1a2b4c] border-b border-gray-200 dark:border-[#2a3b5c] transition-colors">
          <h2 className="text-2xl font-bold text-[#1a365d] dark:text-white transition-colors">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-[#e6c15c] text-white dark:text-[#1a2b4c] flex items-center justify-center font-bold text-sm transition-colors">
              AD
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6 anim-fadeInUp">
            
            {/* Welcome Banner */}
            <div className="bg-[#1a365d] dark:bg-gradient-to-r dark:from-[#0B0F19] dark:to-[#1a2b4c] border dark:border-[#2a3b5c] rounded-2xl p-6 md:p-8 text-white flex items-center shadow-md relative overflow-hidden transition-colors">
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-full border-2 border-yellow-400 bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-inner">
                  AD
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome Back, ORIC Administrator 👋</h1>
                  <p className="text-blue-200 text-sm md:text-base">UET Mardan Alumni Association</p>
                  <p className="text-blue-300 text-xs mt-2">Managing Alumni Records</p>
                </div>
              </div>
              {/* Decorative background element */}
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#234b82] to-transparent opacity-50 rounded-r-2xl pointer-events-none"></div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 delay-100 anim-fadeInUp">
              {stats.map((stat, index) => (
                <Card key={index} className="rounded-xl shadow-sm border-gray-200 dark:border-slate-800 dark:bg-slate-900 transition-colors card-hover">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${stat.bgColor} dark:bg-opacity-20 flex items-center justify-center flex-shrink-0 transition-colors`}>
                      <stat.icon className={`h-6 w-6 ${stat.color} dark:brightness-110`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 transition-colors">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 delay-200 anim-fadeInUp">
              
              {/* Left Column: Verification Requests (takes up 2 columns space) */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">Pending Verification Requests</h3>
                <Card className="rounded-xl shadow-sm border-gray-200 dark:border-slate-800 dark:bg-slate-900 h-full transition-colors card-hover">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors">
                      {verificationRequests.map((req) => (
                        <div key={req.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm transition-colors">
                              {req.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white transition-colors">{req.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{req.program}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">{req.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors bg-transparent">
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 transition-colors bg-transparent">
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 rounded-b-xl text-center transition-colors">
                      <a href="/dashboard/admin/verifications" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                        View all pending requests &rarr;
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Verification Status Chart */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">Verification Status</h3>
                <Card className="rounded-xl shadow-sm border-gray-200 dark:border-slate-800 dark:bg-slate-900 transition-colors card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal transition-colors">All Time Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Re-use the VerificationChart but wrap it to match styling */}
                    <div className="h-[250px] flex items-center justify-center w-full">
                      <VerificationChart />
                    </div>
                    
                    {/* Custom Legend */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-gray-600 dark:text-gray-300 transition-colors">Registered</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white transition-colors">1,245</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-gray-600 dark:text-gray-300 transition-colors">Approved</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white transition-colors">5</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-gray-600 dark:text-gray-300 transition-colors">Pending</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white transition-colors">18</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
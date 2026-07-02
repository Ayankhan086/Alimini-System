// components/alumni/dashboard.tsx
'use client'

import { Sidebar } from '@/components/alumni/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CalendarDays,
  Edit,
  Users,
  UserCircle,
  MapPin,
  Megaphone,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
} from 'lucide-react'
import Link from 'next/link'
import { AvatarViewer } from '@/components/profile/avatar-viewer'

// Mock Data for the prototype based on the image
const upcomingEvents = [
  {
    month: 'JUN',
    day: '28',
    title: 'AI Workshop',
    location: 'Main Auditorium',
    registered: false,
  },
  {
    month: 'JUL',
    day: '15',
    title: 'Annual Alumni Meetup',
    location: 'UET Mardan Main Campus',
    registered: true,
  },
]

const recentAnnouncements = [
  'Alumni registration is now open.',
  'New networking event announced.',
  'Update your profile information.',
]

const recentActivity = [
  {
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    text: 'Updated profile successfully.',
    time: '1d ago',
  },
  {
    icon: CalendarCheck,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    text: 'Registered for AI Workshop.',
    time: '2d ago',
  },
]

export function AlumniDashboard({ alumniData }: { alumniData: any }) {
  // 1. Dynamic Welcome Info
  const initials = `${alumniData.firstName?.[0] || ''}${alumniData.lastName?.[0] || ''}`
  const fullName = `${alumniData.firstName} ${alumniData.lastName}`
  const formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  
  // 2. Profile Completion Algorithm
  const fieldsToCheck = [
    { key: 'phone', label: 'Phone Number' },
    { key: 'cnic', label: 'CNIC' },
    { key: 'currentEmployer', label: 'Current Employer' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'industry', label: 'Industry' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'linkedinUrl', label: 'LinkedIn' },
  ]

  let filledCount = 0
  const missingLabels: string[] = []

  fieldsToCheck.forEach(field => {
    if (alumniData[field.key]) {
      filledCount++
    } else {
      missingLabels.push(field.label)
    }
  })

  // Add skills check
  if (alumniData.skills && alumniData.skills.length > 0) {
    filledCount++
  } else {
    missingLabels.push('Skills')
  }

  // Calculate percentage (Base 50% for core academic info already filled, remaining 50% for the 9 fields above)
  const totalFields = fieldsToCheck.length + 1 // +1 for skills
  const completionPercentage = Math.round(50 + (filledCount / totalFields) * 50)
  
  const missingText = missingLabels.length > 0 
    ? `Missing: ${missingLabels.slice(0, 3).join(', ')}${missingLabels.length > 3 ? '...' : ''}`
    : 'Your profile is completely up to date!'

  // 3. Membership Status
  const statusColor = alumniData.verificationStatus === 'APPROVED' ? 'text-emerald-600' : 
                      alumniData.verificationStatus === 'REJECTED' ? 'text-red-600' : 'text-amber-500'
  
  // Format member since year
  const memberSince = new Date(alumniData.verifiedAt || alumniData.createdAt).getFullYear()

  return (
    <div className="flex h-screen bg-gray-50/50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#1a365d]">Dashboard</h2>
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <AvatarViewer 
                avatarUrl={alumniData.avatarUrl} 
                initials={initials} 
                fullName={fullName} 
                size="sm" 
                interactive={false}
              />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Welcome Banner */}
            <div className="bg-[#1a365d] rounded-2xl p-6 md:p-8 text-white flex items-center shadow-md relative overflow-hidden">
              <div className="flex items-center gap-5 relative z-10">
                <AvatarViewer 
                  avatarUrl={alumniData.avatarUrl} 
                  initials={initials} 
                  fullName={fullName} 
                  size="lg" 
                />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome Back, {alumniData.firstName}! 👋</h1>
                  <p className="text-blue-200 text-sm md:text-base">{alumniData.program} &nbsp;•&nbsp; Batch {alumniData.graduationYear}</p>
                  <p className="text-blue-300 text-xs mt-2">{formattedDate}</p>
                </div>
              </div>
              {/* Decorative background element */}
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#234b82] to-transparent opacity-50 rounded-r-2xl pointer-events-none"></div>
            </div>

            {/* Top Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Completion */}
              <Card className="rounded-xl shadow-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-700">Profile Completion</h3>
                    <Link href="/profile/edit">
                      <Button className="bg-[#1a365d] hover:bg-[#12284c] text-white h-9 text-xs">Complete Profile</Button>
                    </Link>
                  </div>
                  <div className="mb-2 text-4xl font-bold text-gray-900">{completionPercentage}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500">{missingText}</p>
                </CardContent>
              </Card>

              {/* Membership Status */}
              <Card className="rounded-xl shadow-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-semibold text-gray-700">Membership Status</h3>
                    <Button className="bg-[#1a365d] hover:bg-[#12284c] text-white h-9 text-xs">View Membership</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Type</p>
                      <p className="font-semibold text-gray-900">Regular</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                      <p className={`font-semibold ${statusColor}`}>{alumniData.verificationStatus}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Fee Paid</p>
                      <p className="font-semibold text-gray-400">N/A</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Member Since: {memberSince}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Link href="/profile/edit">
                  <Button className="w-full h-12 bg-[#254f85] hover:bg-[#1c3a63] text-white shadow-sm font-medium">
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                </Link>
                <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-sm font-medium">
                  <Users className="h-4 w-4 mr-2" /> Alumni Directory
                </Button>
                <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-medium">
                  <CalendarDays className="h-4 w-4 mr-2" /> Browse Events
                </Button>
                <Link href="/profile">
                  <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white shadow-sm font-medium">
                    <UserCircle className="h-4 w-4 mr-2" /> View Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Upcoming Events & Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Events */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
                <Card className="rounded-xl shadow-sm border-gray-200 h-full">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {upcomingEvents.map((event, i) => (
                        <div key={i} className="p-5 flex items-start gap-4">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center min-w-[50px] shadow-sm">
                            <div className="text-[10px] font-bold text-gray-500 uppercase">{event.month}</div>
                            <div className="text-xl font-bold text-[#1a365d]">{event.day}</div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{event.title}</h4>
                            <p className="text-xs text-gray-500 flex items-center mt-1 mb-2">
                              <MapPin className="h-3 w-3 mr-1 text-red-500" />
                              {event.location}
                            </p>
                            {event.registered ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-semibold">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Already Registered
                              </span>
                            ) : (
                              <Button className="bg-[#1a365d] hover:bg-[#12284c] text-white h-7 text-xs px-4 rounded-md">
                                Register
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        View All Events &rarr;
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Announcements */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Recent Announcements</h3>
                <Card className="rounded-xl shadow-sm border-gray-200 h-full">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {recentAnnouncements.map((announcement, i) => (
                        <div key={i} className="p-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <Megaphone className="h-4 w-4 text-amber-500" />
                          </div>
                          <p className="text-sm text-gray-700">{announcement}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        See all announcements &rarr;
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-3 pb-8">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <Card className="rounded-xl shadow-sm border-gray-200">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center`}>
                            <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                          </div>
                          <p className="text-sm text-gray-700">{activity.text}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

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
    text: 'Updated profile — Employer set to TechCorp Ltd.',
    time: '1d ago',
  },
  {
    icon: CalendarCheck,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    text: 'Registered for AI Workshop (28 June, Main Auditorium).',
    time: '2d ago',
  },
  {
    icon: CreditCard,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    text: 'Membership approved — Regular Member, Active.',
    time: '25d ago',
  },
]

export function AlumniDashboard() {
  return (
    <div className="flex h-screen bg-gray-50/50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#1a365d]">Dashboard</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a365d] text-white flex items-center justify-center font-bold text-sm">
              MK
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Welcome Banner */}
            <div className="bg-[#1a365d] rounded-2xl p-6 md:p-8 text-white flex items-center shadow-md relative overflow-hidden">
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-full border-2 border-yellow-400 bg-[#1a365d] text-white flex items-center justify-center font-bold text-xl shadow-inner">
                  MK
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome Back, Muhammad Khan! 👋</h1>
                  <p className="text-blue-200 text-sm md:text-base">Computer Science &nbsp;•&nbsp; Batch 2023</p>
                  <p className="text-blue-300 text-xs mt-2">26 June 2026</p>
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
                    <Button className="bg-[#1a365d] hover:bg-[#12284c] text-white h-9 text-xs">Complete Profile</Button>
                  </div>
                  <div className="mb-2 text-4xl font-bold text-gray-900">80%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Missing: Phone Number, LinkedIn, Current Employer</p>
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
                      <p className="font-semibold text-emerald-600">Active</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Fee Paid</p>
                      <p className="font-semibold text-emerald-600">Yes</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Member Since: 2023</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Button className="w-full h-12 bg-[#254f85] hover:bg-[#1c3a63] text-white shadow-sm font-medium">
                  <Edit className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
                <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-sm font-medium">
                  <Users className="h-4 w-4 mr-2" /> Alumni Directory
                </Button>
                <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-medium">
                  <CalendarDays className="h-4 w-4 mr-2" /> Browse Events
                </Button>
                <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white shadow-sm font-medium">
                  <UserCircle className="h-4 w-4 mr-2" /> View Profile
                </Button>
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
                      <a href="/dashboard/events" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
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
                      <a href="/dashboard/announcements" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
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

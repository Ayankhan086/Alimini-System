// components/admin/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  CalendarDays,
  CreditCard,
  Megaphone,
  ClipboardList,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react'

type MenuItem = {
  icon: LucideIcon
  label: string
  href: string
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard', href: '/dashboard/admin' },
  { icon: Users, label: 'Alumni Management', href: '/dashboard/admin/alumni' },
  { icon: CalendarDays, label: 'Event Management', href: '/dashboard/admin/events' },
  { icon: CreditCard, label: 'Membership Requests', href: '/dashboard/admin/verifications' },
  { icon: Megaphone, label: 'Announcements', href: '/dashboard/admin/announcements' },
  { icon: ClipboardList, label: 'Audit Logs', href: '/dashboard/admin/logs' },
  { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex flex-col w-[280px] bg-[#223d5e] text-gray-300 h-full border-r border-[#192f4a] flex-shrink-0">
      
      {/* Logo Area */}
      <div className="flex items-center gap-4 p-6 pt-8 pb-8 border-b border-[#192f4a]">
        <div className="w-14 h-14 rounded-xl bg-[#c19927] flex items-center justify-center font-bold text-white text-[16px] shadow-sm flex-shrink-0">
          UET
        </div>
        <h1 className="text-xl font-semibold text-white tracking-wide leading-tight">
          ORIC Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 no-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href) && item.href !== '/dashboard/admin'
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                'flex items-center px-6 py-[18px] transition-colors text-[17px]',
                isActive
                  ? 'bg-[#1a3351] text-white border-l-[6px] border-white'
                  : 'hover:bg-[#1a3351]/50 hover:text-white border-l-[6px] border-transparent text-[#a3b1c6]'
              )}
            >
              <item.icon className={cn("h-6 w-6 mr-4 flex-shrink-0", isActive ? "text-[#fcd34d]" : "text-[#8a9bb3]")} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#192f4a]">
        <button
          onClick={async () => {
            await signOut({ redirect: false })
            router.push('/login')
          }}
          className="flex w-full items-center px-4 py-3 rounded-lg text-[#a3b1c6] hover:text-white hover:bg-[#1a3351]/50 transition-colors"
        >
          <LogOut className="h-[22px] w-[22px] mr-4 flex-shrink-0 text-red-400" />
          <span className="font-medium text-[17px]">Logout</span>
        </button>
      </div>
    </div>
  )
}
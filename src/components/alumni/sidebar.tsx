// components/alumni/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  User,
  Users,
  CalendarDays,
  CreditCard,
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
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'My Profile', href: '/profile' },
  { icon: Users, label: 'Alumni Directory', href: '/dashboard/directory' },
  { icon: CalendarDays, label: 'Events', href: '/dashboard/events' },
  { icon: CreditCard, label: 'Membership', href: '/dashboard/membership' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex flex-col w-64 bg-[#1a365d] text-gray-300 h-full border-r border-[#12284c]">
      <div className="p-6 border-b border-[#234572]">
        <h1 className="text-2xl font-bold text-white tracking-tight">AMS</h1>
        <p className="text-xs text-blue-200/70 mt-1">Alumni Management</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                'flex items-center px-6 py-3 transition-colors text-[15px]',
                isActive
                  ? 'bg-[#152c4d] text-white border-l-4 border-white'
                  : 'hover:bg-[#152c4d]/50 hover:text-white border-l-4 border-transparent'
              )}
            >
              <item.icon className={cn("h-5 w-5 mr-3 flex-shrink-0", isActive ? "text-white" : "text-gray-400")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#234572]">
        <button
          onClick={async () => {
            await signOut({ redirect: false })
            router.push('/login')
          }}
          className="flex w-full items-center px-2 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-[#152c4d]/50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3 flex-shrink-0 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

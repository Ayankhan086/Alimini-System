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
    <div className="flex flex-col w-64 bg-slate-50 dark:bg-[#1a365d] text-slate-700 dark:text-gray-300 h-full border-r border-gray-200 dark:border-[#12284c] transition-colors">
      <div className="p-6 border-b border-gray-200 dark:border-[#234572] transition-colors">
        <h1 className="text-2xl font-bold text-[#1a365d] dark:text-white tracking-tight transition-colors">AMS</h1>
        <p className="text-xs text-slate-500 dark:text-blue-200/70 mt-1 transition-colors">Alumni Management</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 dark:bg-[#152c4d] text-[#1a365d] dark:text-white border-l-4 border-[#eab308] dark:border-white font-medium'
                      : 'hover:bg-slate-100 dark:hover:bg-[#152c4d]/50 hover:text-slate-900 dark:hover:text-white border-l-4 border-transparent text-slate-600 dark:text-gray-300'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 mr-3', isActive ? "text-[#eab308] dark:text-[#e6c15c]" : "text-slate-400 dark:text-gray-400")} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-[#12284c] transition-colors">
        <button
          onClick={async () => {
            await signOut({ redirect: false })
            router.push('/login')
          }}
          className="flex w-full items-center px-2 py-3 rounded-lg text-slate-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-white hover:bg-red-50 dark:hover:bg-[#152c4d]/50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}

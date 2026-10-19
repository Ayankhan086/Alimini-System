'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  Activity,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Home,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'

type MenuItem = {
  icon: LucideIcon
  label: string
  href: string
}

type MenuGroup = {
  label: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Workspace',
    items: [
      { icon: Home, label: 'Overview', href: '/dashboard/admin' },
      { icon: Users, label: 'Alumni Management', href: '/dashboard/admin/alumni' },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { icon: CalendarDays, label: 'Event Management', href: '/dashboard/admin/events' },
      { icon: CreditCard, label: 'Membership Requests', href: '/dashboard/admin/verifications' },
      { icon: Megaphone, label: 'Announcements', href: '/dashboard/admin/announcements' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { icon: ClipboardList, label: 'Audit Logs', href: '/dashboard/admin/logs' },
      { icon: Settings, label: 'Security', href: '/dashboard/security' },
    ],
  },
]

function isItemActive(pathname: string, href: string) {
  return href === '/dashboard/admin'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}

function NavigationLinks({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-5">
      {menuGroups.map((group) => (
        <div key={group.label} className="mb-6 last:mb-0">
          <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {group.label}
          </h2>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = isItemActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300',
                      active
                        ? 'bg-white/10 text-white shadow-sm ring-1 ring-inset ring-white/10'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    )}
                  >
                    {active ? (
                      <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-amber-300" />
                    ) : null}
                    <item.icon
                      aria-hidden="true"
                      className={cn(
                        'h-[18px] w-[18px] shrink-0 transition-colors',
                        active ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {active ? <ChevronRight aria-hidden="true" className="h-4 w-4 text-slate-400" /> : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function LogoutButton({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    try {
      await signOut({ redirect: false })
      onNavigate?.()
      router.push('/login')
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-slate-300 transition-colors hover:bg-rose-400/10 hover:text-rose-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-wait disabled:opacity-60"
    >
      <LogOut aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
      <span>{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
    </button>
  )
}

function SidebarPanel({
  pathname,
  onNavigate,
  mobile = false,
  onClose,
}: {
  pathname: string
  onNavigate?: () => void
  mobile?: boolean
  onClose?: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#101d31] text-white">
      <div className="border-b border-white/[0.08] px-5 pb-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard/admin" onClick={onNavigate} className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-200 to-amber-400 text-[#17263d] shadow-[0_8px_24px_rgba(245,190,79,0.15)]">
              <GraduationCap aria-hidden="true" className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-bold tracking-wide text-white">UET MARDAN</span>
              <span className="mt-0.5 block truncate text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Alumni Association
              </span>
            </span>
          </Link>
          {mobile ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-400/10 text-blue-200">
            <ShieldCheck aria-hidden="true" className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-slate-100">Admin workspace</span>
            <span className="mt-0.5 block text-[11px] text-slate-400">Secure access enabled</span>
          </span>
          <Activity aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
        </div>
      </div>

      <NavigationLinks pathname={pathname} onNavigate={onNavigate} />

      <div className="border-t border-white/[0.08] p-3">
        <LogoutButton onNavigate={onNavigate} />
        <p className="mt-3 px-3 text-[10px] font-medium tracking-wide text-slate-500">
          UET Mardan · Administration
        </p>
      </div>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpenPathname, setMobileOpenPathname] = useState<string | null>(null)
  const isMobileOpen = mobileOpenPathname === pathname

  useEffect(() => {
    if (!isMobileOpen) return
    const previousOverflow = document.body.style.overflow
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileOpenPathname(null)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileOpen])

  return (
    <>
      <aside aria-label="Primary sidebar" className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col border-r border-white/[0.06] shadow-[8px_0_32px_rgba(15,23,42,0.08)] lg:flex">
        <SidebarPanel pathname={pathname} />
      </aside>

      <aside aria-label="Mobile navigation" className="sticky top-0 z-30 flex h-screen w-[68px] shrink-0 flex-col bg-[#101d31] lg:hidden">
        <div className="flex h-[68px] items-center justify-center border-b border-white/[0.08]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-400 text-[#17263d]">
            <GraduationCap aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpenPathname(pathname)}
          aria-label="Open navigation menu"
          aria-expanded={isMobileOpen}
          aria-controls="admin-mobile-navigation"
          className="mx-auto mt-4 flex h-11 w-11 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
        <span className="mx-auto mt-3 h-1.5 w-1.5 rounded-full bg-emerald-400" aria-label="Admin access active" />

        <div className="mt-auto border-t border-white/[0.08] py-3">
          <button
            type="button"
            onClick={() => setMobileOpenPathname(pathname)}
            aria-label="Open account and sign-out menu"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <LogOut aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpenPathname(null)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
          />
          <aside
            id="admin-mobile-navigation"
            aria-label="Admin navigation menu"
            className="absolute inset-y-0 left-0 w-[min(20rem,calc(100vw-4rem))] shadow-2xl"
          >
            <SidebarPanel
              pathname={pathname}
              mobile
              onClose={() => setMobileOpenPathname(null)}
              onNavigate={() => setMobileOpenPathname(null)}
            />
          </aside>
        </div>
      ) : null}
    </>
  )
}

// components/layout/header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<{ user?: { role?: string; name?: string } } | null>(null)
  const currentLocation = usePathname()

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setSession(data)
        }
      })
      .catch(() => {})
  }, [])
  const isActiveDesktop = (path: string) => {
    const isActive = currentLocation === path;
    return `text-sm font-semibold transition-colors pb-1 ${
      isActive 
        ? "text-[#1a365d] border-b-2 border-[#eab308]"
        : "text-slate-600 hover:text-[#1a365d]"
    }`;
  };

  const isActiveMobile = (path: string) => {
    const isActive = currentLocation === path;
    return `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? "text-[#1a365d] bg-blue-50/50 border-l-4 border-[#eab308]"
        : "text-gray-700 hover:text-slate-900 hover:bg-gray-100"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-full p-1 overflow-hidden shadow-sm">
                <Image
                  src="/UETM-IMAGES/UET-logo.webp"
                  alt="UET Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-[#1a365d] tracking-wide leading-none transition-colors">
                  UET-MARDAN
                </span>
                <span className="text-[10px] sm:text-[8px] text-[#eab308] uppercase tracking-wider mt-1 pl-1 transition-colors">
                  Alumni Management System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            <Link href="/" className={isActiveDesktop("/")} aria-current={currentLocation === "/" ? "page" : undefined}>
              Home
            </Link>
            <Link href="/about" className={isActiveDesktop("/about")} aria-current={currentLocation === "/about" ? "page" : undefined}>
              About
            </Link>
            <Link href="/leadership" className={isActiveDesktop("/leadership")} aria-current={currentLocation === "/leadership" ? "page" : undefined}>
              Leadership
            </Link>
            <Link href="/contact" className={isActiveDesktop("/contact")} aria-current={currentLocation === "/contact" ? "page" : undefined}>
              Contact
            </Link>
            {session?.user ? (
              <Link
                href={session.user.role === 'SUPER_ADMIN' || session.user.role === 'SUB_ADMIN' ? '/dashboard/admin' : '/dashboard'}
                className="text-sm font-semibold bg-[#1a365d] text-white hover:bg-[#12284c] px-5 py-2.5 rounded-md transition-all shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={isActiveDesktop("/login")} aria-current={currentLocation === "/login" ? "page" : undefined}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-[#1a365d] text-white hover:bg-[#12284c] px-5 py-2.5 rounded-md transition-all shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center sm:hidden gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-2 pt-2 pb-3 space-y-1" aria-label="Mobile navigation">
            <Link href="/" className={isActiveMobile("/")} aria-current={currentLocation === "/" ? "page" : undefined}>
              Home
            </Link>
            <Link href="/about" className={isActiveMobile("/about")} aria-current={currentLocation === "/about" ? "page" : undefined}>
              About Us
            </Link>
            <Link href="/leadership" className={isActiveMobile("/leadership")} aria-current={currentLocation === "/leadership" ? "page" : undefined}>
              Leadership
            </Link>
            <Link href="/contact" className={isActiveMobile("/contact")} aria-current={currentLocation === "/contact" ? "page" : undefined}>
              Contact
            </Link>
            {session?.user ? (
              <Link
                href={session.user.role === 'SUPER_ADMIN' || session.user.role === 'SUB_ADMIN' ? '/dashboard/admin' : '/dashboard'}
                className="block px-3 py-2 rounded-md text-base font-medium bg-[#1a365d] text-white hover:bg-[#12284c] dark:bg-[#e6c15c] dark:text-[#1a2b4c] dark:hover:bg-[#d4af37] mt-4 text-center transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={isActiveMobile("/login")} aria-current={currentLocation === "/login" ? "page" : undefined}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-[#1a365d] text-white hover:bg-[#12284c] dark:bg-[#e6c15c] dark:text-[#1a2b4c] dark:hover:bg-[#d4af37] mt-4 text-center transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
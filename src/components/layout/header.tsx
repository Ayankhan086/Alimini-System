// components/layout/header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const currentLocation = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])
  const isActiveDesktop = (path: string) => {
    const isActive = currentLocation === path;
    return `text-sm font-semibold transition-colors pb-1 ${
      isActive 
        ? "text-[#1a365d] dark:text-white border-b-2 border-[#eab308] dark:border-[#e6c15c]" 
        : "text-slate-600 hover:text-[#1a365d] dark:text-gray-300 dark:hover:text-white"
    }`;
  };

  const isActiveMobile = (path: string) => {
    const isActive = currentLocation === path;
    return `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? "text-[#1a365d] bg-blue-50/50 dark:text-white dark:bg-[#2a3b5c] border-l-4 border-[#eab308] dark:border-[#e6c15c]"
        : "text-gray-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a3b5c]"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1a2b4c] border-b border-gray-200 dark:border-[#2a3b5c] shadow-sm dark:shadow-none transition-colors">
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
                <span className="text-xl sm:text-2xl font-bold text-[#1a365d] dark:text-white tracking-wide leading-none transition-colors">
                  UET-MARDAN
                </span>
                <span className="text-[10px] sm:text-[8px] text-[#eab308] dark:text-[#e6c15c] uppercase tracking-wider mt-1 pl-1 transition-colors">
                  Alumni Management System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={isActiveDesktop("/")}>
              Home
            </Link>
            <Link href="/about" className={isActiveDesktop("/about")}>
              About
            </Link>
            <Link href="/leadership" className={isActiveDesktop("/leadership")}>
              Leadership
            </Link>
            <Link href="/contact" className={isActiveDesktop("/contact")}>
              Contact
            </Link>
            <Link href="/login" className={isActiveDesktop("/login")}>
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-[#1a365d] text-white hover:bg-[#12284c] dark:bg-[#e6c15c] dark:text-[#1a2b4c] px-5 py-2.5 rounded-md dark:hover:bg-[#d4af37] transition-all shadow-sm"
            >
              Register
            </Link>
            
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#2a3b5c] dark:hover:bg-[#31517f] transition-colors border border-gray-200 dark:border-[#31517f] ml-2"
                aria-label="Toggle theme"
                title="Toggle light/dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-[#e6c15c]" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>
            )}
          </nav>

          {/* Mobile menu and theme buttons */}
          <div className="flex items-center sm:hidden gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#2a3b5c] dark:hover:bg-[#31517f] transition-colors border border-gray-200 dark:border-[#31517f]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-[#e6c15c]" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#1a2b4c] border-t border-gray-200 dark:border-[#2a3b5c]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={isActiveMobile("/")}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={isActiveMobile("/about")}
            >
              About Us
            </Link>
            <Link
              href="/leadership"
              className={isActiveMobile("/leadership")}
            >
              Leadership
            </Link>
            <Link
              href="/contact"
              className={isActiveMobile("/contact")}
            >
              Contact
            </Link>
            <Link
              href="/login"
              className={isActiveMobile("/login")}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block px-3 py-2 rounded-md text-base font-medium bg-[#1a365d] text-white hover:bg-[#12284c] dark:bg-[#e6c15c] dark:text-[#1a2b4c] dark:hover:bg-[#d4af37] mt-4 text-center transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
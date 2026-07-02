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
  return (
    <header className="sticky top-0 z-50 w-full bg-[#1a2b4c] border-b border-[#2a3b5c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-full p-1 overflow-hidden shadow-sm">
                <Image
                  src="/UETM-IMAGES/UET-logo.webp"
                  alt="UET Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wide leading-none">
                  UET-MARDAN
                </span>
                <span className="text-[10px] sm:text-[8px] text-[#e6c15c] uppercase tracking-wider mt-1 pl-1">
                  Alumni Management System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-white ${currentLocation === "/"  ? "border-b-2 border-[#e6c15c]" : ""} pb-1 text-sm font-medium`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-gray-300 ${currentLocation === "/about"  ? "border-b-2 border-[#e6c15c]" : ""} hover:text-white transition-colors text-sm font-medium`}
            >
              About Us
            </Link>
            <Link
              href="/leadership"
              className={`text-gray-300 ${currentLocation === "/leadership"  ? "border-b-2 border-[#e6c15c]" : ""} hover:text-white transition-colors text-sm font-medium`}
            >
              Leadership
            </Link>
            <Link
              href="/contact"
              className={`text-gray-300 ${currentLocation === "/contact"  ? "border-b-2 border-[#e6c15c]" : ""} hover:text-white transition-colors text-sm font-medium`}
            >
              Contact
            </Link>
            <Link 
              href="/login"
              className={`text-gray-300  hover:text-white transition-colors text-sm font-medium`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Register
            </Link>
            
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-[#2a3b5c] hover:bg-[#31517f] transition-colors border border-[#31517f] ml-2"
                aria-label="Toggle theme"
                title="Toggle light/dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-200" />
                )}
              </button>
            )}
          </nav>

          {/* Mobile menu and theme buttons */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-[#2a3b5c] hover:bg-[#31517f] transition-colors border border-[#31517f]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-200" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
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
        <div className="md:hidden bg-[#1a2b4c] border-t border-[#2a3b5c]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#2a3b5c]"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#2a3b5c]"
            >
              About Us
            </Link>
            <Link
              href="/leadership"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#2a3b5c]"
            >
              Leadership
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#2a3b5c]"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#2a3b5c]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4 text-center"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
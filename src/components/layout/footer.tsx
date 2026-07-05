// components/layout/footer.tsx
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#24426b] text-slate-600 dark:text-gray-300 border-t border-gray-200 dark:border-[#31517f] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
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
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              UET Mardan Alumni Association — connecting graduates worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-lg transition-colors">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/leadership" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-lg transition-colors">Connect With Us</h3>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#31517f] text-slate-600 dark:text-gray-300 flex items-center justify-center hover:bg-[#1a365d] hover:text-white dark:hover:bg-[#e6c15c] dark:hover:text-[#1a2b4c] transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#31517f] text-slate-600 dark:text-gray-300 flex items-center justify-center hover:bg-[#1a365d] hover:text-white dark:hover:bg-[#e6c15c] dark:hover:text-[#1a2b4c] transition-colors">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#31517f] text-slate-600 dark:text-gray-300 flex items-center justify-center hover:bg-[#1a365d] hover:text-white dark:hover:bg-[#e6c15c] dark:hover:text-[#1a2b4c] transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-1 transition-colors">Email</p>
              <a href="mailto:oric@uetmardan.edu.pk" className="text-slate-900 dark:text-white hover:text-[#1a365d] dark:hover:text-[#e6c15c] transition-colors text-sm font-medium">
                oric@uetmardan.edu.pk
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
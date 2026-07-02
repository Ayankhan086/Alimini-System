// components/layout/footer.tsx
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="bg-[#24426b] text-gray-300 border-t border-[#31517f]">
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
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              UET Mardan Alumni Association — connecting graduates worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/leadership" className="hover:text-white transition-colors">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Connect With Us</h3>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-8 h-8 rounded-full bg-[#31517f] flex items-center justify-center hover:bg-[#e6c15c] hover:text-[#1a2b4c] transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#31517f] flex items-center justify-center hover:bg-[#e6c15c] hover:text-[#1a2b4c] transition-colors">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#31517f] flex items-center justify-center hover:bg-[#e6c15c] hover:text-[#1a2b4c] transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <a href="mailto:oric@uetmardan.edu.pk" className="text-white hover:text-[#e6c15c] transition-colors text-sm">
                oric@uetmardan.edu.pk
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
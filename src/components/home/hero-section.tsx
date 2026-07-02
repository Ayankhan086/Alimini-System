// components/home/hero-section.tsx
import Link from 'next/link'

export function HeroSection() {
  return (
    <section 
      className="relative py-24 sm:py-32 lg:py-40 flex flex-col items-center justify-center text-center overflow-hidden border-b border-[#2a3b5c] bg-cover bg-center"
      style={{ backgroundImage: "url('/UETM-IMAGES/bg_uet.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#1a2b4c]/80 dark:bg-slate-900/80 mix-blend-multiply"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
          Welcome to the UET Mardan Alumni<br />
          Association
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-300 mb-10 font-light">
          Connect, Collaborate, and Give Back.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-[#1a2b4c] bg-[#e6c15c] rounded-md hover:bg-[#d4af37] transition-colors shadow-lg hover:shadow-xl"
          >
            Register Now
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-[#31517f] rounded-md hover:bg-[#41618f] transition-colors shadow-lg hover:shadow-xl"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  )
}
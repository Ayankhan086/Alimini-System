// components/home/hero-section.tsx
import Link from 'next/link'

export function HeroSection() {
  return (
    <section 
      className="relative py-24 sm:py-32 lg:py-40 flex flex-col items-center justify-center text-center overflow-hidden border-b border-gray-200 dark:border-[#2a3b5c] bg-cover bg-center transition-colors"
      style={{ backgroundImage: "url('/UETM-IMAGES/bg_uet.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0B0F19]/80 mix-blend-multiply transition-colors"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight anim-fadeInUp">
          Welcome to the UET Mardan Alumni<br />
          Association
        </h1>
        <p className="mt-4 text-lg sm:text-2xl text-gray-300 mb-10 font-light anim-fadeInUp delay-100">
          Connect, Collaborate, and Give Back.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 anim-fadeInUp delay-200">
          <Link
            href="/register"
            className="btn btn-accent px-10 py-4 text-[17px] rounded-full"
          >
            Register Now
          </Link>
          <Link
            href="/login"
            className="btn btn-primary px-10 py-4 text-[17px] rounded-full"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  )
}
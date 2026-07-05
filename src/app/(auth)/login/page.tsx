// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Login - Alumni Management System',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[url('/UETM-IMAGES/bg_uet.jpg')] bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[#0B0F19]/40 mix-blend-multiply"></div>
      
      <div className="w-full max-w-[1000px] glass-card overflow-hidden shadow-2xl flex min-h-[600px] relative z-10 transition-colors anim-fadeInUp">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative bg-white/95 dark:bg-[#0B0F19]/95 transition-colors">
          <div className="mb-8 delay-100 anim-fadeInUp">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">
              Welcome back
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm transition-colors">
              Log in to access your alumni profile and network.
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500 dark:text-slate-300 transition-colors">New alumni? </span>
            <Link href="/register" className="text-[#1a365d] dark:text-[#FFD700] font-bold hover:underline underline-offset-4 transition-colors">
              Register here &rarr;
            </Link>
          </div>
        </div>

        {/* Right Side - Info Panel */}
        <div className="hidden md:flex w-1/2 bg-slate-50 dark:bg-[#1a365d] p-12 flex-col justify-between relative overflow-hidden gap-8 border-l border-gray-100 dark:border-none transition-colors">
          {/* Decorative shapes background */}
          

          <div className="relative z-10">
            <div className="flex items-center mb-16 gap-3">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-full p-1 overflow-hidden shadow-sm border border-gray-200 dark:border-none">
                <Image
                  src="/UETM-IMAGES/UET-logo.webp"
                  alt="UET Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-wide leading-none transition-colors">
                  UET-MARDAN
                </span>
                <span className="text-[10px] sm:text-[8px] text-[#eab308] dark:text-[#e6c15c] uppercase tracking-wider mt-1 pl-1 transition-colors">
                  Alumni Management System
                </span>
              </div>
            
          </div>

            <div className="space-y-6">
              <h2 className="text-3xl leading-tight font-bold text-slate-900 dark:text-white transition-colors">
                <span className="text-[#eab308] text-3xl leading-none mr-2 font-serif">&ldquo;</span>
                Your journey started here.<br />
                Continue it with us.
              </h2>

              <div className="relative pl-6 py-1">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#eab308] rounded-full"></div>
                <p className="text-slate-600 dark:text-blue-100/90 leading-relaxed text-xs transition-colors">
                  Connect, collaborate, and give back. Reconnect with classmates, explore careers, and stay engaged — all in one place.
                </p>
              </div>
            </div>

            <div className="mt-16 flex justify-around gap-12">
              <div>
                <div className="text-3xl font-bold text-[#eab308] mb-1">1,200+</div>
                <div className="text-sm text-slate-500 dark:text-blue-200/80 transition-colors">Alumni connected</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#eab308] mb-1">87</div>
                <div className="text-sm text-slate-500 dark:text-blue-200/80 transition-colors">Events this year</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-slate-500 dark:text-blue-300/70 text-xs transition-colors">
            <ShieldCheck className="h-4 w-4 text-[#eab308]" />
            <span>Secure login &middot; UETMAA alumni network</span>
          </div>
        </div>
      </div>
    </div>
  )
}
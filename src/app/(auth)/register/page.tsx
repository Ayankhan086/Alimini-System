// app/(auth)/register/page.tsx
import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Register - Alumni Management System',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[url('/UETM-IMAGES/bg_uet.jpg')] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center justify-center p-4 py-12 relative before:absolute before:inset-0 before:bg-white/60 dark:before:bg-[#0B0F19]/90 before:backdrop-blur-sm">
      <div className="mb-8 flex flex-col items-center relative z-10">
        <Image src="/UETM-IMAGES/UET-logo.webp" alt="Logo" width={100} height={100} />
        <h1 className="text-2xl md:text-[28px] font-bold text-[#1a365d] dark:text-white">
          Create your alumni account
        </h1>
      </div>
      
      <div className="w-full max-w-[650px] bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-slate-700 overflow-hidden relative z-10">
        <RegisterForm />
      </div>
    </div>
  )
}
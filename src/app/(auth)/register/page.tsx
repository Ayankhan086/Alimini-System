// app/(auth)/register/page.tsx
import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Register - Alumni Management System',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[url('/UETM-IMAGES/bg_uet.jpg')] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center justify-center p-4 py-12 relative">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="mb-8 flex flex-col items-center relative z-10 anim-fadeInUp">
        <Image src="/UETM-IMAGES/UET-logo.webp" alt="Logo" width={100} height={100} className='rounded-full shadow-lg shadow-white/10' />
        <h1 className="text-2xl md:text-[28px] font-bold text-white mt-4 transition-colors">
          Create your alumni account
        </h1>
      </div>
      
      <div className="w-full max-w-[800px] glass-card overflow-hidden relative z-10 transition-colors anim-fadeInUp delay-100">
        <div className="bg-white/95 dark:bg-[#0B0F19]/95 transition-colors">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
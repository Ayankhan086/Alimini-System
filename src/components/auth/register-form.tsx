// components/auth/register-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, Star, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

// ── Zod schema — matches Prisma User + Alumni models exactly ──────────
const currentYear = new Date().getFullYear()

const registerSchema = z.object({
  // → User model
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),

  // → Alumni model: Personal Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  cnic: z.string().min(13, 'CNIC must be at least 13 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),

  // → Alumni model: Educational Information
  degreeLevel: z.string().min(1, 'Degree level is required'),
  program: z.string().min(1, 'Program name is required'),
  admissionYear: z.string()
    .min(4, 'Admission year is required')
    .refine((val) => {
      const year = parseInt(val)
      return year >= 2000 && year <= currentYear
    }, `Year must be between 2000 and ${currentYear}`),
  graduationYear: z.string()
    .min(4, 'Graduation year is required')
    .refine((val) => {
      const year = parseInt(val)
      return year >= 2000 && year <= currentYear + 6
    }, `Year must be between 2000 and ${currentYear + 6}`),
  registrationNumber: z.string().min(1, 'Registration number is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const admission = parseInt(data.admissionYear)
  const graduation = parseInt(data.graduationYear)
  return graduation > admission
}, {
  message: "Graduation year must be after admission year",
  path: ["graduationYear"],
})

type RegisterFormData = z.infer<typeof registerSchema>

// ── Shared select class for consistent styling ────────────────────────
const selectClass = "form-select h-11"

// ── Shared input class for consistent styling ─────────────────────────
const inputClass = "form-input h-11"

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }
      
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-8 text-center anim-fadeInUp">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-[#1a365d] dark:text-white">Registration Successful!</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-2">
          Your application has been submitted for ORIC verification.
        </p>
        <p className="text-sm text-gray-400 dark:text-slate-500 mb-6">
          You can log in now. Your profile will show as &ldquo;Pending&rdquo; until verified by the admin.
        </p>
        <Link href="/login">
          <Button className="btn btn-primary">
            Go to Login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 md:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* ── Personal Information Section ────────────────────────── */}
        <div>
          <h3 className="text-[#1a365d] dark:text-[#FFD700] font-bold text-[15px] border-b border-gray-200 dark:border-slate-700 pb-2 mb-5">
            Personal Information
          </h3>
          
          <div className="space-y-4">
            {/* First name + Last name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="form-label">First name</label>
                <Input id="firstName" placeholder="Ahmed" className={inputClass} {...register('firstName')} />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="form-label">Last name</label>
                <Input id="lastName" placeholder="Khan" className={inputClass} {...register('lastName')} />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="form-label">Email address</label>
              <Input id="email" type="email" placeholder="ahmed@example.com" className={inputClass} {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label htmlFor="password" className="form-label">Password</label>
                <Input id="password" type="password" placeholder="••••••••" className={`${inputClass} tracking-widest placeholder:tracking-normal`} {...register('password')} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" className={`${inputClass} tracking-widest placeholder:tracking-normal`} {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* CNIC + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label htmlFor="cnic" className="form-label">CNIC number</label>
                <Input id="cnic" placeholder="35202-1234567-1" className={inputClass} {...register('cnic')} />
                {errors.cnic && <p className="text-xs text-red-500">{errors.cnic.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="form-label">Phone number</label>
                <Input id="phone" placeholder="+92 300 1234567" className={inputClass} {...register('phone')} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Educational Information Section ─────────────────────── */}
        <div>
          <h3 className="text-[#1a365d] dark:text-[#FFD700] font-bold text-[15px] border-b border-gray-200 dark:border-slate-700 pb-2 mb-5 mt-8">
            Educational Information (For Verification)
          </h3>
          
          <div className="space-y-4">
            {/* Degree level + Program */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label htmlFor="degreeLevel" className="form-label">Degree level</label>
                <select 
                  id="degreeLevel" 
                  className={selectClass}
                  {...register('degreeLevel')}
                >
                  <option value="BSc">BSc</option>
                  <option value="MSc">MSc</option>
                  <option value="PhD">PhD</option>
                </select>
                {errors.degreeLevel && <p className="text-xs text-red-500">{errors.degreeLevel.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="program" className="form-label">Program name</label>
                <Input id="program" placeholder="Electrical Engineering" className={inputClass} {...register('program')} />
                {errors.program && <p className="text-xs text-red-500">{errors.program.message}</p>}
              </div>
            </div>

            {/* Admission year + Graduation year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label htmlFor="admissionYear" className="form-label">Admission year</label>
                <Input id="admissionYear" type="number" placeholder="2018" className={inputClass} {...register('admissionYear')} />
                {errors.admissionYear && <p className="text-xs text-red-500">{errors.admissionYear.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="graduationYear" className="form-label">Graduation year</label>
                <Input id="graduationYear" type="number" placeholder="2022" className={inputClass} {...register('graduationYear')} />
                {errors.graduationYear && <p className="text-xs text-red-500">{errors.graduationYear.message}</p>}
              </div>
            </div>

            {/* Registration number (full width) */}
            <div className="space-y-1.5">
              <label htmlFor="registrationNumber" className="form-label flex items-center gap-1.5">
                Registration number 
              </label>
              <Input id="registrationNumber" placeholder="18MDSWE012" className={inputClass} {...register('registrationNumber')} />
              <p className="text-[11px] text-[#eab308] dark:text-[#FFD700] font-medium flex items-center mt-1">
                <Info className="h-3 w-3 mr-1" /> Required for ORIC verification
              </p>
              {errors.registrationNumber && <p className="text-xs text-red-500">{errors.registrationNumber.message}</p>}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" className="btn btn-primary w-full h-12 text-[15px]" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Registration'}
          </Button>
          
          <p className="text-center mt-5 text-sm">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Already have an account? </span>
            <Link href="/login" className="text-[#008C9E] dark:text-[#FFD700] font-bold hover:underline transition-colors">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
// components/auth/login-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Check session to route by role
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      
      if (session?.user?.role === 'ADMIN') {
        router.push('/dashboard/admin')
      } else {
        router.push('/dashboard')
      }
      
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="alumni@uetmardan.edu.pk"
                className="pl-12 py-6 rounded-xl border-gray-200 bg-white text-black shadow-sm dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 pl-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-12 pr-12 py-6 rounded-xl border-gray-200 bg-white text-black shadow-sm text-lg tracking-widest placeholder:tracking-normal placeholder:text-base placeholder:font-normal font-medium dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 pl-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded-[4px] border-2 border-gray-300 bg-white checked:border-[#1a365d] checked:bg-[#1a365d] dark:border-slate-600 dark:bg-slate-800 dark:checked:border-[#FFD700] dark:checked:bg-[#FFD700] transition-all" />
              <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white dark:text-slate-900 opacity-0 peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </span>
            </div>
            <span className="ml-2.5 text-[14px] text-gray-600 dark:text-slate-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-[14px] font-semibold text-[#1a365d] dark:text-[#FFD700] hover:text-blue-800 dark:hover:text-yellow-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 mt-2 rounded-xl bg-[#1a365d] dark:bg-[#FFD700] dark:text-[#0B0F19] hover:bg-[#12284c] hover:cursor-pointer dark:hover:bg-[#E6C15C] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Access Your Network'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}

'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a placeholder to avoid layout shift before hydration
    return <div className={cn("w-[38px] h-[38px] rounded-full", className)} aria-hidden="true" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "p-2 rounded-full transition-colors border",
        "bg-slate-100 hover:bg-slate-200 border-gray-200", // Light Mode classes
        "dark:bg-[#2a3b5c] dark:hover:bg-[#31517f] dark:border-[#31517f]", // Dark Mode classes
        className
      )}
      aria-label="Toggle theme"
      title="Toggle light/dark mode"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-[#e6c15c]" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600" />
      )}
    </button>
  )
}

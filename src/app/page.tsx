// app/(dashboard)/page.tsx (Homepage)
import { Metadata } from 'next'
import { HeroSection } from '@/components/home/hero-section'
import { AboutSection } from '@/components/home/about-section'
import { WhyJoinSection } from '@/components/home/why-join-section'
import { StatsSection } from '@/components/home/stats-section'
import { CtaSection } from '@/components/home/cta-section'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Alumni Management System | UET Mardan',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 font-sans selection:bg-[#e6c15c] selection:text-[#1a2b4c]">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <WhyJoinSection />
        <StatsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
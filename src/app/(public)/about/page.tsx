import Hero from '@/components/about/Hero'
import MissionVision from '@/components/about/MissionVision'
import Constitution from '@/components/about/Constitution'
import Membership from '@/components/about/Membership'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
    title: 'About UETMAA - UET Mardan Alumni Association',
    description: 'Learn about UETMAA mission, vision, constitution, membership tiers, and more',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 font-sans selection:bg-[#e6c15c] selection:text-[#1a2b4c]">
            <Header />
            <main className="space-y-8">
                <Hero />
                <MissionVision />
                <Constitution />
                <Membership />
            </main>
            <Footer />
        </div>
    )
}
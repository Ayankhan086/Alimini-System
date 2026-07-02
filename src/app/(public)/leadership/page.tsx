import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Hero from '@/components/leadership/Hero'
import Grid from '@/components/leadership/Grid'

export const metadata = {
    title: 'About UETMAA - UET Mardan Alumni Association',
    description: 'Learn about UETMAA mission, vision, constitution, membership tiers, and more',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 font-sans selection:bg-[#e6c15c] selection:text-[#1a2b4c]">
            <Header />
            <main >
                <Hero />
                <Grid />
            </main>
            <Footer />
        </div>
    )
}
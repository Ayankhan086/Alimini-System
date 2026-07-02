// components/home/about-section.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="bg-white dark:bg-[#0B0F19] py-20 sm:py-28 text-center px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About UETMAA
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 mb-8 leading-relaxed">
          The UET Mardan Alumni Association (UETMAA) unites graduates across the globe to 
          strengthen ties with their alma mater. We work to foster lifelong networking, support 
          current students through mentorship and resources, and contribute to the continued 
          growth of engineering education at UET Mardan.
        </p>
        <Link 
          href="/about"
          className="inline-flex items-center justify-center text-[#1a2b4c] dark:text-yellow-400 font-semibold hover:text-[#d4af37] dark:hover:text-yellow-300 transition-colors group"
        >
          Read More
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}

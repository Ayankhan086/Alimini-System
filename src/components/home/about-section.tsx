// components/home/about-section.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="bg-white dark:bg-[#0B0F19] py-20 sm:py-28 text-center px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 anim-fadeInUp">
          About <span className="text-grad-cyan">UETMAA</span>
        </h2>
        <p className="text-base sm:text-xl text-gray-600 dark:text-slate-300 mb-10 leading-relaxed font-light anim-fadeInUp delay-100">
          The UET Mardan Alumni Association (UETMAA) unites graduates across the globe to 
          strengthen ties with their alma mater. We work to foster lifelong networking, support 
          current students through mentorship and resources, and contribute to the continued 
          growth of engineering education at UET Mardan.
        </p>
        <div className="anim-fadeInUp delay-200">
          <Link 
            href="/about"
            className="inline-flex items-center justify-center font-bold text-[#008C9E] dark:text-[#FFD700] hover:text-[#006B7A] dark:hover:text-yellow-300 transition-colors group text-lg"
          >
            Read More
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

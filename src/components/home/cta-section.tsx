// components/home/cta-section.tsx
import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="bg-[#fdfbf7] dark:bg-[#0B0F19] py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2b4c] dark:text-white mb-4">
          Ready to reconnect?
        </h2>
        <p className="text-lg text-gray-600 dark:text-slate-300 mb-10">
          Join the UETMAA family today.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-[#1a2b4c] dark:bg-[#e6c15c] dark:text-[#1a2b4c] rounded-md hover:bg-[#2a3b5c] dark:hover:bg-[#d4af37] transition-colors shadow-md hover:shadow-lg"
        >
          Register Now
        </Link>
      </div>
    </section>
  )
}

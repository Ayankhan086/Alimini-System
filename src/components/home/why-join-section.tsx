// components/home/why-join-section.tsx
import { Globe, Briefcase, GraduationCap } from 'lucide-react'

export function WhyJoinSection() {
  const features = [
    {
      title: 'Global Network',
      description: 'Connect with 10,000+ alumni across 15+ countries working in diverse industries worldwide.',
      icon: <Globe className="w-6 h-6 text-[#4a90e2] dark:text-blue-400" />,
      iconBg: 'bg-[#f0f7ff] dark:bg-blue-900/30'
    },
    {
      title: 'Career Growth',
      description: 'Access mentorship opportunities, job referrals, and a professional network that opens doors.',
      icon: <Briefcase className="w-6 h-6 text-[#d4af37] dark:text-yellow-400" />,
      iconBg: 'bg-[#fdfbf7] dark:bg-yellow-900/30'
    },
    {
      title: 'Give Back',
      description: 'Support current students through scholarships, mentoring programs, and research funding.',
      icon: <GraduationCap className="w-6 h-6 text-[#1a2b4c] dark:text-slate-300" />,
      iconBg: 'bg-[#f2f4f8] dark:bg-slate-700/50'
    }
  ]

  return (
    <section className="bg-[#f3f4f6] dark:bg-slate-900 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Why Join?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-slate-700 flex flex-col items-start"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${feature.iconBg}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

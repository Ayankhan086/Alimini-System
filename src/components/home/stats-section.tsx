// components/home/stats-section.tsx
export function StatsSection() {
  const stats = [
    { value: '5000+', label: 'Alumni Worldwide' },
    { value: '15+', label: 'Countries Represented' },
    { value: '50+', label: 'Events Hosted' }
  ]

  return (
    <section className="bg-slate-50 dark:bg-[#1a2b4c] py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-[#2a3b5c] transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-[#2a3b5c]">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center pt-8 md:pt-0 first:pt-0">
              <span className="text-4xl sm:text-5xl font-bold text-[#1a365d] dark:text-[#e6c15c] mb-3 transition-colors">
                {stat.value}
              </span>
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300 uppercase tracking-wider font-medium transition-colors">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
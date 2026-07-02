import React from 'react'

const Constitution = () => {
  const points = [
    "Promote engineering education and academic excellence at UET Mardan",
    "Foster lifelong networking and collaboration among alumni",
    "Establish endowment funds to support scholarships and research",
    "Organize events, reunions, and mentorship programs for members",
    "Advocate for the interests of alumni and the university community",
    "Support current students through career guidance and internships"
  ]

  return (
    <div className=' mx-auto bg-[#F2F2F3] dark:bg-slate-800/50 p-4  shadow-sm flex flex-col justify-center items-center py-15'>
      <h2 className="text-3xl font-bold text-[#1a3a5c] dark:text-white mb-8">
        UETMAA Constitution (Brief)
      </h2>
      <ul className="space-y-2 bg-white dark:bg-slate-800 px-20 py-10 rounded-xl w-[70%]">
        {points.map((point, index) => (
          <li key={index} className="text-gray-700 dark:text-slate-300 list-disc ">
             {point}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Constitution
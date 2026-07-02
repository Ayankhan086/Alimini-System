import React from 'react'

const Grid = () => {
  const members = [
    {
      initials: "MS",
      name: "Dr. Mohammad Sohail Khan",
      role: "President",
      details: ["Professor, UET Mardan", "Senior Engineer, Systems Ltd."]
    },
    {
      initials: "BA",
      name: "Engr. Bilal Ahmed",
      role: "Vice President",
      details: ["Senior Engineer, Systems Ltd."]
    },
    {
      initials: "AM",
      name: "Ayesha Malik",
      role: "General Secretary",
      details: ["Project Manager, Devsinc"]
    },
    {
      initials: "UT",
      name: "Usman Tariq",
      role: "Treasurer",
      details: ["Finance Lead, Arishoth"]
    },
    {
      initials: "SY",
      name: "Sana Yousaf",
      role: "Joint Secretary",
      details: ["Civil Engineer, NESHAK"]
    },
    {
      initials: "HR",
      name: "Hamza Raza",
      role: "EC Member",
      details: ["Software Architect, 10Peats"]
    },
    {
      initials: "FN",
      name: "Fatima Noor",
      role: "EC Member",
      details: ["Power Systems Engineer, PESCO"]
    },
    {
      initials: "ZT",
      name: "Zainab Tariq",
      role: "Senior Developer, VentureCive",
      details: []
    },
    {
      initials: "IS",
      name: "Imran Sheikh",
      role: "EC Member",
      details: ["Operations Manager, Caresen"]
    },
    {
      initials: "MK",
      name: "Mahnoor Khalid",
      role: "EC Member",
      details: ["Product Lead, Fok3"]
    },
    {
      initials: "SM",
      name: "Saad Mehmood",
      role: "EC Member",
      details: ["Tech Lead, TRG Pakistan"]
    },
    {
      initials: "HA",
      name: "Hira Aslam",
      role: "EC Member",
      details: ["QA Manager, Techcope"]
    }
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 bg-gray-100 dark:bg-[#0B0F19]">
        {members.map((member, index) => (
          <div key={index} className="card bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow hover:cursor-pointer">
            {/* Initials Circle */}
            <div className="w-16 h-16 rounded-full bg-[#1a3a5c] dark:bg-slate-700 text-white flex items-center justify-center text-xl font-bold mb-4">
              {member.initials}
            </div>
            
            {/* Name */}
            <h3 className="text-lg font-semibold text-[#1a3a5c] dark:text-white mb-1">
              {member.name}
            </h3>
            
            {/* Role */}
            <p className="text-[#f0b429] dark:text-yellow-400 font-medium mb-2">
              {member.role}
            </p>
            
            {/* Details */}
            {member.details.length > 0 && (
              <ul className="text-sm text-gray-600 dark:text-slate-300 space-y-1">
                {member.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Grid
import React from 'react'

const Membership = () => {
  const tiers = [
    {
      type: "Regular Member",
      fee: "PKR 500 / year",
      description: "Open to all verified graduates"
    },
    {
      type: "Annual Member",
      fee: "PKR 2,000 / year",
      description: "Includes event discounts & newsletter"
    },
    {
      type: "Life Member",
      fee: "PKR 15,000 (one-time)",
      description: "Lifetime access to all UETMAA benefits"
    }
  ]

  return (
    <div className='mx-auto max-w-4xl my-20'>
      <h2 className="text-3xl text-center font-bold text-[#1a3a5c] dark:text-white pb-2 mb-4">
        Membership Tiers
      </h2>
      <div className="border border-gray-300 dark:border-slate-700 rounded overflow-hidden">
        <div className="grid grid-cols-3 bg-[#F5F5FA] dark:bg-slate-800 text-[#1a3a5c] dark:text-slate-200 font-semibold">
          <div className="p-3">MEMBERSHIP TYPE</div>
          <div className="p-3">FEE</div>
          <div className="p-3">DESCRIPTION</div>
        </div>
        {tiers.map((tier, index) => (
          <div key={index} className="grid grid-cols-3 border-t border-gray-300 dark:border-slate-700">
            <div className="p-3 font-semibold text-[#1a3a5c] dark:text-white">{tier.type}</div>
            <div className="p-3 text-[#f0b429] dark:text-yellow-400 font-medium">{tier.fee}</div>
            <div className="p-3 text-gray-600 dark:text-slate-300">{tier.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Membership
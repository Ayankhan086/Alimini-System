import React from 'react'

const Hero = () => {
  return (
    <section 
      className="relative p-8 md:p-12 py-24 md:py-32 text-center flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/UETM-IMAGES/bg_uet.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#1a2b4c]/80 dark:bg-slate-900/80 mix-blend-multiply"></div>
      
      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">About UETMAA</h1>
        <p className="text-lg md:text-2xl text-blue-100">
          UET Mardan Alumni Management System — Keeping the spirit alive
        </p>
      </div>
    </section>
  )
}

export default Hero
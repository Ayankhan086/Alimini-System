import React from "react";

export default function Hero() {
  return (
    <section 
      className="relative p-8 md:p-12 py-24 md:py-32 text-center flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/UETM-IMAGES/bg_uet.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#1a2b4c]/80 dark:bg-slate-900/80 mix-blend-multiply"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">Get in Touch</h1>
        <p className="text-lg text-slate-200">
          Have a question about registration? We're here to help.
        </p>
      </div>
    </section>
  );
}

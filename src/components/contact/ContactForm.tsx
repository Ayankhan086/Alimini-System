"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-8">Send Us a Message</h2>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-xl shadow-sm text-left">
          <div className="mb-6 form-group">
            <label htmlFor="name" className="text-sm font-medium text-slate-500 dark:text-slate-300 mb-2 block">Full Name</label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1a2b4c] focus:ring-2 focus:ring-[#1a2b4c]/20 outline-none rounded-md text-slate-900 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white transition-all"
              placeholder="Ahmed Khan"
            />
          </div>
          
          <div className="mb-6 form-group">
            <label htmlFor="email" className="text-sm font-medium text-slate-500 dark:text-slate-300 mb-2 block">Email Address</label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1a2b4c] focus:ring-2 focus:ring-[#1a2b4c]/20 outline-none rounded-md text-slate-900 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6 form-group">
            <label htmlFor="message" className="text-sm font-medium text-slate-500 dark:text-slate-300 mb-2 block">Message</label>
            <textarea
              id="message"
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1a2b4c] focus:ring-2 focus:ring-[#1a2b4c]/20 outline-none rounded-md text-slate-900 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white resize-none transition-all"
              placeholder="Type your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a2b4c] dark:bg-[#e6c15c] dark:text-[#1a2b4c] hover:bg-[#2a3b5c] dark:hover:bg-[#d4af37] text-white font-medium py-3 px-4 rounded-md transition-colors shadow-sm"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Message sent successfully!</h3>
          <p className="text-slate-500 dark:text-slate-400">We'll get back to you soon.</p>
        </div>
      )}
      
      {/* Displaying Success State demo underneath like in the mockup */}
      {isSubmitted && (
        <div className="mt-16 text-left">
          <p className="text-sm font-semibold text-slate-500 mb-4">Success State (on submit):</p>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-xl shadow-sm flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg font-bold mb-1">Message sent successfully!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">We'll get back to you soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}

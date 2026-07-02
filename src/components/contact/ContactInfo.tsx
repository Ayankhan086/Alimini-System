import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <MapPin className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Office Address</h3>
        <p className="font-medium text-slate-900 dark:text-white">
          ORIC Office, UET Mardan,<br />
          Khyber Pakhtunkhwa, Pakistan
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
          <Mail className="w-6 h-6 text-yellow-500" />
        </div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Email Address</h3>
        <p className="font-medium text-slate-900 dark:text-white">oric@uetmardan.edu.pk</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
        <div className="w-12 h-12 rounded-full bg-amber-100/50 dark:bg-amber-900/30 flex items-center justify-center mb-6">
          <Phone className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Phone Number</h3>
        <p className="font-medium text-slate-900 dark:text-white">+92 937 860 071</p>
      </div>
    </div>
  );
}

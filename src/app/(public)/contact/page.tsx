import React from "react";
import Hero from "@/components/contact/Hero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 font-sans selection:bg-[#e6c15c] selection:text-[#1a2b4c]">
      <Header />
      <main className="flex-grow flex flex-col">
        <Hero />
        {/* Main Content */}
        <section className="flex-grow py-16 ">
          <div className="container mx-auto px-4 max-w-5xl">
            <ContactInfo />
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

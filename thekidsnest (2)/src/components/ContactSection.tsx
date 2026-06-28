/**
 * @file ContactSection.tsx
 * @description Provides the dedicated contact section for TheKidsNest with direct click-to-email and click-to-chat features.
 * @purpose Renders the email link, facebook page link, phone numbers, and location details to provide secondary support channels.
 * @interaction Displays interactive email buttons and WhatsApp links to initiate quick inquiries.
 * 
 * UX Reasoning:
 * - High contrast contact tiles make phone numbers, emails, and social links instantly readable on mobile devices.
 * - Simple interactive hover effects let parents know these are tap/click actions.
 * - Addresses the customer email request explicitly: thekidsnestbd@gmail.com.
 */

import React from 'react';
import { Mail, MessageCircle, Facebook, Clock, MapPin, Sparkles } from 'lucide-react';

/**
 * Modern Contact Us section displaying email and links.
 */
export default function ContactSection() {
  return (
    <section className="bg-white dark:bg-slate-900 py-16 transition-colors duration-300" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-sans text-xs font-bold tracking-widest text-rose-500 uppercase">
            Have Questions?
          </h2>
          <p className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Get In Touch With Us
          </p>
          <div className="mx-auto h-1 w-12 rounded-full bg-rose-500" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3" id="contact-blocks-container">
          
          {/* Tile 1: Email Support */}
          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 p-8 text-center bg-slate-50/40 dark:bg-slate-800/20 hover:border-rose-200 dark:hover:border-slate-700 hover:shadow-xs transition-all group">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 transition-transform group-hover:scale-105">
              <Mail className="h-6 w-6" />
            </div>
            <h4 className="font-sans text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Email Support</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
              Send us an email anytime and our parenting support team will get back to you within 2 hours.
            </p>
            <a
              href="mailto:thekidsnestbd@gmail.com"
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 px-5 py-3 text-xs font-black text-white transition-colors cursor-pointer"
              id="contact-email-btn"
            >
              thekidsnestbd@gmail.com
            </a>
          </div>

          {/* Tile 2: WhatsApp Chat Support */}
          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 p-8 text-center bg-slate-50/40 dark:bg-slate-800/20 hover:border-emerald-200 dark:hover:border-slate-700 hover:shadow-xs transition-all group">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 transition-transform group-hover:scale-105">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h4 className="font-sans text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">WhatsApp Order Help</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
              Prefer to order via chat? Our agent is online. Share your baby's weight and brand of choice!
            </p>
            <a
              href="https://wa.me/8801330862469?text=Hello%20TheKidsNest!%20I%20have%20a%20diaper%20requirement%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 text-xs font-black text-white transition-colors cursor-pointer"
              id="contact-whatsapp-btn"
            >
              Chat 01330862469
            </a>
          </div>

          {/* Tile 3: Social & Timing */}
          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 p-8 text-center bg-slate-50/40 dark:bg-slate-800/20 hover:border-blue-200 dark:hover:border-slate-700 hover:shadow-xs transition-all group">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 transition-transform group-hover:scale-105">
              <Facebook className="h-6 w-6" />
            </div>
            <h4 className="font-sans text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Join Our Facebook Page</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
              Follow our community page for toddler care articles, parenting advice, and stock alerts.
            </p>
            <a
              href="https://www.facebook.com/thekidsnestbd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-xs font-black text-white transition-colors cursor-pointer"
              id="contact-facebook-btn"
            >
              @thekidsnestbd
            </a>
          </div>

        </div>

        {/* Dynamic Timing & Shipping Cards info block */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-around gap-6" id="contact-meta-info">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-amber-500" />
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase">Support Hours</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Daily: 9:00 AM – 10:00 PM</span>
            </div>
          </div>

          <div className="h-px w-full md:h-8 md:w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-rose-500" />
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase">Sylhet Dispatch Hub</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Express delivery within Sylhet division</span>
            </div>
          </div>

          <div className="h-px w-full md:h-8 md:w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase">Cash on Delivery</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Pay only when verified inside Sylhet/all other cities</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

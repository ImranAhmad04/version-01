/**
 * @file Footer.tsx
 * @description Provides the global page footer for TheKidsNest.
 * @purpose Renders copyright credentials, quick link menus, and highlights shipping rates to assure customers.
 * @interaction Display-only component containing site maps and social anchors.
 * 
 * UX Reasoning:
 * - Simple column layouts are highly scannable and render beautifully on both smartphones and desktops.
 * - Restates our Cash on Delivery and delivery fee parameters in the foot margin to reinforce safety.
 */

import React from 'react';
import { Facebook, MessageCircle, Heart, Sparkles, MapPin } from 'lucide-react';

/**
 * Modern site footer layout.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Top Segment: Brand & Shipping Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800" id="footer-top">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-rose-400 to-amber-300 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-sans text-lg font-extrabold tracking-tight text-white">
                TheKids<span className="text-rose-400">Nest</span>
              </span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your safe, authentic, and fast hub for premium quality baby diapers in Bangladesh. Curated with care for toddlers aged 0–3 years. No advance payments.
            </p>
          </div>

          {/* Quick links Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Sitemap</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <a href="#" className="hover:text-rose-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#features" className="hover:text-rose-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#size-finder" className="hover:text-rose-400 transition-colors">Smart Size Finder</a>
              </li>
              <li>
                <a href="#products" className="hover:text-rose-400 transition-colors">Shop Diapers</a>
              </li>
            </ul>
          </div>

          {/* Shipping guidelines col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Delivery Rates</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span>Inside Sylhet: <strong className="text-white">৳50 BDT</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span>Outside Sylhet: <strong className="text-white">৳150 BDT</strong></span>
              </li>
              <li className="text-[11px] text-slate-500 font-bold uppercase leading-tight">
                Cash on Delivery (COD) Standard
              </li>
            </ul>
          </div>

          {/* Connect col */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Connect</h4>
            <div className="flex gap-2" id="footer-social-icons">
              <a
                href="https://www.facebook.com/thekidsnestbd/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"
                title="Facebook Link"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/8801330862469"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"
                title="WhatsApp Link"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
            <span className="text-[10px] text-slate-500 block font-semibold">
              Call Support: 01330862469
            </span>
          </div>

        </div>

        {/* Bottom Segment: Copyright & Trust Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500" id="footer-bottom">
          <p>© {currentYear} TheKidsNest. All rights reserved. 🇧🇩</p>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>for Toddlers and Parents</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

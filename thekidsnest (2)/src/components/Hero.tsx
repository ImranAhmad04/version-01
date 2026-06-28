/**
 * @file Hero.tsx
 * @description Renders the high-impact modern Hero banner for TheKidsNest.
 * @purpose Welcomes parents with an inviting, baby-safe visual aesthetic (warm pastel tones, elegant layout), immediately highlighting our premium diaper collections.
 * @interaction Directs user focus to the ProductCatalog or the Smart Size Calculator through anchor links.
 * 
 * UX Reasoning:
 * - Employs soft, welcoming pastel gradients (rose-peach-amber) that elicit feelings of safety, softness, and trust associated with babies.
 * - Bold, clear value propositions (COD, Fastest Delivery, Trusted by 55+ Regular Clients).
 * - Mobile-first: Buttons are stacked on small mobile devices for easy thumb taps, with beautiful micro-animations for interactivity.
 */

import React from 'react';
import { ArrowRight, Calculator, ShieldCheck, Heart, Truck } from 'lucide-react';

interface HeroProps {
  onStartShopping: () => void;
  onOpenFinder: () => void;
}

/**
 * Modern Hero Section with parent-toddler friendly copywriting and primary call-to-actions.
 */
export default function Hero({ onStartShopping, onOpenFinder }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-amber-50/30 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-900 py-16 sm:py-24 transition-colors duration-300" id="home">
      
      {/* Background soft ambient glowing circles */}
      <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-900/10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-900/10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Hero Text / Value Prop (Left side) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left" id="hero-content">
            
            {/* Playful greeting pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/70 px-4 py-1.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/30">
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Only the Softest Care for Your Toddler</span>
            </div>

            <h1 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
              Keep Baby Active, Dry & <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Rash-Free</span> All Day!
            </h1>

            <p className="mx-auto lg:mx-0 max-w-xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Premium baby diapers from trusted brands like <strong>Supermom, Avonee, NeoCare, Twinkle, Mina, Fresh</strong>, and <strong>Comfort Care</strong>. Perfect fits tailored for toddlers aged 0–3 years, with super-fast cash on delivery across Bangladesh.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4" id="hero-actions">
              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  onStartShopping();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-rose-300/30 hover:shadow-rose-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                id="hero-shop-now-btn"
              >
                Shop Premium Diapers
                <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href="#size-finder"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenFinder();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-rose-400 transition-all cursor-pointer"
                id="hero-calculator-btn"
              >
                <Calculator className="h-5 w-5 text-amber-500" />
                Find Baby Size
              </a>
            </div>

            {/* Micro badges */}
            <div className="pt-4 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0" id="hero-micro-badges">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">100% Original</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Fastest Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-rose-100 p-1.5 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">0% Baby Rashes</span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Graphic Banner (Right side) */}
          <div className="lg:col-span-5 relative" id="hero-visual">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-gradient-to-tr from-rose-100 to-amber-100 dark:from-slate-800 dark:to-slate-700 p-8 shadow-2xl shadow-rose-100/40 dark:shadow-none border border-white/50 dark:border-slate-700/50">
              
              {/* Cute illustration card */}
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg text-4xl">
                  👶
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Welcome to TheKidsNest
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your gentle companion for baby care. Selected original diapers matched with love.
                  </p>
                </div>

                {/* Floating active stats for parents to feel secure */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="rounded-2xl bg-white/70 dark:bg-slate-800/70 p-4 shadow-sm border border-rose-100/20">
                    <span className="block text-xl font-extrabold text-rose-500">Original</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Authentic Brands</span>
                  </div>
                  <div className="rounded-2xl bg-white/70 dark:bg-slate-800/70 p-4 shadow-sm border border-rose-100/20">
                    <span className="block text-xl font-extrabold text-amber-500">COD</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">No Advance Paid</span>
                  </div>
                </div>

                {/* Brand names ticker */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Featured Brands</span>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {['Supermom', 'Avonee', 'Mina', 'Twinkle', 'NeoCare', 'Fresh', 'Comfort Care'].map((b) => (
                      <span
                        key={b}
                        className="rounded-lg bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-2xs"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/**
 * @file RecommendedDiapers.tsx
 * @description Provides a polished, high-conversion section highlighting our expert recommendations for baby diapers.
 * @purpose Displays specific buying guides: budget-friendly (Mina) vs. premium-yet-affordable (Avonee) with clean aesthetic cards.
 * @interaction Display-only with scroll-to-shop action triggers.
 */

import React from 'react';
import { Sparkles, ThumbsUp, DollarSign, Award, ArrowRight } from 'lucide-react';

interface RecommendedDiapersProps {
  onSelectBrand?: (brand: string) => void;
}

export default function RecommendedDiapers({ onSelectBrand }: RecommendedDiapersProps) {
  
  const handleScrollAndFilter = (brand: string) => {
    if (onSelectBrand) {
      onSelectBrand(brand);
    }
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-900/60 py-16 transition-colors duration-300 border-y border-slate-100 dark:border-slate-800/60" id="recommendations">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Expert Curations</span>
          </div>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Our Recommended Diaper
          </h2>
          <p className="font-sans text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Not sure which brand is perfect for your baby? We have tested and handpicked the absolute best choices depending on your budget and preference.
          </p>
          <div className="mx-auto h-1 w-12 rounded-full bg-amber-500" />
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2" id="recommended-grid">
          
          {/* Card 1: Mina (Budget-Friendly) */}
          <div 
            className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-slate-800 p-8 shadow-md hover:shadow-xl border border-slate-100 dark:border-slate-700/50 transition-all hover:-translate-y-1 group"
            id="rec-card-mina"
          >
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-3.5 w-3.5" />
                  Best Value Option
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">All Mina Products</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-sans text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Finding budget friendly best option?
                </h3>
                <h4 className="font-display text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  Mina Diapers <ThumbsUp className="h-6 w-6 text-emerald-500" />
                </h4>
              </div>

              <p className="font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If you are looking for absolute affordability without giving up high absorption capacity, leak protection, or baby skin safety, **Mina** is the ultimate candidate. Highly recommended for daily active use.
              </p>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => handleScrollAndFilter('Mina')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-emerald-600 px-6 py-3 text-sm font-bold transition-all cursor-pointer"
              >
                View All Mina Products
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Avonee (Premium Comfort at Lowest Budget) */}
          <div 
            className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-slate-800 p-8 shadow-md hover:shadow-xl border border-slate-100 dark:border-slate-700/50 transition-all hover:-translate-y-1 group"
            id="rec-card-avonee"
          >
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 to-indigo-500" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/40 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <Award className="h-3.5 w-3.5" />
                  Lowest Budget Premium Feel
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">All Avonee Products</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-sans text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Finding premium feel at lowest budget?
                </h3>
                <h4 className="font-display text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  Avonee is the best option <Sparkles className="h-6 w-6 text-amber-500" />
                </h4>
              </div>

              <p className="font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If you desire a cottony-soft, ultra-breathable luxury diaper feel for your toddler but want to pay the absolute lowest budget, **Avonee** is your best bet. Perfect for heavy overnight sleeping and highly sensitive skin.
              </p>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => handleScrollAndFilter('Avonee')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-rose-600 px-6 py-3 text-sm font-bold transition-all cursor-pointer"
              >
                View All Avonee Products
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

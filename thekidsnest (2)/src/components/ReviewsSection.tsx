/**
 * @file ReviewsSection.tsx
 * @description Renders the parent review shelf for TheKidsNest, showing real reviews from Bangladeshi parents.
 * @purpose Builds immense buyer confidence by demonstrating parent satisfaction with sizing and delivery speeds.
 * @interaction Display-only component loading static content from the reviews data store.
 * 
 * UX Reasoning:
 * - Each review lists the baby's age and diaper size (e.g., "14 Months Old"), helping other parents relate their child's needs.
 * - Star ratings and green "Verified Parent" checkmarks visually signify safety, authenticity, and trust.
 * - Grid-based spacing adapts gracefully from single review cards on small phones to 3 cards on desktop.
 */

import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { customerReviews } from '../data/reviews';

/**
 * Verified Client Reviews section showing ratings and comments.
 */
export default function ReviewsSection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/60 py-16 transition-colors duration-300" id="reviews">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-rose-500">
            <Star className="h-3.5 w-3.5 fill-rose-500" />
            <span>Trusted Choice</span>
          </div>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            What Parents Say About Us
          </h2>
          <p className="mx-auto max-w-lg text-sm text-slate-500 dark:text-slate-400">
            Hear from some of our 55+ active regular parents who trust TheKidsNest for authentic diaper packs and friendly service.
          </p>
          <div className="mx-auto h-1 w-12 rounded-full bg-rose-500" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" id="reviews-cards-grid">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs relative hover:shadow-md transition-shadow group"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-slate-100 dark:text-slate-700 pointer-events-none transition-colors group-hover:text-rose-100/50" />

              <div>
                {/* Star rating row */}
                <div className="flex items-center gap-1 mb-4" id={`review-stars-${rev.id}`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4.5 w-4.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Profile Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover border border-rose-100"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-sans text-xs font-bold text-slate-800 dark:text-slate-100 block">
                      {rev.name}
                    </span>
                    {rev.verified && (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" title="Verified Parent Buyer" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {rev.location} • <span className="text-rose-500 font-semibold">{rev.babyAge}</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

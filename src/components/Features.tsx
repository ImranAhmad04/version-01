/**
 * @file Features.tsx
 * @description Implements the feature highlights section of TheKidsNest landing page.
 * @purpose Showcases our distinct advantages like cash on delivery, lightning-fast dispatch, and authentic quality products for baby comfort.
 * @interaction Display-only trust component positioned between the Hero and the interactive Product Catalog.
 * 
 * UX Reasoning:
 * - Large, friendly colored card layouts that highlight each feature with relatable, parent-focused copy.
 * - Bold headings and high contrast icons make this highly scannable on mobile screens.
 * - Emphasizes security (No advance payments required) to remove purchase hesitation.
 */

import React from 'react';
import { Truck, CircleCheck, Heart } from 'lucide-react';

/**
 * Trust and Value Prop features display segment.
 */
export default function Features() {
  const list = [
    {
      id: 'feat-delivery',
      title: 'Fastest Delivery',
      desc: 'Superfast delivery right to your doorstep. Inside Sylhet in just hours, outside Sylhet in 1–2 days.',
      icon: <Truck className="h-6 w-6 text-indigo-500" />,
      color: 'bg-indigo-50 dark:bg-indigo-950/30'
    },
    {
      id: 'feat-cod',
      title: 'Cash on Delivery (COD)',
      desc: '100% secure. Pay only when you hold the diaper pack in your hands. No advance payments or cards needed!',
      icon: <CircleCheck className="h-6 w-6 text-emerald-500" />,
      color: 'bg-emerald-50 dark:bg-emerald-950/30'
    },
    {
      id: 'feat-quality',
      title: 'Quality Product For Kids',
      desc: 'Curated breathable, lightweight, and leak-proof diaper systems designed to support toddler play and sleep.',
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      color: 'bg-rose-50 dark:bg-rose-950/30'
    }
  ];

  return (
    <section className="bg-white dark:bg-slate-900 py-16 transition-colors duration-300" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-sans text-xs font-bold tracking-widest text-rose-500 uppercase">
            About Us
          </h2>
          <p className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Designed to Make Parenting Easier
          </p>
          <div className="mx-auto h-1 w-12 rounded-full bg-rose-500" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3" id="features-grid">
          {list.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 transition-transform hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none hover:bg-white dark:hover:bg-slate-800 group"
              id={item.id}
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

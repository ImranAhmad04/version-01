/**
 * @file SizeCalculator.tsx
 * @description Provides a smart baby diaper size finder based on numeric weights in BDT.
 * @purpose Helps parents instantly identify correct diaper sizes (e.g., S, M, L) across multiple brands, avoiding buying wrong sizes.
 * @interaction Filters the static product list dynamically as the weight input changes, feeding selection directly into the Cart.
 * 
 * UX Reasoning:
 * - Parents are often confused by diaper weight overlaps (e.g., S vs M). Providing a simple slider or custom presets takes away all guess-work.
 * - Dynamic feedback: Shows recommended items immediately without requiring page reloads or form submissions.
 * - Mobile-first: Friendly slider with oversized thumb target and text buttons for weight presets.
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Check, ShoppingCart, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface SizeCalculatorProps {
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  productsList: Product[];
}

/**
 * Smart Diaper Size Calculator Component
 */
export default function SizeCalculator({ onAddToCart, onQuickBuy, productsList }: SizeCalculatorProps) {
  // Setup local state for baby's weight (default is 7kg, common for infants)
  const [weight, setWeight] = useState<number>(7);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Compute recommendations using useMemo to avoid re-calculation on other renders
  const recommendations = useMemo(() => {
    if (isNaN(weight) || weight <= 0) return [];
    return productsList.filter((prod) => {
      return weight >= prod.minWeight && weight <= prod.maxWeight;
    });
  }, [productsList, weight]);

  /**
   * Triggers a small success flash state when adding an item from the calculator list.
   * @param prod Selected diaper product
   */
  const handleAdd = (prod: Product) => {
    onAddToCart(prod);
    setSuccessId(prod.id);
    setTimeout(() => {
      setSuccessId(null);
    }, 1500);
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-900/60 py-16 transition-colors duration-300" id="size-finder">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Component Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Calculator className="h-4 w-4" />
            <span>Smart Assistant</span>
          </div>
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Diaper Size Finder
          </h2>
          <p className="mx-auto max-w-lg text-sm text-slate-500 dark:text-slate-400">
            Not sure which size fits your toddler? Drag the slider or type your baby's weight to instantly match correct sizes across all major brands!
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start" id="size-calculator-container">
          
          {/* Slider & Presets (Left Side) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-md">
            <h3 className="font-sans text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              Enter Baby's Weight
            </h3>

            {/* Numeric & Slide Input */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Weight:</span>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={weight || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setWeight(isNaN(val) ? 0 : val);
                    }}
                    className="w-16 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-2 py-1 text-center font-mono text-lg font-bold text-rose-500 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    id="baby-weight-number-input"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">kg</span>
                </div>
              </div>

              {/* Slider */}
              <div className="relative pt-2">
                <input
                  type="range"
                  min="2"
                  max="28"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-100 dark:bg-slate-700 appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                  id="baby-weight-slider"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                  <span>2 kg</span>
                  <span>10 kg</span>
                  <span>20 kg</span>
                  <span>28 kg</span>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Presets</span>
                <div className="grid grid-cols-2 gap-2" id="size-presets-grid">
                  {[
                    { label: 'Newborn (3kg)', wt: 3 },
                    { label: 'Infant (7.5kg)', wt: 7.5 },
                    { label: 'Toddler (11kg)', wt: 11 },
                    { label: 'Active (15kg)', wt: 15 },
                    { label: 'Junior (22kg)', wt: 22 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setWeight(p.wt)}
                      className={`rounded-xl p-2 text-xs font-semibold transition-colors text-center cursor-pointer ${
                        weight === p.wt
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Recommendations List (Right Side) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-sans text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Recommended Diapers ({recommendations.length})
              </h3>
              <span className="text-xs text-rose-500 font-semibold">Matched for {weight} kg</span>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1" id="recommended-products-list">
                {recommendations.slice(0, 10).map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xs transition-shadow hover:shadow-md relative"
                  >
                    {prod.badge && (
                      <span className="absolute top-3 right-3 rounded-full bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 text-[9px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">
                        {prod.badge}
                      </span>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-lg bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                          {prod.brand}
                        </span>
                        <span className="rounded-lg bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          Size {prod.size}
                        </span>
                      </div>

                      <h4 className="font-sans text-base font-bold text-slate-800 dark:text-slate-100">
                        {prod.productName} ({prod.system})
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Baby Weight: <span className="text-slate-800 dark:text-slate-200 font-bold">{prod.weightRange}</span> • Qty: <span className="text-slate-800 dark:text-slate-200 font-bold">{prod.packQty}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/40 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">MRP Price</span>
                        <span className="text-lg font-black text-rose-500 dark:text-rose-400 font-mono">
                          ৳{prod.mrp}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Add To Cart */}
                        <button
                          onClick={() => handleAdd(prod)}
                          className="rounded-xl bg-slate-100 dark:bg-slate-700 p-2.5 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 transition-colors cursor-pointer"
                          title="Add to Cart"
                        >
                          {successId === prod.id ? <Check className="h-4 w-4 animate-scale" /> : <ShoppingCart className="h-4 w-4" />}
                        </button>

                        {/* Order Now (Direct Link) */}
                        <button
                          onClick={() => onQuickBuy(prod)}
                          className="rounded-xl bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 px-3 py-2 text-xs font-extrabold text-white transition-colors cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                <span className="text-3xl">🧸</span>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No exact matches found</p>
                <p className="text-xs text-slate-400">Please try adjusting the weight slider to find valid toddler sizes.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

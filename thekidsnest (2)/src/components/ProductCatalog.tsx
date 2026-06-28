/**
 * @file ProductCatalog.tsx
 * @description Provides the interactive storefront shelf for TheKidsNest with real-time searching, sorting, and pagination.
 * @purpose Renders the grid of 61 baby diaper packages, allowing parents to filter by brand, diaper style, and toddler size.
 * @interaction Emits callbacks to App state for adding to cart and initiating quick checkouts.
 * 
 * UX Reasoning:
 * - Tab-based quick selectors let mobile users filter the entire catalog with single taps instead of clumsy dropdowns.
 * - Sizing badges are color-coded to reduce visual noise and help parents visually lock onto their baby's size.
 * - Dynamic "Show More" pagination keeps initial page load and rendering lightning-fast.
 */

import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Check, FilterX, HelpCircle, PackageOpen } from 'lucide-react';
import { Product, DiaperBrand, DiaperSize, DiaperSystem } from '../types';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  productsList: Product[];
  selectedBrand?: string;
  onSelectedBrandChange?: (brand: string) => void;
}

/**
 * Grid layout and filters for all baby diaper variants.
 */
export default function ProductCatalog({ 
  onAddToCart, 
  onQuickBuy, 
  productsList,
  selectedBrand: externalBrand,
  onSelectedBrandChange: onExternalBrandChange
}: ProductCatalogProps) {
  // Filter States
  const [search, setSearch] = useState<string>('');
  const [localBrand, setLocalBrand] = useState<string>('All');
  
  const selectedBrand = externalBrand !== undefined ? externalBrand : localBrand;
  const setSelectedBrand = (brand: string) => {
    if (onExternalBrandChange) {
      onExternalBrandChange(brand);
    } else {
      setLocalBrand(brand);
    }
  };

  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  
  // Pagination & visual feedback
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Constants
  const brands: string[] = ['All', 'Supermom', 'Avonee', 'Mina', 'Twinkle', 'NeoCare', 'Fresh', 'Comfort Care'];
  const sizes: string[] = ['All', 'NB', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const systems: string[] = ['All', 'Pant', 'Belt', 'Tape'];

  // Dynamically calculate filtered products
  const filteredProducts = useMemo(() => {
    return productsList.filter((prod) => {
      // 1. Search filter matches brand, size, weight range, or full product name
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          prod.productName.toLowerCase().includes(q) ||
          prod.brand.toLowerCase().includes(q) ||
          prod.size.toLowerCase().includes(q) ||
          prod.weightRange.toLowerCase().includes(q) ||
          prod.system.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // 2. Brand filter
      if (selectedBrand && selectedBrand !== 'All' && prod.brand !== selectedBrand) {
        return false;
      }

      // 3. Size filter
      if (selectedSize && selectedSize !== 'All' && prod.size !== selectedSize) {
        return false;
      }

      // 4. System/Type filter
      if (selectedSystem && selectedSystem !== 'All') {
        // Normalize 'Belt/Tape', 'Belt' matches
        if (selectedSystem === 'Belt' && (prod.system === 'Belt' || prod.system === 'Belt/Tape')) {
          return true;
        }
        if (selectedSystem === 'Tape' && (prod.system === 'Tape' || prod.system === 'Belt/Tape')) {
          return true;
        }
        if (prod.system !== selectedSystem) {
          return false;
        }
      }

      return true;
    });
  }, [productsList, search, selectedBrand, selectedSize, selectedSystem]);

  /**
   * Resets all search queries and active filter states.
   */
  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('All');
    setSelectedSize('All');
    setSelectedSystem('All');
    setVisibleCount(12);
  };

  /**
   * Adds an item to the shopping cart with a temporary visual checkmark.
   * @param prod Selected product
   */
  const handleAddToCartClick = (prod: Product) => {
    onAddToCart(prod);
    setSuccessId(prod.id);
    setTimeout(() => {
      setSuccessId(null);
    }, 1500);
  };

  // Slice visible products for performance
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section className="bg-white dark:bg-slate-900 py-16 transition-colors duration-300" id="products">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h2 className="font-sans text-xs font-bold tracking-widest text-rose-500 uppercase">
              Our Diaper Collection
            </h2>
            <h3 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Find the Perfect Fit
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Browse original premium baby diapers. Instant cash on delivery across Bangladesh.
            </p>
          </div>

          {/* Quick Stats Search Counter */}
          <div className="text-xs font-semibold bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 rounded-full px-4 py-2 border border-rose-100/50 self-start md:self-auto">
            Showing {filteredProducts.length} unique items
          </div>
        </div>

        {/* Filters Panel Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 mb-10 border border-slate-100 dark:border-slate-800 space-y-6" id="filters-panel">
          
          {/* Row 1: Search & Diaper Style Selection */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-6">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search brands, sizes, weights (e.g. 12 kg, NeoCare)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(12); // Reset visible on filter
                }}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                id="search-input"
              />
            </div>

            {/* Diaper Style/System Tabs */}
            <div className="md:col-span-6 flex flex-col justify-center space-y-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Diaper Style</span>
              <div className="flex bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-slate-700" id="system-tabs">
                {systems.map((sys) => (
                  <button
                    key={sys}
                    onClick={() => {
                      setSelectedSystem(sys);
                      setVisibleCount(12);
                    }}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedSystem === sys
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Brand Selection Tabs */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Select Brand</span>
            <div className="flex flex-wrap gap-2" id="brand-selector">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBrand(b);
                    setVisibleCount(12);
                  }}
                  className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    selectedBrand === b
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Size Selection Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Select Size</span>
              <a href="#size-finder" className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-0.5">
                <HelpCircle className="h-3 w-3" /> Size Guide
              </a>
            </div>
            <div className="flex flex-wrap gap-2" id="size-selector">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSize(s);
                    setVisibleCount(12);
                  }}
                  className={`rounded-xl h-10 min-w-10 px-3 text-xs font-bold transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Products Grid */}
        {visibleProducts.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="products-shelf">
              {visibleProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group flex flex-col justify-between bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-5 shadow-xs transition-all hover:shadow-lg dark:hover:shadow-none hover:-translate-y-0.5 relative"
                  id={`product-card-${prod.id}`}
                >
                  {/* Badge */}
                  {prod.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider z-10">
                      {prod.badge}
                    </span>
                  )}

                  {/* Top content */}
                  <div>
                    {/* Visual box containing brand diaper image representation */}
                    <div className={`aspect-square w-full rounded-2xl bg-gradient-to-tr ${prod.imageColor} flex flex-col items-center justify-center mb-4 relative overflow-hidden transition-transform group-hover:scale-[1.02]`}>
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={`${prod.brand} Diaper Package`}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-4xl filter drop-shadow-md">👶</span>
                      )}
                      
                      {/* Abstract pack labels */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-slate-800/95 backdrop-blur-xs rounded-xl p-2.5 text-center shadow-xs border border-white/20">
                        <span className="block text-[11px] font-extrabold text-slate-800 dark:text-slate-100">
                          {prod.brand} Premium
                        </span>
                        <span className="block text-[9px] font-semibold text-slate-400">
                          Dry Protect Technology
                        </span>
                      </div>
                    </div>

                    {/* Meta tags */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="rounded-md bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-100/30">
                        Size {prod.size}
                      </span>
                      <span className="rounded-md bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100/30">
                        {prod.system}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-sans text-base font-extrabold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-rose-500 transition-colors">
                      {prod.productName}
                    </h4>

                    {/* Details */}
                    <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="flex justify-between">
                        <span>Weight Range:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{prod.weightRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pack Quantity:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{prod.packQty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom pricing & CTAs */}
                  <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">PRICE (BDT)</span>
                      <span className="text-xl font-black text-rose-500 dark:text-rose-400 font-mono">
                        ৳{prod.mrp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Add To Cart */}
                      <button
                        onClick={() => handleAddToCartClick(prod)}
                        className="rounded-xl bg-slate-100 dark:bg-slate-700 p-3 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 transition-colors cursor-pointer"
                        title="Add to Shopping Cart"
                      >
                        {successId === prod.id ? <Check className="h-4.5 w-4.5 text-white animate-scale" /> : <ShoppingCart className="h-4.5 w-4.5" />}
                      </button>

                      {/* Quick Buy */}
                      <button
                        onClick={() => onQuickBuy(prod)}
                        className="rounded-xl bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 px-3.5 py-2.5 text-xs font-black text-white shadow-xs transition-colors cursor-pointer"
                      >
                        Quick Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination / Show More */}
            {filteredProducts.length > visibleCount && (
              <div className="flex justify-center pt-4" id="show-more-container">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="rounded-full bg-slate-900 hover:bg-rose-500 dark:bg-slate-800 dark:hover:bg-rose-600 px-8 py-3.5 text-sm font-extrabold text-white transition-all cursor-pointer shadow-md"
                >
                  Load More Diapers
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-4 border border-dashed border-slate-200 dark:border-slate-700" id="no-products-found">
            <PackageOpen className="h-14 w-14 text-slate-300 dark:text-slate-600 animate-bounce" />
            <div className="space-y-1">
              <p className="text-lg font-extrabold text-slate-700 dark:text-slate-200">No Diapers Match Your Criteria</p>
              <p className="text-sm text-slate-400">Try loosening your search query or selecting "All" sizes / styles.</p>
            </div>
            <button
              onClick={handleResetFilters}
              className="rounded-2xl bg-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-600 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

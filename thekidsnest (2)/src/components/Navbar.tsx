/**
 * @file Navbar.tsx
 * @description Provides the global responsive header for TheKidsNest with navigation, branding, dark mode switcher, and live cart overlay toggle.
 * @purpose Renders the brand logo, primary sections, and interactive controls to drive customer trust and quick purchase access.
 * @interaction Triggers cart drawer open/close state and controls global DOM theme toggling.
 * 
 * UX Reasoning:
 * - A sticky, frosted-glass header keeps navigation and the shopping cart always within thumb-reach on mobile screens.
 * - Simple typography and friendly iconography (like a shopping bag and baby emoji) immediately communicate that this is a baby-centric store.
 * - Conversion optimization: The cart button shows a bouncing orange badge for added visual weight to encourage final checkouts.
 */

import React from 'react';
import { ShoppingBag, Sun, Moon, Sparkles, Facebook, User } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  cartCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
}

/**
 * Responsive Header component with theme toggling and live cart notification.
 * @param props Props containing dark mode state, setter, cart item count, and toggle callback.
 */
export default function Navbar({ darkMode, setDarkMode, cartCount, onCartClick, onAuthClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-100/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" id="navbar-container">
        
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-2 group" id="brand-logo-link">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-rose-400 to-amber-300 text-white shadow-md shadow-rose-200/50 dark:shadow-none transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              TheKids<span className="text-rose-500">Nest</span>
            </span>
            <span className="font-sans text-[10px] tracking-widest text-amber-500 dark:text-amber-400 uppercase font-bold">
              Premium Diapers
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" id="desktop-nav">
          <a href="#" className="font-sans text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            Home
          </a>
          <a href="#features" className="font-sans text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            About Us
          </a>
          <a href="#size-finder" className="font-sans text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            Size Finder
          </a>
          <a href="#products" className="font-sans text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            Shop Diapers
          </a>
          <a href="#contact" className="font-sans text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            Contact
          </a>
        </nav>

        {/* Interactive Controls */}
        <div className="flex items-center gap-3" id="navbar-actions">
          {/* Facebook Quick Link */}
          <a
            href="https://www.facebook.com/thekidsnestbd/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Visit Facebook Page"
            id="facebook-social-link"
          >
            <Facebook className="h-5 w-5" />
          </a>

          {/* Theme Toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggle-btn"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>

          {/* User Sign-In/Dashboard Trigger Button */}
          <button
            onClick={onAuthClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 transition-all duration-200 shadow-3xs text-xs font-bold cursor-pointer"
            id="auth-modal-trigger"
            title="Account / Admin Dashboard"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </button>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={onCartClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 transition-all duration-200 shadow-sm cursor-pointer"
            id="cart-drawer-trigger"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-bounce"
                id="cart-badge"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

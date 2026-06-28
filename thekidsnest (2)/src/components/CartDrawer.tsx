/**
 * @file CartDrawer.tsx
 * @description Implements the shopping cart panel and Cash on Delivery (COD) checkout form in a sliding right-hand drawer.
 * @purpose Handles cart quantities, shipping cost toggle (Sylhet vs non-Sylhet), validation, and order submission.
 * @interaction Receives the cart list from App state and fires the onOrderSubmit callback upon validation.
 * 
 * UX Reasoning:
 * - A single, combined Cart + Checkout flow eliminates page hops, maximizing purchase completion rates.
 * - Order without login: Only Name, WhatsApp number, and Delivery Address are marked as required, offering friction-free checkout.
 * - Delivery calculations update dynamically with clear price breakdowns (inside Sylhet ৳50 vs outside Sylhet ৳150).
 */

import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, MapPin, Send, HelpCircle, ShieldAlert } from 'lucide-react';
import { CartItem, OrderDetails } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOrderSuccess: (details: OrderDetails) => void;
}

/**
 * Sliding drawer containing the cart items list and standard checkout form.
 */
export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onOrderSuccess
}: CartDrawerProps) {
  
  // Checkout form fields state
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [district, setDistrict] = useState<'inside_sylhet' | 'outside_sylhet'>('inside_sylhet');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Calculate Subtotal BDT
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);

  // Delivery charge rule: Sylhet = 50, rest of Bangladesh = 150
  const deliveryCharge = cartItems.length > 0 ? (district === 'inside_sylhet' ? 50 : 150) : 0;

  // Total BDT
  const total = subtotal + deliveryCharge;

  /**
   * Validates contact details and address prior to placing an order.
   * @returns boolean indicating if the form is fully valid
   */
  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};

    if (!name.trim()) {
      tempErrors.name = 'Please provide your full name.';
    }
    
    // Bangladesh mobile pattern checks
    if (!whatsappNumber.trim()) {
      tempErrors.whatsappNumber = 'WhatsApp number is required.';
    } else if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(whatsappNumber.replace(/[\s-]/g, ''))) {
      tempErrors.whatsappNumber = 'Please enter a valid Bangladesh mobile number.';
    }

    if (!address.trim()) {
      tempErrors.address = 'Please provide your complete delivery address.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please provide a valid email format.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  /**
   * Submits the COD checkout parameters.
   */
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const details: OrderDetails = {
      name,
      whatsappNumber,
      address,
      email: email || undefined,
      phoneNumber: phoneNumber || undefined,
      district,
      items: cartItems,
      subtotal,
      deliveryCharge,
      total
    };

    onOrderSuccess(details);

    // Reset Form on Success
    setName('');
    setWhatsappNumber('');
    setAddress('');
    setEmail('');
    setPhoneNumber('');
    setDistrict('inside_sylhet');
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content panel */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-rose-500" />
            <h2 className="font-sans text-lg font-extrabold text-slate-800 dark:text-slate-100">
              Shopping Cart & Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            id="close-cart-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Cart Items Shelf */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">
              Selected Diapers
            </h3>

            {cartItems.length > 0 ? (
              <div className="space-y-3" id="cart-items-container">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/40 relative"
                  >
                    {/* Visual Mini Avatar */}
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${item.product.imageColor} flex items-center justify-center overflow-hidden shrink-0`}>
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={`${item.product.brand} Packaging Thumbnail`}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-xl">👶</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans text-xs font-bold text-slate-500 dark:text-slate-400">
                        {item.product.brand} • Size {item.product.size} ({item.product.system})
                      </h4>
                      <p className="font-sans text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">
                        {item.product.productName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.product.packQty} • {item.product.weightRange}
                      </p>
                      <span className="font-mono text-xs font-bold text-rose-500 dark:text-rose-400 mt-1 block">
                        ৳{item.product.mrp} BDT
                      </span>
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[10px] text-slate-400 hover:text-rose-500 font-bold transition-colors cursor-pointer"
                      >
                        Remove
                      </button>

                      <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-3xl">🛒</p>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">Your shopping cart is empty.</p>
                <p className="text-xs text-slate-400 mt-1">Add diapers from the shelf to begin.</p>
              </div>
            )}
          </div>

          {/* Section 2: Order Form (Only shows if cart has items) */}
          {cartItems.length > 0 && (
            <form onSubmit={handleSubmitOrder} className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800" id="checkout-form">
              <h3 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-rose-500" />
                Delivery Information (COD)
              </h3>

              {/* Form Input: Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anika Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.name && <p className="text-[10px] font-bold text-rose-500">{errors.name}</p>}
              </div>

              {/* Form Input: WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 01330862469"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    errors.whatsappNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                <span className="text-[10px] text-slate-400 block font-semibold">Important: We will send confirmation on this WhatsApp number.</span>
                {errors.whatsappNumber && <p className="text-[10px] font-bold text-rose-500">{errors.whatsappNumber}</p>}
              </div>

              {/* Form Input: Complete Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="House #, Road #, Area/Village, Thana, District"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none ${
                    errors.address ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.address && <p className="text-[10px] font-bold text-rose-500">{errors.address}</p>}
              </div>

              {/* Optional Field: Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. parent@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.email && <p className="text-[10px] font-bold text-rose-500">{errors.email}</p>}
              </div>

              {/* Optional Field: Alternative Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Alternative Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 01712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* District Delivery Charge selector */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Delivery District
                </label>
                <div className="grid grid-cols-2 gap-3" id="district-delivery-charge-toggles">
                  <button
                    type="button"
                    onClick={() => setDistrict('inside_sylhet')}
                    className={`rounded-2xl p-4 text-left border cursor-pointer transition-all ${
                      district === 'inside_sylhet'
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">Inside Sylhet</span>
                    <span className="block text-xs font-semibold text-rose-500 mt-1">৳50 BDT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDistrict('outside_sylhet')}
                    className={`rounded-2xl p-4 text-left border cursor-pointer transition-all ${
                      district === 'outside_sylhet'
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">Outside Sylhet</span>
                    <span className="block text-xs font-semibold text-rose-500 mt-1">৳150 BDT</span>
                  </button>
                </div>
              </div>

              {/* Safety notice */}
              <div className="rounded-2xl bg-amber-50/70 dark:bg-slate-800 border border-amber-100 dark:border-slate-700/60 p-4 flex items-start gap-2.5">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  We offer absolute <strong>Cash on Delivery (COD)</strong> protection. You only pay the rider once the diaper packet arrives. No credit card required.
                </p>
              </div>

              {/* Submit Trigger - Hidden in standard layout, handled below */}
              <button type="submit" className="hidden" id="hidden-submit-trigger" />
            </form>
          )}

        </div>

        {/* Drawer Footer Price Summary & Actions */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="space-y-2.5 mb-6">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} packs)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Delivery Charge ({district === 'inside_sylhet' ? 'Inside Sylhet' : 'Outside Sylhet'})</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800">
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Total BDT</span>
                <span className="text-xl font-black text-rose-500 dark:text-rose-400 font-mono">৳{total}</span>
              </div>
            </div>

            <button
              onClick={() => {
                const triggerBtn = document.getElementById('hidden-submit-trigger');
                if (triggerBtn) triggerBtn.click();
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-4 text-center text-base font-extrabold text-white shadow-lg shadow-rose-300/30 hover:shadow-rose-400/40 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              id="confirm-order-btn"
            >
              <Send className="h-4.5 w-4.5" />
              Place Order (Cash on Delivery)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

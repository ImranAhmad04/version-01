/**
 * @file SuccessModal.tsx
 * @description Renders the custom checkout success screen overlay for TheKidsNest orders.
 * @purpose Prompts users with their instant confirmation, listing their exact details and supplying a direct button to connect with our WhatsApp.
 * @interaction Displayed instantly once the checkout form validates, guiding the customer to WhatsApp.
 * 
 * UX Reasoning:
 * - A clean, focused dialog keeps parents calm and informed.
 * - The big green WhatsApp button uses high-contrast typography, matching standard app button sizing rules.
 * - Auto-formatting: Translates the customer's shopping cart into a beautifully structured text message so they can hit "Send" on WhatsApp without typing anything!
 */

import React from 'react';
import { CheckCircle, ExternalLink, X, Heart } from 'lucide-react';
import { OrderDetails } from '../types';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderDetails | null;
}

/**
 * Overlay success modal providing visual validation and direct WhatsApp launch action.
 */
export default function SuccessModal({ isOpen, onClose, orderDetails }: SuccessModalProps) {
  if (!isOpen || !orderDetails) return null;

  // Compile preformatted WhatsApp message
  const makeWhatsAppMessage = (): string => {
    const itemsList = orderDetails.items
      .map((item) => `• ${item.product.brand} ${item.product.productName} (Size ${item.product.size}, ${item.product.packQty}) x ${item.quantity} pack(s) - ৳${item.product.mrp * item.quantity}`)
      .join('\n');

    const messageText = `Assalamu Alaikum TheKidsNest! I have placed an order:

*Customer Information:*
👤 Name: ${orderDetails.name}
📱 WhatsApp Number: ${orderDetails.whatsappNumber}
📍 Address: ${orderDetails.address}
${orderDetails.email ? `✉️ Email: ${orderDetails.email}\n` : ''}${orderDetails.phoneNumber ? `📞 Alternative Phone: ${orderDetails.phoneNumber}\n` : ''}
*Ordered Diaper Packs:*
${itemsList}

*Financial Summary:*
💵 Subtotal: ৳${orderDetails.subtotal} BDT
🚚 Delivery: ৳${orderDetails.deliveryCharge} BDT (${orderDetails.district === 'inside_sylhet' ? 'Inside Sylhet' : 'Outside Sylhet'})
💰 *Grand Total: ৳${orderDetails.total} BDT*

Please confirm my Cash on Delivery order! Thank you.`;

    return encodeURIComponent(messageText);
  };

  const whatsappURL = `https://wa.me/8801330862469?text=${makeWhatsAppMessage()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" id="success-modal-backdrop">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-100 dark:border-slate-800 shadow-2xl text-center space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors cursor-pointer"
          id="close-success-modal-btn"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon Animation */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 animate-pulse">
          <CheckCircle className="h-12 w-12" />
        </div>

        {/* Messaging requested specifically by the user */}
        <div className="space-y-2">
          <h3 className="font-sans text-2xl font-black text-slate-900 dark:text-white">
            Order Recieved!
          </h3>
          <p className="font-sans text-sm font-bold text-slate-800 dark:text-slate-200">
            We recieved your order, a confirmation msg will go to your whatsapp within few minites
          </p>
          <p className="font-sans text-xs text-slate-400">
            Order Reference: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">TKN-{(Date.now() % 1000000)}</span>
          </p>
        </div>

        {/* Short Order Summary list */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 text-left border border-slate-100 dark:border-slate-800 max-h-40 overflow-y-auto">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Order Summary</span>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{orderDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">WhatsApp:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{orderDetails.whatsappNumber}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-bold">Total Bill:</span>
              <span className="font-bold text-rose-500 dark:text-rose-400">৳{orderDetails.total} BDT (COD)</span>
            </div>
          </div>
        </div>

        {/* Big WhatsApp CTA */}
        <div className="pt-2">
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-200 dark:shadow-none transition-all cursor-pointer hover:scale-[1.01]"
            id="whatsapp-confirm-action-btn"
          >
            Check Whatsapp
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>

        <div className="flex justify-center items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
          <span>Thank you for shopping at TheKidsNest</span>
        </div>

      </div>
    </div>
  );
}

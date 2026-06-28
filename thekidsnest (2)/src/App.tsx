/**
 * @file App.tsx
 * @description Master state controller and layout orchestrator for TheKidsNest diaper landing page.
 * @purpose Connects the shopping cart, dark-theme state, product recommending logic, and order submission flows seamlessly.
 * @interaction Coordinates event listeners and data passing between Navbar, Hero, SizeFinder, ProductCatalog, and Checkout drawers.
 * 
 * Major Architecture Decision:
 * Decision: client-side-only React state with localStorage persistence for cart and dark mode.
 * Why: The client explicitly requested a lightweight landing page targeting Vercel deployment with instant WhatsApp COD order notifications. Placing ordering/cart state inside client-side memory maximizes response speeds and guarantees 100% offline-safety without demanding active server databases.
 * Benefits: Instantaneous response, zero cloud billing cost, flawless Vercel compliance.
 * Potential Drawbacks: Reloading the browser inside incognito mode or clearing cache resets the cart.
 * Future Scalability Impact: If the client scales to 1,000+ orders, they can easily replace the onSubmit mock handler with a direct server route `/api/orders` to store in Firestore.
 */

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import SizeCalculator from './components/SizeCalculator';
import ProductCatalog from './components/ProductCatalog';
import RecommendedDiapers from './components/RecommendedDiapers';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SuccessModal from './components/SuccessModal';
import AuthModal from './components/AuthModal';
import { Product, CartItem, OrderDetails, FirestoreOrder } from './types';
import { auth, db, ensureAdminCreated } from './lib/firebase';
import { doc, setDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { products as staticProducts } from './data/products';

export default function App() {
  
  /* ----------------------------------------------------
     1. APPLICATION STATES
     ---------------------------------------------------- */
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Custom products added via admin dashboard
  const [customProducts, setCustomProducts] = useState<Product[]>([]);

  // Selected brand filter shared with recommended diaper selector card clicks
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');
  
  // Visibility toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Successful order data holder
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);

  // Combine static diaper packs with custom administrator-added diaper packs
  const mergedProducts = useMemo(() => {
    return [...staticProducts, ...customProducts];
  }, [customProducts]);

  // Dark Mode toggler persistent in localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tkn_theme');
      return saved ? saved === 'dark' : false;
    }
    return false;
  });

  /* ----------------------------------------------------
     2. LIFE CYCLE EFFECTS (Theme & Cart Recovery)
     ---------------------------------------------------- */
  /**
   * Effect: Monitors the darkMode state and toggles the document element's class list for Tailwind v4.
   * Also persists choice in localStorage.
   */
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('tkn_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('tkn_theme', 'light');
    }
  }, [darkMode]);

  /**
   * Effect: Recovers shopping cart state on mount to prevent parent data loss upon accidental reloads.
   */
  useEffect(() => {
    const savedCart = localStorage.getItem('tkn_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to parse recovered shopping cart:', err);
      }
    }

    // 1. Ensure primary administrator account exists
    ensureAdminCreated().catch((err) => {
      console.error('Admin user auto-provision failed:', err);
    });

    // 2. Real-time stream of custom diaper products added in Admin dashboard
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setCustomProducts(list);
    }, (err) => {
      console.error('Firestore custom products snapshot sub failed:', err);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Saves cart contents whenever updated.
   * @param items Updated cart list
   */
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('tkn_cart', JSON.stringify(items));
  };

  /* ----------------------------------------------------
     3. HANDLERS & CORE FUNCTIONS
     ---------------------------------------------------- */
  /**
   * Purpose: Adds a selected diaper package to the shopping cart.
   * Input: prod: Product
   * Return: void
   * Why: Let's parents pile up multiple diaper styles and check out with unified shipping.
   */
  const handleAddToCart = (prod: Product) => {
    const existingIndex = cartItems.findIndex((item) => item.product.id === prod.id);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const updated = [...cartItems, { product: prod, quantity: 1 }];
      saveCart(updated);
    }
  };

  /**
   * Purpose: Instantly adds item and opens checkout pane.
   * Input: prod: Product
   * Return: void
   * Why: Speeds up buy times for parents who want a single quick pack immediately without navigating the full drawer.
   */
  const handleQuickBuy = (prod: Product) => {
    handleAddToCart(prod);
    setIsCartOpen(true);
  };

  /**
   * Purpose: Updates quantity of specific items in the cart.
   * Input: productId: string, qty: number
   * Return: void
   * Why: Enables parents to buy multiple packs (e.g., 2 S packs) or fix accidental entries.
   */
  const handleUpdateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updated = cartItems.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    saveCart(updated);
  };

  /**
   * Purpose: Removes a product from the shopping cart.
   * Input: productId: string
   * Return: void
   * Why: Provides standard cart hygiene before final submission.
   */
  const handleRemoveItem = (productId: string) => {
    const filtered = cartItems.filter((item) => item.product.id !== productId);
    saveCart(filtered);
  };

  /**
   * Purpose: Writes the order to Firestore under /orders/{id}, triggers an admin notification email,
   *          clears cart memory, and opens the WhatsApp Success dialog.
   * Input: details: OrderDetails
   * Return: void
   * Why: Ensures real-time tracking on the Admin Dashboard and sends instant email updates to the admin.
   */
  const handleOrderSubmission = async (details: OrderDetails) => {
    const orderId = `ord-${Date.now()}`;
    const orderObj: FirestoreOrder = {
      id: orderId,
      userId: auth.currentUser?.uid || 'guest',
      items: cartItems,
      customerName: details.name,
      customerPhone: details.whatsappNumber,
      shippingAddress: details.address,
      deliveryDistrict: details.district === 'inside_sylhet' ? 'sylhet' : 'outside_sylhet',
      deliveryFee: details.deliveryCharge,
      totalPrice: details.total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Persist order details in Firestore for Real-time Admin Dashboard
      await setDoc(doc(db, 'orders', orderId), orderObj);
      console.log('Order successfully persisted in Firestore:', orderId);
    } catch (err) {
      console.error('Firestore order persistence error caught:', err);
    }

    try {
      // 2. Dispatch secure HTML notification to admin email: thekidsnestbd@gmail.com
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderObj })
      });
      console.log('Order notification email dispatched successfully.');
    } catch (err) {
      console.error('Email dispatch error caught:', err);
    }

    setActiveOrder(details);
    setIsCartOpen(false);
    setIsSuccessOpen(true);

    // Wipe cart memory upon success
    saveCart([]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 antialiased font-sans">
      
      {/* 1. Header Navigation bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
      />

      {/* Main content body */}
      <main id="main-content">
        {/* 2. Brand Hero Segment */}
        <Hero
          onStartShopping={() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenFinder={() => {
            const el = document.getElementById('size-finder');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Core Trust Features */}
        <Features />

        {/* Our Recommended Diaper Selection Section */}
        <RecommendedDiapers onSelectBrand={setSelectedBrandFilter} />

        {/* 4. Smart interactive Diaper Size Calculator */}
        <SizeCalculator
          onAddToCart={handleAddToCart}
          onQuickBuy={handleQuickBuy}
          productsList={mergedProducts}
        />

        {/* 5. Complete searchable shop product collection */}
        <ProductCatalog
          onAddToCart={handleAddToCart}
          onQuickBuy={handleQuickBuy}
          productsList={mergedProducts}
          selectedBrand={selectedBrandFilter}
          onSelectedBrandChange={setSelectedBrandFilter}
        />

        {/* 6. Click-to-contact cards */}
        <ContactSection />
      </main>

      {/* 8. Global footer */}
      <Footer />

      {/* 9. Floating / Overlay Cart checkout drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onOrderSuccess={handleOrderSubmission}
      />

      {/* 10. Success trigger dialog */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        orderDetails={activeOrder}
      />

      {/* 11. User and Admin Auth/Dashboard Portal Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

    </div>
  );
}

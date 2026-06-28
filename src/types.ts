/**
 * @file types.ts
 * @description This file defines global TypeScript interfaces, types, and enums shared across the application.
 * @purpose To provide static type checking and structural contracts for products, filters, cart states, and orders.
 * @interaction This file is imported by data loaders, component modules, and the main App controller to maintain data integrity.
 * 
 * Major Architecture Decision:
 * Decision: Storing types in a separate `/src/types.ts` file instead of embedding them within App.tsx.
 * Why: Keeps components modular, prevents circular dependencies, and ensures high readability for maintenance.
 * Benefits: Avoids cluttering React visual logic with boilerplate interface descriptions.
 * Potential Drawbacks: Requires extra import statements in component files.
 * Future Scalability Impact: Supports easy integration with backend APIs or Firestore schemas by having unified type declarations.
 */

/**
 * Diaper System Type
 * NB = Newborn, Pant, Belt, Tape or Belt/Tape combinations
 */
export type DiaperSystem = 'Pant' | 'Belt' | 'Tape' | 'Belt/Tape';

/**
 * Diaper Size Options
 */
export type DiaperSize = 'NB' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

/**
 * Diaper Brand Option
 */
export type DiaperBrand = 'Supermom' | 'Avonee' | 'Mina' | 'Twinkle' | 'NeoCare' | 'Fresh' | 'Comfort Care';

/**
 * Product Interface
 * @description Structure of a single diaper pack option from the provided price list.
 */
export interface Product {
  id: string;            // Unique string identifier
  brand: DiaperBrand;    // Brand name
  productName: string;   // Full display product name
  system: DiaperSystem;  // Type/System of diaper
  size: DiaperSize;      // Sizing code (S, M, L, etc.)
  weightRange: string;   // Description of toddler weight suitability (e.g. "6-12 kg")
  minWeight: number;     // Numeric minimum weight for filtering/calculator
  maxWeight: number;     // Numeric maximum weight for filtering/calculator
  packQty: string;       // Pack quantity descriptor (e.g. "42 pcs")
  qtyNumber: number;     // Numeric quantity of items inside the pack (e.g. 42)
  mrp: number;           // Maximum Retail Price in BDT
  imageColor: string;    // Accent color or background representation (since we use vectors)
  image?: string;        // Optional brand diaper packaging image URL or asset reference
  badge?: string;        // Optional discount or feature badge (e.g., "Best Value", "Premium Soft")
}

/**
 * Cart Item Interface
 * @description Wraps a selected product with its chosen purchase quantity.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Order Details Interface
 * @description Captures necessary client details, selection, and shipping options for COD checkout.
 */
export interface OrderDetails {
  name: string;
  whatsappNumber: string;
  address: string;
  email?: string;
  phoneNumber?: string; // Optional alternative contact phone
  district: 'inside_sylhet' | 'outside_sylhet';
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

/**
 * Customer Review Interface
 */
export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
  babyAge: string;
}

/**
 * Firebase User Profile Interface
 */
export interface FirebaseUserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  displayName?: string;
  createdAt: string;
  cart?: CartItem[];
}

/**
 * Administrative User Inbox Message Interface
 */
export interface UserInboxMessage {
  id: string;
  text: string;
  createdAt: string;
  senderEmail: string;
}

/**
 * Firestore Order Record representation
 */
export interface FirestoreOrder {
  id: string;
  userId: string; // matches User UID or "guest"
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryDistrict: 'sylhet' | 'outside_sylhet';
  deliveryFee: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}


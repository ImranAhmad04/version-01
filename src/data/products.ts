/**
 * @file products.ts
 * @description Serves as the static database for diaper products. Pre-populated with the exact pricing and quantities provided.
 * @purpose Contains the full dataset of 61 diaper products with details like pack sizes, systems, prices, and helper functions for search and filters.
 * @interaction Used by the SizeCalculator and ProductCatalog to filter, query, and render correct data points.
 * 
 * Major Architecture Decision:
 * Decision: Baking the full static product table into a highly structured array with parsed fields (like numerical pack sizes and min/max weights).
 * Why: Allows instant page loads, zero network latency, offline reliability, and precise client-side sorting/filtering.
 * Benefits: Rapid client-side querying and size recommendations.
 */

import { Product } from '../types';

import supermomImg from '../assets/images/supermom_diaper_1782619972277.jpg';
import avoneeImg from '../assets/images/avonee_diaper_1782619985464.jpg';
import minaImg from '../assets/images/mina_diaper_1782619954530.jpg';
import twinkleImg from '../assets/images/twinkle_diaper_1782619998456.jpg';
import neocareImg from '../assets/images/neocare_diaper_1782620009540.jpg';
import freshImg from '../assets/images/fresh_diaper_1782620019511.jpg';
import comfortImg from '../assets/images/comfort_diaper_1782620033838.jpg';

export const brandImageMap: Record<string, string> = {
  'Supermom': supermomImg,
  'Avonee': avoneeImg,
  'Mina': minaImg,
  'Twinkle': twinkleImg,
  'NeoCare': neocareImg,
  'Fresh': freshImg,
  'Comfort Care': comfortImg,
};

/**
 * Static list of 61 diaper products containing brand, sizing, style, count, and BDT pricing.
 */
const rawProducts: Product[] = [
  // ==================== SUPERMOM PRODUCTS ====================
  {
    id: 'sm-pant-s-42',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'S',
    weightRange: '0–8 kg',
    minWeight: 0,
    maxWeight: 8,
    packQty: '42 pcs',
    qtyNumber: 42,
    mrp: 900,
    imageColor: 'from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20',
    badge: 'Popular Choice'
  },
  {
    id: 'sm-pant-m-40',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'M',
    weightRange: '6–12 kg',
    minWeight: 6,
    maxWeight: 12,
    packQty: '40 pcs',
    qtyNumber: 40,
    mrp: 900,
    imageColor: 'from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20',
    badge: 'Perfect Fit'
  },
  {
    id: 'sm-pant-l-34',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'L',
    weightRange: '8–15 kg',
    minWeight: 8,
    maxWeight: 15,
    packQty: '34 pcs',
    qtyNumber: 34,
    mrp: 900,
    imageColor: 'from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20'
  },
  {
    id: 'sm-pant-xl-32',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'XL',
    weightRange: '12–20 kg',
    minWeight: 12,
    maxWeight: 20,
    packQty: '32 pcs',
    qtyNumber: 32,
    mrp: 900,
    imageColor: 'from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20'
  },
  {
    id: 'sm-pant-xxl-24',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'XXL',
    weightRange: '14–25 kg',
    minWeight: 14,
    maxWeight: 25,
    packQty: '24 pcs',
    qtyNumber: 24,
    mrp: 900,
    imageColor: 'from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20'
  },
  {
    id: 'sm-pant-s-60',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'S',
    weightRange: '0–8 kg',
    minWeight: 0,
    maxWeight: 8,
    packQty: '60 pcs',
    qtyNumber: 60,
    mrp: 1200,
    imageColor: 'from-amber-100 to-amber-250 dark:from-amber-900/40 dark:to-amber-800/20',
    badge: 'Saver Pack'
  },
  {
    id: 'sm-pant-m-50',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'M',
    weightRange: '6–12 kg',
    minWeight: 6,
    maxWeight: 12,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 1200,
    imageColor: 'from-amber-100 to-amber-250 dark:from-amber-900/40 dark:to-amber-800/20',
    badge: 'Saver Pack'
  },
  {
    id: 'sm-pant-l-48',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'L',
    weightRange: '8–15 kg',
    minWeight: 8,
    maxWeight: 15,
    packQty: '48 pcs',
    qtyNumber: 48,
    mrp: 1200,
    imageColor: 'from-amber-100 to-amber-250 dark:from-amber-900/40 dark:to-amber-800/20',
    badge: 'Saver Pack'
  },
  {
    id: 'sm-pant-xl-44',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'XL',
    weightRange: '12–20 kg',
    minWeight: 12,
    maxWeight: 20,
    packQty: '44 pcs',
    qtyNumber: 44,
    mrp: 1200,
    imageColor: 'from-amber-100 to-amber-250 dark:from-amber-900/40 dark:to-amber-800/20',
    badge: 'Saver Pack'
  },
  {
    id: 'sm-pant-xxl-34',
    brand: 'Supermom',
    productName: 'Super Pant',
    system: 'Pant',
    size: 'XXL',
    weightRange: '14–25 kg',
    minWeight: 14,
    maxWeight: 25,
    packQty: '34 pcs',
    qtyNumber: 34,
    mrp: 1200,
    imageColor: 'from-amber-100 to-amber-250 dark:from-amber-900/40 dark:to-amber-800/20',
    badge: 'Saver Pack'
  },

  // ==================== AVONEE PRODUCTS ====================
  {
    id: 'av-pant-s-42',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'S',
    weightRange: '4–8 kg',
    minWeight: 4,
    maxWeight: 8,
    packQty: '42 pcs',
    qtyNumber: 42,
    mrp: 890,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20'
  },
  {
    id: 'av-pant-s-60',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'S',
    weightRange: '4–8 kg',
    minWeight: 4,
    maxWeight: 8,
    packQty: '60 pcs',
    qtyNumber: 60,
    mrp: 1200,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20',
    badge: 'Jumbo Value'
  },
  {
    id: 'av-pant-m-40',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'M',
    weightRange: '7–12 kg',
    minWeight: 7,
    maxWeight: 12,
    packQty: '40 pcs',
    qtyNumber: 40,
    mrp: 890,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20'
  },
  {
    id: 'av-pant-m-56',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'M',
    weightRange: '7–12 kg',
    minWeight: 7,
    maxWeight: 12,
    packQty: '56 pcs',
    qtyNumber: 56,
    mrp: 1200,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20',
    badge: 'Jumbo Value'
  },
  {
    id: 'av-pant-l-34',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'L',
    weightRange: '9–14 kg',
    minWeight: 9,
    maxWeight: 14,
    packQty: '34 pcs',
    qtyNumber: 34,
    mrp: 890,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20'
  },
  {
    id: 'av-pant-l-48',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'L',
    weightRange: '9–14 kg',
    minWeight: 9,
    maxWeight: 14,
    packQty: '48 pcs',
    qtyNumber: 48,
    mrp: 1200,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20',
    badge: 'Jumbo Value'
  },
  {
    id: 'av-pant-xl-32',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'XL',
    weightRange: '12–17 kg',
    minWeight: 12,
    maxWeight: 17,
    packQty: '32 pcs',
    qtyNumber: 32,
    mrp: 890,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20'
  },
  {
    id: 'av-pant-xl-44',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'XL',
    weightRange: '12–17 kg',
    minWeight: 12,
    maxWeight: 17,
    packQty: '44 pcs',
    qtyNumber: 44,
    mrp: 1200,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20',
    badge: 'Jumbo Value'
  },
  {
    id: 'av-pant-xxl-24',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'XXL',
    weightRange: '14–25 kg',
    minWeight: 14,
    maxWeight: 25,
    packQty: '24 pcs',
    qtyNumber: 24,
    mrp: 890,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20'
  },
  {
    id: 'av-pant-xxl-34',
    brand: 'Avonee',
    productName: 'Avonee Pants Baby Diaper',
    system: 'Pant',
    size: 'XXL',
    weightRange: '14–25 kg',
    minWeight: 14,
    maxWeight: 25,
    packQty: '34 pcs',
    qtyNumber: 34,
    mrp: 1200,
    imageColor: 'from-pink-100 to-pink-200 dark:from-pink-950/40 dark:to-pink-900/20',
    badge: 'Jumbo Value'
  },
  {
    id: 'av-belt-nb-20',
    brand: 'Avonee',
    productName: 'Avonee Belt Newborn Diaper',
    system: 'Belt/Tape',
    size: 'NB',
    weightRange: '2–5 kg',
    minWeight: 2,
    maxWeight: 5,
    packQty: '20 pcs',
    qtyNumber: 20,
    mrp: 600,
    imageColor: 'from-rose-100 to-rose-200 dark:from-rose-950/40 dark:to-rose-900/20',
    badge: 'Newborn Care'
  },
  {
    id: 'av-belt-xxl-24',
    brand: 'Avonee',
    productName: 'Avonee Belt Baby Diaper',
    system: 'Belt/Tape',
    size: 'XXL',
    weightRange: '16 kg+',
    minWeight: 16,
    maxWeight: 30,
    packQty: '24 pcs',
    qtyNumber: 24,
    mrp: 1100,
    imageColor: 'from-rose-100 to-rose-200 dark:from-rose-950/40 dark:to-rose-900/20'
  },

  // ==================== MINA PRODUCTS ====================
  {
    id: 'mn-pant-s-50',
    brand: 'Mina',
    productName: 'Mina Baby Diaper Pant',
    system: 'Pant',
    size: 'S',
    weightRange: '4–8 kg',
    minWeight: 4,
    maxWeight: 8,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 700,
    imageColor: 'from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/20',
    badge: 'Budget Choice'
  },
  {
    id: 'mn-pant-m-50',
    brand: 'Mina',
    productName: 'Mina Baby Diaper Pant',
    system: 'Pant',
    size: 'M',
    weightRange: '5–12 kg',
    minWeight: 5,
    maxWeight: 12,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 700,
    imageColor: 'from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/20',
    badge: 'Best Value'
  },
  {
    id: 'mn-pant-l-50',
    brand: 'Mina',
    productName: 'Mina Baby Diaper Pant',
    system: 'Pant',
    size: 'L',
    weightRange: '9–16 kg',
    minWeight: 9,
    maxWeight: 16,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 750,
    imageColor: 'from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/20',
    badge: 'Best Value'
  },
  {
    id: 'mn-pant-xl-50',
    brand: 'Mina',
    productName: 'Mina Baby Diaper Pant',
    system: 'Pant',
    size: 'XL',
    weightRange: '12–17 kg*',
    minWeight: 12,
    maxWeight: 17,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 1080,
    imageColor: 'from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/20'
  },
  {
    id: 'mn-pant-xxl-50',
    brand: 'Mina',
    productName: 'Mina Baby Diaper Pant',
    system: 'Pant',
    size: 'XXL',
    weightRange: '17–25 kg*',
    minWeight: 17,
    maxWeight: 25,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 1100,
    imageColor: 'from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/20'
  },

  // ==================== TWINKLE PRODUCTS ====================
  {
    id: 'tw-pant-s-42',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'S',
    weightRange: 'Up to 8 kg',
    minWeight: 0,
    maxWeight: 8,
    packQty: '42 pcs',
    qtyNumber: 42,
    mrp: 890,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20'
  },
  {
    id: 'tw-pant-s-60',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'S',
    weightRange: 'Up to 8 kg',
    minWeight: 0,
    maxWeight: 8,
    packQty: '60 pcs',
    qtyNumber: 60,
    mrp: 1200,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20',
    badge: 'Eco Pack'
  },
  {
    id: 'tw-pant-m-40',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'M',
    weightRange: '6–12 kg',
    minWeight: 6,
    maxWeight: 12,
    packQty: '40 pcs',
    qtyNumber: 40,
    mrp: 1100,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20'
  },
  {
    id: 'tw-pant-m-50',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'M',
    weightRange: '6–12 kg',
    minWeight: 6,
    maxWeight: 12,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 1200,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20'
  },
  {
    id: 'tw-pant-l-34',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'L',
    weightRange: '9–14 kg',
    minWeight: 9,
    maxWeight: 14,
    packQty: '34 pcs',
    qtyNumber: 34,
    mrp: 1100,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20'
  },
  {
    id: 'tw-pant-l-48',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'L',
    weightRange: '9–14 kg',
    minWeight: 9,
    maxWeight: 14,
    packQty: '48 pcs',
    qtyNumber: 48,
    mrp: 1200,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20'
  },
  {
    id: 'tw-pant-xl-32',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'XL',
    weightRange: '11–25 kg',
    minWeight: 11,
    maxWeight: 25,
    packQty: '32 pcs',
    qtyNumber: 32,
    mrp: 1100,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20'
  },
  {
    id: 'tw-pant-xl-44',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'XL',
    weightRange: '11–25 kg',
    minWeight: 11,
    maxWeight: 25,
    packQty: '44 pcs',
    qtyNumber: 44,
    mrp: 1200,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20'
  },
  {
    id: 'tw-pant-xxl-34',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Pant Diaper',
    system: 'Pant',
    size: 'XXL',
    weightRange: '15–30 kg',
    minWeight: 15,
    maxWeight: 30,
    packQty: '34 pcs',
    qtyNumber: 34,
    mrp: 1200,
    imageColor: 'from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/20'
  },
  {
    id: 'tw-belt-s-44',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'S',
    weightRange: 'Up to 8 kg',
    minWeight: 0,
    maxWeight: 8,
    packQty: '44 pcs',
    qtyNumber: 44,
    mrp: 1150,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'tw-belt-s-30',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'S',
    weightRange: 'Up to 8 kg',
    minWeight: 0,
    maxWeight: 8,
    packQty: '30 pcs',
    qtyNumber: 30,
    mrp: 850,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'tw-belt-m-40',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'M',
    weightRange: '6–11 kg',
    minWeight: 6,
    maxWeight: 11,
    packQty: '40 pcs',
    qtyNumber: 40,
    mrp: 1100,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'tw-belt-m-28',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'M',
    weightRange: '6–11 kg',
    minWeight: 6,
    maxWeight: 11,
    packQty: '28 pcs',
    qtyNumber: 28,
    mrp: 850,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'tw-belt-l-36',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'L',
    weightRange: '7–18 kg',
    minWeight: 7,
    maxWeight: 18,
    packQty: '36 pcs',
    qtyNumber: 36,
    mrp: 1100,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'tw-belt-l-26',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'L',
    weightRange: '7–18 kg',
    minWeight: 7,
    maxWeight: 18,
    packQty: '26 pcs',
    qtyNumber: 26,
    mrp: 850,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'tw-belt-xl-32',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'XL',
    weightRange: '11–25 kg',
    minWeight: 11,
    maxWeight: 25,
    packQty: '32 pcs',
    qtyNumber: 32,
    mrp: 1100,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'tw-belt-xl-24',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'XL',
    weightRange: '11–25 kg',
    minWeight: 11,
    maxWeight: 25,
    packQty: '24 pcs',
    qtyNumber: 24,
    mrp: 850,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'tw-belt-xxl-24',
    brand: 'Twinkle',
    productName: 'Savlon Twinkle Baby Belt Diaper',
    system: 'Belt',
    size: 'XXL',
    weightRange: '15–30 kg',
    minWeight: 15,
    maxWeight: 30,
    packQty: '24 pcs',
    qtyNumber: 24,
    mrp: 1100,
    imageColor: 'from-indigo-100 to-indigo-200 dark:from-indigo-950/40 dark:to-indigo-900/20'
  },

  // ==================== NEOCARE PRODUCTS ====================
  {
    id: 'nc-belt-nb-20',
    brand: 'NeoCare',
    productName: 'Baby Diaper Premium',
    system: 'Belt/Tape',
    size: 'NB',
    weightRange: '0–4 kg',
    minWeight: 0,
    maxWeight: 4,
    packQty: '20 pcs',
    qtyNumber: 20,
    mrp: 640,
    imageColor: 'from-cyan-100 to-teal-100 dark:from-cyan-950/40 dark:to-teal-900/20',
    badge: 'Premium Soft'
  },
  {
    id: 'nc-belt-s-50',
    brand: 'NeoCare',
    productName: 'Baby Diaper Premium',
    system: 'Belt/Tape',
    size: 'S',
    weightRange: '3–6 kg',
    minWeight: 3,
    maxWeight: 6,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 1200,
    imageColor: 'from-cyan-100 to-teal-100 dark:from-cyan-950/40 dark:to-teal-900/20',
    badge: 'Highly Absorbing'
  },
  {
    id: 'nc-belt-m-50',
    brand: 'NeoCare',
    productName: 'Baby Diaper Premium',
    system: 'Belt/Tape',
    size: 'M',
    weightRange: '4–9 kg',
    minWeight: 4,
    maxWeight: 9,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 1450,
    imageColor: 'from-cyan-100 to-teal-100 dark:from-cyan-950/40 dark:to-teal-900/20',
    badge: 'Ultra Leak Guard'
  },
  {
    id: 'nc-belt-l-50',
    brand: 'NeoCare',
    productName: 'Baby Diaper Premium',
    system: 'Belt/Tape',
    size: 'L',
    weightRange: '7–18 kg',
    minWeight: 7,
    maxWeight: 18,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 1650,
    imageColor: 'from-cyan-100 to-teal-100 dark:from-cyan-950/40 dark:to-teal-900/20'
  },
  {
    id: 'nc-belt-xl-50',
    brand: 'NeoCare',
    productName: 'Baby Diaper Premium',
    system: 'Belt/Tape',
    size: 'XL',
    weightRange: '11–25 kg',
    minWeight: 11,
    maxWeight: 25,
    packQty: '50 pcs',
    qtyNumber: 50,
    mrp: 1950,
    imageColor: 'from-cyan-100 to-teal-100 dark:from-cyan-950/40 dark:to-teal-900/20'
  },

  // ==================== FRESH PRODUCTS ====================
  {
    id: 'fr-pant-s-42',
    brand: 'Fresh',
    productName: 'Happy Nappy Pant Diaper',
    system: 'Pant',
    size: 'S',
    weightRange: '4–8 kg',
    minWeight: 4,
    maxWeight: 8,
    packQty: '42 pcs',
    qtyNumber: 42,
    mrp: 890,
    imageColor: 'from-emerald-100 to-emerald-200 dark:from-emerald-950/40 dark:to-emerald-900/20'
  },
  {
    id: 'fr-pant-m-40',
    brand: 'Fresh',
    productName: 'Happy Nappy Pant Diaper',
    system: 'Pant',
    size: 'M',
    weightRange: '7–12 kg',
    minWeight: 7,
    maxWeight: 12,
    packQty: '40 pcs',
    qtyNumber: 40,
    mrp: 890,
    imageColor: 'from-emerald-100 to-emerald-200 dark:from-emerald-950/40 dark:to-emerald-900/20'
  },
  {
    id: 'fr-pant-l-34',
    brand: 'Fresh',
    productName: 'Happy Nappy Pant Diaper',
    system: 'Pant',
    size: 'L',
    weightRange: '9–14 kg',
    minWeight: 9,
    maxWeight: 14,
    packQty: '34 pcs',
    qtyNumber: 34,
    mrp: 890,
    imageColor: 'from-emerald-100 to-emerald-200 dark:from-emerald-950/40 dark:to-emerald-900/20'
  },
  {
    id: 'fr-pant-xl-32',
    brand: 'Fresh',
    productName: 'Happy Nappy Pant Diaper',
    system: 'Pant',
    size: 'XL',
    weightRange: '12–17 kg',
    minWeight: 12,
    maxWeight: 17,
    packQty: '32 pcs',
    qtyNumber: 32,
    mrp: 890,
    imageColor: 'from-emerald-100 to-emerald-200 dark:from-emerald-950/40 dark:to-emerald-900/20'
  },
  {
    id: 'fr-pant-xxl-24',
    brand: 'Fresh',
    productName: 'Happy Nappy Pant Diaper',
    system: 'Pant',
    size: 'XXL',
    weightRange: '15–25 kg',
    minWeight: 15,
    maxWeight: 25,
    packQty: '24 pcs',
    qtyNumber: 24,
    mrp: 890,
    imageColor: 'from-emerald-100 to-emerald-200 dark:from-emerald-950/40 dark:to-emerald-900/20'
  },

  // ==================== COMFORT CARE PRODUCTS ====================
  {
    id: 'cc-pant-s-42',
    brand: 'Comfort Care',
    productName: 'Comfort Baby Pant Diaper',
    system: 'Pant',
    size: 'S',
    weightRange: '3–8 kg',
    minWeight: 3,
    maxWeight: 8,
    packQty: '42 pcs',
    qtyNumber: 42,
    mrp: 880,
    imageColor: 'from-purple-100 to-indigo-150 dark:from-purple-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'cc-pant-m-40',
    brand: 'Comfort Care',
    productName: 'Comfort Baby Pant Diaper',
    system: 'Pant',
    size: 'M',
    weightRange: '7–12 kg',
    minWeight: 7,
    maxWeight: 12,
    packQty: '40 pcs',
    qtyNumber: 40,
    mrp: 880,
    imageColor: 'from-purple-100 to-indigo-150 dark:from-purple-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'cc-pant-l-36',
    brand: 'Comfort Care',
    productName: 'Comfort Baby Pant Diaper',
    system: 'Pant',
    size: 'L',
    weightRange: '9–14 kg',
    minWeight: 9,
    maxWeight: 14,
    packQty: '36 pcs',
    qtyNumber: 36,
    mrp: 880,
    imageColor: 'from-purple-100 to-indigo-150 dark:from-purple-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'cc-pant-xl-32',
    brand: 'Comfort Care',
    productName: 'Comfort Baby Pant Diaper',
    system: 'Pant',
    size: 'XL',
    weightRange: '12–17 kg',
    minWeight: 12,
    maxWeight: 17,
    packQty: '32 pcs',
    qtyNumber: 32,
    mrp: 880,
    imageColor: 'from-purple-100 to-indigo-150 dark:from-purple-950/40 dark:to-indigo-900/20'
  },
  {
    id: 'cc-pant-xxl-26',
    brand: 'Comfort Care',
    productName: 'Comfort Baby Pant Diaper',
    system: 'Pant',
    size: 'XXL',
    weightRange: '16–25 kg',
    minWeight: 16,
    maxWeight: 25,
    packQty: '26 pcs',
    qtyNumber: 26,
    mrp: 880,
    imageColor: 'from-purple-100 to-indigo-150 dark:from-purple-950/40 dark:to-indigo-900/20',
    badge: 'High Elasticity'
  },
  {
    id: 'cc-pant-xxxl-24',
    brand: 'Comfort Care',
    productName: 'Comfort Baby Pant Diaper',
    system: 'Pant',
    size: 'XXXL',
    weightRange: '20–28 kg',
    minWeight: 20,
    maxWeight: 28,
    packQty: '24 pcs',
    qtyNumber: 24,
    mrp: 880,
    imageColor: 'from-purple-100 to-indigo-150 dark:from-purple-950/40 dark:to-indigo-900/20',
    badge: 'Extra Large Room'
  }
];

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  image: brandImageMap[p.brand],
}));

/**
 * Filter products based on active categories.
 * @param search Search text
 * @param brand Filter brand
 * @param size Filter size
 * @param system Filter system
 * @returns Array of filtered products
 */
export function getFilteredProducts(
  search: string,
  brand: string | null,
  size: string | null,
  system: string | null
): Product[] {
  return products.filter((prod) => {
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
    if (brand && brand !== 'All' && prod.brand !== brand) {
      return false;
    }

    // 3. Size filter
    if (size && size !== 'All' && prod.size !== size) {
      return false;
    }

    // 4. System/Type filter
    if (system && system !== 'All') {
      // Normalize 'Belt/Tape', 'Belt' matches
      if (system === 'Belt' && (prod.system === 'Belt' || prod.system === 'Belt/Tape')) {
        return true;
      }
      if (system === 'Tape' && (prod.system === 'Tape' || prod.system === 'Belt/Tape')) {
        return true;
      }
      if (prod.system !== system) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Recommends products based on baby's current weight.
 * @param weightInKg Numeric weight in kilograms
 * @returns Array of recommended products
 */
export function recommendProductsByWeight(weightInKg: number): Product[] {
  if (isNaN(weightInKg) || weightInKg <= 0) return [];

  return products.filter((prod) => {
    return weightInKg >= prod.minWeight && weightInKg <= prod.maxWeight;
  });
}

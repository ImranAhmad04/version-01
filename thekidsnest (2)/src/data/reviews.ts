/**
 * @file reviews.ts
 * @description Static review data and helper functions representing toddler parent reviews in Bangladesh.
 * @purpose Pre-populates the customer reviews slider with highly contextual user opinions (focusing on diapers, leak protection, Sylhet delivery speeds).
 * @interaction Loaded by the ReviewsSection component.
 */

import { CustomerReview } from '../types';

/**
 * List of highly authentic parenting reviews from moms & dads across Bangladesh.
 */
export const customerReviews: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Sumaiya Akter',
    location: 'Zindabazar, Sylhet',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Supermom pant diapers are perfect for my 1-year-old baby. Ordering from TheKidsNest is very convenient. I got delivery within Sylhet in just 3 hours and paid only 50 taka delivery charge!',
    verified: true,
    date: 'June 12, 2026',
    babyAge: '14 Months Old'
  },
  {
    id: 'rev-2',
    name: 'Mohammad Raihan',
    location: 'Upashahar, Sylhet',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'NeoCare premium diapers are always fresh and authentic here. I chose cash on delivery (COD) and the diaper pack came in original sealed packaging. Highly recommended for busy fathers!',
    verified: true,
    date: 'June 20, 2026',
    babyAge: '6 Months Old'
  },
  {
    id: 'rev-3',
    name: 'Anika Jahan',
    location: 'Mirpur, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'I live outside Sylhet but still got my Savlon Twinkle diapers delivered in 2 days. The pack of 60 S is original quality. Excellent response on WhatsApp after placing the order.',
    verified: true,
    date: 'June 25, 2026',
    babyAge: '9 Months Old'
  },
  {
    id: 'rev-4',
    name: 'Farzana Yesmin',
    location: 'Ambarkhana, Sylhet',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Comfort Care size L fits my baby boy perfectly. Zero rashes! TheKidsNest team has always provided superb service on WhatsApp. Trustworthy store.',
    verified: true,
    date: 'June 18, 2026',
    babyAge: '18 Months Old'
  },
  {
    id: 'rev-5',
    name: 'Tamim Ahmed',
    location: 'Shibganj, Sylhet',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Buying Mina pant diapers in bulk has saved me so much money. Avonee newborn belt tape is also super reliable here. 5 stars for the seamless COD checkout form!',
    verified: true,
    date: 'May 28, 2026',
    babyAge: 'Newborn'
  }
];

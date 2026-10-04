import { ShopProduct, SortOption } from '@/types/shop';

// Empty products array — database is the single source of truth
export const shopProducts: ShopProduct[] = [];

export const shopCategories = [
  { id: 'all', label: 'All Jewellery' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'necklaces', label: 'Necklaces' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'rings', label: 'Rings' },
  { id: 'bracelets', label: 'Bracelets' },
  { id: 'bangles', label: 'Bangles' },
  { id: 'pearls', label: 'Pearls' },
  { id: 'bridal-jewellery', label: 'Bridal' },
  { id: 'collections', label: 'Collections' },
];

export const pearlTypeOptions = [
  'South Sea',
  'Akoya',
  'Tahitian',
  'Freshwater',
  'Baroque',
];

export const priceOptions = [
  { id: 'under-10k', label: 'Under ₹10,000' },
  { id: '10k-25k', label: '₹10,000 - ₹25,000' },
  { id: '25k-50k', label: '₹25,000 - ₹50,000' },
  { id: 'above-50k', label: 'Above ₹50,000' },
];

export const materialOptions = [
  'Gold',
  'Silver',
  'Gold-plated',
  'Mixed metal',
];

export const collectionOptions = [
  'Royal Pearls',
  'Heritage',
  'Bridal',
  'Contemporary',
];

export const colorOptions = [
  { id: 'White', label: 'White', colorHex: '#F7F4EF' },
  { id: 'Golden Champagne', label: 'Golden Champagne', colorHex: '#E5C687' },
  { id: 'Peacock Black', label: 'Peacock Black', colorHex: '#2E3532' },
  { id: 'Rose Blush', label: 'Rose Blush', colorHex: '#E8C4C4' },
  { id: 'Silver Grey', label: 'Silver Grey', colorHex: '#C0C5C1' },
];

export const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'featured', label: 'Featured Curation' },
  { id: 'newest', label: 'Newest Releases' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

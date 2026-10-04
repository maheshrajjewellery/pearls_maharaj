export type ShopCategory =
  | 'all'
  | 'new-arrivals'
  | 'bestsellers'
  | 'necklaces'
  | 'pearl-sets'
  | 'bangles'
  | 'bracelets'
  | 'earrings'
  | 'rings'
  | 'cufflinks'
  | 'gemstones'
  | 'saltwater'
  | 'pearl-combos'
  | 'bridal';

export type PearlType =
  | 'Freshwater'
  | 'Akoya'
  | 'South Sea'
  | 'Tahitian'
  | 'Keshi'
  | 'Baroque'
  | 'All Types';

export type StoneFilter =
  | 'Diamond'
  | 'Emeralds'
  | 'Pearls'
  | 'Ruby'
  | 'Sapphire'
  | 'Tanzanite'
  | 'Multi-Color';

export type PriceFilter =
  | 'under-10k'
  | '10k-25k'
  | '25k-50k'
  | 'above-50k';

export type MaterialFilter =
  | 'Gold'
  | 'Silver'
  | 'Gold-plated'
  | 'Mixed metal';

export type CollectionFilter =
  | 'Royal Pearls'
  | 'Heritage'
  | 'Bridal'
  | 'Contemporary';

export type ColorFilter =
  | 'White'
  | 'Black'
  | 'Grey'
  | 'Golden'
  | 'Pink / Peach'
  | 'Multi-color'
  | 'Golden Champagne'
  | 'Peacock Black'
  | 'Rose Blush'
  | 'Silver Grey';

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-low'
  | 'price-high';

export interface ProductSpecs {
  pearlSize: string;
  luster: string;
  metalPurity: string;
  hallmark: string;
  origin: string;
  closure?: string;
  weight?: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  formattedPrice: string;
  comparePrice?: number;
  formattedComparePrice?: string;
  category: ShopCategory;
  pearlType: PearlType;
  material: string;
  materialFilter: MaterialFilter;
  collection: CollectionFilter;
  color: ColorFilter;
  stone?: StoneFilter;
  priceRange: PriceFilter;
  image: string;
  hoverImage: string;
  images: string[];
  badge?: 'NEW' | 'BESTSELLER' | 'LIMITED' | 'SIGNATURE' | 'EXCLUSIVE';
  descriptor: string;
  shortDescription: string;
  specs: ProductSpecs;
  isNewArrival: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewsCount?: number;
  inStock: boolean;
  availableSizes?: string[];
  createdAt: string;
}

export interface FilterState {
  category: ShopCategory;
  pearlTypes: PearlType[];
  stones: StoneFilter[];
  priceRanges: PriceFilter[];
  materials: MaterialFilter[];
  collections: CollectionFilter[];
  colors: ColorFilter[];
  searchQuery: string;
  preset?: 'bestsellers' | 'new-arrivals' | null;
}

export interface CartItem {
  product: ShopProduct;
  quantity: number;
  selectedSize?: string;
}

export interface UserProfile {
  id: string;
  googleId?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: string;
}


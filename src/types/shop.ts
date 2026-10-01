export type ShopCategory =
  | 'all'
  | 'new-arrivals'
  | 'necklaces'
  | 'earrings'
  | 'rings'
  | 'bracelets'
  | 'bangles'
  | 'pearl-sets'
  | 'bridal'
  | 'gemstones';

export type PearlType =
  | 'Freshwater'
  | 'Akoya'
  | 'South Sea'
  | 'Tahitian'
  | 'Baroque';

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
  priceRanges: PriceFilter[];
  materials: MaterialFilter[];
  collections: CollectionFilter[];
  colors: ColorFilter[];
  searchQuery: string;
}

export interface CartItem {
  product: ShopProduct;
  quantity: number;
  selectedSize?: string;
}

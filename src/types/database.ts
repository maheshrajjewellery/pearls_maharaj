export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProduct {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  sale_price: number | null;
  sku: string;
  stock_quantity: number;
  material: string | null;
  gemstone: string | null;
  color: string | null;
  size: string | null;
  weight: string | null;
  featured: boolean;
  is_active: boolean;
  is_new: boolean;
  is_sale: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface DbProductWithRelations extends DbProduct {
  category?: DbCategory | null;
  product_images?: DbProductImage[];
}

export interface ProductFilterParams {
  category_id?: string;
  category_slug?: string;
  search?: string;
  is_active?: boolean;
  featured?: boolean;
  is_new?: boolean;
  is_sale?: boolean;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface DbCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  banner_image: string | null;
  status: 'Active' | 'Draft';
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbCollectionProduct {
  id: string;
  collection_id: string;
  product_id: string;
  created_at?: string;
}

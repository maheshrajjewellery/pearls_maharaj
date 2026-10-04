import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DbProduct, DbProductImage, DbProductWithRelations, ProductFilterParams } from '@/types/database';
import { ShopProduct, ShopCategory, PearlType, MaterialFilter, CollectionFilter, ColorFilter } from '@/types/shop';
import { deleteProductImage } from './storageService';

const LOCAL_STORAGE_KEY = 'maharaj_db_products';

// Slug generator
export const generateProductSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// SKU generator
export const generateUniqueSKU = (): string => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MJ-SKU-${rand}`;
};

// Convert DB Product record to ShopProduct interface for frontend rendering
export const dbToShopProduct = (dbProd: DbProductWithRelations): ShopProduct => {
  const images = (dbProd.product_images && dbProd.product_images.length > 0)
    ? dbProd.product_images.sort((a, b) => a.display_order - b.display_order).map((img) => img.image_url)
    : [
        'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800',
      ];

  const primaryImage = dbProd.product_images?.find((img) => img.is_primary)?.image_url || images[0];
  const hoverImage = images.length > 1 ? images[1] : primaryImage;

  const categorySlug = dbProd.category?.slug || 'necklaces';

  // Determine badge
  let badge: ShopProduct['badge'] = undefined;
  if (dbProd.is_new) badge = 'NEW';
  else if (dbProd.is_sale) badge = 'EXCLUSIVE';
  else if (dbProd.featured) badge = 'SIGNATURE';

  // Format price
  const formattedPrice = `₹ ${dbProd.price.toLocaleString('en-IN')}`;
  const formattedCompare = dbProd.sale_price ? `₹ ${dbProd.sale_price.toLocaleString('en-IN')}` : undefined;

  return {
    id: dbProd.id,
    name: dbProd.name,
    slug: dbProd.slug,
    price: dbProd.price,
    formattedPrice,
    comparePrice: dbProd.sale_price || undefined,
    formattedComparePrice: formattedCompare,
    category: categorySlug as ShopCategory,
    pearlType: (dbProd.gemstone as PearlType) || 'South Sea',
    material: dbProd.material || '18K Yellow Gold',
    materialFilter: (dbProd.material?.includes('Gold') ? 'Gold' : dbProd.material?.includes('Silver') ? 'Silver' : 'Gold') as MaterialFilter,
    collection: 'Royal Pearls' as CollectionFilter,
    color: (dbProd.color as ColorFilter) || 'White',
    priceRange: dbProd.price < 25000 ? 'under-10k' : dbProd.price <= 50000 ? '25k-50k' : 'above-50k',
    image: primaryImage,
    hoverImage: hoverImage,
    images: images,
    badge,
    descriptor: `${dbProd.material || '18K Gold'} • ${dbProd.gemstone || 'South Sea Pearl'}`,
    shortDescription: dbProd.short_description || dbProd.name,
    specs: {
      pearlSize: dbProd.size || '11mm - 13mm',
      luster: 'AAA Superior Mirror Luster',
      metalPurity: dbProd.material || '18K Gold (750 BIS Hallmarked)',
      hallmark: dbProd.sku || 'BIS Hallmarked',
      origin: 'Australian South Sea Waters',
      weight: dbProd.weight || '45.0 grams',
    },
    isNewArrival: dbProd.is_new,
    isFeatured: dbProd.featured,
    rating: 5.0,
    reviewsCount: 18,
    inStock: dbProd.stock_quantity > 0 && dbProd.is_active,
    createdAt: dbProd.created_at || new Date().toISOString(),
  };
};

// Local storage fallback helpers
const getLocalProducts = (): ShopProduct[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return [];
};

const setLocalProducts = (prods: ShopProduct[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prods));
  }
};

// Fetch products from Database
export const fetchProductsFromDb = async (params: ProductFilterParams = {}): Promise<{
  products: ShopProduct[];
  total: number;
}> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('products').select(`
        *,
        category:categories(*),
        product_images(*)
      `, { count: 'exact' });

      if (params.is_active !== undefined) {
        query = query.eq('is_active', params.is_active);
      }
      if (params.category_id) {
        query = query.eq('category_id', params.category_id);
      }
      if (params.featured !== undefined) {
        query = query.eq('featured', params.featured);
      }
      if (params.is_new !== undefined) {
        query = query.eq('is_new', params.is_new);
      }
      if (params.is_sale !== undefined) {
        query = query.eq('is_sale', params.is_sale);
      }
      if (params.search && params.search.trim()) {
        const q = `%${params.search.trim()}%`;
        query = query.or(`name.ilike.${q},sku.ilike.${q},short_description.ilike.${q}`);
      }

      // Sorting
      if (params.sortBy === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (params.sortBy === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (params.sortBy === 'name') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, count, error } = await query;
      if (!error && data) {
        const mapped = data.map((item) => dbToShopProduct(item as DbProductWithRelations));
        setLocalProducts(mapped);
        return { products: mapped, total: count || mapped.length };
      }
    } catch (err) {
      console.warn('Supabase fetch products error, using local database cache:', err);
    }
  }

  // Fallback local products
  let local = getLocalProducts();
  if (params.is_active !== undefined) {
    local = local.filter((p) => p.inStock === params.is_active);
  }
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase();
    local = local.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  return { products: local, total: local.length };
};

// Get single product by slug
export const fetchProductBySlugFromDb = async (slug: string): Promise<ShopProduct | null> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          product_images(*)
        `)
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return dbToShopProduct(data as DbProductWithRelations);
      }
    } catch (err) {
      console.error('Fetch product by slug error:', err);
    }
  }

  const local = getLocalProducts();
  return local.find((p) => p.slug === slug) || null;
};

// Validation Helper
export const validateProductInput = (input: {
  name: string;
  category_id?: string;
  category?: string;
  sku: string;
  price: number;
  sale_price?: number | null;
  stock_quantity: number;
  images: string[];
}) => {
  if (!input.name || !input.name.trim()) {
    throw new Error('Product name is required.');
  }
  if (!input.sku || !input.sku.trim()) {
    throw new Error('Product SKU is required.');
  }
  if (input.price === undefined || input.price === null || isNaN(input.price) || input.price <= 0) {
    throw new Error('Price must be greater than 0.');
  }
  if (input.sale_price !== undefined && input.sale_price !== null && input.sale_price > input.price) {
    throw new Error('Sale price cannot be greater than the original price.');
  }
  if (input.stock_quantity === undefined || input.stock_quantity === null || input.stock_quantity < 0) {
    throw new Error('Stock quantity cannot be negative.');
  }
  if (!input.images || input.images.length === 0) {
    throw new Error('Please upload at least one product image.');
  }
};

// Create product in Database
export const createProductInDb = async (input: {
  name: string;
  sku: string;
  slug?: string;
  category_id?: string;
  category_slug?: string;
  short_description?: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  stock_quantity: number;
  material?: string;
  gemstone?: string;
  color?: string;
  size?: string;
  weight?: string;
  featured?: boolean;
  is_active?: boolean;
  is_new?: boolean;
  is_sale?: boolean;
  display_order?: number;
  images: string[];
}): Promise<ShopProduct> => {
  // 1. Validation
  validateProductInput({
    name: input.name,
    sku: input.sku,
    price: input.price,
    sale_price: input.sale_price,
    stock_quantity: input.stock_quantity,
    images: input.images,
  });

  const slug = (input.slug && input.slug.trim()) ? generateProductSlug(input.slug) : generateProductSlug(input.name);

  // Check duplicate SKU & slug
  if (isSupabaseConfigured()) {
    const { data: skuExists } = await supabase.from('products').select('id').eq('sku', input.sku.trim()).maybeSingle();
    if (skuExists) {
      throw new Error(`Product SKU "${input.sku.trim()}" already exists. Please enter a unique SKU.`);
    }

    const { data: slugExists } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    if (slugExists) {
      throw new Error(`Product slug "${slug}" already exists. Please adjust the product name or slug.`);
    }
  }

  const productId = crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;

  const newDbProduct: DbProduct = {
    id: productId,
    category_id: input.category_id || 'a1111111-1111-1111-1111-111111111111',
    name: input.name.trim(),
    slug,
    short_description: input.short_description?.trim() || null,
    description: input.description?.trim() || null,
    price: Number(input.price),
    sale_price: input.sale_price ? Number(input.sale_price) : null,
    sku: input.sku.trim(),
    stock_quantity: Number(input.stock_quantity),
    material: input.material?.trim() || null,
    gemstone: input.gemstone?.trim() || null,
    color: input.color?.trim() || null,
    size: input.size?.trim() || null,
    weight: input.weight?.trim() || null,
    featured: input.featured ?? false,
    is_active: input.is_active ?? true,
    is_new: input.is_new ?? true,
    is_sale: input.is_sale ?? (!!input.sale_price && input.sale_price > 0),
    display_order: input.display_order ?? 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const imageRecords: DbProductImage[] = input.images.map((imgUrl, idx) => ({
    id: crypto.randomUUID ? crypto.randomUUID() : `img-${Date.now()}-${idx}`,
    product_id: productId,
    image_url: imgUrl,
    alt_text: `${input.name} Image ${idx + 1}`,
    display_order: idx + 1,
    is_primary: idx === 0,
    created_at: new Date().toISOString(),
  }));

  if (isSupabaseConfigured()) {
    try {
      const { data: insertedProduct, error: prodErr } = await supabase
        .from('products')
        .insert([{
          id: newDbProduct.id,
          category_id: newDbProduct.category_id,
          name: newDbProduct.name,
          slug: newDbProduct.slug,
          short_description: newDbProduct.short_description,
          description: newDbProduct.description,
          price: newDbProduct.price,
          sale_price: newDbProduct.sale_price,
          sku: newDbProduct.sku,
          stock_quantity: newDbProduct.stock_quantity,
          material: newDbProduct.material,
          gemstone: newDbProduct.gemstone,
          color: newDbProduct.color,
          size: newDbProduct.size,
          weight: newDbProduct.weight,
          featured: newDbProduct.featured,
          is_active: newDbProduct.is_active,
          is_new: newDbProduct.is_new,
          is_sale: newDbProduct.is_sale,
          display_order: newDbProduct.display_order,
        }])
        .select()
        .single();

      if (prodErr) throw new Error(prodErr.message);

      if (imageRecords.length > 0) {
        await supabase.from('product_images').insert(
          imageRecords.map((img) => ({
            product_id: productId,
            image_url: img.image_url,
            alt_text: img.alt_text,
            display_order: img.display_order,
            is_primary: img.is_primary,
          }))
        );
      }

      const shopProduct = dbToShopProduct({
        ...insertedProduct,
        product_images: imageRecords,
      });

      const localList = [shopProduct, ...getLocalProducts()];
      setLocalProducts(localList);
      return shopProduct;
    } catch (err: any) {
      console.error('Supabase product creation failed:', err);
      throw new Error(err.message || 'Failed to insert product into database.');
    }
  }

  // Local fallback
  const shopProduct = dbToShopProduct({
    ...newDbProduct,
    product_images: imageRecords,
  });
  const localList = [shopProduct, ...getLocalProducts()];
  setLocalProducts(localList);
  return shopProduct;
};

// Update product in Database
export const updateProductInDb = async (
  id: string,
  input: {
    name?: string;
    sku?: string;
    slug?: string;
    category_id?: string;
    category_slug?: string;
    short_description?: string;
    description?: string;
    price?: number;
    sale_price?: number | null;
    stock_quantity?: number;
    material?: string;
    gemstone?: string;
    color?: string;
    size?: string;
    weight?: string;
    featured?: boolean;
    is_active?: boolean;
    is_new?: boolean;
    is_sale?: boolean;
    display_order?: number;
    images?: string[];
  }
): Promise<ShopProduct> => {
  let existingProduct: DbProduct | null = null;
  let existingImages: DbProductImage[] = [];

  if (isSupabaseConfigured()) {
    const { data } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', id)
      .single();
    if (data) {
      existingProduct = data;
      existingImages = data.product_images || [];
    }
  }

  const updatedName = input.name?.trim() || existingProduct?.name || 'Jewellery Piece';
  const updatedSku = input.sku?.trim() || existingProduct?.sku || generateUniqueSKU();
  const updatedPrice = input.price !== undefined ? Number(input.price) : (existingProduct?.price || 10000);
  const updatedSalePrice = input.sale_price !== undefined ? (input.sale_price ? Number(input.sale_price) : null) : existingProduct?.sale_price;
  const updatedStock = input.stock_quantity !== undefined ? Number(input.stock_quantity) : (existingProduct?.stock_quantity ?? 10);
  const updatedImages = input.images || (existingImages.length > 0 ? existingImages.map((i) => i.image_url) : ['https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg']);

  validateProductInput({
    name: updatedName,
    sku: updatedSku,
    price: updatedPrice,
    sale_price: updatedSalePrice,
    stock_quantity: updatedStock,
    images: updatedImages,
  });

  const slug = input.slug ? generateProductSlug(input.slug) : generateProductSlug(updatedName);

  if (isSupabaseConfigured()) {
    try {
      const { data: updatedProd, error } = await supabase
        .from('products')
        .update({
          name: updatedName,
          sku: updatedSku,
          slug,
          category_id: input.category_id || existingProduct?.category_id,
          short_description: input.short_description !== undefined ? input.short_description : existingProduct?.short_description,
          description: input.description !== undefined ? input.description : existingProduct?.description,
          price: updatedPrice,
          sale_price: updatedSalePrice,
          stock_quantity: updatedStock,
          material: input.material !== undefined ? input.material : existingProduct?.material,
          gemstone: input.gemstone !== undefined ? input.gemstone : existingProduct?.gemstone,
          color: input.color !== undefined ? input.color : existingProduct?.color,
          size: input.size !== undefined ? input.size : existingProduct?.size,
          weight: input.weight !== undefined ? input.weight : existingProduct?.weight,
          featured: input.featured !== undefined ? input.featured : existingProduct?.featured,
          is_active: input.is_active !== undefined ? input.is_active : existingProduct?.is_active,
          is_new: input.is_new !== undefined ? input.is_new : existingProduct?.is_new,
          is_sale: input.is_sale !== undefined ? input.is_sale : existingProduct?.is_sale,
          display_order: input.display_order !== undefined ? input.display_order : existingProduct?.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Re-sync images
      if (input.images) {
        await supabase.from('product_images').delete().eq('product_id', id);
        await supabase.from('product_images').insert(
          input.images.map((imgUrl, idx) => ({
            product_id: id,
            image_url: imgUrl,
            alt_text: `${updatedName} Image ${idx + 1}`,
            display_order: idx + 1,
            is_primary: idx === 0,
          }))
        );
      }

      const shopProduct = dbToShopProduct({
        ...updatedProd,
        product_images: input.images ? input.images.map((url, i) => ({
          id: `img-${id}-${i}`,
          product_id: id,
          image_url: url,
          alt_text: null,
          display_order: i + 1,
          is_primary: i === 0,
          created_at: new Date().toISOString(),
        })) : existingImages,
      });

      const list = getLocalProducts().map((p) => (p.id === id ? shopProduct : p));
      setLocalProducts(list);
      return shopProduct;
    } catch (err: any) {
      console.error('Supabase product update error:', err);
    }
  }

  // Local fallback
  const list = getLocalProducts();
  const existing = list.find((p) => p.id === id);
  const formattedPrice = `₹ ${updatedPrice.toLocaleString('en-IN')}`;
  const formattedCompare = updatedSalePrice ? `₹ ${updatedSalePrice.toLocaleString('en-IN')}` : undefined;

  const updatedShopProduct: ShopProduct = {
    ...(existing || {} as any),
    id,
    name: updatedName,
    slug,
    price: updatedPrice,
    formattedPrice,
    comparePrice: updatedSalePrice || undefined,
    formattedComparePrice: formattedCompare,
    category: (input.category_slug || existing?.category || 'necklaces') as ShopCategory,
    material: input.material || existing?.material || '18K Gold',
    pearlType: (input.gemstone || existing?.pearlType || 'South Sea') as PearlType,
    color: (input.color || existing?.color || 'White') as ColorFilter,
    shortDescription: input.short_description || existing?.shortDescription || updatedName,
    descriptor: `${input.material || '18K Gold'} • ${input.gemstone || 'South Sea Pearl'}`,
    image: updatedImages[0],
    hoverImage: updatedImages[1] || updatedImages[0],
    images: updatedImages,
    isFeatured: input.featured ?? existing?.isFeatured ?? false,
    isNewArrival: input.is_new ?? existing?.isNewArrival ?? false,
    inStock: input.is_active !== undefined ? (input.is_active && updatedStock > 0) : (existing?.inStock ?? true),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  const updatedList = list.map((p) => (p.id === id ? updatedShopProduct : p));
  setLocalProducts(updatedList);
  return updatedShopProduct;
};

// Delete product from Database
export const deleteProductFromDb = async (id: string, softDelete: boolean = false): Promise<boolean> => {
  if (softDelete) {
    await updateProductInDb(id, { is_active: false });
    return true;
  }

  if (isSupabaseConfigured()) {
    try {
      const { data: images } = await supabase.from('product_images').select('image_url').eq('product_id', id);
      if (images && images.length > 0) {
        for (const img of images) {
          await deleteProductImage(img.image_url);
        }
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
    } catch (err) {
      console.error('Supabase delete product error:', err);
    }
  }

  const list = getLocalProducts().filter((p) => p.id !== id);
  setLocalProducts(list);
  return true;
};

// Delete ALL products from Database and local storage
export const deleteAllProductsFromDb = async (): Promise<boolean> => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      console.error('Supabase delete all products error:', err);
    }
  }

  setLocalProducts([]);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('maharaj_admin_products');
  }
  return true;
};

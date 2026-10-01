import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DbCategory } from '@/types/database';
import { AdminCategory } from '@/types/admin';
import { ShopCategory } from '@/types/shop';

const LOCAL_STORAGE_KEY = 'maharaj_db_categories';

// Initial seed categories fallback
const initialCategories: DbCategory[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Majestic strands, drop pendants & chokers',
    image_url: 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=600',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Drop earrings, studs & chandeliers',
    image_url: 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=600',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    name: 'Rings',
    slug: 'rings',
    description: 'Solitaire pearls set in gold & platinum',
    image_url: 'https://images.pexels.com/photos/19525066/pexels-photo-19525066.jpeg?auto=compress&cs=tinysrgb&w=600',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Single and multi-strand pearl wristwear',
    image_url: 'https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=600',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    name: 'Bangles',
    slug: 'bangles',
    description: 'Heritage gold bangles encrusted with pearls',
    image_url: 'https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=600',
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    name: 'Pearls',
    slug: 'pearls',
    description: 'Matching necklace, earring & ring ensembles',
    image_url: 'https://images.pexels.com/photos/7743044/pexels-photo-7743044.jpeg?auto=compress&cs=tinysrgb&w=600',
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777',
    name: 'Bridal Jewellery',
    slug: 'bridal-jewellery',
    description: 'Sacred wedding jewellery collections',
    image_url: 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=600',
    display_order: 7,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a8888888-8888-8888-8888-888888888888',
    name: 'Collections',
    slug: 'collections',
    description: 'Curated royal & heritage ensembles',
    image_url: 'https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=600',
    display_order: 8,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to load/save local storage fallback
const getLocalCategories = (): DbCategory[] => {
  if (typeof window === 'undefined') return initialCategories;
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialCategories));
  return initialCategories;
};

const setLocalCategories = (categories: DbCategory[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
  }
};

// Generate slug
export const generateCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Convert DbCategory to AdminCategory
export const dbToAdminCategory = (dbCat: DbCategory, itemCount: number = 0): AdminCategory => {
  return {
    id: (dbCat.slug || dbCat.id) as ShopCategory,
    name: dbCat.name,
    slug: dbCat.slug,
    description: dbCat.description || '',
    image: dbCat.image_url || 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg',
    itemCount,
    enabled: dbCat.is_active,
    displayOrder: dbCat.display_order,
  };
};

export const fetchCategoriesFromDb = async (onlyActive: boolean = false): Promise<DbCategory[]> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        setLocalCategories(data);
        return data;
      }
    } catch (err) {
      console.warn('Could not fetch categories from Supabase, falling back to local DB cache:', err);
    }
  }

  const local = getLocalCategories();
  return onlyActive ? local.filter((c) => c.is_active) : local;
};

export const createCategoryInDb = async (input: {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}): Promise<DbCategory> => {
  if (!input.name || !input.name.trim()) {
    throw new Error('Category name is required.');
  }

  const slug = (input.slug && input.slug.trim()) ? generateCategorySlug(input.slug) : generateCategorySlug(input.name);

  // Check duplicate slug
  const existing = await fetchCategoriesFromDb(false);
  if (existing.some((c) => c.slug === slug)) {
    throw new Error(`Category slug "${slug}" already exists. Please choose a unique name or slug.`);
  }

  const newCategory: DbCategory = {
    id: crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`,
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || null,
    image_url: input.image_url || null,
    display_order: input.display_order ?? existing.length + 1,
    is_active: input.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('categories').insert([{
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        image_url: newCategory.image_url,
        display_order: newCategory.display_order,
        is_active: newCategory.is_active,
      }]).select().single();

      if (!error && data) {
        const updatedList = [...existing, data];
        setLocalCategories(updatedList);
        return data;
      }
    } catch (err) {
      console.error('Supabase category create error:', err);
    }
  }

  const updatedList = [...existing, newCategory];
  setLocalCategories(updatedList);
  return newCategory;
};

export const updateCategoryInDb = async (
  id: string,
  input: {
    name?: string;
    slug?: string;
    description?: string;
    image_url?: string;
    display_order?: number;
    is_active?: boolean;
  }
): Promise<DbCategory> => {
  const existing = await fetchCategoriesFromDb(false);
  const target = existing.find((c) => c.id === id || c.slug === id);
  if (!target) {
    throw new Error('Category not found.');
  }

  let slug = target.slug;
  if (input.slug && input.slug !== target.slug) {
    slug = generateCategorySlug(input.slug);
    if (existing.some((c) => c.slug === slug && c.id !== target.id)) {
      throw new Error(`Category slug "${slug}" already exists.`);
    }
  }

  const updatedCategory: DbCategory = {
    ...target,
    name: input.name !== undefined ? input.name.trim() : target.name,
    slug,
    description: input.description !== undefined ? input.description.trim() : target.description,
    image_url: input.image_url !== undefined ? input.image_url : target.image_url,
    display_order: input.display_order !== undefined ? input.display_order : target.display_order,
    is_active: input.is_active !== undefined ? input.is_active : target.is_active,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: updatedCategory.name,
          slug: updatedCategory.slug,
          description: updatedCategory.description,
          image_url: updatedCategory.image_url,
          display_order: updatedCategory.display_order,
          is_active: updatedCategory.is_active,
        })
        .eq('id', target.id)
        .select()
        .single();

      if (!error && data) {
        const list = existing.map((c) => (c.id === target.id ? data : c));
        setLocalCategories(list);
        return data;
      }
    } catch (err) {
      console.error('Supabase category update error:', err);
    }
  }

  const list = existing.map((c) => (c.id === target.id ? updatedCategory : c));
  setLocalCategories(list);
  return updatedCategory;
};

export const deleteCategoryFromDb = async (categoryId: string): Promise<boolean> => {
  // REQUIREMENT: Check whether products belong to category before deleting!
  const existingCategories = await fetchCategoriesFromDb(false);
  const target = existingCategories.find((c) => c.id === categoryId || c.slug === categoryId);
  if (!target) {
    throw new Error('Category not found.');
  }

  // Check products table for references
  let hasProducts = false;
  if (isSupabaseConfigured()) {
    try {
      const { count, error } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', target.id);
      if (!error && count && count > 0) {
        hasProducts = true;
      }
    } catch (err) {
      console.error('Check category products error:', err);
    }
  }

  // Also check local products store if fallback
  if (!hasProducts && typeof window !== 'undefined') {
    const savedProducts = localStorage.getItem('maharaj_admin_products');
    if (savedProducts) {
      try {
        const prods = JSON.parse(savedProducts);
        if (prods.some((p: any) => p.category === target.slug || p.category_id === target.id)) {
          hasProducts = true;
        }
      } catch {}
    }
  }

  if (hasProducts) {
    throw new Error(
      `Cannot delete category "${target.name}" because it contains associated products. Please reassign or delete the products first.`
    );
  }

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', target.id);
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('foreign key')) {
        throw new Error(`Cannot delete category "${target.name}" because products belong to it.`);
      }
    }
  }

  const filtered = existingCategories.filter((c) => c.id !== target.id);
  setLocalCategories(filtered);
  return true;
};

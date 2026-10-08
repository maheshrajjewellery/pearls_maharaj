import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DbCollection } from '@/types/database';
import { AdminCollection } from '@/types/admin';

const LOCAL_STORAGE_KEY = 'MAHESHRAJ_db_collections';
const LOCAL_STORAGE_JUNCTION_KEY = 'MAHESHRAJ_db_collection_products';

const initialCollections: AdminCollection[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Royal Pearls Collection',
    slug: 'royal-pearls',
    description: 'Curated royal South Sea and Tahitian pearl masterpieces',
    coverImage: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800',
    bannerImage: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1920',
    status: 'Active',
    displayOrder: 1,
    productIds: ['b1111111-1111-1111-1111-111111111111', 'b4444444-4444-4444-4444-444444444444'],
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Heritage Royal Dynasty',
    slug: 'heritage',
    description: 'Heritage designs inspired by royal Indian court jewellery',
    coverImage: 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=800',
    bannerImage: 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=1920',
    status: 'Active',
    displayOrder: 2,
    productIds: ['b3333333-3333-3333-3333-333333333333'],
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Sacred Wedding Bridal',
    slug: 'bridal',
    description: 'Sacred wedding pearl jewellery for royal brides',
    coverImage: 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=800',
    bannerImage: 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=1920',
    status: 'Active',
    displayOrder: 3,
    productIds: ['b2222222-2222-2222-2222-222222222222', 'b3333333-3333-3333-3333-333333333333'],
  },
];

const getLocalCollections = (): AdminCollection[] => {
  if (typeof window === 'undefined') return initialCollections;
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialCollections));
  return initialCollections;
};

const setLocalCollections = (cols: AdminCollection[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cols));
  }
};

export const generateCollectionSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const fetchCollectionsFromDb = async (): Promise<AdminCollection[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data: colsData, error: colsErr } = await supabase
        .from('collections')
        .select('*')
        .order('display_order', { ascending: true });

      if (!colsErr && colsData) {
        // Fetch collection_products junction data
        const { data: junctionData } = await supabase.from('collection_products').select('*');

        const mapProductIds: Record<string, string[]> = {};
        if (junctionData) {
          junctionData.forEach((row: any) => {
            if (!mapProductIds[row.collection_id]) {
              mapProductIds[row.collection_id] = [];
            }
            mapProductIds[row.collection_id].push(row.product_id);
          });
        }

        const formatted: AdminCollection[] = colsData.map((dbCol: DbCollection) => ({
          id: dbCol.id,
          name: dbCol.name,
          slug: dbCol.slug,
          description: dbCol.description || '',
          coverImage: dbCol.cover_image || 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg',
          bannerImage: dbCol.banner_image || dbCol.cover_image || 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg',
          status: dbCol.status || (dbCol.is_active ? 'Active' : 'Draft'),
          displayOrder: dbCol.display_order,
          productIds: mapProductIds[dbCol.id] || [],
        }));

        setLocalCollections(formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Could not fetch collections from Supabase, falling back to local DB cache:', err);
    }
  }

  return getLocalCollections();
};

export const createCollectionInDb = async (input: {
  name: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  bannerImage?: string;
  status?: 'Active' | 'Draft';
  displayOrder?: number;
  productIds?: string[];
}): Promise<AdminCollection> => {
  if (!input.name || !input.name.trim()) {
    throw new Error('Collection name is required.');
  }

  const slug = input.slug && input.slug.trim() ? generateCollectionSlug(input.slug) : generateCollectionSlug(input.name);
  const existing = await fetchCollectionsFromDb();

  if (existing.some((c) => c.slug === slug)) {
    throw new Error(`Collection slug "${slug}" already exists. Please choose a unique name or slug.`);
  }

  const colId = crypto.randomUUID ? crypto.randomUUID() : `col-${Date.now()}`;
  const status = input.status || 'Active';

  const newCol: AdminCollection = {
    id: colId,
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || '',
    coverImage: input.coverImage || 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg',
    bannerImage: input.bannerImage || input.coverImage || 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg',
    status,
    displayOrder: input.displayOrder ?? existing.length + 1,
    productIds: input.productIds || [],
  };

  if (isSupabaseConfigured()) {
    const { data: dbData, error: dbErr } = await supabase
      .from('collections')
      .insert([{
        id: colId,
        name: newCol.name,
        slug: newCol.slug,
        description: newCol.description,
        cover_image: newCol.coverImage,
        banner_image: newCol.bannerImage,
        status: newCol.status,
        display_order: newCol.displayOrder,
        is_active: status === 'Active',
      }])
      .select()
      .single();

    if (dbErr) {
      console.error('Supabase collection create error:', dbErr);
      throw new Error(dbErr.message || 'Failed to insert collection into Supabase.');
    }

    if (dbData && newCol.productIds.length > 0) {
      const junctionRows = newCol.productIds.map((pId) => ({
        collection_id: colId,
        product_id: pId,
      }));
      await supabase.from('collection_products').insert(junctionRows);
    }

    if (dbData) {
      const updated = [...existing, newCol];
      setLocalCollections(updated);
      return newCol;
    }
  }

  const updated = [...existing, newCol];
  setLocalCollections(updated);
  return newCol;
};

export const updateCollectionInDb = async (
  id: string,
  input: {
    name?: string;
    slug?: string;
    description?: string;
    coverImage?: string;
    bannerImage?: string;
    status?: 'Active' | 'Draft';
    displayOrder?: number;
    productIds?: string[];
  }
): Promise<AdminCollection> => {
  const existing = await fetchCollectionsFromDb();
  const target = existing.find((c) => c.id === id || c.slug === id);

  if (!target) {
    throw new Error('Collection not found.');
  }

  let slug = target.slug;
  if (input.slug && input.slug !== target.slug) {
    slug = generateCollectionSlug(input.slug);
    if (existing.some((c) => c.slug === slug && c.id !== target.id)) {
      throw new Error(`Collection slug "${slug}" already exists.`);
    }
  }

  const updatedCol: AdminCollection = {
    ...target,
    name: input.name !== undefined ? input.name.trim() : target.name,
    slug,
    description: input.description !== undefined ? input.description.trim() : target.description,
    coverImage: input.coverImage !== undefined ? input.coverImage : target.coverImage,
    bannerImage: input.bannerImage !== undefined ? input.bannerImage : target.bannerImage,
    status: input.status !== undefined ? input.status : target.status,
    displayOrder: input.displayOrder !== undefined ? input.displayOrder : target.displayOrder,
    productIds: input.productIds !== undefined ? input.productIds : target.productIds,
  };

  if (isSupabaseConfigured()) {
    const { data: dbData, error: dbErr } = await supabase
      .from('collections')
      .update({
        name: updatedCol.name,
        slug: updatedCol.slug,
        description: updatedCol.description,
        cover_image: updatedCol.coverImage,
        banner_image: updatedCol.bannerImage,
        status: updatedCol.status,
        display_order: updatedCol.displayOrder,
        is_active: updatedCol.status === 'Active',
      })
      .eq('id', target.id)
      .select()
      .single();

    if (dbErr) {
      console.error('Supabase collection update error:', dbErr);
      throw new Error(dbErr.message || 'Failed to update collection in Supabase.');
    }

    if (input.productIds !== undefined) {
      // Refresh junction records
      await supabase.from('collection_products').delete().eq('collection_id', target.id);
      if (input.productIds.length > 0) {
        const junctionRows = input.productIds.map((pId) => ({
          collection_id: target.id,
          product_id: pId,
        }));
        await supabase.from('collection_products').insert(junctionRows);
      }
    }

    if (dbData) {
      const list = existing.map((c) => (c.id === target.id ? updatedCol : c));
      setLocalCollections(list);
      return updatedCol;
    }
  }

  const list = existing.map((c) => (c.id === target.id ? updatedCol : c));
  setLocalCollections(list);
  return updatedCol;
};

export const deleteCollectionFromDb = async (id: string): Promise<boolean> => {
  const existing = await fetchCollectionsFromDb();
  const target = existing.find((c) => c.id === id || c.slug === id);

  if (!target) {
    throw new Error('Collection not found.');
  }

  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('collections').delete().eq('id', target.id);
    if (error) {
      console.error('Supabase collection delete error:', error);
      throw new Error(error.message || 'Failed to delete collection from Supabase.');
    }
  }

  const list = existing.filter((c) => c.id !== target.id);
  setLocalCollections(list);
  return true;
};

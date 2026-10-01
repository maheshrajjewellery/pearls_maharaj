-- ====================================================================
-- MAHARAJA JEWELLERY - DATABASE ARCHITECTURE & SEED MIGRATION
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CREATE TABLE: products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
  sku TEXT UNIQUE NOT NULL,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  material TEXT,
  gemstone TEXT,
  color TEXT,
  size TEXT,
  weight TEXT,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR PRODUCTS
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_sale ON products(is_sale);

-- 4. CREATE TABLE: product_images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR PRODUCT IMAGES
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- 5. AUTOMATIC updated_at TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_categories_updated_at ON categories;
CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public categories read" ON categories;
CREATE POLICY "Public categories read" ON categories
FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public products read" ON products;
CREATE POLICY "Public products read" ON products
FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public product_images read" ON product_images;
CREATE POLICY "Public product_images read" ON product_images
FOR SELECT USING (true);

-- ADMIN FULL ACCESS POLICIES
DROP POLICY IF EXISTS "Admin categories all" ON categories;
CREATE POLICY "Admin categories all" ON categories
FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin products all" ON products;
CREATE POLICY "Admin products all" ON products
FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin product_images all" ON product_images;
CREATE POLICY "Admin product_images all" ON product_images
FOR ALL USING (auth.role() = 'authenticated');

-- 7. SUPABASE STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public product-images read" ON storage.objects;
CREATE POLICY "Public product-images read" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin product-images upload" ON storage.objects;
CREATE POLICY "Admin product-images upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin product-images delete" ON storage.objects;
CREATE POLICY "Admin product-images delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- 8. SEED DATA
-- Seed Categories
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'Necklaces', 'necklaces', 'Majestic strands, drop pendants & chokers', 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=600', 1, true),
  ('a2222222-2222-2222-2222-222222222222', 'Earrings', 'earrings', 'Drop earrings, studs & chandeliers', 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=600', 2, true),
  ('a3333333-3333-3333-3333-333333333333', 'Rings', 'rings', 'Solitaire pearls set in gold & platinum', 'https://images.pexels.com/photos/19525066/pexels-photo-19525066.jpeg?auto=compress&cs=tinysrgb&w=600', 3, true),
  ('a4444444-4444-4444-4444-444444444444', 'Bracelets', 'bracelets', 'Single and multi-strand pearl wristwear', 'https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=600', 4, true),
  ('a5555555-5555-5555-5555-555555555555', 'Bangles', 'bangles', 'Heritage gold bangles encrusted with pearls', 'https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=600', 5, true),
  ('a6666666-6666-6666-6666-666666666666', 'Pearls', 'pearls', 'Loose South Sea, Akoya & Tahitian gems', 'https://images.pexels.com/photos/7743044/pexels-photo-7743044.jpeg?auto=compress&cs=tinysrgb&w=600', 6, true),
  ('a7777777-7777-7777-7777-777777777777', 'Bridal Jewellery', 'bridal-jewellery', 'Sacred royal wedding jewellery collections', 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=600', 7, true),
  ('a8888888-8888-8888-8888-888888888888', 'Collections', 'collections', 'Curated royal & heritage ensembles', 'https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=600', 8, true)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- Seed Products
INSERT INTO products (id, category_id, name, slug, short_description, description, price, sale_price, sku, stock_quantity, material, gemstone, color, size, weight, featured, is_active, is_new, is_sale, display_order)
VALUES 
  (
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Royal Heritage Pearl Choker',
    'royal-heritage-pearl-choker',
    'Exquisite multi-row choker featuring luminous champagne South Sea pearls handset with royal 18K gold clasp.',
    'Crafted with rare Australian South Sea pearls, this royal choker epitomizes regal elegance. Each pearl is hand-selected for its mirror-like luster and champagne undertone.',
    185000.00,
    165000.00,
    'MJ-SKU-9001',
    15,
    '18K Yellow Gold',
    'South Sea Pearl',
    'Golden Champagne',
    '16 inch (Princess)',
    '48.6 grams',
    true,
    true,
    true,
    true,
    1
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    'Elysian Pearl Drop Earrings',
    'elysian-pearl-drop-earrings',
    'Graceful elongated drop earrings featuring teardrop freshwater pearls suspended from radiant hand-brushed gold arcs.',
    'Designed for timeless appeal, these drop earrings feature AA+ graded white pearls mounted in 18K yellow gold settings.',
    42000.00,
    NULL,
    'MJ-SKU-9002',
    24,
    '18K Yellow Gold',
    'Freshwater Pearl',
    'White',
    'Standard Drop',
    '8.4 grams',
    true,
    true,
    true,
    false,
    2
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'a7777777-7777-7777-7777-777777777777',
    'Maharani Emerald & Pearl Haar',
    'maharani-emerald-pearl-haar',
    'Opulent multi-layer bridal necklace adorned with Zambian emerald beads and lustre Akoya pearls.',
    'Inspired by royal Indian dynasties, this grand wedding piece combines intense green emeralds with pristine white Akoya pearls in 18K gold.',
    31000.00,
    285000.00,
    'MJ-SKU-9003',
    5,
    '18K Gold',
    'Akoya Pearl & Emerald',
    'White & Emerald Green',
    '24 inch (Grand Haar)',
    '112.5 grams',
    true,
    true,
    false,
    true,
    3
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'a3333333-3333-3333-3333-333333333333',
    'Imperial Solitaire Pearl Ring',
    'imperial-solitaire-pearl-ring',
    'Stunning 12mm Golden South Sea pearl solitaire set in diamond-paved 18K white gold.',
    'A magnificent solitaire ring holding a perfectly round golden pearl accented by brilliant cut round diamonds.',
    88000.00,
    NULL,
    'MJ-SKU-9004',
    12,
    '18K White Gold',
    'Golden South Sea Pearl & Diamonds',
    'Golden Champagne',
    'US 7 / Indian 14',
    '11.2 grams',
    false,
    true,
    true,
    false,
    4
  )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, price = EXCLUDED.price, sku = EXCLUDED.sku;

-- Seed Product Images
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Royal Heritage Pearl Choker Main', 1, true),
  ('b1111111-1111-1111-1111-111111111111', 'https://images.pexels.com/photos/10835519/pexels-photo-10835519.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Royal Heritage Pearl Choker Angle', 2, false),
  ('b2222222-2222-2222-2222-222222222222', 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Elysian Pearl Drop Earrings Primary', 1, true),
  ('b2222222-2222-2222-2222-222222222222', 'https://images.pexels.com/photos/9421333/pexels-photo-9421333.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Elysian Pearl Drop Earrings Detail', 2, false),
  ('b3333333-3333-3333-3333-333333333333', 'https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Maharani Emerald Pearl Haar Primary', 1, true),
  ('b4444444-4444-4444-4444-444444444444', 'https://images.pexels.com/photos/19525066/pexels-photo-19525066.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Imperial Solitaire Pearl Ring Primary', 1, true)
ON CONFLICT DO NOTHING;

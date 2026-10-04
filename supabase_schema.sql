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

-- CATEGORIES RLS POLICIES
DROP POLICY IF EXISTS "Public categories read" ON categories;
DROP POLICY IF EXISTS "Admin categories all" ON categories;
DROP POLICY IF EXISTS "Allow public read categories" ON categories;
DROP POLICY IF EXISTS "Allow admin full access categories" ON categories;

CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow admin full access categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- PRODUCTS RLS POLICIES
DROP POLICY IF EXISTS "Public products read" ON products;
DROP POLICY IF EXISTS "Admin products all" ON products;
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow admin full access products" ON products;

CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access products" ON products FOR ALL USING (true) WITH CHECK (true);

-- PRODUCT IMAGES RLS POLICIES
DROP POLICY IF EXISTS "Public product_images read" ON product_images;
DROP POLICY IF EXISTS "Admin product_images all" ON product_images;
DROP POLICY IF EXISTS "Allow public read product_images" ON product_images;
DROP POLICY IF EXISTS "Allow admin full access product_images" ON product_images;

CREATE POLICY "Allow public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Allow admin full access product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);

-- 7. SUPABASE STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public product-images read" ON storage.objects;
DROP POLICY IF EXISTS "Admin product-images upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin product-images delete" ON storage.objects;

CREATE POLICY "Public product-images read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin product-images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Admin product-images delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

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

-- ====================================================================
-- 9. CREATE TABLE: collections
-- ====================================================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  banner_image TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Draft')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR COLLECTIONS
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_status ON collections(status);
CREATE INDEX IF NOT EXISTS idx_collections_display_order ON collections(display_order);

-- TRIGGER FOR COLLECTIONS updated_at
DROP TRIGGER IF EXISTS set_collections_updated_at ON collections;
CREATE TRIGGER set_collections_updated_at
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS POLICIES FOR COLLECTIONS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read collections" ON collections;
DROP POLICY IF EXISTS "Allow admin full access collections" ON collections;
CREATE POLICY "Allow public read collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Allow admin full access collections" ON collections FOR ALL USING (true) WITH CHECK (true);

-- 10. CREATE TABLE: collection_products (Junction table)
CREATE TABLE IF NOT EXISTS collection_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(collection_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_products_col_id ON collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_prod_id ON collection_products(product_id);

ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read collection_products" ON collection_products;
DROP POLICY IF EXISTS "Allow admin full access collection_products" ON collection_products;
CREATE POLICY "Allow public read collection_products" ON collection_products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access collection_products" ON collection_products FOR ALL USING (true) WITH CHECK (true);

-- SEED COLLECTIONS
INSERT INTO collections (id, name, slug, description, cover_image, banner_image, status, display_order)
VALUES 
  ('c1111111-1111-1111-1111-111111111111', 'Royal Pearls Collection', 'royal-pearls', 'Curated royal South Sea and Tahitian pearl masterpieces', 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Active', 1),
  ('c2222222-2222-2222-2222-222222222222', 'Heritage Royal Dynasty', 'heritage', 'Heritage designs inspired by royal Indian court jewellery', 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Active', 2),
  ('c3333333-3333-3333-3333-333333333333', 'Sacred Wedding Bridal', 'bridal', 'Sacred wedding pearl jewellery for royal brides', 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Active', 3)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- ====================================================================
-- 11. CREATE TABLE: orders
-- ====================================================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  order_status TEXT NOT NULL DEFAULT 'Confirmed',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read insert orders" ON orders;
CREATE POLICY "Allow public read insert orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 12. CREATE TABLE: user_addresses
-- ====================================================================
CREATE TABLE IF NOT EXISTS user_addresses (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  house_flat TEXT NOT NULL,
  street TEXT NOT NULL,
  area TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_addresses_email ON user_addresses(user_email);

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow user_addresses access" ON user_addresses;
CREATE POLICY "Allow user_addresses access" ON user_addresses FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 13. CREATE TABLE: coupons
-- ====================================================================
CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(12, 2) NOT NULL,
  min_order_amount NUMERIC(12, 2) DEFAULT 0,
  max_discount NUMERIC(12, 2),
  expiry_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read coupons" ON coupons;
CREATE POLICY "Allow public read coupons" ON coupons FOR SELECT USING (true);

-- SEED COUPONS
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, expiry_date, is_active)
VALUES
  ('WELCOME10', '10% off on your luxury jewellery purchase', 'percentage', 10, 0, '2028-12-31 23:59:59+00', true),
  ('ROYAL15', '15% off on orders above ₹50,000', 'percentage', 15, 50000, '2028-12-31 23:59:59+00', true),
  ('PEARL5000', 'Flat ₹5,000 off on grand heritage orders above ₹1,00,000', 'fixed', 5000, 100000, '2028-12-31 23:59:59+00', true),
  ('MAHARAJA20', '20% off on signature bridal suites above ₹1,50,000', 'percentage', 20, 150000, '2028-12-31 23:59:59+00', true)
ON CONFLICT (code) DO NOTHING;

-- ====================================================================
-- 14. CREATE TABLE: profiles
-- ====================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'email',
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow profiles access" ON profiles;
CREATE POLICY "Allow profiles access" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 15. CREATE TABLE: corporate_gifting_enquiries
-- ====================================================================
CREATE TABLE IF NOT EXISTS corporate_gifting_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_number TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  designation TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_type TEXT,
  website TEXT,
  quantity INTEGER DEFAULT 1,
  quantity_range TEXT,
  budget TEXT,
  gift_type TEXT,
  occasion TEXT,
  preferred_delivery_date DATE,
  customization_required TEXT,
  packaging_required TEXT,
  branding_required TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  assigned_to TEXT,
  assigned_to_name TEXT,
  quotation_amount NUMERIC(12, 2),
  quotation_date TIMESTAMPTZ,
  quotation_valid_until TIMESTAMPTZ,
  quotation_notes TEXT,
  quotation_ref TEXT,
  is_archived BOOLEAN DEFAULT false,
  converted_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_corporate_enquiries_status ON corporate_gifting_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_corporate_enquiries_email ON corporate_gifting_enquiries(email);
CREATE INDEX IF NOT EXISTS idx_corporate_enquiries_enquiry_number ON corporate_gifting_enquiries(enquiry_number);

DROP TRIGGER IF EXISTS set_corporate_enquiries_updated_at ON corporate_gifting_enquiries;
CREATE TRIGGER set_corporate_enquiries_updated_at
BEFORE UPDATE ON corporate_gifting_enquiries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE corporate_gifting_enquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all corporate_gifting_enquiries" ON corporate_gifting_enquiries;
CREATE POLICY "Allow all corporate_gifting_enquiries" ON corporate_gifting_enquiries FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 16. CREATE TABLE: corporate_gifting_enquiry_events
-- ====================================================================
CREATE TABLE IF NOT EXISTS corporate_gifting_enquiry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL REFERENCES corporate_gifting_enquiries(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  message TEXT NOT NULL,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_corporate_enquiry_events_enquiry_id ON corporate_gifting_enquiry_events(enquiry_id);

ALTER TABLE corporate_gifting_enquiry_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all corporate_gifting_enquiry_events" ON corporate_gifting_enquiry_events;
CREATE POLICY "Allow all corporate_gifting_enquiry_events" ON corporate_gifting_enquiry_events FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 17. CREATE TABLE: cms_content (Dynamic CMS Content Store)
-- ====================================================================
CREATE TABLE IF NOT EXISTS cms_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS set_cms_content_updated_at ON cms_content;
CREATE TRIGGER set_cms_content_updated_at
BEFORE UPDATE ON cms_content
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read cms_content" ON cms_content;
DROP POLICY IF EXISTS "Allow admin all cms_content" ON cms_content;

CREATE POLICY "Allow public read cms_content" ON cms_content FOR SELECT USING (true);
CREATE POLICY "Allow admin all cms_content" ON cms_content FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 18. CREATE TABLE: homepage_hero_banners (Multiple Homepage Banners)
-- ====================================================================
CREATE TABLE IF NOT EXISTS homepage_hero_banners (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL DEFAULT 'MAHARAJ JEWELLERY',
  subtitle TEXT NOT NULL DEFAULT 'The Purest Pearl Elegance',
  description TEXT,
  image_url TEXT NOT NULL,
  image_path TEXT,
  mobile_image_url TEXT,
  mobile_image_path TEXT,
  cta_text TEXT DEFAULT 'EXPLORE THE COLLECTION',
  cta_link TEXT DEFAULT '/shop',
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'Published' CHECK (status IN ('Published', 'Draft')),
  image_position TEXT DEFAULT 'center center',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_homepage_hero_banners_display_order ON homepage_hero_banners(display_order);
CREATE INDEX IF NOT EXISTS idx_homepage_hero_banners_status ON homepage_hero_banners(status);

DROP TRIGGER IF EXISTS set_homepage_hero_banners_updated_at ON homepage_hero_banners;
CREATE TRIGGER set_homepage_hero_banners_updated_at
BEFORE UPDATE ON homepage_hero_banners
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE homepage_hero_banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read homepage_hero_banners" ON homepage_hero_banners;
DROP POLICY IF EXISTS "Allow admin full access homepage_hero_banners" ON homepage_hero_banners;
CREATE POLICY "Allow public read homepage_hero_banners" ON homepage_hero_banners FOR SELECT USING (true);
CREATE POLICY "Allow admin full access homepage_hero_banners" ON homepage_hero_banners FOR ALL USING (true) WITH CHECK (true);

-- SEED HOMEPAGE HERO BANNERS
INSERT INTO homepage_hero_banners (id, title, subtitle, description, image_url, mobile_image_url, cta_text, cta_link, display_order, is_active, status, image_position)
VALUES 
  ('slide-01', 'MAHARAJ JEWELLERY', 'The Purest Pearl Elegance', 'Rare South Sea, Akoya, and Tahitian pearls crafted into timeless heirlooms by master artisans.', '/images/pearl-banner.png', '/images/pearl-banner-mobile.png', 'EXPLORE THE COLLECTION', '/shop', 1, true, 'Published', 'center center'),
  ('slide-02', 'ROYAL HERITAGE', 'South Sea Pearl Strands', 'Hand-selected golden and white South Sea pearls set in 18K gold fittings.', '/images/pearl-banner.png', '/images/pearl-banner-mobile.png', 'DISCOVER SOUTH SEA', '/shop?category=saltwater', 2, true, 'Published', 'center center'),
  ('slide-03', 'THE BRIDAL EDIT', 'Sacred Bridal Heirloom Collection', 'Ornate pearl chokers, layered necklaces, and matching earrings crafted for unforgettable moments.', '/images/pearl-banner.png', '/images/pearl-banner-mobile.png', 'EXPLORE BRIDAL', '/shop?category=bridal', 3, true, 'Published', 'center center')
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description, image_url = EXCLUDED.image_url;







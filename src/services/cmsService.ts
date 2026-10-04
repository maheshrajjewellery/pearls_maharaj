import { supabase } from '@/lib/supabase';
import {
  HomepageCMS,
  AboutCMS,
  PearlEducationCMS,
  BridalCMS,
} from '@/types/admin';
import {
  initialHomepageCMS,
  initialAboutCMS,
  initialPearlEducationCMS,
  initialBridalCMS,
} from '@/admin/data/adminMockData';

import { deleteHeroBannerImage } from '@/services/storageService';
import { HomepageHeroSlide } from '@/types/admin';

export interface ContactCMS {
  heroHeading: string;
  heroSubheading: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  consultationHeading: string;
  consultationDescription: string;
}

export interface CorporateCMS {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  overviewText: string;
  benefitsHeading: string;
  benefits: { title: string; desc: string }[];
}

export interface FooterCMS {
  tagline: string;
  phone: string;
  email: string;
  address: string;
  copyrightText: string;
  socialInstagram: string;
  socialFacebook: string;
  socialPinterest: string;
  socialWhatsapp: string;
}

export const defaultContactCMS: ContactCMS = {
  heroHeading: 'Private Client Concierge & Consultations',
  heroSubheading: 'Connect with our master jewelers, arrange private appointments, or request bespoke pearl commissions.',
  phone: '+91 (040) 6688 9900',
  email: 'concierge@maharajjewellery.com',
  address: 'Maharaj Heritage Palace, Road No. 10, Jubilee Hills, Hyderabad, Telangana 500033',
  workingHours: 'Monday to Saturday: 10:30 AM – 7:30 PM (IST)',
  consultationHeading: 'Schedule a Private Consultation',
  consultationDescription: 'Experience our royal heritage pearl collections with a personal jewellery master in our private salon or online.',
};

export const defaultCorporateCMS: CorporateCMS = {
  heroHeading: 'Royal Corporate Gifting & Bespoke Commissions',
  heroSubheading: 'Elevate executive relationships with handcrafted South Sea pearl heirlooms and custom engraved gold keepsake cases.',
  heroImage: 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=1920',
  overviewText: 'Maharaj Jewellery curates prestigious gifts for board members, valued clients, and executive milestones. Each commission comes in signature velvet velvet boxes with certificate of authenticity.',
  benefitsHeading: 'The Maharaj Distinction in Corporate Gifting',
  benefits: [
    { title: 'Custom Hallmark & Engraving', desc: 'Personalized corporate logos, initials, and commemorative messaging on 18K gold backplates.' },
    { title: 'Luxury Velvet Presentation', desc: 'Bespoke royal blue and gold foil presentation boxes handcrafted by royal artisans.' },
    { title: 'Dedicated Concierge Manager', desc: 'End-to-end assistance from initial design selection to white-glove international door delivery.' },
    { title: 'Global Insured Logistics', desc: 'Fully insured worldwide transit with real-time consignment tracking.' }
  ],
};

export const defaultFooterCMS: FooterCMS = {
  tagline: 'Preserving the centuries-old legacy of royal Indian court jewellery and pristine South Sea pearls.',
  phone: '+91 (040) 6688 9900',
  email: 'concierge@maharajjewellery.com',
  address: 'Maharaj Heritage Palace, Jubilee Hills, Hyderabad',
  copyrightText: '© 2026 MAHARAJ JEWELLERY. ALL RIGHTS RESERVED.',
  socialInstagram: 'https://instagram.com/maharajjewellery',
  socialFacebook: 'https://facebook.com/maharajjewellery',
  socialPinterest: 'https://pinterest.com/maharajjewellery',
  socialWhatsapp: 'https://wa.me/9104066889900',
};

export interface AllCMSData {
  homepage: HomepageCMS;
  about: AboutCMS;
  education: PearlEducationCMS;
  bridal: BridalCMS;
  contact: ContactCMS;
  corporate: CorporateCMS;
  footer: FooterCMS;
}

const LOCAL_STORAGE_PREFIX = 'maharaj_cms_';

/**
 * Fetch hero banners directly from `homepage_hero_banners` table in Supabase
 */
export async function fetchHeroBannersFromDb(): Promise<HomepageHeroSlide[] | null> {
  try {
    const { data, error } = await supabase
      .from('homepage_hero_banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        title: item.title || 'MAHARAJ JEWELLERY',
        subtitle: item.subtitle || 'The Purest Pearl Elegance',
        description: item.description || '',
        imageUrl: item.image_url,
        imagePath: item.image_path || undefined,
        mobileImageUrl: item.mobile_image_url || undefined,
        mobileImagePath: item.mobile_image_path || undefined,
        ctaText: item.cta_text || 'EXPLORE THE COLLECTION',
        ctaLink: item.cta_link || '/shop',
        displayOrder: item.display_order ?? 1,
        isActive: item.is_active ?? true,
        status: (item.status as 'Published' | 'Draft') || 'Published',
        imagePosition: item.image_position || 'center center',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    }
  } catch (err) {
    console.warn('[CMS] homepage_hero_banners fetch warning:', err);
  }
  return null;
}

/**
 * Save hero banners to `homepage_hero_banners` table in Supabase
 */
export async function saveHeroBannersToDb(slides: HomepageHeroSlide[]): Promise<boolean> {
  try {
    // 1. Get existing DB records to check for deletions
    const { data: currentDbRows } = await supabase.from('homepage_hero_banners').select('id, image_path, mobile_image_path');
    
    if (currentDbRows && currentDbRows.length > 0) {
      const activeIds = new Set(slides.map(s => s.id));
      const deletedRows = currentDbRows.filter(r => !activeIds.has(r.id));

      for (const row of deletedRows) {
        await supabase.from('homepage_hero_banners').delete().eq('id', row.id);
        if (row.image_path) await deleteHeroBannerImage(row.image_path);
        if (row.mobile_image_path) await deleteHeroBannerImage(row.mobile_image_path);
      }
    }

    // 2. Prepare payload for upsert
    const payload = slides.map((slide, idx) => ({
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image_url: slide.imageUrl,
      image_path: slide.imagePath || null,
      mobile_image_url: slide.mobileImageUrl || null,
      mobile_image_path: slide.mobileImagePath || null,
      cta_text: slide.ctaText,
      cta_link: slide.ctaLink,
      display_order: slide.displayOrder ?? idx + 1,
      is_active: slide.isActive,
      status: slide.status,
      image_position: slide.imagePosition || 'center center',
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('homepage_hero_banners').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('[CMS] Warning upserting to homepage_hero_banners table:', error);
    }
    return true;
  } catch (err) {
    console.warn('[CMS] Exception saving hero banners to database:', err);
    return false;
  }
}

/**
 * Helper to fetch a single CMS key from Supabase `cms_content` table with fallback to localStorage & mock default
 */
export async function getCMSContent<T>(key: string, fallbackDefault: T): Promise<T> {
  let content: T | null = null;

  // 1. Try Supabase `cms_content` table
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('data')
      .eq('key', key)
      .single();

    if (!error && data && data.data) {
      content = data.data as T;
    }
  } catch (err) {
    console.warn(`[CMS] Supabase fetch error for key "${key}":`, err);
  }

  // 2. If key === 'homepage', try direct fetch from `homepage_hero_banners` table
  if (key === 'homepage') {
    const dbBanners = await fetchHeroBannersFromDb();
    if (dbBanners && dbBanners.length > 0) {
      const baseHomepage = (content as HomepageCMS) || (fallbackDefault as HomepageCMS);
      content = {
        ...baseHomepage,
        heroSlides: dbBanners,
      } as unknown as T;
    }
  }

  if (content) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(content));
    }
    return content;
  }

  // 3. Try LocalStorage fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (local) {
      try {
        return JSON.parse(local) as T;
      } catch {
        // ignore parse error
      }
    }
  }

  // 4. Fallback Default
  return fallbackDefault;
}

/**
 * Save / Upsert CMS Content to Supabase & LocalStorage
 */
export async function updateCMSContent<T>(key: string, content: T): Promise<boolean> {
  // Always update LocalStorage immediately for instantaneous UI updates
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(content));
  }

  // If key === 'homepage', sync heroSlides to `homepage_hero_banners` table
  if (key === 'homepage') {
    const homepageData = content as unknown as HomepageCMS;
    if (homepageData && homepageData.heroSlides) {
      await saveHeroBannersToDb(homepageData.heroSlides);
    }
  }

  // Upsert into Supabase `cms_content`
  try {
    const { error } = await supabase
      .from('cms_content')
      .upsert(
        {
          key,
          data: content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (error) {
      console.error(`[CMS] Error upserting CMS key "${key}" to Supabase:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[CMS] Exception upserting CMS key "${key}":`, err);
    return false;
  }
}

/**
 * Fetch all CMS sections in parallel
 */
export async function fetchAllCMSData(): Promise<AllCMSData> {
  const [homepage, about, education, bridal, contact, corporate, footer] = await Promise.all([
    getCMSContent<HomepageCMS>('homepage', initialHomepageCMS),
    getCMSContent<AboutCMS>('about', initialAboutCMS),
    getCMSContent<PearlEducationCMS>('education', initialPearlEducationCMS),
    getCMSContent<BridalCMS>('bridal', initialBridalCMS),
    getCMSContent<ContactCMS>('contact', defaultContactCMS),
    getCMSContent<CorporateCMS>('corporate', defaultCorporateCMS),
    getCMSContent<FooterCMS>('footer', defaultFooterCMS),
  ]);

  return {
    homepage,
    about,
    education,
    bridal,
    contact,
    corporate,
    footer,
  };
}


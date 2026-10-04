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
 * Helper to fetch a single CMS key from Supabase `cms_content` table with fallback to localStorage & mock default
 */
export async function getCMSContent<T>(key: string, fallbackDefault: T): Promise<T> {
  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('data')
      .eq('key', key)
      .single();

    if (!error && data && data.data) {
      // Save locally as cache fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data.data));
      }
      return data.data as T;
    }
  } catch (err) {
    console.warn(`[CMS] Supabase fetch error for key "${key}", checking localStorage fallback:`, err);
  }

  // 2. Try LocalStorage
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

  // 3. Fallback Default
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
      // Even if database table isn't created yet, local save succeeded
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

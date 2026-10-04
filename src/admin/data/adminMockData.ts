import {
  AdminOrder,
  AdminCustomer,
  CorporateEnquiry,
  ContactEnquiry,
  AdminReview,
  Banner,
  NewsletterSubscriber,
  AdminCategory,
  AdminCollection,
  HomepageCMS,
  AboutCMS,
  PearlEducationCMS,
  BridalCMS,
  AdminSettings,
  ActivityLog,
} from '@/types/admin';
import { shopProducts } from '@/data/shopProducts';

export const initialOrders: AdminOrder[] = [];

export const initialCustomers: AdminCustomer[] = [];

export const initialCorporateEnquiries: CorporateEnquiry[] = [];

export const initialContactEnquiries: ContactEnquiry[] = [
  {
    id: 'cnt-501',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@gmail.com',
    phone: '+91 98490 55443',
    subject: 'Bespoke Tahitian Pearl Bridal Set Request',
    message: 'I would like to schedule a private consultation for a custom bridal ensemble using peacock black Tahitian pearls.',
    date: '2026-09-30T11:20:00Z',
    status: 'New',
    category: 'Custom',
  },
  {
    id: 'cnt-502',
    name: 'Devraj Chauhan',
    email: 'devraj.c@outlooks.com',
    phone: '+91 97654 12345',
    subject: 'Authentication Certificate Query',
    message: 'Does the Royal South Sea Pearl Strand come with GIA or Gemological Institute certification?',
    date: '2026-09-29T18:00:00Z',
    status: 'Read',
    category: 'Jewellery',
  },
];

export const initialReviews: AdminReview[] = [
  {
    id: 'rev-1',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    productId: 'p-01',
    productName: 'Royal South Sea Pearl Strand',
    rating: 5,
    title: 'Exquisite luster and unmatched royalty',
    comment: 'The pearls glow with a warm champagne radiance. The clasp feeling solid gold is incredible. Packaging was fit for royalty.',
    date: '2026-09-28T15:00:00Z',
    status: 'Approved',
  },
  {
    id: 'rev-2',
    customerName: 'Nisha Gupta',
    customerEmail: 'nisha.g@designstudio.in',
    productId: 'p-02',
    productName: 'Akoya Brilliance Pearl Earrings',
    rating: 5,
    title: 'Pure understated elegance',
    comment: 'Subtle and lightweight yet they capture everyone’s attention in evening light.',
    date: '2026-09-25T12:30:00Z',
    status: 'Approved',
  },
  {
    id: 'rev-3',
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@gmail.com',
    productId: 'p-03',
    productName: 'Maharani Pearl Choker Set',
    rating: 4,
    title: 'Breathtaking craftsmanship',
    comment: 'Beautiful piece! Delivery took 1 extra day due to custom packaging, but worth the wait.',
    date: '2026-09-20T10:00:00Z',
    status: 'Approved',
  },
];

export const initialBanners: Banner[] = [
  {
    id: 'ban-1',
    title: 'Royal South Sea Autumn Collection',
    subtitle: 'Unrivaled luminance handcrafted for royalty',
    imageUrl: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ctaText: 'Explore Royal Pearls',
    ctaLink: '/shop?collection=Royal+Pearls',
    type: 'Homepage',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    status: 'Active',
  },
  {
    id: 'ban-2',
    title: 'Sacred Bridal Grace 2026',
    subtitle: 'Ornate pearl chokers & sets for modern brides',
    imageUrl: 'https://images.pexels.com/photos/25389117/pexels-photo-25389117.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ctaText: 'View Bridal Campaign',
    ctaLink: '/bridal',
    type: 'Promotional',
    startDate: '2026-08-15',
    endDate: '2026-12-31',
    status: 'Active',
  },
];

export const initialNewsletterSubscribers: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'priya.sharma@example.com', dateJoined: '2025-11-12', status: 'Subscribed' },
  { id: 'sub-2', email: 'v.rao@constructions.com', dateJoined: '2026-01-15', status: 'Subscribed' },
  { id: 'sub-3', email: 'meera@luxeliving.co', dateJoined: '2026-02-28', status: 'Subscribed' },
  { id: 'sub-4', email: 'ananya.s@lifestyle.in', dateJoined: '2025-08-04', status: 'Subscribed' },
  { id: 'sub-5', email: 'karan.m@techventures.io', dateJoined: '2026-09-30', status: 'Subscribed' },
];

export const initialCategories: AdminCategory[] = [
  { id: 'necklaces', name: 'Necklaces', slug: 'necklaces', description: 'Majestic strands, drop pendants & chokers', image: 'https://images.pexels.com/photos/10061399/pexels-photo-10061399.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 12, enabled: true, displayOrder: 1 },
  { id: 'earrings', name: 'Earrings', slug: 'earrings', description: 'Drop earrings, studs & chandeliers', image: 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 15, enabled: true, displayOrder: 2 },
  { id: 'rings', name: 'Rings', slug: 'rings', description: 'Solitaire pearls set in gold & platinum', image: 'https://images.pexels.com/photos/19525066/pexels-photo-19525066.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 8, enabled: true, displayOrder: 3 },
  { id: 'bracelets', name: 'Bracelets', slug: 'bracelets', description: 'Single and multi-strand pearl wristwear', image: 'https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 6, enabled: true, displayOrder: 4 },
  { id: 'bangles', name: 'Bangles', slug: 'bangles', description: 'Heritage gold bangles encrusted with pearls', image: 'https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 5, enabled: true, displayOrder: 5 },
  { id: 'pearl-sets', name: 'Pearl Sets', slug: 'pearl-sets', description: 'Matching necklace, earring & ring ensembles', image: 'https://images.pexels.com/photos/7743044/pexels-photo-7743044.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 7, enabled: true, displayOrder: 6 },
  { id: 'bridal', name: 'Bridal', slug: 'bridal', description: 'Sacred wedding jewellery collections', image: 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 9, enabled: true, displayOrder: 7 },
  { id: 'new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest seasonal creations', image: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 8, enabled: true, displayOrder: 8 },
  { id: 'gemstones', name: 'Gemstones & Pearls', slug: 'gemstones', description: 'Rare emeralds & rubies paired with pearls', image: 'https://images.pexels.com/photos/17555289/pexels-photo-17555289.jpeg?auto=compress&cs=tinysrgb&w=600', itemCount: 4, enabled: true, displayOrder: 9 },
];

export const initialCollections: AdminCollection[] = [
  {
    id: 'col-1',
    name: 'Royal Pearls',
    slug: 'royal-pearls',
    description: 'Majestic strands worthy of royalty, sourced from deep South Sea waters.',
    coverImage: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1200',
    bannerImage: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1920',
    status: 'Active',
    displayOrder: 1,
    productIds: ['p-01', 'p-04', 'p-05'],
  },
  {
    id: 'col-2',
    name: 'Heritage',
    slug: 'heritage',
    description: 'Timeless designs rooted in royal Indian jewellery traditions.',
    coverImage: 'https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg?auto=compress&cs=tinysrgb&w=800',
    bannerImage: 'https://images.pexels.com/photos/177332/pexels-photo-177332.jpeg?auto=compress&cs=tinysrgb&w=1920',
    status: 'Active',
    displayOrder: 2,
    productIds: ['p-02', 'p-03', 'p-06'],
  },
  {
    id: 'col-3',
    name: 'Bridal',
    slug: 'bridal',
    description: 'Ornate pieces designed to illuminate sacred beginnings.',
    coverImage: 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=800',
    bannerImage: 'https://images.pexels.com/photos/25389117/pexels-photo-25389117.jpeg?auto=compress&cs=tinysrgb&w=1600',
    status: 'Active',
    displayOrder: 3,
    productIds: ['p-03', 'p-08'],
  },
  {
    id: 'col-4',
    name: 'Contemporary',
    slug: 'contemporary',
    description: 'Modern interpretations of classic pearls for everyday luxury.',
    coverImage: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=1200',
    bannerImage: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=1920',
    status: 'Active',
    displayOrder: 4,
    productIds: ['p-07'],
  },
];

export const initialHomepageCMS: HomepageCMS = {
  hero: {
    heading: 'The Purest Pearl Elegance',
    subtitle: 'MAHARAJ JEWELLERY',
    description: 'Rare South Sea, Akoya, and Tahitian pearls crafted into timeless heirlooms by master artisans.',
    bgImage: '/images/pearl-banner.png',
    ctaText: 'EXPLORE THE COLLECTION',
    ctaLink: '/shop',
    active: true,
  },
  heroSlides: [
    {
      id: 'slide-01',
      title: 'MAHARAJ JEWELLERY',
      subtitle: 'The Purest Pearl Elegance',
      description: 'Rare South Sea, Akoya, and Tahitian pearls crafted into timeless heirlooms by master artisans.',
      imageUrl: '/images/pearl-banner.png',
      mobileImageUrl: '/images/pearl-banner-mobile.png',
      ctaText: 'EXPLORE THE COLLECTION',
      ctaLink: '/shop',
      displayOrder: 1,
      isActive: true,
      status: 'Published',
      imagePosition: 'center center',
      createdAt: '2026-10-04T12:00:00Z',
      updatedAt: '2026-10-04T12:00:00Z',
    },
    {
      id: 'slide-02',
      title: 'ROYAL HERITAGE',
      subtitle: 'South Sea Pearl Strands',
      description: 'Hand-selected golden and white South Sea pearls set in 18K gold fittings.',
      imageUrl: '/images/pearl-banner.png',
      mobileImageUrl: '/images/pearl-banner-mobile.png',
      ctaText: 'DISCOVER SOUTH SEA',
      ctaLink: '/shop?category=saltwater',
      displayOrder: 2,
      isActive: true,
      status: 'Published',
      imagePosition: 'center center',
      createdAt: '2026-10-04T12:00:00Z',
      updatedAt: '2026-10-04T12:00:00Z',
    },
    {
      id: 'slide-03',
      title: 'THE BRIDAL EDIT',
      subtitle: 'Sacred Bridal Heirloom Collection',
      description: 'Ornate pearl chokers, layered necklaces, and matching earrings crafted for unforgettable moments.',
      imageUrl: '/images/pearl-banner.png',
      mobileImageUrl: '/images/pearl-banner-mobile.png',
      ctaText: 'EXPLORE BRIDAL',
      ctaLink: '/shop?category=bridal',
      displayOrder: 3,
      isActive: true,
      status: 'Published',
      imagePosition: 'center center',
      createdAt: '2026-10-04T12:00:00Z',
      updatedAt: '2026-10-04T12:00:00Z',
    },
  ],
  discoverCategories: {
    title: 'Curated Categories',
    subtitle: 'Explore our exquisite range of high jewellery',
    active: true,
  },
  featuredCollections: {
    title: 'Featured Collections',
    subtitle: 'Masterpieces of craftsmanship and luster',
    active: true,
  },
  pearlStory: {
    heading: 'A Legacy of Radiance',
    content: 'For over three decades, Maharaj Jewellery has preserved the sacred art of pearl selection and gold smithing. Every pearl in our collection is hand-evaluated for luster, overtones, and surface perfection.',
    image: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ctaText: 'DISCOVER OUR HERITAGE',
    ctaLink: '/about',
    active: true,
  },
  craftsmanship: {
    heading: 'Crafted To Last Generations',
    subtitle: 'From ocean to masterpiece, our 5-step process ensures unrivaled perfection.',
    bgImage: 'https://images.pexels.com/photos/6263146/pexels-photo-6263146.jpeg?auto=compress&cs=tinysrgb&w=1920',
    active: true,
  },
  bridalSection: {
    heading: 'Sacred Bridal Heirlooms',
    subtitle: 'Illuminate your special day with strands fit for royalty.',
    image: 'https://images.pexels.com/photos/25389117/pexels-photo-25389117.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ctaText: 'VIEW BRIDAL CAMPAIGN',
    ctaLink: '/bridal',
    active: true,
  },
  educationSection: {
    title: 'Pearl Education',
    subtitle: 'Understand the essential factors that define pearl perfection: Luster, Nacre, Surface, Shape, and Size.',
    active: true,
  },
  giftingSection: {
    title: 'The Art of Corporate Gifting',
    subtitle: 'Honor key milestones, valued partners, and executive achievements with handcrafted South Sea pearl jewellery presented in custom engraved leather boxes.',
    image: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=1200',
    active: true,
  },
  editorialGallery: {
    title: 'The Maharaj World',
    active: true,
  },
  newsletter: {
    title: 'Join The Maharaj Inner Circle',
    subtitle: 'Receive private invitations to preview limited edition releases and pearl education masterclasses.',
    active: true,
  },
};

export const initialAboutCMS: AboutCMS = {
  heroHeading: 'Three Decades of Imperial Craftsmanship',
  heroImage: 'https://images.pexels.com/photos/6263146/pexels-photo-6263146.jpeg?auto=compress&cs=tinysrgb&w=1920',
  philosophyHeading: 'Our Philosophy',
  philosophyText: 'We believe jewellery should not merely adorn, but evoke an indelible sense of emotion, history, and royal dignity.',
  storyHeading: 'The Maharaj Pearl Heritage',
  storyText: 'Founded in 1994, Maharaj Jewellery set out with a single ambition: to curate the finest natural and cultured pearls from the South Pacific and Japan, matching them with hand-sculpted 18K and 22K gold settings.',
  storyImage: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1000',
  craftHeading: 'Uncompromising Mastery',
  craftText: 'Each master jeweler in our Hyderabad atelier has spent over 20 years honing techniques passed down through generations of royal court goldsmiths.',
  values: [
    { title: 'Ethical Sourcing', desc: 'Sourced strictly from certified sustainable pearl farms.' },
    { title: 'Luster Integrity', desc: 'Only top 1% AAA+ grade pearls with thick nacre qualify.' },
    { title: 'Custom Heirlooms', desc: 'Bespoke design services for milestone celebrations.' },
  ],
  ctaText: 'SCHEDULE A PRIVATE CONSULTATION',
  ctaLink: '/contact',
};

export const initialPearlEducationCMS: PearlEducationCMS = {
  heroTitle: 'The Connoisseur’s Guide to Pearls',
  heroSubtitle: 'Learn how to judge luster, body color, shape, and nacre quality like an expert.',
  heroImage: 'https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=1600',
  sections: [
    {
      id: 'types',
      title: '1. Pearl Types & Origins',
      description: 'Understanding South Sea, Akoya, Tahitian, and Freshwater pearls.',
      image: 'https://images.pexels.com/photos/908183/pexels-photo-908183.jpeg?auto=compress&cs=tinysrgb&w=1000',
      content: 'South Sea pearls are known as the Queen of Pearls, ranging from 9mm to 20mm with unmatched satin luster.',
    },
    {
      id: 'luster',
      title: '2. Understanding Luster',
      description: 'Luster is the single most critical factor in valuing a pearl.',
      image: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1000',
      content: 'High luster reflects sharp, mirror-like images. Poor luster looks dull or chalky.',
    },
    {
      id: 'care',
      title: '3. Caring For Your Pearls',
      description: 'Pearls are organic gems and require gentle care.',
      image: 'https://images.pexels.com/photos/7743044/pexels-photo-7743044.jpeg?auto=compress&cs=tinysrgb&w=1000',
      content: 'Rule of thumb: Pearls should be the last thing you put on and the first thing you take off.',
    },
  ],
};

export const initialBridalCMS: BridalCMS = {
  heroHeading: 'The Sacred Bridal Collection',
  heroSubheading: 'Regal pearl chokers, necklaces, and bangles designed for your most sacred beginnings.',
  heroImage: 'https://images.pexels.com/photos/25389117/pexels-photo-25389117.jpeg?auto=compress&cs=tinysrgb&w=1600',
  collectionsTitle: 'Bridal Ensembles',
  featuredProductIds: ['p-03', 'p-08'],
  ctaHeading: 'Bespoke Bridal Styling',
  ctaText: 'Book a personal session with our lead bridal stylist.',
};

export const initialSettings: AdminSettings = {
  storeName: 'Maharaj Jewellery',
  storeEmail: 'concierge@maharajjewellery.com',
  storePhone: '+91 (040) 2355-8899',
  storeAddress: 'Maharaj House, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
  currency: 'INR (₹)',
  taxRatePercent: 3, // 3% GST on jewellery
  freeShippingThreshold: 50000,
  standardShippingFee: 1500,
  expressShippingFee: 3500,
  socialInstagram: 'https://instagram.com/maharajjewellery',
  socialFacebook: 'https://facebook.com/maharajjewellery',
  socialPinterest: 'https://pinterest.com/maharajjewellery',
  socialWhatsapp: '+919876543210',
  seoDefaultTitle: 'Maharaj Jewellery | Luxury South Sea & Akoya Pearls',
  seoDefaultDescription: 'Discover imperial luxury pearl necklaces, earrings, rings and bespoke bridal collections by Maharaj Jewellery.',
  enableGuestCheckout: true,
  enableReviews: true,
};

export const initialActivityLogs: ActivityLog[] = [
  { id: 'act-1', type: 'Order', title: 'New Order Received', description: 'Order #MJ-2026-8804 placed by Karan Mehra for ₹3,10,000', timestamp: '10 mins ago', severity: 'success' },
  { id: 'act-2', type: 'Corporate', title: 'New Corporate Enquiry', description: 'Meera Kapoor (LuxeLiving PR) submitted an enquiry for 25 gifts', timestamp: '45 mins ago', severity: 'info' },
  { id: 'act-3', type: 'Stock', title: 'Low Stock Alert', description: 'Royal South Sea Pearl Strand (p-01) stock remaining: 2 units', timestamp: '2 hours ago', severity: 'warning' },
  { id: 'act-4', type: 'Order', title: 'Order Shipped', description: 'Order #MJ-2026-8802 shipped via BlueDart (AWB BD998231)', timestamp: '5 hours ago', severity: 'info' },
  { id: 'act-5', type: 'Customer', title: 'New VIP Customer', description: 'Ananya Singhania upgraded to VIP Status (Spent ₹6.5 Lakhs)', timestamp: '1 day ago', severity: 'success' },
];

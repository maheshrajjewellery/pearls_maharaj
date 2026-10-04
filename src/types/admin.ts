import { ShopProduct, ShopCategory, CollectionFilter } from './shop';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

export interface OrderItem {
  id: string;
  product: ShopProduct;
  quantity: number;
  unitPrice: number;
  selectedSize?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  inventoryRestored?: boolean;
  timeline: {
    status: OrderStatus | string;
    timestamp: string;
    note?: string;
  }[];
}

export interface AdminCustomerAddress {
  id?: string;
  label?: string;
  fullName?: string;
  phone?: string;
  houseFlat?: string;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  address: string;
  isDefault?: boolean;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  firstOrderDate: string | null;
  lastOrderDate: string | null;
  cancelledOrdersCount: number;
  deliveredOrdersCount: number;
  joinedDate: string;
  status: 'Active' | 'Inactive';
  provider?: 'google' | 'email';
  avatarUrl?: string;
  addresses: AdminCustomerAddress[];
  wishlistCount: number;
}

export type CorporateEnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'In Discussion'
  | 'Quotation Sent'
  | 'Converted'
  | 'Closed'
  | 'Rejected';

export interface CorporateEnquiryEvent {
  id: string;
  enquiryId: string;
  eventType: string;
  oldStatus?: string;
  newStatus?: string;
  message: string;
  createdBy: string;
  createdAt: string;
}

export interface QuotationDetails {
  amount?: number;
  quotationDate?: string;
  validUntil?: string;
  notes?: string;
  quotationRef?: string;
}

export interface CorporateEnquiry {
  id: string;
  enquiryNumber: string;
  companyName: string;
  contactName: string;
  designation?: string;
  email: string;
  phone: string;
  companyType?: string;
  website?: string;
  quantity: number;
  quantityRange?: string;
  budget: string;
  giftType?: string;
  occasion?: string;
  preferredDeliveryDate?: string;
  customizationRequired?: string;
  packagingRequired?: string;
  brandingRequired?: string;
  message?: string;
  status: CorporateEnquiryStatus;
  assignedTo?: string | null;
  assignedToName?: string | null;
  quotation?: QuotationDetails;
  internalNotes?: string;
  isArchived?: boolean;
  convertedOrderId?: string;
  createdAt: string;
  updatedAt: string;
  events: CorporateEnquiryEvent[];
  // Legacy backward-compatibility aliases
  name?: string;
  company?: string;
  numberOfGifts?: number;
}

export type ContactEnquiryStatus = 'New' | 'Read' | 'Replied' | 'Closed';

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: ContactEnquiryStatus;
  category: 'General' | 'Jewellery' | 'Custom' | 'Bridal';
}

export interface AdminReview {
  id: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'Approved' | 'Hidden' | 'Pending';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  type: 'Homepage' | 'Collection' | 'Promotional';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Scheduled';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  dateJoined: string;
  status: 'Subscribed' | 'Unsubscribed';
}

export interface AdminCategory {
  id: ShopCategory;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  enabled: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  status: 'Active' | 'Draft';
  displayOrder: number;
  productIds: string[];
}

export interface HomepageHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imagePath?: string;
  mobileImageUrl?: string;
  mobileImagePath?: string;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
  isActive: boolean;
  status: 'Published' | 'Draft';
  imagePosition?: 'center center' | 'center left' | 'center right' | 'top center' | 'bottom center';
  createdAt?: string;
  updatedAt?: string;
}

export interface HomepageCMS {
  hero: {
    heading: string;
    subtitle: string;
    description: string;
    bgImage: string;
    bgImagePath?: string;
    bgImageName?: string;
    bgImageDimensions?: string;
    bgImageSize?: string;
    bgImageUpdatedAt?: string;
    ctaText: string;
    ctaLink: string;
    active: boolean;
  };
  heroSlides?: HomepageHeroSlide[];
  discoverCategories: {
    title: string;
    subtitle: string;
    active: boolean;
  };
  featuredCollections: {
    title: string;
    subtitle: string;
    active: boolean;
  };
  pearlStory: {
    heading: string;
    content: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    active: boolean;
  };
  craftsmanship: {
    heading: string;
    subtitle: string;
    bgImage: string;
    active: boolean;
  };
  bridalSection: {
    heading: string;
    subtitle: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    active: boolean;
  };
  educationSection?: {
    title: string;
    subtitle: string;
    active: boolean;
  };
  giftingSection?: {
    title: string;
    subtitle: string;
    image: string;
    active: boolean;
  };
  editorialGallery?: {
    title: string;
    active: boolean;
  };
  newsletter: {
    title: string;
    subtitle: string;
    active: boolean;
  };
}

export interface AboutCMS {
  heroHeading: string;
  heroImage: string;
  philosophyHeading: string;
  philosophyText: string;
  storyHeading: string;
  storyText: string;
  storyImage: string;
  craftHeading: string;
  craftText: string;
  values: { title: string; desc: string }[];
  ctaText: string;
  ctaLink: string;
}

export interface PearlEducationSection {
  id: string;
  title: string;
  description: string;
  image: string;
  steps?: { title: string; desc: string }[];
  content?: string;
}

export interface PearlEducationCMS {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  sections: PearlEducationSection[];
}

export interface BridalCMS {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  collectionsTitle: string;
  featuredProductIds: string[];
  ctaHeading: string;
  ctaText: string;
}

export interface AdminSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  socialInstagram: string;
  socialFacebook: string;
  socialPinterest: string;
  socialWhatsapp: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  enableGuestCheckout: boolean;
  enableReviews: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Store Manager' | 'Editor';
  avatarUrl?: string;
}

export interface ActivityLog {
  id: string;
  type: 'Order' | 'Customer' | 'Corporate' | 'Product' | 'Stock' | 'System';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
}

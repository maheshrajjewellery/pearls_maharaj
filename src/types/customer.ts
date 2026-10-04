import { UserProfile } from './shop';
import { AdminOrder } from './admin';

export type DashboardTab =
  | 'overview'
  | 'orders'
  | 'wishlist'
  | 'profile'
  | 'addresses'
  | 'payments'
  | 'settings';

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface ExtendedUserProfile extends UserProfile {
  phone?: string;
  dob?: string;
  joinedDate?: string;
}

export interface CustomerNotificationSettings {
  emailOrders: boolean;
  emailPromotions: boolean;
  smsUpdates: boolean;
  whatsappAlerts: boolean;
}

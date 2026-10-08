import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CustomerAddress } from '@/types/customer';
import { AdminOrder, AdminCustomer, AdminCustomerAddress } from '@/types/admin';
import { fetchOrdersFromDb } from './orderService';

export interface CustomerFilterParams {
  searchTerm?: string;
  statusFilter?: 'All' | 'Active' | 'Inactive';
  customerTypeFilter?: 'All' | 'New' | 'Returning';
  orderActivityFilter?: 'All' | 'Never Ordered' | 'Has Orders';
  dateJoinedFilter?: 'All' | 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'Custom Range';
  startDate?: string;
  endDate?: string;
  sortBy?: 'newest' | 'oldest' | 'name' | 'most_orders' | 'highest_spending' | 'most_recent_order';
  page?: number;
  pageSize?: number;
}

export interface FetchCustomersResult {
  customers: AdminCustomer[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  dashboardStats: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    customersWithOrders: number;
    totalCustomerRevenue: number;
  };
}

// Default initial addresses for demo customer accounts fallback
const defaultDemoAddresses: Record<string, CustomerAddress[]> = {
  'priya.sharma@example.com': [
    {
      id: 'addr-1',
      fullName: 'Priya Sharma',
      phone: '+91 98765 43210',
      houseFlat: 'Plot 45',
      street: 'Road No. 36',
      area: 'Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      country: 'India',
      isDefault: true,
    },
  ],
  'v.rao@constructions.com': [
    {
      id: 'addr-2',
      fullName: 'Vikramaditya Rao',
      phone: '+91 91234 56789',
      houseFlat: '12',
      street: 'Boat Club Road',
      area: 'RA Puram',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600028',
      country: 'India',
      isDefault: true,
    },
  ],
  'ananya.s@lifestyle.in': [
    {
      id: 'addr-3',
      fullName: 'Ananya Singhania',
      phone: '+91 99887 76655',
      houseFlat: '88',
      street: 'Ridge Road',
      area: 'Malabar Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400006',
      country: 'India',
      isDefault: true,
    },
  ],
  'karan.m@techventures.io': [
    {
      id: 'addr-4',
      fullName: 'Karan Mehra',
      phone: '+91 97112 23344',
      houseFlat: 'Plot 104',
      street: 'Golf Course Road',
      area: 'DLF Phase 5',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      country: 'India',
      isDefault: true,
    },
  ],
};

// ADDRESS STORAGE HELPERS
export const getCustomerAddresses = (email: string): CustomerAddress[] => {
  if (typeof window === 'undefined' || !email) return [];
  const key = `MAHESHRAJ_addresses_${email.toLowerCase()}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading customer addresses:', err);
  }

  // Check demo fallback
  const demoList = defaultDemoAddresses[email.toLowerCase()];
  if (demoList) {
    saveCustomerAddresses(email, demoList);
    return demoList;
  }

  return [];
};

export const saveCustomerAddresses = (email: string, addresses: CustomerAddress[]): void => {
  if (typeof window === 'undefined' || !email) return;
  const key = `MAHESHRAJ_addresses_${email.toLowerCase()}`;
  try {
    localStorage.setItem(key, JSON.stringify(addresses));
  } catch (err) {
    console.error('Error saving customer addresses:', err);
  }
};

export const addCustomerAddress = (
  email: string,
  newAddr: Omit<CustomerAddress, 'id'>
): CustomerAddress[] => {
  const current = getCustomerAddresses(email);
  const created: CustomerAddress = {
    ...newAddr,
    id: `addr_${Date.now()}`,
    isDefault: current.length === 0 ? true : newAddr.isDefault,
  };

  let updated = [...current];
  if (created.isDefault) {
    updated = updated.map((a) => ({ ...a, isDefault: false }));
  }
  updated.unshift(created);
  saveCustomerAddresses(email, updated);
  return updated;
};

export const updateCustomerAddress = (
  email: string,
  updatedAddress: CustomerAddress
): CustomerAddress[] => {
  const current = getCustomerAddresses(email);
  let updated = current.map((a) => (a.id === updatedAddress.id ? updatedAddress : a));

  if (updatedAddress.isDefault) {
    updated = updated.map((a) =>
      a.id === updatedAddress.id ? { ...a, isDefault: true } : { ...a, isDefault: false }
    );
  }
  saveCustomerAddresses(email, updated);
  return updated;
};

export const deleteCustomerAddress = (email: string, addressId: string): CustomerAddress[] => {
  const current = getCustomerAddresses(email);
  const filtered = current.filter((a) => a.id !== addressId);
  if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
    filtered[0].isDefault = true;
  }
  saveCustomerAddresses(email, filtered);
  return filtered;
};

export const setDefaultCustomerAddress = (email: string, addressId: string): CustomerAddress[] => {
  const current = getCustomerAddresses(email);
  const updated = current.map((a) => ({
    ...a,
    isDefault: a.id === addressId,
  }));
  saveCustomerAddresses(email, updated);
  return updated;
};

// ORDER STORAGE HELPERS
export const getCustomerOrdersFromDb = async (email: string): Promise<AdminOrder[]> => {
  if (!email) return [];
  const cleanEmail = email.trim().toLowerCase();

  try {
    const res = await fetchOrdersFromDb({ pageSize: 1000 });
    const userOrders = res.orders.filter(
      (o) => o.customerEmail.toLowerCase() === cleanEmail
    );

    saveCustomerOrders(cleanEmail, userOrders);
    return userOrders;
  } catch (err) {
    console.error('Error fetching customer orders from DB:', err);
    return getCustomerOrders(cleanEmail);
  }
};

export const getCustomerOrders = (email: string): AdminOrder[] => {
  if (typeof window === 'undefined' || !email) return [];
  const cleanEmail = email.trim().toLowerCase();

  let allOrdersMatched: AdminOrder[] = [];
  try {
    const savedAll = localStorage.getItem('MAHESHRAJ_all_orders');
    if (savedAll) {
      const allOrders: AdminOrder[] = JSON.parse(savedAll);
      allOrdersMatched = allOrders.filter((o) => o.customerEmail.toLowerCase() === cleanEmail);
    }
  } catch (err) {
    console.error('Error reading all orders store:', err);
  }

  if (allOrdersMatched.length > 0) {
    saveCustomerOrders(cleanEmail, allOrdersMatched);
    return allOrdersMatched;
  }

  const key = `MAHESHRAJ_orders_${cleanEmail}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading customer orders:', err);
  }

  return [];
};

export const saveCustomerOrders = (email: string, orders: AdminOrder[]): void => {
  if (typeof window === 'undefined' || !email) return;
  const cleanEmail = email.trim().toLowerCase();
  const key = `MAHESHRAJ_orders_${cleanEmail}`;
  try {
    localStorage.setItem(key, JSON.stringify(orders));

    const savedAll = localStorage.getItem('MAHESHRAJ_all_orders');
    let allOrders: AdminOrder[] = savedAll ? JSON.parse(savedAll) : [];

    for (const o of orders) {
      const idx = allOrders.findIndex((item) => item.id === o.id || item.orderNumber === o.orderNumber);
      if (idx >= 0) {
        allOrders[idx] = { ...allOrders[idx], ...o };
      } else {
        allOrders.unshift(o);
      }
    }
    localStorage.setItem('MAHESHRAJ_all_orders', JSON.stringify(allOrders));
  } catch (err) {
    console.error('Error saving customer orders:', err);
  }
};

export const addCustomerOrder = (email: string, order: AdminOrder): AdminOrder[] => {
  const current = getCustomerOrders(email);
  const updated = [order, ...current];
  saveCustomerOrders(email, updated);
  return updated;
};

/**
 * Fetch database-driven customer profiles and orders, calculating metrics, search, filtering, sorting, and pagination
 */
export const fetchCustomersFromDb = async (
  params: CustomerFilterParams = {}
): Promise<FetchCustomersResult> => {
  const {
    searchTerm = '',
    statusFilter = 'All',
    customerTypeFilter = 'All',
    orderActivityFilter = 'All',
    dateJoinedFilter = 'All',
    startDate,
    endDate,
    sortBy = 'newest',
    page = 1,
    pageSize = 10,
  } = params;

  // 1. Fetch Orders from Database
  let allOrders: AdminOrder[] = [];
  try {
    const res = await fetchOrdersFromDb({ pageSize: 2000 });
    allOrders = res.orders;
  } catch (err) {
    console.warn('Error fetching orders for customer aggregation:', err);
  }

  // 2. Fetch Profiles from Supabase if configured
  let dbProfiles: any[] = [];
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) {
        dbProfiles = data;
      }
    } catch (err) {
      console.warn('Error fetching profiles from Supabase:', err);
    }
  }

  // 3. Fetch User Addresses from Supabase if configured
  let dbAddresses: any[] = [];
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('user_addresses').select('*');
      if (!error && data) {
        dbAddresses = data;
      }
    } catch (err) {
      console.warn('Error fetching user_addresses from Supabase:', err);
    }
  }

  // 4. Fetch registered users from LocalStorage
  let localUsers: any[] = [];
  if (typeof window !== 'undefined') {
    try {
      const savedReg = localStorage.getItem('MAHESHRAJ_registered_users');
      if (savedReg) {
        localUsers = JSON.parse(savedReg);
      }
      const savedUser = localStorage.getItem('MAHESHRAJ_user');
      if (savedUser) {
        const single = JSON.parse(savedUser);
        if (!localUsers.some((u) => u.email?.toLowerCase() === single.email?.toLowerCase())) {
          localUsers.push(single);
        }
      }
    } catch {}
  }

  // Map to hold unified customer objects keyed by email.toLowerCase()
  const customerMap = new Map<string, AdminCustomer>();

  // A. Add customers from Supabase Profiles
  for (const prof of dbProfiles) {
    if (!prof.email) continue;
    const cleanEmail = prof.email.trim().toLowerCase();
    customerMap.set(cleanEmail, {
      id: prof.id || `CUST-${cleanEmail}`,
      name: prof.full_name || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: prof.phone || '',
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      firstOrderDate: null,
      lastOrderDate: null,
      cancelledOrdersCount: 0,
      deliveredOrdersCount: 0,
      joinedDate: prof.created_at || new Date().toISOString(),
      status: prof.status === 'Inactive' ? 'Inactive' : 'Active',
      provider: prof.provider || 'email',
      avatarUrl: prof.avatar_url || '',
      addresses: [],
      wishlistCount: 0,
    });
  }

  // B. Merge registered local users (Google & Email logins)
  for (const u of localUsers) {
    if (!u.email) continue;
    const cleanEmail = u.email.trim().toLowerCase();
    const existing = customerMap.get(cleanEmail);

    if (existing) {
      existing.name = u.name || existing.name;
      existing.phone = u.phone || existing.phone;
      existing.avatarUrl = u.avatarUrl || existing.avatarUrl;
      existing.provider = u.provider || existing.provider || 'email';
      if (u.joinedDate && new Date(u.joinedDate) < new Date(existing.joinedDate)) {
        existing.joinedDate = u.joinedDate;
      }
    } else {
      customerMap.set(cleanEmail, {
        id: u.id || `CUST-${cleanEmail}`,
        name: u.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: u.phone || '',
        totalOrders: 0,
        totalSpent: 0,
        avgOrderValue: 0,
        firstOrderDate: null,
        lastOrderDate: null,
        cancelledOrdersCount: 0,
        deliveredOrdersCount: 0,
        joinedDate: u.joinedDate || new Date().toISOString(),
        status: u.status === 'Inactive' ? 'Inactive' : 'Active',
        provider: u.provider || (u.googleId ? 'google' : 'email'),
        avatarUrl: u.avatarUrl || '',
        addresses: [],
        wishlistCount: 0,
      });
    }
  }

  // C. Add/merge customers from Orders table (ensures every customer who placed an order appears)
  for (const ord of allOrders) {
    if (!ord.customerEmail) continue;
    const cleanEmail = ord.customerEmail.trim().toLowerCase();
    const existing = customerMap.get(cleanEmail);

    if (existing) {
      if (!existing.phone && ord.customerPhone) {
        existing.phone = ord.customerPhone;
      }
      if (!existing.name || existing.name === cleanEmail.split('@')[0]) {
        if (ord.customerName && ord.customerName !== 'Valued Customer') {
          existing.name = ord.customerName;
        }
      }
    } else {
      customerMap.set(cleanEmail, {
        id: `CUST-${ord.id || cleanEmail}`,
        name: ord.customerName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: ord.customerPhone || '',
        totalOrders: 0,
        totalSpent: 0,
        avgOrderValue: 0,
        firstOrderDate: ord.createdAt,
        lastOrderDate: ord.createdAt,
        cancelledOrdersCount: 0,
        deliveredOrdersCount: 0,
        joinedDate: ord.createdAt,
        status: 'Active',
        provider: 'email',
        avatarUrl: '',
        addresses: [],
        wishlistCount: 0,
      });
    }
  }

  // D. Populate customer statistics and order relationships
  for (const [email, cust] of customerMap.entries()) {
    const custOrders = allOrders.filter(
      (o) => o.customerEmail.trim().toLowerCase() === email
    );

    cust.totalOrders = custOrders.length;

    // Filter valid orders for revenue calculation (exclude Cancelled and Failed)
    const validOrders = custOrders.filter(
      (o) => o.orderStatus !== 'Cancelled' && o.paymentStatus !== 'Failed'
    );

    cust.totalSpent = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    cust.avgOrderValue = validOrders.length > 0 ? Math.round(cust.totalSpent / validOrders.length) : 0;
    cust.cancelledOrdersCount = custOrders.filter((o) => o.orderStatus === 'Cancelled').length;
    cust.deliveredOrdersCount = custOrders.filter((o) => o.orderStatus === 'Delivered').length;

    if (custOrders.length > 0) {
      // Sort orders chronologically
      const sortedByDate = [...custOrders].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      cust.firstOrderDate = sortedByDate[0].createdAt;
      cust.lastOrderDate = sortedByDate[sortedByDate.length - 1].createdAt;

      // Update joined date if first order was earlier
      if (new Date(cust.firstOrderDate) < new Date(cust.joinedDate)) {
        cust.joinedDate = cust.firstOrderDate;
      }
    }

    // E. Populate customer addresses (from DB user_addresses, order shipping addresses & LocalStorage)
    const addressesList: AdminCustomerAddress[] = [];

    // Check DB addresses
    const userDbAddresses = dbAddresses.filter(
      (a) => (a.user_email || '').trim().toLowerCase() === email
    );
    for (const dba of userDbAddresses) {
      const fullAddr = `${dba.house_flat || ''} ${dba.street || ''} ${dba.area || ''}, ${dba.city}, ${dba.state} ${dba.pincode}`.trim();
      addressesList.push({
        id: dba.id,
        fullName: dba.full_name,
        phone: dba.phone,
        houseFlat: dba.house_flat,
        street: dba.street,
        area: dba.area,
        city: dba.city,
        state: dba.state,
        pincode: dba.pincode,
        country: dba.country || 'India',
        address: fullAddr,
        isDefault: dba.is_default,
      });
    }

    // Check LocalStorage addresses
    const localAddrs = getCustomerAddresses(email);
    for (const la of localAddrs) {
      const fullAddr = `${la.houseFlat || ''} ${la.street || ''} ${la.area || ''}, ${la.city}, ${la.state} ${la.pincode}`.trim();
      if (!addressesList.some((existing) => existing.address === fullAddr)) {
        addressesList.push({
          id: la.id,
          fullName: la.fullName,
          phone: la.phone,
          houseFlat: la.houseFlat,
          street: la.street,
          area: la.area,
          city: la.city,
          state: la.state,
          pincode: la.pincode,
          country: la.country || 'India',
          address: fullAddr,
          isDefault: la.isDefault,
        });
      }
    }

    // Check Order shipping addresses if no saved address exists
    for (const ord of custOrders) {
      if (ord.shippingAddress) {
        const fullAddr = `${ord.shippingAddress.street}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state} ${ord.shippingAddress.pincode}, ${ord.shippingAddress.country}`.trim();
        if (fullAddr && !addressesList.some((existing) => existing.address === fullAddr)) {
          addressesList.push({
            fullName: ord.customerName,
            phone: ord.customerPhone,
            street: ord.shippingAddress.street,
            city: ord.shippingAddress.city,
            state: ord.shippingAddress.state,
            pincode: ord.shippingAddress.pincode,
            country: ord.shippingAddress.country || 'India',
            address: fullAddr,
            isDefault: addressesList.length === 0,
          });
        }
      }
    }

    cust.addresses = addressesList;
  }

  const allCustomersArray = Array.from(customerMap.values());

  // 5. Compute Global Dashboard Statistics
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dashboardStats = {
    totalCustomers: allCustomersArray.length,
    newCustomers: allCustomersArray.filter(
      (c) => new Date(c.joinedDate) >= thirtyDaysAgo
    ).length,
    activeCustomers: allCustomersArray.filter((c) => c.status === 'Active').length,
    customersWithOrders: allCustomersArray.filter((c) => c.totalOrders > 0).length,
    totalCustomerRevenue: allCustomersArray.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  // 6. Apply Search and Filters
  let filtered = [...allCustomersArray];

  // A. Search Filter (Name, Email, Phone, Customer ID)
  if (searchTerm && searchTerm.trim() !== '') {
    const q = searchTerm.trim().toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }

  // B. Account Status Filter (All, Active, Inactive)
  if (statusFilter && statusFilter !== 'All') {
    filtered = filtered.filter((c) => c.status === statusFilter);
  }

  // C. Customer Type Filter (All, New, Returning)
  if (customerTypeFilter === 'New') {
    filtered = filtered.filter((c) => new Date(c.joinedDate) >= thirtyDaysAgo);
  } else if (customerTypeFilter === 'Returning') {
    filtered = filtered.filter((c) => c.totalOrders > 1);
  }

  // D. Order Activity Filter (All, Never Ordered, Has Orders)
  if (orderActivityFilter === 'Never Ordered') {
    filtered = filtered.filter((c) => c.totalOrders === 0);
  } else if (orderActivityFilter === 'Has Orders') {
    filtered = filtered.filter((c) => c.totalOrders > 0);
  }

  // E. Date Joined Filter (Today, Last 7 Days, Last 30 Days, Custom Range)
  if (dateJoinedFilter === 'Today') {
    const todayStr = now.toISOString().split('T')[0];
    filtered = filtered.filter((c) => c.joinedDate.startsWith(todayStr));
  } else if (dateJoinedFilter === 'Last 7 Days') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((c) => new Date(c.joinedDate) >= sevenDaysAgo);
  } else if (dateJoinedFilter === 'Last 30 Days') {
    filtered = filtered.filter((c) => new Date(c.joinedDate) >= thirtyDaysAgo);
  } else if (dateJoinedFilter === 'Custom Range' && (startDate || endDate)) {
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((c) => new Date(c.joinedDate) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((c) => new Date(c.joinedDate) <= end);
    }
  }

  // 7. Apply Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'most_orders') {
      return b.totalOrders - a.totalOrders;
    }
    if (sortBy === 'highest_spending') {
      return b.totalSpent - a.totalSpent;
    }
    if (sortBy === 'most_recent_order') {
      const dateA = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
      const dateB = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

  // 8. Server-side / Client Pagination
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedCustomers = filtered.slice(startIndex, startIndex + pageSize);

  return {
    customers: paginatedCustomers,
    totalCount,
    page: validPage,
    pageSize,
    totalPages,
    dashboardStats,
  };
};

/**
 * Activate or Deactivate Customer Account in Database & Auth state
 */
export const updateCustomerStatusInDb = async (
  email: string,
  newStatus: 'Active' | 'Inactive'
): Promise<{ success: boolean; errorMessage?: string }> => {
  if (!email) return { success: false, errorMessage: 'Invalid customer email.' };
  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Update in Supabase Profiles table if configured
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({ email: cleanEmail, status: newStatus, updated_at: new Date().toISOString() }, { onConflict: 'email' });
        if (error) {
          console.warn('Supabase profile status update error:', error.message);
        }
      } catch (sbErr) {
        console.warn('Supabase exception updating customer status:', sbErr);
      }
    }

    // 2. Update in LocalStorage registered users
    if (typeof window !== 'undefined') {
      try {
        const savedReg = localStorage.getItem('MAHESHRAJ_registered_users');
        if (savedReg) {
          let regUsers: any[] = JSON.parse(savedReg);
          regUsers = regUsers.map((u) =>
            u.email?.toLowerCase() === cleanEmail ? { ...u, status: newStatus } : u
          );
          localStorage.setItem('MAHESHRAJ_registered_users', JSON.stringify(regUsers));
        }

        const savedUser = localStorage.getItem('MAHESHRAJ_user');
        if (savedUser) {
          const single = JSON.parse(savedUser);
          if (single.email?.toLowerCase() === cleanEmail) {
            single.status = newStatus;
            localStorage.setItem('MAHESHRAJ_user', JSON.stringify(single));
          }
        }
      } catch {}
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, errorMessage: err.message || 'Failed to update customer account status.' };
  }
};

/**
 * Subscribe to Supabase Realtime updates on profiles, orders, and addresses
 */
export const subscribeToCustomersRealtime = (onCustomerChange: () => void) => {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const channel = supabase
      .channel('public:customers_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        onCustomerChange();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        onCustomerChange();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_addresses' }, () => {
        onCustomerChange();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Customers realtime subscription error:', err);
    return () => {};
  }
};

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
  eventType: string; // e.g. 'CREATED', 'STATUS_CHANGED', 'NOTE_ADDED', 'ASSIGNED', 'QUOTATION_UPDATED', 'CONVERTED', 'ARCHIVED'
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

export interface StaffMember {
  id: string;
  name: string;
  role: string;
}

export const STAFF_MEMBERS: StaffMember[] = [
  { id: 'staff-1', name: 'Rajesh Kumar', role: 'Corporate Sales Lead' },
  { id: 'staff-2', name: 'Meera Nair', role: 'Senior Concierge' },
  { id: 'staff-3', name: 'Vikramaditya Sharma', role: 'Gifting Director' },
  { id: 'admin-1', name: 'Maharaj Executive', role: 'Super Admin' },
];

export interface CorporateEnquiry {
  id: string;
  enquiryNumber: string; // e.g. ENQ-1024
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
}

export interface EnquiryFilterParams {
  status?: string; // 'All', 'New', 'Contacted', 'In Discussion', 'Quotation Sent', 'Converted', 'Closed', 'Rejected', 'Archived'
  dateFilter?: string; // 'All', 'Today', 'Last 7 days', 'Last 30 days', 'Custom'
  startDate?: string;
  endDate?: string;
  budgetFilter?: string; // 'All', 'Under ₹25,000', '₹25,000–₹50,000', '₹50,000–₹1,00,000', '₹1,00,000+'
  quantityFilter?: string; // 'All', 'Under 25', '25–50', '50–100', '100+'
  searchTerm?: string; // Search by Enquiry ID, Company name, Contact person, Email, Phone
  page?: number;
  pageSize?: number;
  showArchived?: boolean;
}

export interface FetchEnquiriesResult {
  enquiries: CorporateEnquiry[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  dashboardStats: {
    totalEnquiries: number;
    newEnquiries: number;
    contactedEnquiries: number;
    inDiscussionEnquiries: number;
    quotationSentEnquiries: number;
    convertedEnquiries: number;
    closedEnquiries: number;
  };
}

const STORAGE_KEY = 'maharaj_corporate_enquiries_v2';
const STORAGE_EVENTS_KEY = 'maharaj_corporate_enquiry_events_v2';

/**
 * Initial seed enquiries (empty by default to eliminate hardcoded enquiries)
 */
const INITIAL_SEED_ENQUIRIES: CorporateEnquiry[] = [];

/**
 * Get stored local state
 */
const getStoredEnquiries = (): CorporateEnquiry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Save state locally
 */
const saveStoredEnquiries = (enquiries: CorporateEnquiry[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
  } catch (e) {
    console.error('Failed to save corporate enquiries to localStorage', e);
  }
};

/**
 * Map DB row from Supabase to CorporateEnquiry
 */
export const dbRowToCorporateEnquiry = (row: any, events: CorporateEnquiryEvent[] = []): CorporateEnquiry => {
  return {
    id: row.id,
    enquiryNumber: row.enquiry_number || `ENQ-${row.id.slice(0, 4)}`,
    companyName: row.company_name || 'N/A',
    contactName: row.contact_name || 'N/A',
    designation: row.designation || undefined,
    email: row.email || '',
    phone: row.phone || '',
    companyType: row.company_type || undefined,
    website: row.website || undefined,
    quantity: Number(row.quantity || 1),
    quantityRange: row.quantity_range || `${row.quantity || 1} Gifts`,
    budget: row.budget || 'Custom',
    giftType: row.gift_type || undefined,
    occasion: row.occasion || undefined,
    preferredDeliveryDate: row.preferred_delivery_date || undefined,
    customizationRequired: row.customization_required || undefined,
    packagingRequired: row.packaging_required || undefined,
    brandingRequired: row.branding_required || undefined,
    message: row.message || undefined,
    status: (row.status as CorporateEnquiryStatus) || 'New',
    assignedTo: row.assigned_to || null,
    assignedToName: row.assigned_to_name || null,
    quotation: row.quotation_amount ? {
      amount: Number(row.quotation_amount),
      quotationDate: row.quotation_date || undefined,
      validUntil: row.quotation_valid_until || undefined,
      notes: row.quotation_notes || undefined,
      quotationRef: row.quotation_ref || undefined,
    } : undefined,
    internalNotes: row.internal_notes || undefined,
    isArchived: !!row.is_archived,
    convertedOrderId: row.converted_order_id || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    events: events || [],
  };
};

/**
 * Fetch enquiries from Database / LocalStorage with full filtering, searching, sorting, and pagination
 */
export const fetchCorporateEnquiriesFromDb = async (
  params: EnquiryFilterParams = {}
): Promise<FetchEnquiriesResult> => {
  const {
    status = 'All',
    dateFilter = 'All',
    startDate,
    endDate,
    budgetFilter = 'All',
    quantityFilter = 'All',
    searchTerm = '',
    page = 1,
    pageSize = 10,
    showArchived = false,
  } = params;

  let allEnquiries: CorporateEnquiry[] = [];
  let isFromSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('corporate_gifting_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Fetch events if available
        const { data: eventsData } = await supabase
          .from('corporate_gifting_enquiry_events')
          .select('*')
          .order('created_at', { ascending: true });

        const eventsMap: Record<string, CorporateEnquiryEvent[]> = {};
        if (eventsData) {
          eventsData.forEach((ev: any) => {
            if (!eventsMap[ev.enquiry_id]) eventsMap[ev.enquiry_id] = [];
            eventsMap[ev.enquiry_id].push({
              id: ev.id,
              enquiryId: ev.enquiry_id,
              eventType: ev.event_type,
              oldStatus: ev.old_status,
              newStatus: ev.new_status,
              message: ev.message,
              createdBy: ev.created_by || 'Admin',
              createdAt: ev.created_at,
            });
          });
        }

        allEnquiries = data.map((row) => dbRowToCorporateEnquiry(row, eventsMap[row.id] || []));
        isFromSupabase = true;
      }
    } catch (err) {
      console.warn('Supabase corporate enquiries fetch error, using local persistence engine:', err);
    }
  }

  if (!isFromSupabase || allEnquiries.length === 0) {
    allEnquiries = getStoredEnquiries();
  }

  // Calculate Real Global Dashboard Statistics (excluding archived)
  const activeEnquiries = allEnquiries.filter((e) => !e.isArchived);
  const dashboardStats = {
    totalEnquiries: activeEnquiries.length,
    newEnquiries: activeEnquiries.filter((e) => e.status === 'New').length,
    contactedEnquiries: activeEnquiries.filter((e) => e.status === 'Contacted').length,
    inDiscussionEnquiries: activeEnquiries.filter((e) => e.status === 'In Discussion').length,
    quotationSentEnquiries: activeEnquiries.filter((e) => e.status === 'Quotation Sent').length,
    convertedEnquiries: activeEnquiries.filter((e) => e.status === 'Converted').length,
    closedEnquiries: activeEnquiries.filter((e) => e.status === 'Closed').length,
  };

  // APPLY FILTERS
  let filtered = [...allEnquiries];

  // 0. Archive filter
  if (!showArchived && status !== 'Archived') {
    filtered = filtered.filter((e) => !e.isArchived);
  } else if (status === 'Archived') {
    filtered = filtered.filter((e) => e.isArchived);
  }

  // 1. Status Filter
  if (status && status !== 'All' && status !== 'Archived') {
    filtered = filtered.filter((e) => e.status === status);
  }

  // 2. Budget Filter
  if (budgetFilter && budgetFilter !== 'All') {
    if (budgetFilter === 'Under ₹25,000') {
      filtered = filtered.filter((e) => e.budget.toLowerCase().includes('under') || e.budget.includes('25,000'));
    } else if (budgetFilter === '₹25,000–₹50,000') {
      filtered = filtered.filter((e) => e.budget.includes('25,000') && e.budget.includes('50,000'));
    } else if (budgetFilter === '₹50,000–₹1,00,000') {
      filtered = filtered.filter((e) => e.budget.includes('50,000') && e.budget.includes('1,00,000'));
    } else if (budgetFilter === '₹1,00,000+') {
      filtered = filtered.filter((e) => e.budget.includes('1,00,000') || e.budget.includes('+'));
    }
  }

  // 3. Quantity Filter
  if (quantityFilter && quantityFilter !== 'All') {
    if (quantityFilter === 'Under 25') {
      filtered = filtered.filter((e) => e.quantity < 25);
    } else if (quantityFilter === '25–50') {
      filtered = filtered.filter((e) => e.quantity >= 25 && e.quantity <= 50);
    } else if (quantityFilter === '50–100') {
      filtered = filtered.filter((e) => e.quantity > 50 && e.quantity <= 100);
    } else if (quantityFilter === '100+') {
      filtered = filtered.filter((e) => e.quantity > 100);
    }
  }

  // 4. Search Filter (Enquiry ID, Company name, Contact person, Email, Phone)
  if (searchTerm && searchTerm.trim() !== '') {
    const term = searchTerm.trim().toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.enquiryNumber.toLowerCase().includes(term) ||
        e.companyName.toLowerCase().includes(term) ||
        e.contactName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.phone.toLowerCase().includes(term)
    );
  }

  // 5. Date Filter
  const now = new Date();
  if (dateFilter === 'Today') {
    const todayStr = now.toISOString().split('T')[0];
    filtered = filtered.filter((e) => e.createdAt.startsWith(todayStr));
  } else if (dateFilter === 'Last 7 days') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((e) => new Date(e.createdAt) >= sevenDaysAgo);
  } else if (dateFilter === 'Last 30 days') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((e) => new Date(e.createdAt) >= thirtyDaysAgo);
  } else if (dateFilter === 'Custom' && (startDate || endDate)) {
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((e) => new Date(e.createdAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((e) => new Date(e.createdAt) <= end);
    }
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // PAGINATION
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedEnquiries = filtered.slice(startIndex, startIndex + pageSize);

  return {
    enquiries: paginatedEnquiries,
    totalCount,
    page: validPage,
    pageSize,
    totalPages,
    dashboardStats,
  };
};

/**
 * Submit New Corporate Enquiry from Customer Form
 */
export const submitCorporateEnquiryInDb = async (input: {
  companyName: string;
  contactName: string;
  designation?: string;
  email: string;
  phone: string;
  companyType?: string;
  website?: string;
  quantity?: number | string;
  budget?: string;
  giftType?: string;
  occasion?: string;
  preferredDeliveryDate?: string;
  customizationRequired?: string;
  packagingRequired?: string;
  brandingRequired?: string;
  message?: string;
}): Promise<{ success: boolean; enquiry: CorporateEnquiry; errorMessage?: string }> => {
  const currentEnquiries = getStoredEnquiries();
  const count = currentEnquiries.length + 1025;
  const enquiryNumber = `ENQ-${count}`;
  const id = `enq-${Date.now()}`;
  const now = new Date().toISOString();

  let parsedQty = 1;
  if (typeof input.quantity === 'number') {
    parsedQty = input.quantity;
  } else if (typeof input.quantity === 'string') {
    const matched = input.quantity.match(/\d+/);
    if (matched) parsedQty = parseInt(matched[0], 10);
  }

  const initialEvent: CorporateEnquiryEvent = {
    id: `ev-${id}-1`,
    enquiryId: id,
    eventType: 'CREATED',
    newStatus: 'New',
    message: `New Corporate Gifting Enquiry received for ${parsedQty} gifts (${input.occasion || 'General'})`,
    createdBy: `Customer (${input.contactName})`,
    createdAt: now,
  };

  const newEnquiry: CorporateEnquiry = {
    id,
    enquiryNumber,
    companyName: input.companyName,
    contactName: input.contactName,
    designation: input.designation || undefined,
    email: input.email,
    phone: input.phone,
    companyType: input.companyType || undefined,
    website: input.website || undefined,
    quantity: parsedQty,
    quantityRange: typeof input.quantity === 'string' ? input.quantity : `${parsedQty} Gifts`,
    budget: input.budget || '₹50,000–₹1,00,000',
    giftType: input.giftType || undefined,
    occasion: input.occasion || undefined,
    preferredDeliveryDate: input.preferredDeliveryDate || undefined,
    customizationRequired: input.customizationRequired || undefined,
    packagingRequired: input.packagingRequired || undefined,
    brandingRequired: input.brandingRequired || undefined,
    message: input.message || undefined,
    status: 'New',
    assignedTo: null,
    assignedToName: null,
    internalNotes: 'New unassigned corporate enquiry submitted online.',
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    events: [initialEvent],
  };

  // Try Supabase insert
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('corporate_gifting_enquiries').insert([
        {
          enquiry_number: enquiryNumber,
          company_name: input.companyName,
          contact_name: input.contactName,
          designation: input.designation || null,
          email: input.email,
          phone: input.phone,
          company_type: input.companyType || null,
          website: input.website || null,
          quantity: parsedQty,
          quantity_range: typeof input.quantity === 'string' ? input.quantity : `${parsedQty} Gifts`,
          budget: input.budget || '₹50,000–₹1,00,000',
          gift_type: input.giftType || null,
          occasion: input.occasion || null,
          preferred_delivery_date: input.preferredDeliveryDate || null,
          customization_required: input.customizationRequired || null,
          packaging_required: input.packagingRequired || null,
          branding_required: input.brandingRequired || null,
          message: input.message || null,
          status: 'New',
          created_at: now,
          updated_at: now,
        },
      ]).select();

      if (!error && data && data[0]) {
        newEnquiry.id = data[0].id;
        initialEvent.enquiryId = data[0].id;

        // Insert event
        await supabase.from('corporate_gifting_enquiry_events').insert([
          {
            enquiry_id: data[0].id,
            event_type: 'CREATED',
            new_status: 'New',
            message: initialEvent.message,
            created_by: initialEvent.createdBy,
            created_at: now,
          },
        ]);
      }
    } catch (dbErr) {
      console.warn('Supabase corporate enquiry insert fallback to local:', dbErr);
    }
  }

  // Update local storage
  const updatedList = [newEnquiry, ...currentEnquiries];
  saveStoredEnquiries(updatedList);

  return { success: true, enquiry: newEnquiry };
};

/**
 * Update Enquiry Status & Log Timeline Event
 */
export const updateEnquiryStatusInDb = async (
  enquiryId: string,
  newStatus: CorporateEnquiryStatus,
  note?: string,
  updatedBy: string = 'Admin'
): Promise<{ success: boolean; enquiry?: CorporateEnquiry; errorMessage?: string }> => {
  const currentEnquiries = getStoredEnquiries();
  const existing = currentEnquiries.find((e) => e.id === enquiryId || e.enquiryNumber === enquiryId);

  if (!existing) {
    return { success: false, errorMessage: 'Enquiry not found.' };
  }

  const oldStatus = existing.status;
  const now = new Date().toISOString();

  const newEvent: CorporateEnquiryEvent = {
    id: `ev-${Date.now()}`,
    enquiryId: existing.id,
    eventType: 'STATUS_CHANGED',
    oldStatus,
    newStatus,
    message: note || `Status changed from ${oldStatus} to ${newStatus}`,
    createdBy: updatedBy,
    createdAt: now,
  };

  const updatedEvents = [...(existing.events || []), newEvent];
  const updatedEnquiry: CorporateEnquiry = {
    ...existing,
    status: newStatus,
    updatedAt: now,
    events: updatedEvents,
    internalNotes: note !== undefined ? note : existing.internalNotes,
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('corporate_gifting_enquiries')
        .update({
          status: newStatus,
          updated_at: now,
        })
        .eq('id', existing.id);

      await supabase.from('corporate_gifting_enquiry_events').insert([
        {
          enquiry_id: existing.id,
          event_type: 'STATUS_CHANGED',
          old_status: oldStatus,
          new_status: newStatus,
          message: newEvent.message,
          created_by: updatedBy,
          created_at: now,
        },
      ]);
    } catch (dbErr) {
      console.warn('Supabase enquiry status update error:', dbErr);
    }
  }

  const updatedList = currentEnquiries.map((e) => (e.id === existing.id ? updatedEnquiry : e));
  saveStoredEnquiries(updatedList);

  return { success: true, enquiry: updatedEnquiry };
};

/**
 * Update Internal Admin Note
 */
export const addEnquiryInternalNoteInDb = async (
  enquiryId: string,
  internalNotes: string,
  updatedBy: string = 'Admin'
): Promise<{ success: boolean; enquiry?: CorporateEnquiry; errorMessage?: string }> => {
  const currentEnquiries = getStoredEnquiries();
  const existing = currentEnquiries.find((e) => e.id === enquiryId || e.enquiryNumber === enquiryId);

  if (!existing) return { success: false, errorMessage: 'Enquiry not found.' };

  const now = new Date().toISOString();
  const newEvent: CorporateEnquiryEvent = {
    id: `ev-${Date.now()}`,
    enquiryId: existing.id,
    eventType: 'NOTE_ADDED',
    message: `Internal Note Added: "${internalNotes.length > 50 ? internalNotes.substring(0, 50) + '...' : internalNotes}"`,
    createdBy: updatedBy,
    createdAt: now,
  };

  const updatedEnquiry: CorporateEnquiry = {
    ...existing,
    internalNotes,
    updatedAt: now,
    events: [...(existing.events || []), newEvent],
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('corporate_gifting_enquiries')
        .update({
          updated_at: now,
        })
        .eq('id', existing.id);

      await supabase.from('corporate_gifting_enquiry_events').insert([
        {
          enquiry_id: existing.id,
          event_type: 'NOTE_ADDED',
          message: newEvent.message,
          created_by: updatedBy,
          created_at: now,
        },
      ]);
    } catch (e) {}
  }

  const updatedList = currentEnquiries.map((e) => (e.id === existing.id ? updatedEnquiry : e));
  saveStoredEnquiries(updatedList);

  return { success: true, enquiry: updatedEnquiry };
};

/**
 * Assign Staff Member to Enquiry
 */
export const assignStaffToEnquiryInDb = async (
  enquiryId: string,
  staffId: string | null,
  updatedBy: string = 'Admin'
): Promise<{ success: boolean; enquiry?: CorporateEnquiry; errorMessage?: string }> => {
  const currentEnquiries = getStoredEnquiries();
  const existing = currentEnquiries.find((e) => e.id === enquiryId || e.enquiryNumber === enquiryId);

  if (!existing) return { success: false, errorMessage: 'Enquiry not found.' };

  const staff = STAFF_MEMBERS.find((s) => s.id === staffId);
  const assignedToName = staff ? `${staff.name} (${staff.role})` : null;
  const now = new Date().toISOString();

  const msg = staff
    ? `Enquiry assigned to ${staff.name} (${staff.role})`
    : `Enquiry unassigned`;

  const newEvent: CorporateEnquiryEvent = {
    id: `ev-${Date.now()}`,
    enquiryId: existing.id,
    eventType: 'ASSIGNED',
    message: msg,
    createdBy: updatedBy,
    createdAt: now,
  };

  const updatedEnquiry: CorporateEnquiry = {
    ...existing,
    assignedTo: staffId,
    assignedToName,
    updatedAt: now,
    events: [...(existing.events || []), newEvent],
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('corporate_gifting_enquiries')
        .update({
          assigned_to: staffId,
          assigned_to_name: assignedToName,
          updated_at: now,
        })
        .eq('id', existing.id);

      await supabase.from('corporate_gifting_enquiry_events').insert([
        {
          enquiry_id: existing.id,
          event_type: 'ASSIGNED',
          message: msg,
          created_by: updatedBy,
          created_at: now,
        },
      ]);
    } catch (e) {}
  }

  const updatedList = currentEnquiries.map((e) => (e.id === existing.id ? updatedEnquiry : e));
  saveStoredEnquiries(updatedList);

  return { success: true, enquiry: updatedEnquiry };
};

/**
 * Record Quotation Details for Enquiry
 */
export const recordQuotationInDb = async (
  enquiryId: string,
  quotation: QuotationDetails,
  updatedBy: string = 'Admin'
): Promise<{ success: boolean; enquiry?: CorporateEnquiry; errorMessage?: string }> => {
  const currentEnquiries = getStoredEnquiries();
  const existing = currentEnquiries.find((e) => e.id === enquiryId || e.enquiryNumber === enquiryId);

  if (!existing) return { success: false, errorMessage: 'Enquiry not found.' };

  const now = new Date().toISOString();
  const ref = quotation.quotationRef || `QT-${Date.now().toString().slice(-4)}`;
  const fullQuotation: QuotationDetails = {
    ...quotation,
    quotationRef: ref,
    quotationDate: quotation.quotationDate || now,
  };

  const oldStatus = existing.status;
  const newStatus: CorporateEnquiryStatus = 'Quotation Sent';

  const newEvent: CorporateEnquiryEvent = {
    id: `ev-${Date.now()}`,
    enquiryId: existing.id,
    eventType: 'QUOTATION_UPDATED',
    oldStatus,
    newStatus,
    message: `Recorded Quotation #${ref} for ₹${(quotation.amount || 0).toLocaleString('en-IN')}`,
    createdBy: updatedBy,
    createdAt: now,
  };

  const updatedEnquiry: CorporateEnquiry = {
    ...existing,
    status: newStatus,
    quotation: fullQuotation,
    updatedAt: now,
    events: [...(existing.events || []), newEvent],
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('corporate_gifting_enquiries')
        .update({
          status: newStatus,
          quotation_amount: quotation.amount,
          quotation_date: fullQuotation.quotationDate,
          quotation_valid_until: quotation.validUntil || null,
          quotation_notes: quotation.notes || null,
          quotation_ref: ref,
          updated_at: now,
        })
        .eq('id', existing.id);

      await supabase.from('corporate_gifting_enquiry_events').insert([
        {
          enquiry_id: existing.id,
          event_type: 'QUOTATION_UPDATED',
          old_status: oldStatus,
          new_status: newStatus,
          message: newEvent.message,
          created_by: updatedBy,
          created_at: now,
        },
      ]);
    } catch (e) {}
  }

  const updatedList = currentEnquiries.map((e) => (e.id === existing.id ? updatedEnquiry : e));
  saveStoredEnquiries(updatedList);

  return { success: true, enquiry: updatedEnquiry };
};

/**
 * Convert Enquiry into Confirmed Order
 */
export const convertEnquiryInDb = async (
  enquiryId: string,
  updatedBy: string = 'Admin'
): Promise<{ success: boolean; enquiry?: CorporateEnquiry; orderId?: string; errorMessage?: string }> => {
  const currentEnquiries = getStoredEnquiries();
  const existing = currentEnquiries.find((e) => e.id === enquiryId || e.enquiryNumber === enquiryId);

  if (!existing) return { success: false, errorMessage: 'Enquiry not found.' };

  const now = new Date().toISOString();
  const orderId = `CORP-ORD-${Math.floor(100 + Math.random() * 900)}`;

  const oldStatus = existing.status;
  const newStatus: CorporateEnquiryStatus = 'Converted';

  const newEvent: CorporateEnquiryEvent = {
    id: `ev-${Date.now()}`,
    enquiryId: existing.id,
    eventType: 'CONVERTED',
    oldStatus,
    newStatus,
    message: `Enquiry converted to active Corporate Order #${orderId}`,
    createdBy: updatedBy,
    createdAt: now,
  };

  const updatedEnquiry: CorporateEnquiry = {
    ...existing,
    status: newStatus,
    convertedOrderId: orderId,
    updatedAt: now,
    events: [...(existing.events || []), newEvent],
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('corporate_gifting_enquiries')
        .update({
          status: newStatus,
          converted_order_id: orderId,
          updated_at: now,
        })
        .eq('id', existing.id);

      await supabase.from('corporate_gifting_enquiry_events').insert([
        {
          enquiry_id: existing.id,
          event_type: 'CONVERTED',
          old_status: oldStatus,
          new_status: newStatus,
          message: newEvent.message,
          created_by: updatedBy,
          created_at: now,
        },
      ]);
    } catch (e) {}
  }

  const updatedList = currentEnquiries.map((e) => (e.id === existing.id ? updatedEnquiry : e));
  saveStoredEnquiries(updatedList);

  return { success: true, enquiry: updatedEnquiry, orderId };
};

/**
 * Soft Archive Enquiry
 */
export const archiveEnquiryInDb = async (
  enquiryId: string,
  updatedBy: string = 'Admin'
): Promise<{ success: boolean; errorMessage?: string }> => {
  const currentEnquiries = getStoredEnquiries();
  const existing = currentEnquiries.find((e) => e.id === enquiryId || e.enquiryNumber === enquiryId);

  if (!existing) return { success: false, errorMessage: 'Enquiry not found.' };

  const now = new Date().toISOString();
  const newEvent: CorporateEnquiryEvent = {
    id: `ev-${Date.now()}`,
    enquiryId: existing.id,
    eventType: 'ARCHIVED',
    message: `Enquiry moved to archive`,
    createdBy: updatedBy,
    createdAt: now,
  };

  const updatedEnquiry: CorporateEnquiry = {
    ...existing,
    isArchived: true,
    updatedAt: now,
    events: [...(existing.events || []), newEvent],
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('corporate_gifting_enquiries')
        .update({ is_archived: true, updated_at: now })
        .eq('id', existing.id);
    } catch (e) {}
  }

  const updatedList = currentEnquiries.map((e) => (e.id === existing.id ? updatedEnquiry : e));
  saveStoredEnquiries(updatedList);

  return { success: true };
};

/**
 * Permanent Delete Enquiry (Authorized Admin only)
 */
export const deleteEnquiryPermanentlyFromDb = async (
  enquiryId: string
): Promise<{ success: boolean; errorMessage?: string }> => {
  const currentEnquiries = getStoredEnquiries();
  const existing = currentEnquiries.find((e) => e.id === enquiryId || e.enquiryNumber === enquiryId);

  if (!existing) return { success: false, errorMessage: 'Enquiry not found.' };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('corporate_gifting_enquiries').delete().eq('id', existing.id);
    } catch (e) {}
  }

  const updatedList = currentEnquiries.filter((e) => e.id !== existing.id);
  saveStoredEnquiries(updatedList);

  return { success: true };
};

/**
 * Export Enquiries to CSV
 */
export const exportEnquiriesToCSV = (enquiries: CorporateEnquiry[]) => {
  const headers = [
    'Enquiry ID',
    'Company Name',
    'Contact Person',
    'Designation',
    'Email',
    'Phone',
    'Quantity',
    'Budget',
    'Status',
    'Assigned To',
    'Occasion',
    'Submitted Date',
  ];

  const rows = enquiries.map((e) => [
    `"${e.enquiryNumber}"`,
    `"${e.companyName.replace(/"/g, '""')}"`,
    `"${e.contactName.replace(/"/g, '""')}"`,
    `"${(e.designation || '').replace(/"/g, '""')}"`,
    `"${e.email}"`,
    `"${e.phone}"`,
    e.quantity,
    `"${e.budget.replace(/"/g, '""')}"`,
    `"${e.status}"`,
    `"${(e.assignedToName || 'Unassigned').replace(/"/g, '""')}"`,
    `"${(e.occasion || '').replace(/"/g, '""')}"`,
    `"${e.createdAt.split('T')[0]}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `corporate_gifting_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

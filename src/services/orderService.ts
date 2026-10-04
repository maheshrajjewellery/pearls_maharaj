import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AdminOrder, OrderItem, OrderStatus, PaymentStatus } from '@/types/admin';
import { updateProductInDb } from './productService';

export interface OrderFilterParams {
  orderStatus?: string; // 'All' or specific status
  paymentStatus?: string; // 'All' or specific payment status
  paymentMethod?: string; // 'All' or specific method
  dateFilter?: string; // 'All', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Custom'
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sortBy?: 'newest' | 'oldest' | 'highest_amount' | 'lowest_amount' | 'customer_name' | 'status';
  page?: number;
  pageSize?: number;
}

export interface FetchOrdersResult {
  orders: AdminOrder[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  dashboardStats: {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  };
}

const STATUS_RANK: Record<OrderStatus, number> = {
  Pending: 0,
  Confirmed: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: 99,
};

/**
 * Check if a status transition is allowed
 */
export const isValidStatusTransition = (
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  allowAdminOverride: boolean = false
): { allowed: boolean; reason?: string } => {
  if (currentStatus === targetStatus) {
    return { allowed: true };
  }

  // 1. Prevent moving Delivered orders backward to active statuses
  if (currentStatus === 'Delivered' && targetStatus !== 'Delivered' && !allowAdminOverride) {
    return {
      allowed: false,
      reason: 'Delivered orders cannot be moved back to active processing status.',
    };
  }

  // 2. Prevent moving Cancelled orders back to active statuses without explicit recovery
  if (currentStatus === 'Cancelled' && targetStatus !== 'Cancelled' && !allowAdminOverride) {
    return {
      allowed: false,
      reason: 'Cancelled orders cannot be moved back without explicit admin recovery confirmation.',
    };
  }

  // 3. Allow cancellation from any active status
  if (targetStatus === 'Cancelled') {
    return { allowed: true };
  }

  // 4. Prevent backward status transitions (e.g. Shipped -> Confirmed)
  const currentRank = STATUS_RANK[currentStatus] ?? 0;
  const targetRank = STATUS_RANK[targetStatus] ?? 0;

  if (targetRank < currentRank && !allowAdminOverride) {
    return {
      allowed: false,
      reason: `Cannot move order status backwards from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  // Forward status transitions (e.g. Confirmed -> Delivered, Confirmed -> Shipped, Processing -> Delivered) are fully allowed
  return { allowed: true };
};

/**
 * Helper to parse order notes JSON safely
 */
const parseOrderMetaFromNotes = (notesText?: string | null): {
  userNotes: string;
  items: OrderItem[];
  timeline: AdminOrder['timeline'];
  inventoryRestored: boolean;
} => {
  const defaultRes = {
    userNotes: notesText || '',
    items: [],
    timeline: [],
    inventoryRestored: false,
  };

  if (!notesText || typeof notesText !== 'string') {
    return defaultRes;
  }

  try {
    if (notesText.startsWith('{') || notesText.startsWith('[')) {
      const parsed = JSON.parse(notesText);
      return {
        userNotes: parsed.userNotes || parsed.notes || '',
        items: Array.isArray(parsed.items) ? parsed.items : [],
        timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
        inventoryRestored: !!parsed.inventoryRestored,
      };
    }
  } catch {}

  return defaultRes;
};

/**
 * Serialize metadata back to notes field
 */
const serializeOrderMetaToNotes = (
  userNotes: string,
  items: OrderItem[],
  timeline: AdminOrder['timeline'],
  inventoryRestored: boolean
): string => {
  return JSON.stringify({
    userNotes: userNotes || '',
    items: items || [],
    timeline: timeline || [],
    inventoryRestored: !!inventoryRestored,
  });
};

/**
 * Convert DB row from Supabase to AdminOrder object
 */
export const dbRowToAdminOrder = (row: any): AdminOrder => {
  const meta = parseOrderMetaFromNotes(row.notes);

  let shippingAddr = {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  };

  if (row.shipping_address) {
    if (typeof row.shipping_address === 'string') {
      try {
        shippingAddr = JSON.parse(row.shipping_address);
      } catch {
        shippingAddr.street = row.shipping_address;
      }
    } else {
      shippingAddr = {
        street: row.shipping_address.street || '',
        city: row.shipping_address.city || '',
        state: row.shipping_address.state || '',
        pincode: row.shipping_address.pincode || '',
        country: row.shipping_address.country || 'India',
      };
    }
  }

  // Construct default timeline if empty
  const createdAt = row.created_at || new Date().toISOString();
  const orderStatus: OrderStatus = (row.order_status as OrderStatus) || 'Confirmed';
  const paymentStatus: PaymentStatus = (row.payment_status as PaymentStatus) || 'Pending';

  let timeline = meta.timeline;
  if (!timeline || timeline.length === 0) {
    timeline = [
      {
        status: 'Pending',
        timestamp: createdAt,
        note: 'Order placed by customer',
      },
    ];
    if (orderStatus !== 'Pending') {
      timeline.push({
        status: orderStatus,
        timestamp: row.updated_at || createdAt,
        note: `Order status confirmed as ${orderStatus}`,
      });
    }
  }

  return {
    id: row.id,
    orderNumber: row.order_number || row.id,
    customerName: row.customer_name || 'Valued Customer',
    customerEmail: (row.customer_email || '').toLowerCase(),
    customerPhone: row.customer_phone || '',
    shippingAddress: shippingAddr,
    items: meta.items,
    subtotal: Number(row.subtotal || 0),
    shippingFee: Number(row.shipping_fee || 0),
    discount: Number(row.discount || 0),
    totalAmount: Number(row.total_amount || 0),
    paymentMethod: row.payment_method || 'Razorpay',
    paymentStatus,
    orderStatus,
    notes: meta.userNotes,
    createdAt,
    updatedAt: row.updated_at || createdAt,
    razorpayPaymentId: row.razorpay_payment_id || undefined,
    razorpayOrderId: row.razorpay_order_id || undefined,
    inventoryRestored: meta.inventoryRestored,
    timeline,
  };
};

/**
 * Fetch orders from database with filters, search, sorting, and server-side pagination
 */
export const fetchOrdersFromDb = async (
  params: OrderFilterParams = {}
): Promise<FetchOrdersResult> => {
  const {
    orderStatus = 'All',
    paymentStatus = 'All',
    paymentMethod = 'All',
    dateFilter = 'All',
    startDate,
    endDate,
    searchTerm = '',
    sortBy = 'newest',
    page = 1,
    pageSize = 10,
  } = params;

  let allOrders: AdminOrder[] = [];

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        allOrders = data.map(dbRowToAdminOrder);
      }
    } catch (err) {
      console.warn('Error fetching orders from Supabase:', err);
    }
  }

  // Combine with LocalStorage orders if available to prevent data loss
  if (typeof window !== 'undefined') {
    try {
      const savedAll = localStorage.getItem('maharaj_all_orders');
      if (savedAll) {
        const localOrders: AdminOrder[] = JSON.parse(savedAll);
        // Merge without duplicates
        for (const lo of localOrders) {
          if (!allOrders.some((o) => o.id === lo.id || o.orderNumber === lo.orderNumber)) {
            allOrders.push(lo);
          }
        }
      }
    } catch {}
  }

  // Calculate Real Global Dashboard Statistics
  const dashboardStats = {
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter((o) => o.orderStatus === 'Pending').length,
    processingOrders: allOrders.filter((o) => o.orderStatus === 'Processing').length,
    shippedOrders: allOrders.filter((o) => o.orderStatus === 'Shipped').length,
    deliveredOrders: allOrders.filter((o) => o.orderStatus === 'Delivered').length,
    cancelledOrders: allOrders.filter((o) => o.orderStatus === 'Cancelled').length,
    totalRevenue: allOrders
      .filter((o) => o.orderStatus !== 'Cancelled' && o.paymentStatus !== 'Failed')
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  // APPLY FILTERS
  let filtered = [...allOrders];

  // 1. Order Status Filter
  if (orderStatus && orderStatus !== 'All') {
    filtered = filtered.filter((o) => o.orderStatus === orderStatus);
  }

  // 2. Payment Status Filter
  if (paymentStatus && paymentStatus !== 'All') {
    filtered = filtered.filter((o) => o.paymentStatus === paymentStatus);
  }

  // 3. Payment Method Filter
  if (paymentMethod && paymentMethod !== 'All') {
    filtered = filtered.filter(
      (o) => o.paymentMethod.toLowerCase() === paymentMethod.toLowerCase()
    );
  }

  // 4. Search Filter (Order ID, Customer Name, Email, Phone)
  if (searchTerm && searchTerm.trim() !== '') {
    const cleanSearch = searchTerm.trim().toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(cleanSearch) ||
        o.id.toLowerCase().includes(cleanSearch) ||
        o.customerName.toLowerCase().includes(cleanSearch) ||
        o.customerEmail.toLowerCase().includes(cleanSearch) ||
        o.customerPhone.toLowerCase().includes(cleanSearch)
    );
  }

  // 5. Date Filter
  const now = new Date();
  if (dateFilter === 'Today') {
    const todayStr = now.toISOString().split('T')[0];
    filtered = filtered.filter((o) => o.createdAt.startsWith(todayStr));
  } else if (dateFilter === 'Yesterday') {
    const yest = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yestStr = yest.toISOString().split('T')[0];
    filtered = filtered.filter((o) => o.createdAt.startsWith(yestStr));
  } else if (dateFilter === 'Last 7 days') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((o) => new Date(o.createdAt) >= sevenDaysAgo);
  } else if (dateFilter === 'Last 30 days') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo);
  } else if (dateFilter === 'Custom' && (startDate || endDate)) {
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((o) => new Date(o.createdAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((o) => new Date(o.createdAt) <= end);
    }
  }

  // 6. APPLY SORTING
  filtered.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'highest_amount') {
      return b.totalAmount - a.totalAmount;
    }
    if (sortBy === 'lowest_amount') {
      return a.totalAmount - b.totalAmount;
    }
    if (sortBy === 'customer_name') {
      return a.customerName.localeCompare(b.customerName);
    }
    if (sortBy === 'status') {
      return a.orderStatus.localeCompare(b.orderStatus);
    }
    return 0;
  });

  // PAGINATION
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedOrders = filtered.slice(startIndex, startIndex + pageSize);

  return {
    orders: paginatedOrders,
    totalCount,
    page: validPage,
    pageSize,
    totalPages,
    dashboardStats,
  };
};

/**
 * Update Order Status in Backend Database & Save Timeline
 */
export const updateOrderStatusInDb = async (
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  allowOverride: boolean = false
): Promise<{ success: boolean; order?: AdminOrder; errorMessage?: string }> => {
  try {
    // 1. Fetch current order
    const { orders } = await fetchOrdersFromDb({ pageSize: 1000 });
    const existing = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

    if (!existing) {
      return { success: false, errorMessage: 'Order not found.' };
    }

    // 2. Validate transition rules
    const transitionCheck = isValidStatusTransition(existing.orderStatus, newStatus, allowOverride);
    if (!transitionCheck.allowed) {
      return { success: false, errorMessage: transitionCheck.reason };
    }

    // 3. Update timeline
    const updatedTimeline = [
      ...existing.timeline,
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Order status updated to ${newStatus}`,
      },
    ];

    const updatedOrder: AdminOrder = {
      ...existing,
      orderStatus: newStatus,
      updatedAt: new Date().toISOString(),
      timeline: updatedTimeline,
    };

    const notesSerialized = serializeOrderMetaToNotes(
      updatedOrder.notes || '',
      updatedOrder.items,
      updatedOrder.timeline,
      !!updatedOrder.inventoryRestored
    );

    // 4. Update in Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('orders')
          .update({
            order_status: newStatus,
            notes: notesSerialized,
            updated_at: updatedOrder.updatedAt,
          })
          .eq('id', existing.id);
      } catch (err) {
        console.warn('Supabase order status update error:', err);
      }
    }

    // 5. Sync in LocalStorage
    if (typeof window !== 'undefined') {
      try {
        const savedAll = localStorage.getItem('maharaj_all_orders');
        let all: AdminOrder[] = savedAll ? JSON.parse(savedAll) : [];
        all = all.map((o) => (o.id === existing.id ? updatedOrder : o));
        localStorage.setItem('maharaj_all_orders', JSON.stringify(all));
      } catch {}
    }

    return { success: true, order: updatedOrder };
  } catch (err: any) {
    return { success: false, errorMessage: err.message || 'Failed to update order status.' };
  }
};

/**
 * Cancel Order in Backend with Inventory Restoration Guard
 */
export const cancelOrderInDb = async (
  orderId: string,
  cancellationReason?: string
): Promise<{ success: boolean; order?: AdminOrder; errorMessage?: string }> => {
  try {
    const { orders } = await fetchOrdersFromDb({ pageSize: 1000 });
    const existing = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

    if (!existing) {
      return { success: false, errorMessage: 'Order not found.' };
    }

    if (existing.orderStatus === 'Cancelled') {
      return { success: false, errorMessage: 'Order is already cancelled.' };
    }

    // Handle inventory restoration safely (prevent duplicate restoration!)
    let inventoryRestored = existing.inventoryRestored || false;
    if (!inventoryRestored && existing.items && existing.items.length > 0) {
      try {
        for (const item of existing.items) {
          if (item.product && item.product.id) {
            // Restore product stock quantity in database
            const currentStock = (item.product as any).stock_quantity ?? (item.product.inStock ? 10 : 0);
            await updateProductInDb(item.product.id, {
              stock_quantity: currentStock + item.quantity,
              is_active: true,
            });
          }
        }
        inventoryRestored = true;
      } catch (stockErr) {
        console.warn('Inventory restoration warning:', stockErr);
      }
    }

    const note = cancellationReason
      ? `Order cancelled by Admin. Reason: ${cancellationReason}.${inventoryRestored ? ' Inventory stock restored.' : ''}`
      : `Order cancelled by Admin.${inventoryRestored ? ' Inventory stock restored.' : ''}`;

    const updatedTimeline = [
      ...existing.timeline,
      {
        status: 'Cancelled',
        timestamp: new Date().toISOString(),
        note,
      },
    ];

    const updatedOrder: AdminOrder = {
      ...existing,
      orderStatus: 'Cancelled',
      inventoryRestored,
      updatedAt: new Date().toISOString(),
      timeline: updatedTimeline,
    };

    const notesSerialized = serializeOrderMetaToNotes(
      updatedOrder.notes || '',
      updatedOrder.items,
      updatedOrder.timeline,
      true
    );

    // Save to Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('orders')
          .update({
            order_status: 'Cancelled',
            notes: notesSerialized,
            updated_at: updatedOrder.updatedAt,
          })
          .eq('id', existing.id);
      } catch (err) {
        console.warn('Supabase cancel order error:', err);
      }
    }

    // Save to LocalStorage
    if (typeof window !== 'undefined') {
      try {
        const savedAll = localStorage.getItem('maharaj_all_orders');
        let all: AdminOrder[] = savedAll ? JSON.parse(savedAll) : [];
        all = all.map((o) => (o.id === existing.id ? updatedOrder : o));
        localStorage.setItem('maharaj_all_orders', JSON.stringify(all));
      } catch {}
    }

    return { success: true, order: updatedOrder };
  } catch (err: any) {
    return { success: false, errorMessage: err.message || 'Failed to cancel order.' };
  }
};

/**
 * Refund Order Payment in Backend Database
 */
export const refundOrderInDb = async (
  orderId: string,
  refundReason?: string
): Promise<{ success: boolean; order?: AdminOrder; errorMessage?: string }> => {
  try {
    const { orders } = await fetchOrdersFromDb({ pageSize: 1000 });
    const existing = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

    if (!existing) {
      return { success: false, errorMessage: 'Order not found.' };
    }

    if (existing.paymentStatus === 'Refunded') {
      return { success: false, errorMessage: 'Payment is already refunded for this order.' };
    }

    if (existing.paymentStatus !== 'Paid') {
      return {
        success: false,
        errorMessage: `Cannot refund order with payment status '${existing.paymentStatus}'. Payment must be 'Paid'.`,
      };
    }

    const note = refundReason
      ? `Payment refunded by Admin. Reason: ${refundReason}. Amount: ₹${existing.totalAmount.toLocaleString('en-IN')}`
      : `Payment refunded by Admin. Total Amount: ₹${existing.totalAmount.toLocaleString('en-IN')}`;

    const updatedTimeline = [
      ...existing.timeline,
      {
        status: existing.orderStatus,
        timestamp: new Date().toISOString(),
        note: `[REFUND PROCESS] ${note}`,
      },
    ];

    const updatedOrder: AdminOrder = {
      ...existing,
      paymentStatus: 'Refunded',
      updatedAt: new Date().toISOString(),
      timeline: updatedTimeline,
    };

    const notesSerialized = serializeOrderMetaToNotes(
      updatedOrder.notes || '',
      updatedOrder.items,
      updatedOrder.timeline,
      !!updatedOrder.inventoryRestored
    );

    // Save to Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('orders')
          .update({
            payment_status: 'Refunded',
            notes: notesSerialized,
            updated_at: updatedOrder.updatedAt,
          })
          .eq('id', existing.id);
      } catch (err) {
        console.warn('Supabase refund order error:', err);
      }
    }

    // Save to LocalStorage
    if (typeof window !== 'undefined') {
      try {
        const savedAll = localStorage.getItem('maharaj_all_orders');
        let all: AdminOrder[] = savedAll ? JSON.parse(savedAll) : [];
        all = all.map((o) => (o.id === existing.id ? updatedOrder : o));
        localStorage.setItem('maharaj_all_orders', JSON.stringify(all));
      } catch {}
    }

    return { success: true, order: updatedOrder };
  } catch (err: any) {
    return { success: false, errorMessage: err.message || 'Failed to refund order payment.' };
  }
};

/**
 * Subscribe to realtime orders changes in Supabase
 */
export const subscribeToOrdersRealtime = (onOrderChange: () => void) => {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const channel = supabase
      .channel('public:orders_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          onOrderChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
};

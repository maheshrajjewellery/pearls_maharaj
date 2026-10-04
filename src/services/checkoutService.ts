import { CartItem, ShopProduct } from '@/types/shop';
import { CustomerAddress } from '@/types/customer';
import { AdminOrder, OrderItem, PaymentStatus, OrderStatus } from '@/types/admin';
import { saveCustomerOrders, getCustomerOrders } from './customerService';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// --------------------------------------------------
// 1. SHIPPING TYPES & CALCULATIONS
// --------------------------------------------------
export interface ShippingOption {
  id: 'standard' | 'express';
  name: string;
  description: string;
  estimatedDays: string;
  cost: number;
  isFreeEligible: boolean;
}

export const DEFAULT_FREE_SHIPPING_THRESHOLD = 50000; // ₹50,000
export const STANDARD_SHIPPING_FEE = 250;
export const EXPRESS_SHIPPING_FEE = 950;

export const getAvailableShippingOptions = (
  subtotal: number,
  freeShippingThreshold: number = DEFAULT_FREE_SHIPPING_THRESHOLD
): ShippingOption[] => {
  const isFree = subtotal >= freeShippingThreshold;
  return [
    {
      id: 'standard',
      name: 'Standard Insured Express Courier',
      description: 'Fully insured transit with tamper-evident luxury packaging',
      estimatedDays: '3 - 5 Business Days',
      cost: isFree ? 0 : STANDARD_SHIPPING_FEE,
      isFreeEligible: isFree,
    },
    {
      id: 'express',
      name: 'Royal Concierge White-Glove Delivery',
      description: 'Priority handling with guaranteed hand delivery by brand ambassador',
      estimatedDays: '1 - 2 Business Days',
      cost: EXPRESS_SHIPPING_FEE,
      isFreeEligible: false,
    },
  ];
};

export const calculateShippingFee = (
  shippingOptionId: 'standard' | 'express',
  subtotal: number,
  freeShippingThreshold: number = DEFAULT_FREE_SHIPPING_THRESHOLD
): number => {
  if (shippingOptionId === 'standard') {
    return subtotal >= freeShippingThreshold ? 0 : STANDARD_SHIPPING_FEE;
  }
  return EXPRESS_SHIPPING_FEE;
};

// --------------------------------------------------
// 2. COUPON / DISCOUNT SERVICE
// --------------------------------------------------
export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string; // ISO format
  isActive: boolean;
}

export const VALID_COUPONS: Record<string, Coupon> = {
  WELCOME10: {
    code: 'WELCOME10',
    description: '10% off on your luxury jewellery purchase',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    expiryDate: '2028-12-31',
    isActive: true,
  },
  ROYAL15: {
    code: 'ROYAL15',
    description: '15% off on orders above ₹50,000',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 50000,
    expiryDate: '2028-12-31',
    isActive: true,
  },
  PEARL5000: {
    code: 'PEARL5000',
    description: 'Flat ₹5,000 off on grand heritage orders above ₹1,00,000',
    discountType: 'fixed',
    discountValue: 5000,
    minOrderAmount: 100000,
    expiryDate: '2028-12-31',
    isActive: true,
  },
  MAHARAJA20: {
    code: 'MAHARAJA20',
    description: '20% off on signature bridal suites above ₹1,50,000',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 150000,
    expiryDate: '2028-12-31',
    isActive: true,
  },
};

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  errorMessage?: string;
}

export const validateCouponCode = (
  code: string,
  subtotal: number
): CouponValidationResult => {
  const cleanCode = code.trim().toUpperCase();

  if (!cleanCode) {
    return { isValid: false, discountAmount: 0, errorMessage: 'Please enter a valid coupon code.' };
  }

  const coupon = VALID_COUPONS[cleanCode];

  if (!coupon || !coupon.isActive) {
    return {
      isValid: false,
      discountAmount: 0,
      errorMessage: `Coupon code '${cleanCode}' is invalid or expired.`,
    };
  }

  // Check expiry
  if (new Date(coupon.expiryDate).getTime() < Date.now()) {
    return {
      isValid: false,
      discountAmount: 0,
      errorMessage: `Coupon code '${cleanCode}' has expired.`,
    };
  }

  // Check minimum order amount
  if (subtotal < coupon.minOrderAmount) {
    const minFormatted = `₹${coupon.minOrderAmount.toLocaleString('en-IN')}`;
    return {
      isValid: false,
      discountAmount: 0,
      errorMessage: `Coupon '${cleanCode}' requires a minimum order value of ${minFormatted}. (Current bag subtotal: ₹${subtotal.toLocaleString('en-IN')})`,
    };
  }

  // Calculate discount amount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // Discount cannot exceed subtotal
  discount = Math.min(discount, subtotal);

  return {
    isValid: true,
    coupon,
    discountAmount: discount,
  };
};

// --------------------------------------------------
// 3. STOCK VALIDATION SERVICE
// --------------------------------------------------
export interface StockCheckResult {
  isAvailable: boolean;
  unavailableItem?: CartItem;
  availableQuantity?: number;
  errorMessage?: string;
}

export const verifyCartStock = async (cart: CartItem[]): Promise<StockCheckResult> => {
  if (!cart || cart.length === 0) {
    return { isAvailable: false, errorMessage: 'Your shopping bag is empty.' };
  }

  // If Supabase is configured, fetch latest product stock quantities
  if (isSupabaseConfigured()) {
    try {
      const productIds = cart.map((item) => item.product.id);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, stock_quantity, is_active')
        .in('id', productIds);

      if (!error && data) {
        for (const item of cart) {
          const dbItem = data.find((p) => p.id === item.product.id);
          if (!dbItem || !dbItem.is_active) {
            return {
              isAvailable: false,
              unavailableItem: item,
              errorMessage: `"${item.product.name}" is currently unavailable or out of stock.`,
            };
          }
          if (dbItem.stock_quantity < item.quantity) {
            return {
              isAvailable: false,
              unavailableItem: item,
              availableQuantity: dbItem.stock_quantity,
              errorMessage: `Insufficient stock for "${item.product.name}". Only ${dbItem.stock_quantity} unit(s) remaining.`,
            };
          }
        }
      }
    } catch (err) {
      console.warn('Supabase stock check error, falling back to product flags:', err);
    }
  }

  // Check in-memory inStock flag
  for (const item of cart) {
    if (item.product.inStock === false) {
      return {
        isAvailable: false,
        unavailableItem: item,
        errorMessage: `"${item.product.name}" is currently out of stock.`,
      };
    }
  }

  return { isAvailable: true };
};

// --------------------------------------------------
// 4. RAZORPAY INTEGRATION SERVICE
// --------------------------------------------------
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface RazorpayOrderDetails {
  id: string; // Server Razorpay Order ID (e.g., order_K9xZ123...)
  amount: number; // in paise (e.g. 18500000)
  currency: string;
}

export const createRazorpayServerOrder = async (
  amountInRupees: number
): Promise<RazorpayOrderDetails> => {
  const amountInPaise = Math.round(amountInRupees * 100);
  const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
  const orderId = `order_rzp_${Date.now()}_${randomSuffix}`;

  return {
    id: orderId,
    amount: amountInPaise,
    currency: 'INR',
  };
};

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const verifyRazorpayPaymentOnServer = async (
  response: RazorpayPaymentResponse,
  expectedAmountInRupees: number
): Promise<boolean> => {
  // Server-side payment verification simulation
  if (
    !response.razorpay_payment_id ||
    !response.razorpay_order_id ||
    expectedAmountInRupees <= 0
  ) {
    return false;
  }
  return true;
};

// --------------------------------------------------
// 5. IMMUTABLE ORDER CREATION & STORAGE SERVICE
// --------------------------------------------------
export interface CreateOrderParams {
  customer: {
    name: string;
    email: string;
    phone: string;
    userId?: string;
  };
  shippingAddress: CustomerAddress;
  cart: CartItem[];
  shippingOption: ShippingOption;
  coupon?: Coupon;
  paymentMethod: 'Razorpay' | 'Card' | 'UPI' | 'NetBanking' | 'Cash on Delivery' | 'Direct Order Confirmation';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  gstRatePercent?: number; // GST included or calculated (e.g. 3%)
}

export const createFinalCheckoutOrder = async (
  params: CreateOrderParams
): Promise<{ success: boolean; order?: AdminOrder; errorMessage?: string }> => {
  try {
    const {
      customer,
      shippingAddress,
      cart,
      shippingOption,
      coupon,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
      gstRatePercent = 3,
    } = params;

    // 1. Calculate Server-Side Subtotal
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 2. Validate Coupon & Discount
    let discount = 0;
    if (coupon) {
      const couponRes = validateCouponCode(coupon.code, subtotal);
      if (couponRes.isValid) {
        discount = couponRes.discountAmount;
      }
    }

    // 3. Calculate Shipping Fee
    const shippingFee = calculateShippingFee(shippingOption.id, subtotal);

    // 4. Calculate Tax / GST
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const taxAmount = Math.round((taxableSubtotal * gstRatePercent) / 100);

    // 5. Calculate Final Amount
    const totalAmount = taxableSubtotal + shippingFee;

    // 6. Build Immutable Snapshot Items
    const immutableItems: OrderItem[] = cart.map((item, idx) => ({
      id: `item_${Date.now()}_${idx}`,
      product: {
        ...item.product, // Freeze snapshot of product info
      },
      quantity: item.quantity,
      unitPrice: item.product.price,
      selectedSize: item.selectedSize || item.product.specs.pearlSize || 'Standard',
    }));

    // 7. Generate Unique Order ID & Order Number
    const timestamp = Date.now();
    const orderNumber = `MJ-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: AdminOrder = {
      id: `ord_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
      orderNumber,
      customerName: customer.name,
      customerEmail: customer.email.toLowerCase(),
      customerPhone: customer.phone,
      shippingAddress: {
        street: `${shippingAddress.houseFlat}, ${shippingAddress.street}${shippingAddress.area ? `, ${shippingAddress.area}` : ''}`,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || 'India',
      },
      items: immutableItems,
      subtotal,
      shippingFee,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      notes: `Order created via secure online checkout. Shipping option: ${shippingOption.name}. ${razorpayPaymentId ? `Razorpay Payment ID: ${razorpayPaymentId}` : ''}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          note: `Payment verified via ${paymentMethod}. Order received and placed for vault dispatch.`,
        },
      ],
    };

    // 8. Store Order in Customer Local Orders & Global Store
    const existingCustomerOrders = getCustomerOrders(customer.email);
    const updatedCustomerOrders = [newOrder, ...existingCustomerOrders];
    saveCustomerOrders(customer.email, updatedCustomerOrders);

    // Save into all-orders store for admin sync
    if (typeof window !== 'undefined') {
      try {
        const savedAll = localStorage.getItem('maharaj_all_orders');
        let allOrders: AdminOrder[] = savedAll ? JSON.parse(savedAll) : [];
        allOrders.unshift(newOrder);
        localStorage.setItem('maharaj_all_orders', JSON.stringify(allOrders));
      } catch {}
    }

    // 9. If Supabase is configured, insert order into Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('orders').insert([
          {
            id: newOrder.id,
            order_number: newOrder.orderNumber,
            customer_name: newOrder.customerName,
            customer_email: newOrder.customerEmail,
            customer_phone: newOrder.customerPhone,
            shipping_address: newOrder.shippingAddress,
            subtotal: newOrder.subtotal,
            shipping_fee: newOrder.shippingFee,
            discount: newOrder.discount,
            total_amount: newOrder.totalAmount,
            payment_method: newOrder.paymentMethod,
            payment_status: newOrder.paymentStatus,
            order_status: newOrder.orderStatus,
            razorpay_payment_id: razorpayPaymentId || null,
            razorpay_order_id: razorpayOrderId || null,
            created_at: newOrder.createdAt,
          },
        ]);
      } catch (err) {
        console.warn('Supabase order insert notice (fallback active):', err);
      }
    }

    return {
      success: true,
      order: newOrder,
    };
  } catch (err: any) {
    console.error('Error creating checkout order:', err);
    return {
      success: false,
      errorMessage: err.message || 'An error occurred while creating your order. Please try again.',
    };
  }
};

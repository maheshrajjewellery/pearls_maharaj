import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Truck,
  CreditCard,
  User,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Plus,
  Edit2,
  Tag,
  Check,
  X,
  Sparkles,
  Phone,
  Mail,
  Building,
  Navigation,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { CustomerAddress } from "@/types/customer";
import {
  getCustomerAddresses,
  addCustomerAddress,
} from "@/services/customerService";
import {
  getAvailableShippingOptions,
  calculateShippingFee,
  ShippingOption,
  verifyCartStock,
  loadRazorpayScript,
  createRazorpayServerOrder,
  verifyRazorpayPaymentOnServer,
  createFinalCheckoutOrder,
} from "@/services/checkoutService";

type CheckoutStep = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const {
    user,
    cart,
    cartSubtotal,
    clearCart,
    setCurrentPage,
    setActiveOrder,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCouponCode,
  } = useShop();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  // --------------------------------------------------
  // 1. CONTACT INFO STATE
  // --------------------------------------------------
  const [contactInfo, setContactInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [contactErrors, setContactErrors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (user) {
      setContactInfo((prev) => ({
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // --------------------------------------------------
  // 2. SHIPPING ADDRESS STATE
  // --------------------------------------------------
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">(
    "new",
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    houseFlat: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [addressErrors, setAddressErrors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    const emailToUse = contactInfo.email || user?.email;
    if (emailToUse) {
      const addresses = getCustomerAddresses(emailToUse);
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setIsAddingNewAddress(false);
      } else {
        setSelectedAddressId("new");
        setIsAddingNewAddress(true);
      }
    }
  }, [contactInfo.email, user]);

  const activeAddress = useMemo<CustomerAddress | null>(() => {
    if (selectedAddressId !== "new" && !isAddingNewAddress) {
      return savedAddresses.find((a) => a.id === selectedAddressId) || null;
    }
    return {
      id: `temp_${Date.now()}`,
      fullName: addressForm.fullName || contactInfo.fullName,
      phone: addressForm.phone || contactInfo.phone,
      houseFlat: addressForm.houseFlat,
      street: addressForm.street,
      area: addressForm.area,
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode,
      country: addressForm.country || "India",
      isDefault: false,
    };
  }, [
    selectedAddressId,
    isAddingNewAddress,
    savedAddresses,
    addressForm,
    contactInfo,
  ]);

  // --------------------------------------------------
  // 3. SHIPPING METHOD STATE
  // --------------------------------------------------
  const shippingOptions = useMemo(
    () => getAvailableShippingOptions(cartSubtotal),
    [cartSubtotal],
  );

  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<
    "standard" | "express"
  >("standard");

  const activeShippingOption = useMemo(
    () =>
      shippingOptions.find((o) => o.id === selectedShippingOptionId) ||
      shippingOptions[0],
    [shippingOptions, selectedShippingOptionId],
  );

  const shippingFee = useMemo(
    () => calculateShippingFee(selectedShippingOptionId, cartSubtotal),
    [selectedShippingOptionId, cartSubtotal],
  );

  // --------------------------------------------------
  // 4. COUPON & TOTALS
  // --------------------------------------------------
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const taxableSubtotal = Math.max(0, cartSubtotal - couponDiscount);
  const gstTaxAmount = Math.round(taxableSubtotal * 0.03); // 3% GST included
  const grandTotal = taxableSubtotal + shippingFee;

  // --------------------------------------------------
  // 5. PAYMENT & PROCESSING STATE
  // --------------------------------------------------
  const [paymentMethod, setPaymentMethod] = useState<
    "Razorpay" | "Cash on Delivery"
  >("Razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Helper to extract 10-digit Indian mobile number
  const getCleanIndianPhone = (phoneStr: string): string => {
    const digitsOnly = phoneStr.replace(/\D/g, "");
    if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
      return digitsOnly.substring(2);
    }
    if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
      return digitsOnly.substring(1);
    }
    return digitsOnly;
  };

  // --------------------------------------------------
  // VALIDATIONS
  // --------------------------------------------------
  const validateContact = (): boolean => {
    const errors: Record<string, string> = {};
    if (!contactInfo.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactInfo.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(contactInfo.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = getCleanIndianPhone(contactInfo.phone);
    if (!contactInfo.phone.trim()) {
      errors.phone = "Mobile number is required.";
    } else if (!phoneRegex.test(cleanPhone)) {
      errors.phone =
        "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddress = (): boolean => {
    if (selectedAddressId !== "new" && !isAddingNewAddress) {
      const found = savedAddresses.find((a) => a.id === selectedAddressId);
      if (found) return true;
    }

    const errors: Record<string, string> = {};
    if (!addressForm.fullName.trim())
      errors.fullName = "Recipient name is required.";

    const phoneToValidate =
      addressForm.phone.trim() || contactInfo.phone.trim();
    const cleanPhone = getCleanIndianPhone(phoneToValidate);
    if (!phoneToValidate) {
      errors.phone = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!addressForm.houseFlat.trim())
      errors.houseFlat = "Flat / House No. / Building is required.";
    if (!addressForm.street.trim())
      errors.street = "Street name / Area is required.";
    if (!addressForm.city.trim()) errors.city = "City is required.";
    if (!addressForm.state.trim()) errors.state = "State is required.";

    const pincodeRegex = /^\d{6}$/;
    if (!addressForm.pincode.trim()) {
      errors.pincode = "Pincode is required.";
    } else if (!pincodeRegex.test(addressForm.pincode.trim())) {
      errors.pincode = "Please enter a valid 6-digit Pincode.";
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --------------------------------------------------
  // STEP HANDLERS
  // --------------------------------------------------
  const handleProceedFromContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContact()) {
      setCurrentStep(2);
    }
  };

  const handleProceedFromAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      if (isAddingNewAddress && saveAddressToProfile && contactInfo.email) {
        const created = addCustomerAddress(contactInfo.email, {
          fullName: addressForm.fullName,
          phone: addressForm.phone || contactInfo.phone,
          houseFlat: addressForm.houseFlat,
          street: addressForm.street,
          area: addressForm.area,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode,
          country: addressForm.country || "India",
          isDefault: savedAddresses.length === 0,
        });
        setSavedAddresses(created);
        if (created.length > 0) {
          setSelectedAddressId(created[0].id);
          setIsAddingNewAddress(false);
        }
      }
      setCurrentStep(3);
    }
  };

  const handleProceedFromDelivery = () => {
    setCurrentStep(4);
  };

  // --------------------------------------------------
  // COUPON ACTIONS
  // --------------------------------------------------
  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccessMsg(null);
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setTimeout(() => {
      const res = applyCouponCode(couponInput);
      if (res.isValid) {
        setCouponSuccessMsg(
          `Coupon '${couponInput.trim().toUpperCase()}' applied successfully!`,
        );
        setCouponInput("");
      } else {
        setCouponError(res.errorMessage || "Invalid coupon code.");
      }
      setIsApplyingCoupon(false);
    }, 350);
  };

  const handleRemoveCoupon = () => {
    removeCouponCode();
    setCouponSuccessMsg(null);
    setCouponError(null);
  };

  // --------------------------------------------------
  // FINAL DIRECT ORDER PLACEMENT (WITHOUT PAYMENT STEP)
  // --------------------------------------------------
  const handlePlaceOrder = async () => {
    setCheckoutError(null);

    if (!validateContact()) {
      setCurrentStep(1);
      return;
    }
    if (!validateAddress()) {
      setCurrentStep(2);
      return;
    }
    if (!activeAddress) {
      setCheckoutError("Please select or provide a valid shipping address.");
      setCurrentStep(2);
      return;
    }
    if (cart.length === 0) {
      setCheckoutError("Your shopping bag is empty.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Server-side Stock Check
      const stockRes = await verifyCartStock(cart);
      if (!stockRes.isAvailable) {
        setCheckoutError(
          stockRes.errorMessage ||
            "One or more items in your cart are unavailable.",
        );
        setIsProcessing(false);
        return;
      }

      // 2. Direct Instant Order Placement (No Payment Gateway Needed)
      const finalRes = await createFinalCheckoutOrder({
        customer: {
          name: contactInfo.fullName,
          email: contactInfo.email,
          phone: contactInfo.phone,
          userId: user?.id,
        },
        shippingAddress: activeAddress,
        cart,
        shippingOption: activeShippingOption,
        coupon: appliedCoupon || undefined,
        paymentMethod: "Direct Order Confirmation",
      });

      if (finalRes.success && finalRes.order) {
        setActiveOrder(finalRes.order);
        clearCart();
        setCurrentPage("checkout-success");
        if (typeof window !== "undefined") {
          window.history.pushState({}, "", "/checkout/success");
        }
      } else {
        setCheckoutError(
          finalRes.errorMessage || "Order placement failed. Please try again.",
        );
        setIsProcessing(false);
      }
    } catch (err: any) {
      setCheckoutError(
        err.message || "An unexpected error occurred during order placement.",
      );
      setIsProcessing(false);
    }
  };

  // --------------------------------------------------
  // RENDER EMPTY CART
  // --------------------------------------------------
  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#FAF7F2] flex flex-col items-center justify-center px-4 py-16 text-[#30372F]">
        <div className="w-24 h-24 rounded-full bg-[#C5A059]/15 flex items-center justify-center mb-6 border border-[#C5A059]/30 shadow-inner">
          <ShoppingBag size={40} strokeWidth={1.2} className="text-[#C5A059]" />
        </div>
        <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#C5A059] font-medium mb-2">
          MAHESHRAJA JEWELLERY VAULT
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#30372F] font-normal mb-3 text-center tracking-wide">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm font-sans text-[#30372F]/70 max-w-md text-center mb-8 font-light leading-relaxed">
          Discover our royal South Sea, Tahitian, and Akoya pearl masterpieces
          crafted for timeless heritage elegance.
        </p>
        <button
          onClick={() => {
            setCurrentPage("shop");
            if (typeof window !== "undefined")
              window.history.pushState({}, "", "/shop");
          }}
          className="px-9 py-4 bg-[#30372F] text-[#FAF7F2] text-xs font-sans tracking-[0.25em] uppercase font-medium hover:bg-[#C5A059] hover:text-[#30372F] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span>EXPLORE LUXURY PIECES</span>
          <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // RENDER CHECKOUT PAGE
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#30372F] py-8 sm:py-14 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#C5A059] selection:text-[#30372F]">
      <div className="max-w-7xl mx-auto">
        {/* TOP HEADER & LUXURY BREADCRUMB */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              onClick={() => {
                setCurrentPage("shop");
                if (typeof window !== "undefined")
                  window.history.pushState({}, "", "/shop");
              }}
              className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.15em] text-[#30372F]/70 hover:text-[#C5A059] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Jewellery Collection</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-sans text-[#C5A059]">
              <Lock size={13} />
              <span className="tracking-widest uppercase font-medium">
                256-BIT SSL ENCRYPTED
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#30372F]/15 pb-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-sans tracking-[0.3em] uppercase text-[#C5A059] font-medium mb-1">
                <Sparkles size={14} />
                <span>PRIVATE CLIENT CHECKOUT</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#30372F] font-normal tracking-wide">
                Secure Order Dispatch
              </h1>
            </div>

            {/* HIGH-END STEP PROGRESS TRACKER */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-sans">
              {[
                { step: 1, label: "Contact" },
                { step: 2, label: "Address" },
                { step: 3, label: "Delivery" },
                { step: 4, label: "Payment" },
              ].map((s, i, arr) => {
                const isActive = currentStep === s.step;
                const isCompleted = currentStep > s.step;
                return (
                  <React.Fragment key={s.step}>
                    <button
                      onClick={() =>
                        isCompleted && setCurrentStep(s.step as CheckoutStep)
                      }
                      disabled={!isCompleted && !isActive}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[#30372F] text-[#FAF7F2] shadow-md ring-2 ring-[#C5A059]/40 font-medium"
                          : isCompleted
                            ? "bg-[#C5A059]/20 text-[#30372F] hover:bg-[#C5A059]/30 font-medium"
                            : "bg-white/60 text-[#30372F]/40 border border-[#30372F]/10"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                          isActive
                            ? "bg-[#C5A059] text-[#30372F] font-bold"
                            : isCompleted
                              ? "bg-[#30372F] text-[#FAF7F2]"
                              : "bg-[#30372F]/10 text-[#30372F]/50"
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={12} strokeWidth={2.5} />
                        ) : (
                          s.step
                        )}
                      </span>
                      <span className="hidden sm:inline tracking-wider uppercase text-[11px]">
                        {s.label}
                      </span>
                    </button>
                    {i < arr.length - 1 && (
                      <ChevronRight
                        size={14}
                        className="text-[#30372F]/20 shrink-0"
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* MOBILE ORDER SUMMARY ACCORDION BANNER */}
        <div className="lg:hidden mb-6 bg-white border border-[#C5A059]/30 p-4 rounded-sm shadow-sm">
          <button
            onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
            className="w-full flex items-center justify-between text-xs font-sans font-medium text-[#30372F]"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#C5A059]" />
              <span>
                {isMobileSummaryOpen ? "Hide Summary" : "View Order Summary"} (
                {cart.length} items)
              </span>
            </div>
            <span className="font-serif text-base text-[#30372F] font-normal">
              ₹ {grandTotal.toLocaleString("en-IN")}
            </span>
          </button>

          <AnimatePresence>
            {isMobileSummaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4 mt-3 border-t border-[#30372F]/10 space-y-3"
              >
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-xs border border-[#30372F]/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-[#30372F] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-[#30372F]/60">
                        Qty: {item.quantity}{" "}
                        {item.selectedSize ? `• Size ${item.selectedSize}` : ""}
                      </p>
                    </div>
                    <span className="font-sans font-medium text-[#30372F]">
                      ₹{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CHECKOUT ERROR ALERT */}
        {checkoutError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50/90 border border-red-300 text-red-900 rounded-sm text-xs font-sans flex items-start gap-3 shadow-sm"
          >
            <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-950 mb-0.5">Checkout Notice</p>
              <p className="text-red-800 font-light leading-relaxed">
                {checkoutError}
              </p>
            </div>
            <button
              onClick={() => setCheckoutError(null)}
              className="text-red-500 hover:text-red-800 p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN - STEPS ACCORDION FORMS */}
          <div className="lg:col-span-7 space-y-8">
            {/* STEP 1: CONTACT INFORMATION */}
            <div
              className={`bg-white border rounded-sm p-6 sm:p-9 transition-all duration-300 ${
                currentStep === 1
                  ? "border-[#C5A059] shadow-[0_10px_35px_rgba(41,35,31,0.06)]"
                  : "border-[#30372F]/15 opacity-90"
              }`}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#30372F]/10">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm transition-colors ${
                      currentStep === 1
                        ? "bg-[#30372F] text-[#FAF7F2]"
                        : "bg-[#C5A059]/20 text-[#30372F]"
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl text-[#30372F] font-normal tracking-wide">
                      Client Information
                    </h2>
                    <p className="text-xs font-sans text-[#30372F]/60 font-light mt-0.5">
                      Order confirmations and insured shipping tracking will be
                      sent here
                    </p>
                  </div>
                </div>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-sans text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
              </div>

              {currentStep === 1 ? (
                <form onSubmit={handleProceedFromContact} className="space-y-5">
                  <div>
                    <label className="block text-xs font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1.5 flex items-center gap-1.5">
                      <User size={13} className="text-[#C5A059]" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      value={contactInfo.fullName}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="e.g. Maharani Gayatri Devi"
                      className={`w-full px-4 py-3.5 bg-[#FAF7F2] border ${
                        contactErrors.fullName
                          ? "border-red-500"
                          : "border-[#30372F]/20"
                      } text-sm font-sans text-[#30372F] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 transition-all rounded-xs`}
                    />
                    {contactErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1 font-sans">
                        {contactErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1.5 flex items-center gap-1.5">
                        <Mail size={13} className="text-[#C5A059]" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            email: e.target.value,
                          })
                        }
                        placeholder="client@domain.com"
                        className={`w-full px-4 py-3.5 bg-[#FAF7F2] border ${
                          contactErrors.email
                            ? "border-red-500"
                            : "border-[#30372F]/20"
                        } text-sm font-sans text-[#30372F] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 transition-all rounded-xs`}
                      />
                      {contactErrors.email && (
                        <p className="text-[11px] text-red-600 mt-1 font-sans">
                          {contactErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1.5 flex items-center gap-1.5">
                        <Phone size={13} className="text-[#C5A059]" />
                        <span>Mobile Number *</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-sans text-[#30372F]/60 font-medium">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              phone: e.target.value,
                            })
                          }
                          placeholder="9876543210"
                          className={`w-full pl-12 pr-4 py-3.5 bg-[#FAF7F2] border ${
                            contactErrors.phone
                              ? "border-red-500"
                              : "border-[#30372F]/20"
                          } text-sm font-sans text-[#30372F] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 transition-all rounded-xs`}
                        />
                      </div>
                      {contactErrors.phone && (
                        <p className="text-[11px] text-red-600 mt-1 font-sans">
                          {contactErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {user && (
                    <div className="flex items-center gap-2.5 text-xs font-sans text-[#C5A059] bg-[#C5A059]/10 p-3 rounded-xs border border-[#C5A059]/20 mt-2">
                      <ShieldCheck
                        size={16}
                        className="shrink-0 text-[#C5A059]"
                      />
                      <span>
                        Authenticated Account: Information populated from your
                        signed-in profile.
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#30372F] hover:bg-[#C5A059] hover:text-[#30372F] text-[#FAF7F2] text-xs font-sans font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-4 rounded-xs"
                  >
                    <span>CONTINUE TO SHIPPING ADDRESS</span>
                    <ChevronRight size={14} />
                  </button>
                </form>
              ) : (
                <div className="text-xs font-sans text-[#30372F]/80 space-y-1 bg-[#FAF7F2] p-4 rounded-xs border border-[#30372F]/10">
                  <p className="font-semibold text-[#30372F] text-sm">
                    {contactInfo.fullName}
                  </p>
                  <p>
                    {contactInfo.email} • +91 {contactInfo.phone}
                  </p>
                </div>
              )}
            </div>

            {/* STEP 2: SHIPPING ADDRESS */}
            <div
              className={`bg-white border rounded-sm p-6 sm:p-9 transition-all duration-300 ${
                currentStep === 2
                  ? "border-[#C5A059] shadow-[0_10px_35px_rgba(41,35,31,0.06)]"
                  : "border-[#30372F]/15 opacity-90"
              }`}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#30372F]/10">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm transition-colors ${
                      currentStep === 2
                        ? "bg-[#30372F] text-[#FAF7F2]"
                        : "bg-[#C5A059]/20 text-[#30372F]"
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl text-[#30372F] font-normal tracking-wide">
                      Shipping Address
                    </h2>
                    <p className="text-xs font-sans text-[#30372F]/60 font-light mt-0.5">
                      Select or enter your luxury vault delivery destination
                    </p>
                  </div>
                </div>
                {currentStep > 2 && (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-sans text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
              </div>

              {currentStep === 2 ? (
                <form onSubmit={handleProceedFromAddress} className="space-y-6">
                  {/* SAVED ADDRESS SELECTOR */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <label className="block text-xs font-sans font-medium uppercase tracking-wider text-[#30372F]">
                        Saved Address Book
                      </label>

                      <div className="grid grid-cols-1 gap-3.5">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setIsAddingNewAddress(false);
                            }}
                            className={`p-4 sm:p-5 border rounded-xs cursor-pointer transition-all flex items-start justify-between ${
                              selectedAddressId === addr.id &&
                              !isAddingNewAddress
                                ? "border-[#C5A059] bg-[#C5A059]/10 shadow-sm ring-1 ring-[#C5A059]/30"
                                : "border-[#30372F]/15 bg-[#FAF7F2] hover:border-[#30372F]/30"
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <input
                                type="radio"
                                name="shipping_address_choice"
                                checked={
                                  selectedAddressId === addr.id &&
                                  !isAddingNewAddress
                                }
                                onChange={() => {
                                  setSelectedAddressId(addr.id);
                                  setIsAddingNewAddress(false);
                                }}
                                className="mt-1 accent-[#30372F]"
                              />
                              <div className="text-xs font-sans text-[#30372F]">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">
                                    {addr.fullName}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="px-2 py-0.5 text-[10px] bg-[#30372F] text-[#FAF7F2] font-medium tracking-wider rounded-xs uppercase">
                                      DEFAULT
                                    </span>
                                  )}
                                </div>
                                <p className="text-[#30372F]/80">
                                  {addr.houseFlat}, {addr.street}
                                  {addr.area ? `, ${addr.area}` : ""}
                                </p>
                                <p className="text-[#30372F]/80">
                                  {addr.city}, {addr.state} -{" "}
                                  <span className="font-semibold">
                                    {addr.pincode}
                                  </span>
                                </p>
                                <p className="text-[#30372F]/60 mt-1">
                                  Phone: {addr.phone}
                                </p>
                              </div>
                            </div>
                            {selectedAddressId === addr.id &&
                              !isAddingNewAddress && (
                                <CheckCircle
                                  className="text-[#C5A059] shrink-0"
                                  size={18}
                                />
                              )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAddressId("new");
                            setIsAddingNewAddress(true);
                          }}
                          className={`p-4 border border-dashed border-[#C5A059]/40 bg-[#FAF7F2] hover:bg-[#C5A059]/10 text-xs font-sans font-medium text-[#30372F] flex items-center justify-center gap-2 transition-all rounded-xs ${
                            isAddingNewAddress
                              ? "border-[#C5A059] bg-[#C5A059]/15 text-[#C5A059]"
                              : ""
                          }`}
                        >
                          <Plus size={16} className="text-[#C5A059]" />
                          <span>Deliver to a New Address</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* NEW ADDRESS FORM */}
                  {(isAddingNewAddress || savedAddresses.length === 0) && (
                    <div className="space-y-4 pt-3 border-t border-[#30372F]/10">
                      <h3 className="text-xs font-sans font-medium uppercase tracking-wider text-[#30372F] flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#C5A059]" />
                        <span>Address Details</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1">
                            Recipient Full Name *
                          </label>
                          <input
                            type="text"
                            value={addressForm.fullName}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                fullName: e.target.value,
                              })
                            }
                            placeholder="Full name"
                            className={`w-full px-3.5 py-3 bg-[#FAF7F2] border ${
                              addressErrors.fullName
                                ? "border-red-500"
                                : "border-[#30372F]/20"
                            } text-sm font-sans focus:outline-none focus:border-[#C5A059] rounded-xs`}
                          />
                          {addressErrors.fullName && (
                            <p className="text-[10px] text-red-600 mt-1 font-sans">
                              {addressErrors.fullName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1">
                            Contact Phone *
                          </label>
                          <input
                            type="tel"
                            value={addressForm.phone}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                phone: e.target.value,
                              })
                            }
                            placeholder="10-digit mobile number"
                            className={`w-full px-3.5 py-3 bg-[#FAF7F2] border ${
                              addressErrors.phone
                                ? "border-red-500"
                                : "border-[#30372F]/20"
                            } text-sm font-sans focus:outline-none focus:border-[#C5A059] rounded-xs`}
                          />
                          {addressErrors.phone && (
                            <p className="text-[10px] text-red-600 mt-1 font-sans">
                              {addressErrors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1">
                          Flat, House No., Building *
                        </label>
                        <input
                          type="text"
                          value={addressForm.houseFlat}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              houseFlat: e.target.value,
                            })
                          }
                          placeholder="e.g. Villa 14, Royal Palm Residency"
                          className={`w-full px-3.5 py-3 bg-[#FAF7F2] border ${
                            addressErrors.houseFlat
                              ? "border-red-500"
                              : "border-[#30372F]/20"
                          } text-sm font-sans focus:outline-none focus:border-[#C5A059] rounded-xs`}
                        />
                        {addressErrors.houseFlat && (
                          <p className="text-[10px] text-red-600 mt-1 font-sans">
                            {addressErrors.houseFlat}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1">
                            Street Name / Area *
                          </label>
                          <input
                            type="text"
                            value={addressForm.street}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                street: e.target.value,
                              })
                            }
                            placeholder="e.g. Jubilee Hills, Road No. 36"
                            className={`w-full px-3.5 py-3 bg-[#FAF7F2] border ${
                              addressErrors.street
                                ? "border-red-500"
                                : "border-[#30372F]/20"
                            } text-sm font-sans focus:outline-none focus:border-[#C5A059] rounded-xs`}
                          />
                          {addressErrors.street && (
                            <p className="text-[10px] text-red-600 mt-1 font-sans">
                              {addressErrors.street}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            value={addressForm.area}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                area: e.target.value,
                              })
                            }
                            placeholder="e.g. Near Heritage Palace Hotel"
                            className="w-full px-3.5 py-3 bg-[#FAF7F2] border border-[#30372F]/20 text-sm font-sans focus:outline-none focus:border-[#C5A059] rounded-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                city: e.target.value,
                              })
                            }
                            placeholder="Hyderabad"
                            className={`w-full px-3.5 py-3 bg-[#FAF7F2] border ${
                              addressErrors.city
                                ? "border-red-500"
                                : "border-[#30372F]/20"
                            } text-sm font-sans focus:outline-none focus:border-[#C5A059] rounded-xs`}
                          />
                          {addressErrors.city && (
                            <p className="text-[10px] text-red-600 mt-1 font-sans">
                              {addressErrors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={addressForm.state}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                state: e.target.value,
                              })
                            }
                            placeholder="Telangana"
                            className={`w-full px-3.5 py-3 bg-[#FAF7F2] border ${
                              addressErrors.state
                                ? "border-red-500"
                                : "border-[#30372F]/20"
                            } text-sm font-sans focus:outline-none focus:border-[#C5A059] rounded-xs`}
                          />
                          {addressErrors.state && (
                            <p className="text-[10px] text-red-600 mt-1 font-sans">
                              {addressErrors.state}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#30372F] mb-1">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            value={addressForm.pincode}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                pincode: e.target.value,
                              })
                            }
                            placeholder="500033"
                            maxLength={6}
                            className={`w-full px-3.5 py-3 bg-[#FAF7F2] border ${
                              addressErrors.pincode
                                ? "border-red-500"
                                : "border-[#30372F]/20"
                            } text-sm font-sans focus:outline-none focus:border-[#C5A059] rounded-xs`}
                          />
                          {addressErrors.pincode && (
                            <p className="text-[10px] text-red-600 mt-1 font-sans">
                              {addressErrors.pincode}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="save_addr_check"
                          checked={saveAddressToProfile}
                          onChange={(e) =>
                            setSaveAddressToProfile(e.target.checked)
                          }
                          className="accent-[#30372F]"
                        />
                        <label
                          htmlFor="save_addr_check"
                          className="text-xs font-sans text-[#30372F] cursor-pointer"
                        >
                          Save address to my account profile for future
                          purchases
                        </label>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#30372F] hover:bg-[#C5A059] hover:text-[#30372F] text-[#FAF7F2] text-xs font-sans font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 rounded-xs"
                  >
                    <span>CONTINUE TO DELIVERY METHOD</span>
                    <ChevronRight size={14} />
                  </button>
                </form>
              ) : (
                <div className="text-xs font-sans text-[#30372F]/80 space-y-1 bg-[#FAF7F2] p-4 rounded-xs border border-[#30372F]/10">
                  {activeAddress ? (
                    <>
                      <p className="font-semibold text-[#30372F] text-sm">
                        {activeAddress.fullName}
                      </p>
                      <p>
                        {activeAddress.houseFlat}, {activeAddress.street}
                      </p>
                      <p>
                        {activeAddress.city}, {activeAddress.state} -{" "}
                        {activeAddress.pincode}
                      </p>
                    </>
                  ) : (
                    <p>No address selected</p>
                  )}
                </div>
              )}
            </div>

            {/* STEP 3: DELIVERY METHOD */}
            <div
              className={`bg-white border rounded-sm p-6 sm:p-9 transition-all duration-300 ${
                currentStep === 3
                  ? "border-[#C5A059] shadow-[0_10px_35px_rgba(41,35,31,0.06)]"
                  : "border-[#30372F]/15 opacity-90"
              }`}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#30372F]/10">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm transition-colors ${
                      currentStep === 3
                        ? "bg-[#30372F] text-[#FAF7F2]"
                        : "bg-[#C5A059]/20 text-[#30372F]"
                    }`}
                  >
                    3
                  </div>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl text-[#30372F] font-normal tracking-wide">
                      Delivery & Packaging
                    </h2>
                    <p className="text-xs font-sans text-[#30372F]/60 font-light mt-0.5">
                      Select your preferred insured vault transit velocity
                    </p>
                  </div>
                </div>
                {currentStep > 3 && (
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-sans text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
              </div>

              {currentStep === 3 ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-4">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedShippingOptionId(option.id)}
                        className={`p-5 border rounded-xs cursor-pointer transition-all flex items-start justify-between ${
                          selectedShippingOptionId === option.id
                            ? "border-[#C5A059] bg-[#C5A059]/10 shadow-sm ring-1 ring-[#C5A059]/30"
                            : "border-[#30372F]/15 bg-[#FAF7F2] hover:border-[#30372F]/30"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="radio"
                            name="shipping_method"
                            checked={selectedShippingOptionId === option.id}
                            onChange={() =>
                              setSelectedShippingOptionId(option.id)
                            }
                            className="mt-1 accent-[#30372F]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-sm font-semibold text-[#30372F]">
                                {option.name}
                              </span>
                              {option.isFreeEligible && (
                                <span className="px-2 py-0.5 text-[10px] bg-[#C5A059] text-[#30372F] font-bold uppercase tracking-wider rounded-xs">
                                  COMPLIMENTARY
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-sans text-[#30372F]/70 mt-1 font-light">
                              {option.description}
                            </p>
                            <p className="text-xs font-sans text-[#C5A059] font-medium mt-1 flex items-center gap-1">
                              <Truck size={13} /> Transit Estimate:{" "}
                              {option.estimatedDays}
                            </p>
                          </div>
                        </div>

                        <span className="font-sans text-sm font-semibold text-[#30372F]">
                          {option.cost === 0
                            ? "FREE"
                            : `₹ ${option.cost.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 p-4 rounded-xs text-xs font-sans text-[#30372F] flex items-center gap-3">
                    <Sparkles size={18} className="text-[#C5A059] shrink-0" />
                    <span>
                      Every order includes{" "}
                      <strong>Signature Velvet Jewelry Box</strong>, BIS
                      Hallmarked Authenticity Card, and Insured Sealed Courier.
                    </span>
                  </div>

                  <button
                    onClick={handleProceedFromDelivery}
                    className="w-full py-4 bg-[#30372F] hover:bg-[#C5A059] hover:text-[#30372F] text-[#FAF7F2] text-xs font-sans font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 rounded-xs"
                  >
                    <span>CONTINUE TO PAYMENT</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-xs font-sans text-[#30372F]/80 bg-[#FAF7F2] p-4 rounded-xs border border-[#30372F]/10">
                  <p className="font-semibold text-[#30372F]">
                    {activeShippingOption.name}
                  </p>
                  <p className="text-[#30372F]/60">
                    {activeShippingOption.cost === 0
                      ? "Complimentary Transit"
                      : `₹ ${activeShippingOption.cost}`}{" "}
                    • {activeShippingOption.estimatedDays}
                  </p>
                </div>
              )}
            </div>

            {/* STEP 4: DIRECT ORDER CONFIRMATION */}
            <div
              className={`bg-white border rounded-sm p-6 sm:p-9 transition-all duration-300 ${
                currentStep === 4
                  ? "border-[#C5A059] shadow-[0_10px_35px_rgba(41,35,31,0.06)]"
                  : "border-[#30372F]/15 opacity-80"
              }`}
            >
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#30372F]/10">
                <div className="w-9 h-9 rounded-full bg-[#30372F] text-[#FAF7F2] flex items-center justify-center font-serif text-sm">
                  4
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#30372F] font-normal tracking-wide">
                    Direct Order Confirmation
                  </h2>
                  <p className="text-xs font-sans text-[#30372F]/60 font-light mt-0.5">
                    Review order details and place order directly (No payment
                    gateway required)
                  </p>
                </div>
              </div>

              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* DIRECT CONFIRMATION DETAILS */}
                  <div className="bg-[#FAF7F2] border border-[#C5A059]/30 p-5 rounded-xs space-y-3.5 text-xs font-sans">
                    <div className="flex items-center gap-2 text-[#C5A059] font-semibold">
                      <CheckCircle2 size={16} />
                      <span>Instant Order Placement Enabled</span>
                    </div>

                    <div className="space-y-1.5 text-[#30372F]/80 border-t border-[#30372F]/10 pt-3">
                      <p>
                        <strong>Deliver To:</strong> {contactInfo.fullName} (
                        {contactInfo.email})
                      </p>
                      {activeAddress && (
                        <p>
                          <strong>Address:</strong> {activeAddress.houseFlat},{" "}
                          {activeAddress.street}, {activeAddress.city},{" "}
                          {activeAddress.state} - {activeAddress.pincode}
                        </p>
                      )}
                      <p>
                        <strong>Shipping:</strong> {activeShippingOption.name} (
                        {activeShippingOption.estimatedDays})
                      </p>
                      <p>
                        <strong>Total Amount:</strong>{" "}
                        <span className="font-semibold text-base text-[#30372F]">
                          ₹ {grandTotal.toLocaleString("en-IN")}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* PLACE ORDER BUTTON */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handlePlaceOrder}
                      className="w-full py-4.5 bg-[#30372F] hover:bg-[#C5A059] hover:text-[#30372F] text-[#FAF7F2] text-xs font-sans font-semibold tracking-[0.25em] uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 rounded-xs"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>CONFIRMING & PLACING YOUR ORDER...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} className="text-[#C5A059]" />
                          <span>
                            CONFIRM & PLACE ORDER (₹{" "}
                            {grandTotal.toLocaleString("en-IN")})
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] font-sans text-center text-[#30372F]/60 mt-3 font-light">
                      By clicking Confirm & Place Order, your order will be
                      directly placed into our luxury vault ledger.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - STICKY LUXURY ORDER SUMMARY RECEIPT */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white border border-[#C5A059]/30 p-6 sm:p-8 shadow-[0_10px_40px_rgba(41,35,31,0.05)] rounded-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#30372F]/15 mb-6">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#C5A059] font-semibold">
                    YOUR SELECTION
                  </span>
                  <h2 className="font-serif text-2xl text-[#30372F] font-normal tracking-wide">
                    Order Summary
                  </h2>
                </div>
                <span className="text-xs font-sans font-medium px-2.5 py-1 bg-[#30372F]/5 rounded-full text-[#30372F]">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* PRODUCT CARDS LIST */}
              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 mb-6 border-b border-[#30372F]/15 pb-6">
                {cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize || index}`}
                    className="flex items-start gap-4 p-2 rounded-xs hover:bg-[#FAF7F2] transition-colors"
                  >
                    <div className="w-16 h-20 aspect-[3/4] bg-[#FAF7F2] border border-[#30372F]/10 overflow-hidden shrink-0 rounded-xs">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans text-xs font-semibold text-[#30372F] leading-snug line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] font-sans text-[#C5A059] font-medium mt-0.5">
                        {item.product.descriptor}
                      </p>
                      {item.selectedSize && (
                        <p className="text-[11px] font-sans text-[#30372F]/60 mt-0.5">
                          Size:{" "}
                          <span className="font-medium text-[#30372F]">
                            {item.selectedSize}
                          </span>
                        </p>
                      )}
                      <p className="text-[11px] font-sans text-[#30372F]/70 mt-1">
                        Qty: {item.quantity} × ₹{" "}
                        {item.product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="font-sans text-xs font-semibold text-[#30372F] shrink-0">
                      ₹{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* COUPON CODE BOX */}
              <div className="mb-6 pb-6 border-b border-[#30372F]/15">
                <label className="block text-xs font-sans font-medium uppercase tracking-wider text-[#30372F] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} className="text-[#C5A059]" />
                    <span>Have a coupon code?</span>
                  </span>
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3.5 bg-[#C5A059]/15 border border-[#C5A059]/40 rounded-xs text-xs font-sans">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={13} className="text-[#C5A059]" />
                        <span className="font-bold text-[#30372F]">
                          {appliedCoupon.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#30372F]/70 mt-0.5">
                        {appliedCoupon.description}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-sans text-red-700 hover:underline font-semibold p-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        placeholder="ENTER CODE (e.g. WELCOME10)"
                        className="flex-1 px-3.5 py-3 bg-[#FAF7F2] border border-[#30372F]/20 text-xs font-sans uppercase tracking-wider text-[#30372F] focus:outline-none focus:border-[#C5A059] rounded-xs"
                      />
                      <button
                        type="button"
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        onClick={handleApplyCoupon}
                        className="px-5 py-3 bg-[#30372F] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#30372F] text-xs font-sans uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 rounded-xs"
                      >
                        {isApplyingCoupon ? "..." : "APPLY"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 font-sans mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {couponError}
                      </p>
                    )}
                    {couponSuccessMsg && (
                      <p className="text-[11px] text-green-700 font-sans mt-1.5 flex items-center gap-1 font-medium">
                        <Check size={12} /> {couponSuccessMsg}
                      </p>
                    )}
                    <p className="text-[10px] text-[#30372F]/50 font-sans mt-1.5">
                      Available:{" "}
                      <strong className="text-[#30372F]">WELCOME10</strong> (10%
                      off) • <strong className="text-[#30372F]">ROYAL15</strong>{" "}
                      (15% off over ₹50k)
                    </p>
                  </div>
                )}
              </div>

              {/* FINANCIAL BREAKDOWN */}
              <div className="space-y-3.5 text-xs font-sans">
                <div className="flex justify-between text-[#30372F]/80">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#30372F]">
                    ₹ {cartSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#C5A059] font-semibold">
                    <span>Coupon Savings</span>
                    <span>- ₹ {couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#30372F]/80">
                  <span>
                    Insured Transit ({activeShippingOption.name.split(" ")[0]})
                  </span>
                  <span className="font-semibold text-[#30372F]">
                    {shippingFee === 0 ? (
                      <span className="text-[#C5A059] font-bold">
                        COMPLIMENTARY
                      </span>
                    ) : (
                      `₹ ${shippingFee.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[#30372F]/60 text-[11px]">
                  <span>GST / Jewellery Tax (3% Included)</span>
                  <span>₹ {gstTaxAmount.toLocaleString("en-IN")}</span>
                </div>

                <div className="pt-4 border-t border-[#30372F]/15 flex items-baseline justify-between">
                  <div>
                    <span className="font-serif text-xl text-[#30372F] font-normal">
                      Grand Total
                    </span>
                    <p className="text-[10px] text-[#30372F]/50 font-light">
                      Includes all taxes, transit insurance & certificate
                    </p>
                  </div>
                  <span className="font-sans text-2xl font-semibold text-[#30372F]">
                    ₹ {grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* LUXURY TRUST ASSURANCE BOX */}
              <div className="mt-6 pt-6 border-t border-[#30372F]/15 space-y-3 text-[11px] font-sans text-[#30372F]/80 bg-[#FAF7F2] p-4 rounded-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-[#C5A059] shrink-0" />
                  <span>
                    100% Certified Authentic Pearls & BIS Hallmarked Gold
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Lock size={16} className="text-[#C5A059] shrink-0" />
                  <span>256-Bit SSL Encrypted Razorpay Gateway</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className="text-[#C5A059] shrink-0" />
                  <span>Complimentary Luxury Velvet Box & Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

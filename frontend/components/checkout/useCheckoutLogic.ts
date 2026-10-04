import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ALL_DISTRICT_NAMES, getAreasForDistrict } from "@/lib/data/districts";

export type PaymentMethod = "COD" | "Online" | "bKash";
export type CourierTier = "standard" | "express" | "insured";

const DELIVERY_OPTIONS: Record<"Dhaka" | "Outside Dhaka", Array<{ value: CourierTier; label: string; price: number }>> = {
  Dhaka: [
    { value: "standard", label: "Standard delivery", price: 70 },
    { value: "express", label: "Priority delivery", price: 120 },
  ],
  "Outside Dhaka": [
    { value: "standard", label: "Nationwide delivery", price: 150 },
    { value: "insured", label: "Protected delivery", price: 250 },
  ],
};

const isValidBdPhone = (value: string) => /^01[3-9]\d{8}$/.test(value.trim());
const isValidOptionalEmail = (value: string) => !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export type CheckoutLogic = ReturnType<typeof useCheckoutLogic>;

export function useCheckoutLogic() {
  const router = useRouter();
  const { items: cartItems, removeFromCart, updateQuantity, clearCart, restoreDemoCart, subtotal } = useCart();

  // Basic Details
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [address, setAddress] = useState("");
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState<PaymentMethod>("COD");
  const [orderNote, setOrderNote] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submissionGuardRef = useRef(false);

  // Step Navigation & Courier Tier
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [courierTier, setCourierTier] = useState<CourierTier>("standard");

  // EMI Financing (Lucrative Checkout)
  const [emiMonths, setEmiMonths] = useState<3 | 6 | 12>(6);

  // Coupon Engine
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Carry the cart-level promotion into whichever checkout template is active.
  useEffect(() => {
    try {
      const savedCoupon = sessionStorage.getItem("techhub_cart_coupon");
      if (!savedCoupon) return;
      const parsed = JSON.parse(savedCoupon) as { code?: string; discount?: number };
      if (parsed.code && typeof parsed.discount === "number" && parsed.discount > 0) {
        /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from cart session state */
        setCouponCode(parsed.code);
        setCouponDiscount(Math.min(parsed.discount, subtotal));
        setCouponApplied(true);
        setCouponMessage({ type: "success", text: `${parsed.code} carried over from your cart.` });
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      sessionStorage.removeItem("techhub_cart_coupon");
    }
  }, [subtotal]);

  // District-dependent delivery and areas
  const deliveryZone: "Dhaka" | "Outside Dhaka" =
    district.trim().toLowerCase() === "dhaka"
      ? "Dhaka"
      : district.trim().length > 0
      ? "Outside Dhaka"
      : "Dhaka";

  const availableAreas = getAreasForDistrict(district);

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    setArea("");
    setCourierTier("standard");
  };

  // Shared delivery catalogue keeps displayed and charged rates aligned.
  const availableCourierOptions = DELIVERY_OPTIONS[deliveryZone];
  const selectedCourierOption = availableCourierOptions.find((option) => option.value === courierTier)
    ?? availableCourierOptions[0];
  const deliveryCharge = cartItems.length === 0 ? 0 : selectedCourierOption.price;

  // High-value outside Dhaka requires advance delivery fee payment (SRS 3.1)
  const isHighValue = subtotal >= 20000;
  const isAdvanceRequired = deliveryZone === "Outside Dhaka" && isHighValue && cartItems.length > 0;

  // Totals
  const totalAmount = Math.max(0, subtotal + deliveryCharge - couponDiscount);
  const advanceToPay = isAdvanceRequired ? deliveryCharge : 0;
  const dueOnDelivery = Math.max(0, totalAmount - advanceToPay);

  // EMI Eligibility & Calculation (threshold: ৳10,000+)
  const isEmiEligible = subtotal >= 10000;
  const monthlyEmi = Math.round(totalAmount / emiMonths);

  // Shared checkout validation rules used by every presentation template.
  const isPhoneValid = isValidBdPhone(phone);
  const isEmailValid = isValidOptionalEmail(email);
  const isContactValid = fullName.trim().length >= 2 && isPhoneValid && isEmailValid;
  const isShippingValid =
    district.trim().length > 0 &&
    area.trim().length > 0 &&
    address.trim().length >= 2 &&
    (sameBillingAddress || billingAddress.trim().length >= 2);

  // Phone Validation (Bangladeshi 11-digit regex: 013-019)
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (val.length > 0 && !isValidBdPhone(val)) {
      setPhoneError("Enter valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX)");
    } else {
      setPhoneError("");
    }
  };

  // Step-Level Form Validation for Precise Checkout
  const isStep1Valid =
    fullName.trim().length >= 2 &&
    /^01[3-9]\d{8}$/.test(phone.trim()) &&
    district.trim().length > 0 &&
    area.trim().length > 0 &&
    address.trim().length >= 2;

  const isStep2Valid = true; // Courier tier is selected by default

  // Coupon Handlers
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return false;
    if (trimmed === "TECHHUB500" || trimmed === "STARTECH" || trimmed === "DISCOUNT500") {
      setCouponDiscount(500);
      setCouponApplied(true);
      setCouponMessage({ type: "success", text: "৳500 TechHub promotional voucher applied!" });
      return true;
    } else if (trimmed === "SAVE1000" && subtotal >= 25000) {
      setCouponDiscount(1000);
      setCouponApplied(true);
      setCouponMessage({ type: "success", text: "৳1,000 High-Ticket hardware coupon applied!" });
      return true;
    } else {
      setCouponMessage({ type: "error", text: "Invalid or expired coupon code. Try 'TECHHUB500'" });
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponMessage(null);
    try {
      sessionStorage.removeItem("techhub_cart_coupon");
    } catch {
      // Session storage unavailable.
    }
  };

  // Order Submission
  const handleOrderSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submissionGuardRef.current) return;
    setSubmitError("");
    if (cartItems.length === 0) return;
    if (phoneError || phone.length < 11) {
      setPhoneError("Please enter a valid 11-digit Bangladeshi mobile number.");
      return;
    }
    if (!termsAccepted) {
      setSubmitError("Please accept the terms and policies before placing your order.");
      return;
    }

    submissionGuardRef.current = true;
    setIsSubmitting(true);

    try {
      // Temporary mock latency so the frontend behaves like the future order API.
      // Replace this delay with the awaited backend request when order creation is connected.
      await new Promise((resolve) => setTimeout(resolve, 700));

      try {
        localStorage.setItem(
          "techhub_last_order",
          JSON.stringify({
          invoiceNo: `TH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          total: totalAmount,
          subtotal,
          deliveryCharge,
          couponDiscount,
          dueOnDelivery,
          name: fullName || "Ziaul Karim",
          phone: phone || "01712345678",
          email: email.trim() || undefined,
          area: area.trim() || undefined,
          address: [address, area, district].filter(Boolean).join(", "),
          sameBillingAddress,
          billingAddress: sameBillingAddress ? address : billingAddress.trim(),
          termsAccepted,
          termsAcceptedAt: new Date().toISOString(),
          termsVersion: "2026-09-17",
          paymentOption,
          courierTier,
          orderNote: orderNote || undefined,
            items: cartItems.map((item) => ({
              name: item.title,
              serial: `SN-${item.slug?.slice(0, 8).toUpperCase() || "TH"}-${Math.floor(100000 + Math.random() * 900000)}`,
              price: item.price,
              quantity: item.quantity,
            })),
          })
        );
      } catch {
        // The confirmation can still complete when browser storage is unavailable.
      }
      try {
        sessionStorage.removeItem("techhub_cart_coupon");
      } catch {
        // Session storage unavailable.
      }
      clearCart();
      router.replace("/checkout/success");
    } catch {
      setSubmitError("We could not place your order. Please review your details and try again.");
    } finally {
      submissionGuardRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    restoreDemoCart,
    subtotal,
    district,
    setDistrict,
    handleDistrictChange,
    availableDistricts: ALL_DISTRICT_NAMES,
    area,
    setArea,
    availableAreas,
    deliveryZone,
    paymentOption,
    setPaymentOption,
    phone,
    phoneError,
    email,
    setEmail,
    fullName,
    setFullName,
    address,
    setAddress,
    sameBillingAddress,
    setSameBillingAddress,
    billingAddress,
    setBillingAddress,
    orderNote,
    setOrderNote,
    isSubmitting,
    submitError,
    deliveryCharge,
    availableCourierOptions,
    isAdvanceRequired,
    totalAmount,
    advanceToPay,
    dueOnDelivery,
    handlePhoneChange,
    handleOrderSubmit,
    isPhoneValid,
    isEmailValid,
    isContactValid,
    isShippingValid,
    // Step navigation (Precise)
    step,
    setStep,
    courierTier,
    setCourierTier,
    isStep1Valid,
    isStep2Valid,
    termsAccepted,
    setTermsAccepted,
    // EMI (Lucrative)
    emiMonths,
    setEmiMonths,
    isEmiEligible,
    monthlyEmi,
    // Coupons
    couponCode,
    setCouponCode,
    couponApplied,
    couponDiscount,
    couponMessage,
    applyCoupon,
    removeCoupon,
  };
}

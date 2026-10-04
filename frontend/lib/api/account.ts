/**
 * Customer Account & RMA API Client / Service Layer
 *
 * Provides a strongly-typed contract for:
 * 1. OTP-based authentication (request, verify, resend)
 * 2. Customer profile and order tracking retrieval (with serial/IMEI binding)
 * 3. RMA & warranty claim ticket submissions
 *
 * Current implementation provides simulated network latency and validation.
 * When the backend API is ready, replace the mock implementations with
 * standard fetch calls to your API endpoints without changing the UI layer.
 */

export interface CustomerProfile {
  id?: string;
  name: string;
  phone: string;
  email?: string;
}

export interface OrderItem {
  name: string;
  serial: string;
  price: number;
}

export interface TimelineStep {
  title: string;
  time: string;
  completed: boolean;
}

export interface CustomerOrder {
  invoiceNo: string;
  date: string;
  total: number;
  status: string;
  courierName: string;
  trackingCode: string;
  items: OrderItem[];
  timeline: TimelineStep[];
}

export interface OtpResponse {
  success: boolean;
  message: string;
  destination: string;
  resendCooldownSec: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  token?: string;
  customer?: CustomerProfile;
  message?: string;
}

export interface RmaClaimPayload {
  serialNumber: string;
  problemDescription: string;
  attachments?: string[]; // Base64 data URLs or preview URLs
}

export interface RmaClaimResponse {
  success: boolean;
  ticketReference: string;
  estimatedResolution: string;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BANGLADESH_MOBILE_PATTERN = /^(?:\+?880|0)1[3-9]\d{8}$/;

export function isValidLoginIdentifier(value: string): boolean {
  const normalized = value.replace(/[\s-]/g, "");
  return EMAIL_PATTERN.test(value.trim()) || BANGLADESH_MOBILE_PATTERN.test(normalized);
}

export function normalizeLoginIdentifier(value: string): string {
  const trimmed = value.trim();
  if (EMAIL_PATTERN.test(trimmed)) return trimmed;

  const mobile = trimmed.replace(/[\s-]/g, "");
  if (mobile.startsWith("+880")) return mobile;
  if (mobile.startsWith("880")) return `+${mobile}`;
  return `+88${mobile}`;
}

const DEFAULT_SAMPLE_ORDER: CustomerOrder = {
  invoiceNo: "TH-2026-89412",
  date: "Aug 29, 2026",
  total: 124570,
  status: "In-Transit (Courier Dispatched)",
  courierName: "Steadfast Courier",
  trackingCode: "STDF-89218412",
  items: [
    { name: "NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X", serial: "SN-RTX4070-882194", price: 79500 },
    { name: "AMD Ryzen 7 7800X3D AM5 Gaming Processor", serial: "SN-R7-7800X-11203", price: 44999 },
  ],
  timeline: [
    { title: "Order Placed & Confirmed", time: "Aug 29, 10:15 AM", completed: true },
    { title: "Advance Delivery Fee Verified (৳150)", time: "Aug 29, 11:30 AM", completed: true },
    { title: "Serial / IMEI Assigned & Invoiced", time: "Aug 29, 02:40 PM", completed: true },
    { title: "Dispatched via Steadfast Courier", time: "Aug 30, 09:00 AM", completed: true },
    { title: "Out for Courier Delivery (Dhaka Hub)", time: "Pending", completed: false },
  ],
};

/**
 * Request an OTP verification code for login/registration.
 */
export async function requestOtp(identifier: string): Promise<OtpResponse> {
  const trimmed = identifier.trim();
  if (!isValidLoginIdentifier(trimmed)) {
    throw new Error("Please enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX) or email address.");
  }

  // Simulated network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const destination = normalizeLoginIdentifier(trimmed);
  return {
    success: true,
    message: `Verification code sent to ${destination}`,
    destination,
    resendCooldownSec: 60,
  };
}

/**
 * Verify 6-digit OTP code submitted by user.
 */
export async function verifyOtpCode(identifier: string, code: string): Promise<VerifyOtpResponse> {
  if (!/^\d{6}$/.test(code)) {
    throw new Error("Enter the complete 6-digit numeric verification code.");
  }

  // Simulated network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    token: "mock-jwt-token-customer-portal",
    customer: {
      name: "Ziaul Karim",
      phone: normalizeLoginIdentifier(identifier),
      email: identifier.includes("@") ? identifier.trim() : undefined,
    },
    message: "Identity verified successfully",
  };
}

/**
 * Resend OTP code after cooldown timer.
 */
export async function resendOtpCode(identifier: string): Promise<OtpResponse> {
  return requestOtp(identifier);
}

/**
 * Fetch customer's active order tracking and bound hardware serials.
 */
export async function getCustomerOrder(invoiceNo?: string): Promise<CustomerOrder> {
  // Simulated network latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("techhub_last_order");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.items && parsed.items.length > 0) {
          return {
            ...DEFAULT_SAMPLE_ORDER,
            invoiceNo: parsed.invoiceNo || invoiceNo || DEFAULT_SAMPLE_ORDER.invoiceNo,
            date: parsed.date || DEFAULT_SAMPLE_ORDER.date,
            total: parsed.total || DEFAULT_SAMPLE_ORDER.total,
            items: parsed.items,
          };
        }
      }
    } catch {
      // Fallback to sample
    }
  }

  return DEFAULT_SAMPLE_ORDER;
}

/**
 * Submit Return / Warranty Claim (RMA) ticket.
 */
export async function submitRmaClaim(payload: RmaClaimPayload): Promise<RmaClaimResponse> {
  if (!payload.serialNumber.trim()) {
    throw new Error("Product Serial Number or IMEI is required.");
  }
  if (!payload.problemDescription.trim() || payload.problemDescription.trim().length < 10) {
    throw new Error("Please provide a detailed problem description (at least 10 characters).");
  }

  // Simulated network latency
  await new Promise((resolve) => setTimeout(resolve, 750));

  const randomRef = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  const ticketReference = `RMA-${year}-${randomRef}`;

  return {
    success: true,
    ticketReference,
    estimatedResolution: "24-48 hours",
    message: "Your RMA claim ticket has been submitted to the Technical Service Center.",
  };
}

const clean = (value: string | undefined) => value?.trim() || undefined;

const phoneHref = (value: string | undefined) => {
  if (!value) return undefined;
  const normalized = value.replace(/(?!^\+)\D/g, "");
  return normalized ? `tel:${normalized}` : undefined;
};

const whatsappHref = (value: string | undefined) => {
  if (!value) return undefined;
  const normalized = value.replace(/\D/g, "");
  return normalized ? `https://wa.me/${normalized}` : undefined;
};

const supportPhone = clean(process.env.NEXT_PUBLIC_SUPPORT_PHONE);
const whatsappNumber = clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

export const storefrontConfig = {
  name: clean(process.env.NEXT_PUBLIC_STORE_NAME) ?? "TechHub Bangladesh",
  legalName: clean(process.env.NEXT_PUBLIC_LEGAL_NAME),
  supportEmail: clean(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
  supportPhone,
  supportPhoneHref: phoneHref(supportPhone),
  whatsappHref: whatsappHref(whatsappNumber),
  address: clean(process.env.NEXT_PUBLIC_STORE_ADDRESS),
  businessHours: clean(process.env.NEXT_PUBLIC_BUSINESS_HOURS),
  tradeLicense: clean(process.env.NEXT_PUBLIC_TRADE_LICENSE),
} as const;

import { storefrontConfig } from "@/lib/storefrontConfig";

export default function FloatingWidgets() {
  const { supportPhoneHref, whatsappHref } = storefrontConfig;

  if (!supportPhoneHref && !whatsappHref) return null;

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 print:hidden xl:flex">
      {supportPhoneHref && (
        <a
          href={supportPhoneHref}
          aria-label="Call customer support"
          className="flex size-12 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition hover:bg-secondary-hover hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
          </svg>
        </a>
      )}
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:bg-emerald-600 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2a9.84 9.84 0 0 0-8.51 14.78L2 22l5.37-1.49A9.99 9.99 0 1 0 12.04 2Zm5.82 14.12c-.25.7-1.46 1.34-2.04 1.42-.52.08-1.19.11-1.92-.12-.44-.14-1.01-.33-1.73-.64-3.05-1.32-5.04-4.4-5.19-4.6-.14-.2-1.24-1.65-1.24-3.15s.78-2.23 1.06-2.54c.28-.3.61-.38.81-.38h.58c.18 0 .43-.07.67.51.25.6.85 2.08.92 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.45.54-.15.15-.3.31-.13.61.18.3.78 1.28 1.67 2.07 1.15 1.02 2.12 1.34 2.42 1.49.3.15.48.13.66-.08.18-.2.76-.89.97-1.19.2-.3.4-.25.68-.15.28.1 1.77.84 2.07.99.3.15.5.23.58.35.08.13.08.73-.18 1.43Z" />
          </svg>
        </a>
      )}
    </aside>
  );
}

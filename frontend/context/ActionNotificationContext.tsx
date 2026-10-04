"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import type { ProductVisualType } from "@/components/storefront/ProductVisual";

export type ToastStatus = "success" | "error" | "info";
export type ToastActionType = "cart" | "wishlist" | "compare";

export interface ToastPayload {
  id?: string | number;
  type?: ToastActionType;
  status?: ToastStatus;
  title?: string;
  message?: string;
  price?: number;
  regularPrice?: number;
  visualType?: ProductVisualType;
  actionText?: string;
  actionHref?: string;
}

interface ActionNotificationContextType {
  showNotification: (payload: ToastPayload) => void;
  hideNotification: () => void;
}

const ActionNotificationContext = createContext<ActionNotificationContextType | undefined>(undefined);

export function ActionNotificationProvider({ children }: { children: React.ReactNode }) {
  const [activeToast, setActiveToast] = useState<ToastPayload | null>(null);
  const [toastKey, setToastKey] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const hideNotification = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveToast(null);
      setIsClosing(false);
    }, 200);
  }, []);

  const showNotification = useCallback(
    (payload: ToastPayload) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setIsClosing(false);
      setActiveToast(payload);
      setToastKey((prev) => prev + 1);

      // Auto dismiss after 4.5 seconds (matching production e-commerce duration)
      timerRef.current = setTimeout(() => {
        hideNotification();
      }, 4500);
    },
    [hideNotification]
  );

  const status = activeToast?.status || "success";
  const isError = status === "error";
  const isInfo = status === "info";

  // Build the message if not explicitly provided
  const displayTitle =
    activeToast?.title ||
    (isError ? "Error" : isInfo ? "Removed" : "Success");
  const displayMessage =
    activeToast?.message ||
    (activeToast?.type === "cart"
      ? "Product successfully added to your cart."
      : activeToast?.type === "wishlist"
      ? (isError ? "This product is already in your wishlist." : isInfo ? "Product removed from your wishlist." : "Product successfully added to wishlist.")
      : (isError ? "This product is already in your compare list." : isInfo ? "Product removed from your compare list." : "Product added to your compare list."));

  return (
    <ActionNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}

      {/* Production Toast Notification Matching Reference Exactly */}
      {activeToast && (
        <div
          key={toastKey}
          role="status"
          aria-live="polite"
          className={`fixed top-4 right-4 sm:top-5 sm:right-6 z-[99999] pointer-events-auto transition-all duration-200 ${
            isClosing
              ? "opacity-0 translate-y-[-6px] scale-95 pointer-events-none"
              : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-top-2 duration-200"
          }`}
        >
          <div
            className={`relative flex items-center gap-3.5 rounded-lg py-3 px-4 sm:py-3.5 sm:px-5 text-white shadow-xl min-w-[280px] sm:min-w-[340px] max-w-[calc(100vw-2rem)] sm:max-w-[420px] ${
              isError
                ? "bg-[#c0392b]/95 border border-[#e74c3c]/30"
                : isInfo
                ? "bg-[#37474f]/95 border border-[#546e7a]/40"
                : "bg-[#43a047]/95 border border-[#4caf50]/30"
            }`}
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.35), 0 0 1px 1px rgba(255, 255, 255, 0.15) inset",
            }}
          >
            {/* Left Icon (Shield Exclamation for error, Minus-Circle/Info for neutral info, Checkmark for success) */}
            <div className="shrink-0 self-center">
              {isError ? (
                <svg
                  className="size-7 sm:size-8 text-white/95 drop-shadow-sm"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm1 10.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                </svg>
              ) : isInfo ? (
                <svg
                  className="size-7 sm:size-8 text-white/95 drop-shadow-sm"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              ) : (
                <svg
                  className="size-7 sm:size-8 text-white/95 drop-shadow-sm"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>

            {/* Text Message Body */}
            <div className="min-w-0 flex-1 pr-4">
              <h4 className="text-[15px] sm:text-base font-bold text-white leading-snug drop-shadow-xs">
                {displayTitle}
              </h4>
              <p className="mt-0.5 text-xs sm:text-[13px] text-white/95 leading-snug font-normal drop-shadow-xs">
                {displayMessage}
              </p>
            </div>

            {/* Close Cross Button */}
            <button
              type="button"
              onClick={hideNotification}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex size-5 items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
              aria-label="Close notification"
            >
              <svg className="size-3.5 stroke-[2.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </ActionNotificationContext.Provider>
  );
}

export function useActionNotification() {
  const context = useContext(ActionNotificationContext);
  if (!context) {
    throw new Error("useActionNotification must be used within an ActionNotificationProvider");
  }
  return context;
}

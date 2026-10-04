import { useId } from "react";

interface TechHubLogoProps {
  className?: string;
  variant?: "light" | "dark";
  compact?: boolean;
  accessibleLabel?: string;
}

/**
 * TechHub Corporate SVG Brand Logo
 * Features a modern geometric circuit/polygon tech emblem + bold corporate wordmark.
 * 100% Vector scalable, razor-sharp on all Retina/HiDPI screens.
 */
export default function TechHubLogo({
  className = "h-9 w-auto",
  variant = "light",
  compact = false,
  accessibleLabel,
}: TechHubLogoProps) {
  const isDark = variant === "dark";
  const textColor = isDark ? "#0f172a" : "#ffffff";
  const instanceId = useId().replace(/:/g, "");
  const emblemGradientId = `techhub-emblem-${instanceId}`;
  const innerGradientId = `techhub-inner-${instanceId}`;

  return (
    <svg
      viewBox={compact ? "0 0 44 44" : "0 0 220 44"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={accessibleLabel ? "img" : undefined}
      aria-label={accessibleLabel}
      aria-hidden={accessibleLabel ? undefined : true}
      focusable="false"
    >
      {/* ── Brand Emblem: Modern Hexagonal Tech Core ── */}
      <g>
        {/* Outer Hexagon Shield */}
        <polygon
          points="22,3 39,12.5 39,31.5 22,41 5,31.5 5,12.5"
          fill={`url(#${emblemGradientId})`}
          stroke="#ef4a23"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Inner Geometric Circuit Lines */}
        <polygon
          points="22,9 33,15.5 33,28.5 22,35 11,28.5 11,15.5"
          fill="#081621"
          stroke={`url(#${innerGradientId})`}
          strokeWidth="1.2"
        />

        {/* Central Core 'T' Glyph & Microchip Node */}
        <path
          d="M16 17H28M22 17V30"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central Glowing Pulse Dot */}
        <circle cx="22" cy="17" r="1.5" fill="#ef4a23" />
        <circle cx="22" cy="30" r="1.2" fill="#3749bb" />
      </g>

      {/* ── Brand Typography & Accent (Hidden in compact emblem-only mode) ── */}
      {!compact && (
        <>
          {/* Brand Typography: Vector Path Outlines (100% Cross-Device & OS Consistent) */}
          <g>
            {/* TECH (Wordmark) */}
            <path
              fill={textColor}
              fillRule="evenodd"
              d="
                M 48 11 H 65 V 16.2 H 59.1 V 32 H 53.9 V 16.2 H 48 Z
                M 68.5 11 H 84 V 15.8 H 73.7 V 19.2 H 82.5 V 23.8 H 73.7 V 27.2 H 84 V 32 H 68.5 Z
                M 105 11 H 94.5 C 90.5 11 87.5 14 87.5 18 V 25 C 87.5 29 90.5 32 94.5 32 H 105 V 26.8 H 95.5 C 93.8 26.8 92.7 25.8 92.7 24 V 19 C 92.7 17.2 93.8 16.2 95.5 16.2 H 105 Z
                M 108.5 11 H 113.7 V 18.9 H 119.8 V 11 H 125 V 32 H 119.8 V 24.1 H 113.7 V 32 H 108.5 Z
              "
            />

            {/* HUB (Brand Orange Wordmark) */}
            <path
              fill="#ef4a23"
              fillRule="evenodd"
              d="
                M 132 11 H 137.2 V 18.9 H 143.3 V 11 H 148.5 V 32 H 143.3 V 24.1 H 137.2 V 32 H 132 Z
                M 152 11 H 157.2 V 24 C 157.2 25.8 158.2 26.8 160.2 26.8 C 162.2 26.8 163.3 25.8 163.3 24 V 11 H 168.5 V 24.5 C 168.5 29 165 32 160.2 32 C 155.5 32 152 29 152 24.5 Z
                M 172 11 H 183.5 C 187 11 188.5 13 188.5 16 C 188.5 18.8 186.5 20.6 183.5 21.2 C 187.2 21.8 189 24 189 27 C 189 30.2 186.8 32 183 32 H 172 Z
                M 177.2 15.5 H 182.5 C 184 15.5 184.8 16.2 184.8 17.2 C 184.8 18.2 184 18.9 182.5 18.9 H 177.2 Z
                M 177.2 23.8 H 183 C 184.5 23.8 185.3 24.5 185.3 25.6 C 185.3 26.7 184.5 27.5 183 27.5 H 177.2 Z
              "
            />
          </g>

          {/* Decorative Microchip Connect Point */}
          <circle cx="212" cy="14" r="2.5" fill="#ef4a23" />
          <path d="M196 14 H 209" stroke="#ef4a23" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {/* ── Gradient Definitions ── */}
      <defs>
        <linearGradient id={emblemGradientId} x1="5" y1="3" x2="39" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3749bb" />
          <stop offset="60%" stopColor="#ef4a23" />
          <stop offset="100%" stopColor="#c0392b" />
        </linearGradient>
        <linearGradient id={innerGradientId} x1="11" y1="9" x2="33" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3749bb" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ef4a23" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

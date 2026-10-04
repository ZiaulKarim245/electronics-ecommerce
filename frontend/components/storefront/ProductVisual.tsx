import React from "react";

export type ProductVisualType =
  | "gpu"
  | "cpu"
  | "laptop"
  | "monitor"
  | "smartphone"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "casing"
  | "cooler"
  | "desktop"
  | "tablet"
  | "office"
  | "camera"
  | "security"
  | "networking"
  | "software"
  | "server"
  | "gadget"
  | "gaming"
  | "tv"
  | "appliance"
  | "accessories";

interface ProductVisualProps {
  type: ProductVisualType;
  className?: string;
}

export default function ProductVisual({ type, className = "size-28" }: ProductVisualProps) {
  switch (type) {
    case "desktop":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(59,130,246,0.25)]">
            {/* Tower Body */}
            <rect x="25" y="15" width="55" height="90" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
            {/* Tempered Glass Front & Side */}
            <rect x="30" y="22" width="45" height="76" rx="3" fill="#020617" opacity="0.85" />
            {/* RGB Fans */}
            <circle cx="52" cy="40" r="11" fill="none" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="52" cy="65" r="11" fill="none" stroke="#a855f7" strokeWidth="2" />
            <circle cx="52" cy="85" r="7" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Power Button & USB Ports */}
            <circle cx="52" cy="18" r="1.5" fill="#38bdf8" />
            <rect x="85" y="45" width="10" height="35" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          </svg>
        </div>
      );

    case "tablet":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(168,85,247,0.25)]">
            {/* Tablet Frame */}
            <rect x="20" y="15" width="75" height="90" rx="8" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
            <rect x="24" y="20" width="67" height="80" rx="4" fill="#020617" />
            {/* Screen Gradient */}
            <rect x="26" y="22" width="63" height="76" rx="3" fill="url(#tabletGrad)" opacity="0.85" />
            {/* Stylus Pen leaning on side */}
            <line x1="98" y1="20" x2="98" y2="100" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
            <polygon points="98,103 96.5,100 99.5,100" fill="#f59e0b" />
            <defs>
              <linearGradient id="tabletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case "office":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(14,165,233,0.25)]">
            {/* Printer Main Body */}
            <rect x="20" y="45" width="80" height="45" rx="6" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" />
            {/* Top Paper In-Tray */}
            <path d="M35 45 L35 22 L85 22 L85 45 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <rect x="42" y="26" width="36" height="15" rx="2" fill="#f8fafc" opacity="0.9" />
            {/* Output Paper Tray */}
            <rect x="32" y="70" width="56" height="18" rx="2" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
            <rect x="38" y="74" width="44" height="10" rx="1" fill="#e2e8f0" />
            {/* Control Panel LED & Buttons */}
            <circle cx="88" cy="55" r="2.5" fill="#10b981" />
            <circle cx="88" cy="62" r="2" fill="#38bdf8" />
          </svg>
        </div>
      );

    case "camera":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(239,68,35,0.25)]">
            {/* Camera Body */}
            <rect x="18" y="35" width="84" height="55" rx="8" fill="#0f172a" stroke="#ef4a23" strokeWidth="2" />
            {/* Viewfinder / Flash top bump */}
            <path d="M42 35 L48 24 L72 24 L78 35 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            {/* Big Glass Lens */}
            <circle cx="60" cy="62" r="22" fill="#020617" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="60" cy="62" r="15" fill="#0f172a" stroke="#ef4a23" strokeWidth="1.5" />
            <circle cx="60" cy="62" r="8" fill="#06b6d4" opacity="0.8" />
            {/* Shutter Button & Red Dot */}
            <rect x="26" y="30" width="10" height="5" rx="1.5" fill="#e2e8f0" />
            <circle cx="28" cy="45" r="2.5" fill="#ef4a23" />
          </svg>
        </div>
      );

    case "security":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(16,185,129,0.25)]">
            {/* Ceiling / Wall Mount Base */}
            <path d="M25 25 L95 25 L85 40 L35 40 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            {/* Dome Glass Sphere */}
            <path d="M35 40 Q60 95 85 40 Z" fill="#020617" stroke="#10b981" strokeWidth="2" />
            {/* Inner Camera Lens */}
            <circle cx="60" cy="55" r="12" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
            <circle cx="60" cy="55" r="6" fill="#06b6d4" />
            {/* Infrared Red LEDs */}
            <circle cx="50" cy="48" r="1.5" fill="#ef4444" />
            <circle cx="70" cy="48" r="1.5" fill="#ef4444" />
            <circle cx="50" cy="62" r="1.5" fill="#ef4444" />
            <circle cx="70" cy="62" r="1.5" fill="#ef4444" />
          </svg>
        </div>
      );

    case "networking":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(6,182,212,0.25)]">
            {/* 4 External Wi-Fi Antennas */}
            <line x1="25" y1="20" x2="35" y2="55" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="48" y1="15" x2="50" y2="55" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="72" y1="15" x2="70" y2="55" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="95" y1="20" x2="85" y2="55" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
            {/* Router Body */}
            <rect x="20" y="55" width="80" height="35" rx="6" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" />
            {/* Geometric Top Grooves */}
            <line x1="30" y1="65" x2="90" y2="65" stroke="#1e293b" strokeWidth="2" />
            {/* Green / Cyan Status LEDs */}
            <circle cx="35" cy="78" r="2" fill="#10b981" />
            <circle cx="45" cy="78" r="2" fill="#10b981" />
            <circle cx="55" cy="78" r="2" fill="#06b6d4" />
            <circle cx="65" cy="78" r="2" fill="#06b6d4" />
            <circle cx="75" cy="78" r="2" fill="#38bdf8" />
          </svg>
        </div>
      );

    case "software":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(168,85,247,0.25)]">
            {/* Software Box / Shield */}
            <polygon points="60,18 95,32 95,72 60,102 25,72 25,32" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
            {/* Internal Circuit Lines */}
            <polygon points="60,26 87,38 87,68 60,92 33,68 33,38" fill="#020617" opacity="0.9" />
            {/* Key / License Icon */}
            <circle cx="60" cy="52" r="10" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <line x1="60" y1="62" x2="60" y2="78" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="68" x2="68" y2="68" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="74" x2="66" y2="74" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "server":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(100,116,139,0.25)]">
            {/* Rack Server Unit 1 */}
            <rect x="15" y="25" width="90" height="24" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="15" y1="25" x2="15" y2="49" stroke="#64748b" strokeWidth="5" />
            <line x1="105" y1="25" x2="105" y2="49" stroke="#64748b" strokeWidth="5" />
            {/* Drive Caddies */}
            <rect x="26" y="30" width="12" height="14" rx="1" fill="#1e293b" />
            <rect x="42" y="30" width="12" height="14" rx="1" fill="#1e293b" />
            <rect x="58" y="30" width="12" height="14" rx="1" fill="#1e293b" />
            <circle cx="85" cy="37" r="2" fill="#10b981" />
            <circle cx="93" cy="37" r="2" fill="#06b6d4" />

            {/* Rack Server Unit 2 */}
            <rect x="15" y="55" width="90" height="24" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
            <line x1="15" y1="55" x2="15" y2="79" stroke="#64748b" strokeWidth="5" />
            <line x1="105" y1="55" x2="105" y2="79" stroke="#64748b" strokeWidth="5" />
            <rect x="26" y="60" width="12" height="14" rx="1" fill="#1e293b" />
            <rect x="42" y="60" width="12" height="14" rx="1" fill="#1e293b" />
            <rect x="58" y="60" width="12" height="14" rx="1" fill="#1e293b" />
            <circle cx="85" cy="67" r="2" fill="#10b981" />
            <circle cx="93" cy="67" r="2" fill="#06b6d4" />
          </svg>
        </div>
      );

    case "gadget":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(245,158,11,0.25)]">
            {/* Watch Straps */}
            <rect x="46" y="10" width="28" height="25" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <rect x="46" y="85" width="28" height="25" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            {/* Watch Case */}
            <rect x="35" y="30" width="50" height="60" rx="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            <rect x="39" y="34" width="42" height="52" rx="10" fill="#020617" />
            {/* Digital Display Content */}
            <text x="60" y="55" fill="#f59e0b" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">10:42</text>
            <path d="M46 68 L52 68 L55 62 L58 74 L61 68 L74 68" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            {/* Crown Button */}
            <rect x="85" y="48" width="4" height="12" rx="1" fill="#ca8a04" />
          </svg>
        </div>
      );

    case "gaming":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(239,68,35,0.25)]">
            {/* Game Controller Shell */}
            <path d="M25 45 C35 30 85 30 95 45 C105 60 102 95 86 95 C75 95 70 78 60 78 C50 78 45 95 34 95 C18 95 15 60 25 45 Z" fill="#0f172a" stroke="#ef4a23" strokeWidth="2" />
            {/* D-Pad */}
            <path d="M37 54 L41 54 L41 50 L45 50 L45 54 L49 54 L49 58 L45 58 L45 62 L41 62 L41 58 L37 58 Z" fill="#38bdf8" />
            {/* Action Buttons */}
            <circle cx="80" cy="50" r="2.5" fill="#ef4444" />
            <circle cx="74" cy="56" r="2.5" fill="#3b82f6" />
            <circle cx="86" cy="56" r="2.5" fill="#10b981" />
            <circle cx="80" cy="62" r="2.5" fill="#f59e0b" />
            {/* Dual Thumbsticks */}
            <circle cx="48" cy="70" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="72" cy="70" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case "tv":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 140 110" className="w-full h-full drop-shadow-[0_10px_20px_rgba(59,130,246,0.25)]">
            {/* Ultra Slim TV Frame */}
            <rect x="15" y="15" width="110" height="66" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Display Area */}
            <rect x="18" y="18" width="104" height="60" rx="2" fill="#020617" />
            {/* Screen HDR Colors */}
            <rect x="20" y="20" width="100" height="56" rx="1" fill="url(#tvGrad)" opacity="0.85" />
            <text x="70" y="52" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="2">4K OLED</text>
            {/* TV Stand Base */}
            <path d="M55 81 L50 96 L90 96 L85 81 Z" fill="#334155" />
            <rect x="42" y="96" width="56" height="3" rx="1" fill="#64748b" />
            <defs>
              <linearGradient id="tvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case "appliance":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 130 90" className="w-full h-full drop-shadow-[0_10px_20px_rgba(16,185,129,0.25)]">
            {/* AC Indoor Unit */}
            <rect x="12" y="25" width="106" height="42" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            {/* Louver Air Vent */}
            <rect x="16" y="52" width="98" height="10" rx="2" fill="#020617" stroke="#34d399" strokeWidth="1" />
            {/* Air Flow Curved Breeze Lines */}
            <path d="M30 68 Q50 78 70 72" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M50 72 Q70 82 90 76" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            {/* Digital Temp Display (18°C) */}
            <text x="95" y="44" fill="#34d399" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="monospace">18°</text>
            <circle cx="26" cy="37" r="3" fill="#10b981" />
          </svg>
        </div>
      );

    case "accessories":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(244,63,94,0.25)]">
            {/* Over-ear Headphones Headband */}
            <path d="M25 65 A35 35 0 0 1 95 65" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
            <path d="M30 65 A30 30 0 0 1 90 65" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            {/* Left Earcup */}
            <rect x="16" y="55" width="16" height="32" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
            <rect x="20" y="60" width="8" height="22" rx="4" fill="#1e293b" />
            {/* Right Earcup */}
            <rect x="88" y="55" width="16" height="32" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
            <rect x="92" y="60" width="8" height="22" rx="4" fill="#1e293b" />
          </svg>
        </div>
      );

    case "gpu":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(6,182,212,0.25)]">
            {/* PCB Board */}
            <rect x="10" y="20" width="180" height="80" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <rect x="15" y="25" width="170" height="70" rx="4" fill="#1e293b" />
            {/* Dual Cooling Fans */}
            <circle cx="65" cy="60" r="24" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="65" cy="60" r="8" fill="#06b6d4" />
            <path d="M65 38 L65 52 M65 68 L65 82 M43 60 L57 60 M73 60 L87 60" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
            <circle cx="135" cy="60" r="24" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="135" cy="60" r="8" fill="#06b6d4" />
            <path d="M135 38 L135 52 M135 68 L135 82 M113 60 L127 60 M143 60 L157 60" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
            {/* PCIe Golden Pins */}
            <rect x="40" y="100" width="80" height="8" rx="1" fill="#f59e0b" />
            {/* RGB Header */}
            <line x1="25" y1="28" x2="175" y2="28" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          </svg>
        </div>
      );

    case "cpu":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(245,158,11,0.25)]">
            {/* Substrate */}
            <rect x="15" y="15" width="90" height="90" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            {/* Integrated Heat Spreader (IHS) */}
            <rect x="25" y="25" width="70" height="70" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
            <rect x="32" y="32" width="56" height="56" rx="2" fill="#1e293b" />
            {/* CPU Engraving Text */}
            <text x="60" y="55" fill="#f59e0b" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">RYZEN</text>
            <text x="60" y="68" fill="#94a3b8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">7800X3D</text>
            <text x="60" y="78" fill="#06b6d4" fontSize="5" fontWeight="bold" textAnchor="middle">3D V-CACHE</text>
            {/* Gold Corner Triangle */}
            <polygon points="17,17 25,17 17,25" fill="#fbbf24" />
          </svg>
        </div>
      );

    case "laptop":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(59,130,246,0.25)]">
            {/* Screen Lid */}
            <rect x="25" y="18" width="110" height="72" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            {/* OLED Display */}
            <rect x="30" y="23" width="100" height="62" rx="3" fill="#020617" />
            {/* Screen Content Gradient */}
            <rect x="32" y="25" width="96" height="58" rx="2" fill="url(#screenGrad)" opacity="0.8" />
            {/* Keyboard Base */}
            <path d="M10 90 L150 90 L140 102 L20 102 Z" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <rect x="65" y="93" width="30" height="4" rx="1" fill="#475569" />
            <defs>
              <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case "monitor":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(14,165,233,0.25)]">
            {/* Curved Screen Frame */}
            <path d="M15 20 Q80 26 145 20 L145 78 Q80 84 15 78 Z" fill="#020617" stroke="#0ea5e9" strokeWidth="2" />
            {/* Display Area */}
            <path d="M18 23 Q80 29 142 23 L142 75 Q80 81 18 75 Z" fill="#0f172a" />
            {/* Desktop Graphic Lines */}
            <line x1="28" y1="50" x2="132" y2="50" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            {/* Stand */}
            <path d="M75 80 L72 102 L88 102 L85 80 Z" fill="#334155" />
            <path d="M50 102 L110 102 L100 106 L60 106 Z" fill="#475569" />
          </svg>
        </div>
      );

    case "smartphone":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 90 140" className="w-full h-full drop-shadow-[0_10px_20px_rgba(6,182,212,0.25)]">
            <rect x="15" y="10" width="60" height="120" rx="12" fill="#020617" stroke="#06b6d4" strokeWidth="2" />
            <rect x="18" y="14" width="54" height="112" rx="8" fill="#0f172a" />
            {/* Screen Wallpaper */}
            <rect x="20" y="16" width="50" height="108" rx="6" fill="url(#phoneGrad)" />
            {/* Punch hole camera */}
            <circle cx="45" cy="22" r="2.5" fill="#020617" />
            <defs>
              <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case "motherboard":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(16,185,129,0.25)]">
            <rect x="10" y="10" width="100" height="100" rx="6" fill="#022c22" stroke="#10b981" strokeWidth="2" />
            {/* CPU Socket */}
            <rect x="40" y="25" width="40" height="40" rx="3" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="46" y="31" width="28" height="28" rx="1" fill="#1e293b" />
            {/* RAM Slots */}
            <rect x="88" y="20" width="4" height="50" rx="1" fill="#06b6d4" />
            <rect x="95" y="20" width="4" height="50" rx="1" fill="#06b6d4" />
            {/* PCIe Slots */}
            <rect x="20" y="75" width="80" height="6" rx="1" fill="#f59e0b" />
            <rect x="20" y="88" width="60" height="5" rx="1" fill="#64748b" />
            {/* Heatsink */}
            <rect x="18" y="25" width="16" height="35" rx="2" fill="#334155" />
          </svg>
        </div>
      );

    case "ram":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 140 70" className="w-full h-full drop-shadow-[0_8px_16px_rgba(6,182,212,0.25)]">
            <rect x="10" y="15" width="120" height="40" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            {/* RGB Top Light Bar */}
            <rect x="15" y="16" width="110" height="6" rx="2" fill="#38bdf8" />
            {/* Heatspreader texture */}
            <rect x="20" y="26" width="100" height="24" rx="2" fill="#1e293b" />
            <text x="70" y="42" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DDR5 6000MHz</text>
            {/* Gold Contact Pins */}
            <line x1="20" y1="56" x2="120" y2="56" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3 2" />
          </svg>
        </div>
      );

    case "storage":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 130 60" className="w-full h-full drop-shadow-[0_8px_16px_rgba(244,63,94,0.25)]">
            {/* M.2 NVMe PCB */}
            <rect x="10" y="15" width="110" height="30" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            {/* Memory Controller */}
            <rect x="22" y="20" width="20" height="20" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            {/* NAND Flash Chips */}
            <rect x="50" y="20" width="28" height="20" rx="2" fill="#0f172a" />
            <rect x="84" y="20" width="28" height="20" rx="2" fill="#0f172a" />
            <text x="70" y="33" fill="#f43f5e" fontSize="7" fontWeight="bold" textAnchor="middle">NVMe PCIe 4.0</text>
            {/* Gold Pins */}
            <rect x="10" y="22" width="4" height="16" fill="#fbbf24" />
          </svg>
        </div>
      );

    case "psu":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 110 110" className="w-full h-full drop-shadow-[0_10px_20px_rgba(234,179,8,0.25)]">
            <rect x="15" y="15" width="80" height="80" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            {/* Fan Grill */}
            <circle cx="55" cy="55" r="28" fill="#020617" stroke="#eab308" strokeWidth="1.5" />
            <circle cx="55" cy="55" r="10" fill="#1e293b" />
            <text x="55" y="58" fill="#fbbf24" fontSize="7" fontWeight="900" textAnchor="middle">850W</text>
            {/* 80 Plus Gold Badge */}
            <rect x="68" y="22" width="20" height="10" rx="2" fill="#ca8a04" />
            <text x="78" y="29" fill="#020617" fontSize="5" fontWeight="black" textAnchor="middle">GOLD</text>
          </svg>
        </div>
      );

    case "casing":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-[0_10px_20px_rgba(6,182,212,0.25)]">
            {/* Tower Frame */}
            <rect x="15" y="10" width="70" height="108" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            {/* Glass Side Panel */}
            <rect x="20" y="18" width="60" height="92" rx="4" fill="#020617" opacity="0.8" />
            {/* Internal RGB Fans */}
            <circle cx="50" cy="38" r="12" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.8" />
            <circle cx="50" cy="68" r="12" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <circle cx="50" cy="95" r="10" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
            {/* Feet */}
            <rect x="20" y="118" width="12" height="4" rx="1" fill="#475569" />
            <rect x="68" y="118" width="12" height="4" rx="1" fill="#475569" />
          </svg>
        </div>
      );

    case "cooler":
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(56,189,248,0.25)]">
            {/* Radiator */}
            <rect x="15" y="15" width="90" height="40" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Triple Fans on Rad */}
            <circle cx="30" cy="35" r="12" fill="#020617" stroke="#0ea5e9" strokeWidth="1" />
            <circle cx="60" cy="35" r="12" fill="#020617" stroke="#0ea5e9" strokeWidth="1" />
            <circle cx="90" cy="35" r="12" fill="#020617" stroke="#0ea5e9" strokeWidth="1" />
            {/* Liquid Tubes */}
            <path d="M40 55 C40 85 50 85 55 90" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
            <path d="M80 55 C80 85 70 85 65 90" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
            {/* CPU Pump Block */}
            <rect x="45" y="85" width="30" height="25" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="60" cy="97" r="7" fill="none" stroke="#a855f7" strokeWidth="2" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}

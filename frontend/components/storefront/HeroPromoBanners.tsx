import Image from "next/image";
import Link from "next/link";

interface PromoBannerItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  href: string;
  bgGradient: string;
  textColor: string;
  btnStyle: string;
  illustration: "feedback" | "career" | "service" | "corporate";
}

const promoBanners: PromoBannerItem[] = [
  {
    id: "feedback",
    title: "আপনার মতামত বা অভিযোগ",
    subtitle: "আমাদের সেবা সম্পর্কে যেকোনো মতামত জানাতে পারেন",
    href: "/contact",
    bgGradient: "bg-gradient-to-br from-[#0c2b5e] via-[#103a7a] to-[#081e42]",
    textColor: "text-white",
    btnStyle: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/20",
    illustration: "feedback",
  },
  {
    id: "career",
    title: "Shape Your Career With Us!",
    subtitle: "We are hiring tech enthusiasts & leaders",
    href: "/careers",
    bgGradient: "bg-gradient-to-br from-[#4a100a] via-[#741b12] to-[#2e0804]",
    textColor: "text-white",
    btnStyle: "bg-white text-rose-950 hover:bg-slate-100 shadow-md font-black",
    illustration: "career",
  },
];

export default function HeroPromoBanners() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 h-full">
      {promoBanners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.href}
          className="group ecommerce-card-hover relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-card-border shadow-xs"
        >
          {banner.image ? (
            <div className="relative aspect-[16/9] lg:aspect-auto h-full min-h-[175px] w-full overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div
              className={`relative flex h-full min-h-[175px] flex-col justify-between p-5 overflow-hidden ${banner.bgGradient} ${banner.textColor}`}
            >
              {/* Background Glow / Graphic Orbs */}
              <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />
              <div className="pointer-events-none absolute -bottom-10 -left-6 size-32 rounded-full bg-black/20 blur-xl" />

              {/* Decorative Geometric Elements */}
              {banner.illustration === "feedback" && (
                <div className="pointer-events-none absolute right-4 top-4 text-3xl opacity-20 group-hover:opacity-35 transition-opacity">
                  ✨
                </div>
              )}
              {banner.illustration === "career" && (
                <div className="pointer-events-none absolute -right-6 -bottom-6 size-28 rounded-full border-[14px] border-white/10" />
              )}

              {/* Content Area */}
              <div className="relative z-10">
                <span className="inline-block rounded-full bg-white/15 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white/90">
                  {banner.illustration === "feedback" ? "Customer Voice" : "Join TechHub"}
                </span>
                <h3 className="mt-2 text-lg sm:text-xl font-black leading-snug tracking-tight">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="mt-1 text-xs text-white/80 line-clamp-1">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

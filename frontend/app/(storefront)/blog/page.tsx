import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";

export const metadata: Metadata = {
  title: "Tech Articles & Buying Guides | TechHub Bangladesh Blog",
  description: "Read latest PC hardware reviews, laptop buying guides, benchmark comparisons, and tech news from TechHub Bangladesh.",
};

const blogPosts = [
  {
    id: 1,
    title: "Best Gaming Laptop Under 1.5 Lakh in Bangladesh (2026 Edition)",
    excerpt: "Detailed comparison between RTX 4060 and RTX 4070 powered laptops from Asus ROG, Acer Predator, and Lenovo Legion with thermal performance analysis.",
    category: "Buying Guide",
    date: "Sep 12, 2026",
    readTime: "5 min read",
    author: "Hardware Desk",
    slug: "best-gaming-laptops-2026-bangladesh",
  },
  {
    id: 2,
    title: "Intel 14th Gen vs AMD Ryzen 7000 Series: Which One Should You Buy?",
    excerpt: "Benchmarking gaming FPS, multi-threaded video editing, and power consumption to help you pick the best processor for your custom desktop PC.",
    category: "Hardware Review",
    date: "Aug 28, 2026",
    readTime: "7 min read",
    author: "TechHub Labs",
    slug: "intel-vs-amd-processor-comparison",
  },
  {
    id: 3,
    title: "How to Choose the Right Tablet PC for Digital Drawing and Graphic Design",
    excerpt: "Pressure sensitivity, pen response rates, and display color gamuts: Huion vs iPad Pro vs Samsung Galaxy Tab compared for creative artists.",
    category: "Creative Tech",
    date: "Aug 15, 2026",
    readTime: "4 min read",
    author: "Design Studio",
    slug: "best-tablets-for-graphic-designers",
  },
  {
    id: 4,
    title: "Understanding Power Supply Ratings: What Does 80 Plus Gold Mean?",
    excerpt: "Why clean power delivery and voltage stability matter for your high-end GPU and motherboard lifespan, plus tips on calculating system wattage.",
    category: "PC Building",
    date: "Aug 02, 2026",
    readTime: "6 min read",
    author: "System Engineers",
    slug: "power-supply-80-plus-efficiency-explained",
  },
];

export default function BlogPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <main className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        <div className="mt-4 rounded-3xl border border-card-border bg-card p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-card-border pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">TechHub Insights</span>
              <h1 className="mt-2 text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                Tech News &amp; Buying Guides
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Expert advice, build walkthroughs, and hardware benchmarks from our in-house computer engineers.
              </p>
            </div>
            <Link
              href="/pc-builder"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-95 shadow-sm shadow-primary/20 shrink-0"
            >
              ⚡ Try PC Builder
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="ecommerce-card-hover flex flex-col justify-between rounded-2xl border border-card-border bg-surface p-6"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{post.category}</span>
                    <span className="text-muted">{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 text-base sm:text-lg font-bold text-foreground leading-snug hover:text-primary transition cursor-pointer">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-card-border/60 pt-4 text-[11px] text-muted">
                  <span>By {post.author}</span>
                  <span>{post.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

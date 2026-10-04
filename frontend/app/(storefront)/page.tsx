import React from "react";
import HeroSlider from "@/components/storefront/HeroSlider";
import HeroPromoBanners from "@/components/storefront/HeroPromoBanners";
import FeaturedCategories from "@/components/storefront/FeaturedCategories";
import ProductShelf from "@/components/storefront/ProductShelf";
import { getFeaturedProducts, getCategories } from "@/lib/api/catalog";

export default async function StorefrontHome() {
  // Fetch both in parallel — React.cache() ensures each is called once even if
  // referenced by multiple components in the same render tree.
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <main>
      {/*  Hero Section: Auto-rotating Slider + 2 Side Promo Cards */}
      <section className="mx-auto max-w-[1440px] px-4 pt-6 pb-6 sm:px-6 lg:px-10">
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)]">
          {/* Auto-Rotating Hero Carousel */}
          <HeroSlider />

          {/* Side Promo Banners */}
          <HeroPromoBanners />
        </div>
      </section>

      {/*  Hardware Component Icon Categories (data from DB) */}
      <FeaturedCategories
        title="Featured Categories"
        subtitle="Explore our wide range of tech products"
        viewAllHref="/products"
        viewAllText="View All →"
        categories={categories}
      />

      {/*  Featured Deals / Product Shelf Grid (data from DB) */}
      <ProductShelf
        title="Featured Products"
        subtitle="Discover our handpicked selection of premium tech products"
        products={featuredProducts}
      />
    </main>
  );
}

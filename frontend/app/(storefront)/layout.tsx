import Header from "@/components/storefront/Header";
import CategoryNav from "@/components/storefront/CategoryNav";
import Footer from "@/components/storefront/Footer";
import MobileBottomNav from "@/components/storefront/MobileBottomNav";
import FloatingWidgets from "@/components/storefront/FloatingWidgets";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip selection:bg-secondary selection:text-white">
      {/*  Global Sticky Header & Navigation (Hidden during print) */}
      <div className="sticky top-0 z-50 print:hidden">
        <Header />
        <CategoryNav />
      </div>

      {/* Page Content Canvas */}
      <div className="flex-1">
        {children}
      </div>

      {/*  Global Storefront Footer (Hidden during print) */}
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] print:hidden xl:pb-0">
        <Footer />
      </div>

      <FloatingWidgets />

      {/*  Mobile Bottom Navigation Bar (Hidden on lg+ and during print) */}
      <div className="print:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}

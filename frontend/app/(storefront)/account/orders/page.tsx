import AccountPortal from "@/components/storefront/account/AccountPortal";

export default function CustomerOrdersPage() {
  return <AccountPortal initialSection="orders" initiallyAuthenticated />;
}

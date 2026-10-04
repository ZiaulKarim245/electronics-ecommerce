import { redirect } from "next/navigation";

interface AccountPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const legacyTab = firstValue(params.tab);
  const invoice = firstValue(params.track) ?? firstValue(params.invoice);

  if (legacyTab === "rma") {
    redirect("/account/rma");
  }

  if (legacyTab === "orders" || invoice) {
    const query = invoice ? `?invoice=${encodeURIComponent(invoice)}` : "";
    redirect(`/account/orders${query}`);
  }

  redirect("/account/login");
}

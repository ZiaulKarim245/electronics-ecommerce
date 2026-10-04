import type { ReactNode } from "react";
import Breadcrumbs from "@/components/storefront/Breadcrumbs";

export interface InformationSection {
  title: string;
  content: ReactNode;
}

interface InformationPageProps {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: InformationSection[];
  aside?: ReactNode;
}

export default function InformationPage({ eyebrow, title, introduction, sections, aside }: InformationPageProps) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <main className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        <header className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{introduction}</p>
        </header>
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-black text-foreground">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-muted">{section.content}</div>
            </section>
          ))}
        </div>
        <aside className="h-fit rounded-3xl border border-primary/20 bg-primary/5 p-6 text-sm leading-6 text-muted lg:sticky lg:top-36">
          {aside ?? <><h2 className="font-black text-foreground">Need help?</h2><p className="mt-2">Use the Contact page or your account to ask about an order, warranty, return, or RMA request.</p></>}
        </aside>
      </div>
    </main>
    </>
  );
}

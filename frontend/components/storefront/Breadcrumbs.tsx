import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <div className={`w-full bg-white border-b border-card-border/70 py-2 ${className}`}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[13px] text-muted"
        >
          <ol className="flex flex-wrap items-center gap-2" itemScope={true} itemType="https://schema.org/BreadcrumbList">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              const isHome = index === 0 && (item.label.toLowerCase() === "home" || item.href === "/");

              return (
                <li
                  key={`${item.label}-${index}`}
                  className="inline-flex items-center gap-2"
                  itemProp="itemListElement"
                  itemScope={true}
                  itemType="https://schema.org/ListItem"
                >
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="hover:text-primary transition-colors text-muted hover:underline inline-flex items-center justify-center gap-1 leading-normal"
                      itemProp="item"
                      title={item.label}
                    >
                      {isHome ? (
                        <>
                          <svg
                            className="size-4 shrink-0 transition-colors"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06l-.91-.91V20a1.5 1.5 0 0 1-1.5 1.5h-3.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 1-.75.75H5.25A1.5 1.5 0 0 1 3.75 20v-7.32l-.91.91a.75.75 0 0 1-1.06-1.06l8.69-8.69Z" />
                          </svg>
                          <span className="sr-only" itemProp="name">{item.label}</span>
                        </>
                      ) : (
                        <span itemProp="name" className="leading-normal">{item.label}</span>
                      )}
                    </Link>
                  ) : (
                    <span
                      className="font-semibold text-foreground truncate max-w-xs sm:max-w-md leading-normal py-0.5"
                      aria-current={isLast ? "page" : undefined}
                      itemProp="name"
                    >
                      {item.label}
                    </span>
                  )}
                  <meta itemProp="position" content={String(index + 1)} />

                  {!isLast && (
                    <svg
                      className="size-3 shrink-0 text-muted/50 select-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

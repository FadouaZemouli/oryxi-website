"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type DesktopNavLink = {
  href: string;
  label: string;
};

export type DesktopNavItem =
  | { type: "link"; href: string; label: string }
  | {
      type: "menu";
      label: string;
      menuLabel: string;
      children: readonly DesktopNavLink[];
    };

type DesktopNavProps = {
  items: readonly DesktopNavItem[];
  ariaLabel: string;
};

function linkClassName(active: boolean) {
  return `text-sm whitespace-nowrap transition-colors hover:text-oms-burgundy ${
    active ? "font-semibold text-oms-burgundy" : "font-medium text-oms-dark"
  }`;
}

export function DesktopNav({ items, ariaLabel }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className="hidden min-w-0 lg:block">
      <ul className="flex items-center gap-5 xl:gap-7">
        {items.map((item) => {
          if (item.type === "menu") {
            const isChildActive = item.children.some(
              (child) => pathname === child.href,
            );

            return (
              <li key={item.label} className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className={`${linkClassName(isChildActive)} inline-flex items-center`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="ms-1 text-[0.65rem] transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                  >
                    ▼
                  </span>
                </button>
                <ul
                  aria-label={item.menuLabel}
                  className="absolute start-0 top-full z-50 hidden min-w-72 border border-oms-gray/70 bg-oms-white py-2 text-start shadow-sm group-hover:block group-focus-within:block"
                >
                  {item.children.map((child) => {
                    const isActive = pathname === child.href;

                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm leading-5 hover:bg-oms-gray/20 hover:text-oms-burgundy ${
                            isActive
                              ? "font-semibold text-oms-burgundy"
                              : "font-medium text-oms-dark"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          }

          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link href={item.href} className={linkClassName(isActive)}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

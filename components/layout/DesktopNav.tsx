"use client";

import Link from "next/link";

export type DesktopNavItem = {
  href: string;
  label: string;
};

type DesktopNavProps = {
  items: readonly DesktopNavItem[];
  ariaLabel: string;
  pathname: string;
};

export function DesktopNav({ items, ariaLabel, pathname }: DesktopNavProps) {
  return (
    <nav aria-label={ariaLabel} className="hidden min-w-0 lg:block">
      <ul className="flex items-center gap-5 xl:gap-7">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`oms-nav-link text-sm whitespace-nowrap transition-colors hover:text-oms-burgundy ${
                  isActive ? "font-semibold text-oms-burgundy" : "font-medium"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

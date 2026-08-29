"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
};

type DesktopNavProps = {
  items: readonly NavLink[];
  ariaLabel: string;
};

export function DesktopNav({ items, ariaLabel }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className="hidden min-w-0 lg:block">
      <ul className="flex items-center gap-4 xl:gap-6">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm whitespace-nowrap transition-colors hover:text-oms-burgundy ${
                  isActive
                    ? "font-semibold text-oms-burgundy"
                    : "font-medium text-oms-dark"
                }`}
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

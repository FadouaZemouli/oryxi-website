"use client";

import Link from "next/link";

export type DesktopNavChild = {
  href: string | null;
  label: string;
};

export type DesktopNavItem = {
  href: string;
  label: string;
  children?: readonly DesktopNavChild[];
};

type DesktopNavProps = {
  items: readonly DesktopNavItem[];
  ariaLabel: string;
  pathname: string;
};

export function DesktopNav({ items, ariaLabel, pathname }: DesktopNavProps) {
  return (
    <nav aria-label={ariaLabel} className="hidden min-w-0 lg:block">
      <ul className="flex items-center gap-4 xl:gap-6 2xl:gap-7">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const hasMenu = Boolean(item.children?.length);

          return (
            <li
              key={item.href}
              className={hasMenu ? "oms-nav-item-has-menu" : undefined}
            >
              <Link
                href={item.href}
                className={`oms-nav-link text-sm whitespace-nowrap transition-colors hover:text-oms-burgundy ${
                  isActive ? "font-semibold text-oms-burgundy" : "font-medium"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-haspopup={hasMenu ? "true" : undefined}
              >
                {item.label}
                {hasMenu ? (
                  <span className="oms-nav-chevron" aria-hidden="true">
                    <svg viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : null}
              </Link>
              {hasMenu ? (
                <ul className="oms-nav-submenu">
                  {item.children?.map((child) => (
                    <li key={child.label}>
                      {child.href ? (
                        <Link href={child.href} className="oms-nav-submenu-link">
                          {child.label}
                        </Link>
                      ) : (
                        <span className="oms-nav-submenu-static">
                          {child.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

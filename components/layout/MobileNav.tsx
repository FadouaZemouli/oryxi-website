"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, quoteHref } from "@/lib/navigation";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div className={`lg:hidden ${open ? "" : "hidden"}`}>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-oms-dark/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav
        id="mobile-navigation"
        aria-label="Mobile"
        className="relative z-50 border-t border-oms-gray/60 bg-oms-white"
      >
        <ul className="flex flex-col px-4 py-4 sm:px-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block py-3 text-base ${
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
        <div className="border-t border-oms-gray/60 px-4 py-4 sm:px-6">
          <PrimaryButton href={quoteHref} className="w-full">
            Request a Quote
          </PrimaryButton>
        </div>
      </nav>
    </div>
  );
}

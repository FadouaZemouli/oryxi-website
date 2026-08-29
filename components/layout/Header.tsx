"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { quoteHref } from "@/lib/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-oms-gray/70 bg-oms-white">
      <Container className="relative z-50 flex items-center justify-between gap-3 bg-oms-white py-3">
        <Link href="/" className="shrink-0" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logos/oms-logo.png"
            alt="ORYXI Maintenance Services"
            width={913}
            height={600}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-3">
          <PrimaryButton
            href={quoteHref}
            className="px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm"
          >
            Request a Quote
          </PrimaryButton>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-oms-gray text-oms-dark lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 bg-oms-dark transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-oms-dark transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-oms-dark transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </Container>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

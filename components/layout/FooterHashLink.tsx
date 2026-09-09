"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type FooterHashLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function samePathHashTarget(href: string) {
  const next = new URL(href, window.location.href);
  if (next.pathname !== window.location.pathname) {
    return null;
  }

  return next.hash;
}

export function FooterHashLink({
  href,
  className,
  children,
  onClick,
}: FooterHashLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const hash = samePathHashTarget(href);
    if (hash == null || hash === "") {
      return;
    }

    event.preventDefault();

    const target = document.querySelector(hash);
    if (target instanceof HTMLElement) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }

    if (window.location.hash === hash) {
      window.dispatchEvent(new Event("hashchange"));
      return;
    }

    window.history.pushState(null, "", hash);
    window.dispatchEvent(new Event("hashchange"));
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

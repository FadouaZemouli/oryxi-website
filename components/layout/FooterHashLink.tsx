"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type FooterHashLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
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
}: FooterHashLinkProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const hash = samePathHashTarget(href);
    if (hash == null) {
      return;
    }

    event.preventDefault();

    if (window.location.hash === hash) {
      window.dispatchEvent(new Event("hashchange"));
      return;
    }

    window.location.hash = hash;
  };

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

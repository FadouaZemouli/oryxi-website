"use client";

import { useState } from "react";

type ClientLogoThumbProps = {
  url: string | null;
  name: string;
  className?: string;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function ClientLogoThumb({
  url,
  name,
  className,
}: ClientLogoThumbProps) {
  const [failed, setFailed] = useState(false);
  const initials = initialsFromName(name);

  if (!url || failed) {
    return (
      <span
        className={`${className ?? ""} oms-admin-client-logo-fallback`.trim()}
        aria-hidden="true"
      >
        {initials}
      </span>
    );
  }

  return (
    // Storage public URLs are not in next.config images.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={url}
      alt=""
      width={56}
      height={56}
      onError={() => setFailed(true)}
    />
  );
}

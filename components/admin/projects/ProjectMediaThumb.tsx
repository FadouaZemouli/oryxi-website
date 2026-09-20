"use client";

import { useState } from "react";

type ProjectMediaThumbProps = {
  url: string | null;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export function ProjectMediaThumb({
  url,
  className,
  alt = "",
  width,
  height,
}: ProjectMediaThumbProps) {
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <span
        className={`${className ?? ""} oms-admin-project-thumb-empty`.trim()}
        aria-hidden="true"
      />
    );
  }

  return (
    // Storage public URLs are not in next.config images.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={url}
      alt={alt}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  );
}

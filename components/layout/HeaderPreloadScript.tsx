"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";
import { getHeaderPreloadScript } from "@/lib/layout/header-preload-inline";

export function HeaderPreloadScript() {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) {
      return null;
    }

    inserted.current = true;

    return (
      <script
        id="oms-header-preload"
        dangerouslySetInnerHTML={{
          __html: getHeaderPreloadScript(),
        }}
      />
    );
  });

  return null;
}

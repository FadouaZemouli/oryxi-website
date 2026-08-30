"use client";

import { useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

type HeaderPreloadScriptProps = {
  locale: Locale;
};

export function HeaderPreloadScript({ locale }: HeaderPreloadScriptProps) {
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
          __html: `(function(){var l=${JSON.stringify(locale)};var p=location.pathname.replace(/\\/$/,"")||"/";var r=document.documentElement;r.setAttribute("data-oms-header",p==="/"+l?"home":"inner");r.setAttribute("data-oms-path",p);})();`,
        }}
      />
    );
  });

  return null;
}

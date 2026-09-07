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
          __html: `(function(){var l=${JSON.stringify(locale)};var range=280;var r=document.documentElement;var sRaf=0;var rRaf=0;function path(){return location.pathname.replace(/\\/$/,"")||"/";}function home(){return path()==="/"+l;}function y(){return window.scrollY||r.scrollTop||0;}function syncPath(){r.setAttribute("data-oms-header",home()?"home":"inner");r.setAttribute("data-oms-path",path());}function syncScroll(){syncPath();if(!home())return;var yv=y();var reduce=false;try{reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){}var p=reduce?(yv>8?1:0):Math.min(1,Math.max(0,yv/range));r.style.setProperty("--oms-logo-progress",p.toFixed(4));r.setAttribute("data-oms-scrolled",p>0.08?"true":"false");}function measure(){if(!home())return;try{if(!window.matchMedia("(min-width: 1024px)").matches)return;}catch(e){return;}var origin=document.querySelector(".oms-hero-brand");var slot=document.querySelector(".oms-header-logo-link");if(!origin||!slot)return;var start=origin.getBoundingClientRect();var end=slot.getBoundingClientRect();if(start.width<1||end.width<1)return;var startTop=start.top+y();var startInline=r.dir==="rtl"?r.clientWidth-start.right:start.left;r.style.setProperty("--oms-logo-x",startInline.toFixed(2)+"px");r.style.setProperty("--oms-logo-y",startTop.toFixed(2)+"px");r.style.setProperty("--oms-logo-dx",(end.left-start.left).toFixed(2)+"px");r.style.setProperty("--oms-logo-dy",(end.top-startTop).toFixed(2)+"px");}function apply(){syncScroll();measure();}function onScroll(){if(sRaf)return;sRaf=requestAnimationFrame(function(){syncScroll();sRaf=0;});}function onReflow(){if(rRaf)return;rRaf=requestAnimationFrame(function(){apply();rRaf=0;});}syncPath();apply();document.addEventListener("DOMContentLoaded",apply);window.addEventListener("pageshow",apply);window.addEventListener("load",apply);window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onReflow,{passive:true});})();`,
        }}
      />
    );
  });

  return null;
}

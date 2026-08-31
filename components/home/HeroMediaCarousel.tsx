"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HeroVideo } from "@/components/home/HeroVideo";
import type { HeroMediaItem } from "@/lib/home/hero-media";

const INTERVAL_MS = 7000;

type HeroMediaCarouselProps = {
  items: HeroMediaItem[];
};

function wrapIndex(index: number, length: number) {
  if (length === 0) {
    return 0;
  }

  return (index % length + length) % length;
}

export function HeroMediaCarousel({ items }: HeroMediaCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [allowMotion, setAllowMotion] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const count = items.length;
  const firstImageSrc = items.find((item) => item.kind === "image")?.src;
  const activeIndex = allowMotion && count > 0 ? index % count : 0;
  const nextIndex = wrapIndex(activeIndex + 1, count);
  const prevIndex = wrapIndex(activeIndex - 1, count);
  const canAdvance = allowMotion && inView && pageVisible && count > 1;
  const canPlayVideo = allowMotion && inView && pageVisible;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const reduce = media.matches;
      setAllowMotion(!reduce);
      if (reduce) {
        setIndex(0);
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (!canAdvance) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIndex((current) => wrapIndex(current + 1, count));
    }, INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [canAdvance, count, activeIndex]);

  if (count === 0) {
    return null;
  }

  return (
    <>
      <div
        ref={rootRef}
        className="oms-hero-carousel"
        data-oms-hero-motion={allowMotion ? "on" : "off"}
      >
        {items.map((item, itemIndex) => {
          const isActive = itemIndex === activeIndex;
          const isNext = itemIndex === nextIndex;
          const isPrev = itemIndex === prevIndex;
          const isLcp = item.kind === "image" && item.src === firstImageSrc;

          if (item.kind === "image") {
            if (!allowMotion && item.src !== firstImageSrc) {
              return null;
            }
          } else if (!allowMotion || !(isActive || isNext || isPrev)) {
            return null;
          }

          return (
            <div
              key={item.id}
              className="oms-hero-slide"
              data-oms-hero-slide={item.id}
              data-oms-hero-kind={item.kind}
              data-active={isActive ? "true" : "false"}
            >
              {item.kind === "image" ? (
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={isLcp}
                  loading={isLcp ? undefined : "eager"}
                  className="oms-hero-media-asset"
                />
              ) : (
                <HeroVideo
                  src={item.src}
                  active={isActive && canPlayVideo}
                  preload={
                    item.deferLoad
                      ? isActive || isNext
                        ? "auto"
                        : "none"
                      : isActive
                        ? "auto"
                        : isNext
                          ? "metadata"
                          : "none"
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      {allowMotion && count > 1 ? (
        <div
          className="oms-hero-progress"
          data-oms-hero-paused={canAdvance ? "false" : "true"}
        >
          {items.map((item, itemIndex) => (
            <span
              key={item.id}
              className="oms-hero-progress-tick"
              data-state={
                itemIndex === activeIndex
                  ? "active"
                  : itemIndex < activeIndex
                    ? "done"
                    : "idle"
              }
            >
              {itemIndex === activeIndex ? (
                <span className="oms-hero-progress-fill" />
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}

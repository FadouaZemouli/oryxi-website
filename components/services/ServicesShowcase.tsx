"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/path";
import { useCarouselAutoplay } from "@/lib/carousel/use-carousel-autoplay";
import {
  SHOWCASE_AUTOPLAY_MS,
  SHOWCASE_SLIDES,
  SHOWCASE_SLIDE_COUNT,
  SHOWCASE_SWIPE_THRESHOLD_PX,
  SHOWCASE_TRANSITION_MS,
  formatShowcaseCounter,
  formatShowcaseSelectorNumber,
  showcaseIndexFromHash,
  syncShowcaseHash,
} from "@/lib/services/showcase-data";

const showcaseSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type ServicesShowcaseProps = {
  locale: Locale;
  dict: Dictionary;
};

function normalizeShowcaseIndex(index: number): number {
  return (
    ((index % SHOWCASE_SLIDE_COUNT) + SHOWCASE_SLIDE_COUNT) % SHOWCASE_SLIDE_COUNT
  );
}

export function ServicesShowcase({ locale, dict }: ServicesShowcaseProps) {
  const copy = dict.servicesPage.showcase;
  const quoteHref = localizedHref(locale, "/request-quote");

  // Always hydrate from a stable index; read location.hash only after mount.
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerEpoch, setTimerEpoch] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const goTo = useCallback(
    (nextIndex: number, options?: { resetTimer?: boolean; syncHash?: boolean }) => {
      const normalized = normalizeShowcaseIndex(nextIndex);
      setActiveIndex(normalized);
      if (options?.resetTimer) {
        setTimerEpoch((value) => value + 1);
      }
      if (options?.syncHash) {
        syncShowcaseHash(normalized);
      }
    },
    [],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, { resetTimer: true, syncHash: true });
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, { resetTimer: true, syncHash: true });
  }, [activeIndex, goTo]);

  const selectSlide = useCallback(
    (index: number) => {
      goTo(index, { resetTimer: true, syncHash: true });
    },
    [goTo],
  );

  const {
    prefersReducedMotion,
    onPointerEnter,
    onPointerLeave,
    onPointerCancel,
  } = useCarouselAutoplay({
    intervalMs: SHOWCASE_AUTOPLAY_MS,
    resetKey: timerEpoch,
    onAdvance: () => {
      setActiveIndex((current) => normalizeShowcaseIndex(current + 1));
    },
  });

  useEffect(() => {
    const scrollToHashTarget = (id: string) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      });
    };

    const syncFromHash = () => {
      const hash = window.location.hash;
      const index = showcaseIndexFromHash(hash);
      if (index != null) {
        setActiveIndex(index);
        setTimerEpoch((value) => value + 1);
        const slide = SHOWCASE_SLIDES[index];
        if (slide) {
          scrollToHashTarget(slide.hash);
        }
      }
    };

    syncFromHash();

    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    // Never treat touch as a sticky hover-pause.
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (startX == null || endX == null) {
      return;
    }

    const delta = endX - startX;
    if (Math.abs(delta) < SHOWCASE_SWIPE_THRESHOLD_PX) {
      return;
    }

    if (delta < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  const onFrameKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  const progressPercent = ((activeIndex + 1) / SHOWCASE_SLIDE_COUNT) * 100;
  const counterLabel = formatShowcaseCounter(activeIndex);

  return (
    <section
      className={`oms-services-showcase ${showcaseSans.variable}`}
      aria-roledescription="carousel"
      aria-label={copy.ariaLabel}
      data-locale={locale}
    >
      {SHOWCASE_SLIDES.map((slide) => (
        <div
          key={slide.hash}
          id={slide.hash}
          className="oms-services-showcase-anchor"
          aria-hidden="true"
        />
      ))}

      <Container className="oms-services-showcase-inner">
        <div
          ref={frameRef}
          className="oms-services-showcase-frame"
          tabIndex={0}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerCancel={onPointerCancel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onKeyDown={onFrameKeyDown}
        >
          <div
            className="oms-services-showcase-track"
            dir="ltr"
            style={{
              transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
              transitionDuration: prefersReducedMotion
                ? "0ms"
                : `${SHOWCASE_TRANSITION_MS}ms`,
            }}
          >
            {SHOWCASE_SLIDES.map((slide, index) => {
              const slideCopy = copy.slides[slide.key];
              const isActive = index === activeIndex;

              return (
                <div
                  key={slide.key}
                  className="oms-services-showcase-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${formatShowcaseCounter(index)} — ${slideCopy.eyebrow}`}
                  aria-hidden={!isActive}
                >
                  <div className="oms-services-showcase-media">
                    <Image
                      src={slide.image}
                      alt={slideCopy.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 72rem, 100vw"
                      className="oms-services-showcase-image"
                      priority={index === 0}
                      draggable={false}
                    />
                  </div>

                  <div
                    className="oms-services-showcase-gradient"
                    aria-hidden="true"
                  />

                  <div
                    className="oms-services-showcase-content"
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    <p className="oms-services-showcase-eyebrow">
                      {slideCopy.eyebrow}
                    </p>
                    <span
                      className="oms-services-showcase-rule"
                      aria-hidden="true"
                    />
                    <h2 className="oms-services-showcase-heading">
                      {slideCopy.heading}
                    </h2>
                    <p className="oms-services-showcase-description">
                      {slideCopy.description}
                    </p>
                    <ul className="oms-services-showcase-capabilities">
                      {slideCopy.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="oms-services-showcase-capability"
                        >
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="oms-services-showcase-arrow oms-services-showcase-arrow--prev"
            aria-label={copy.prevLabel}
            onClick={goPrev}
          >
            <ChevronLeft aria-hidden="true" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            className="oms-services-showcase-arrow oms-services-showcase-arrow--next"
            aria-label={copy.nextLabel}
            onClick={goNext}
          >
            <ChevronRight aria-hidden="true" strokeWidth={1.75} />
          </button>

          <div className="oms-services-showcase-footer" dir="ltr">
            <p
              className="oms-services-showcase-counter"
              aria-live="polite"
              aria-atomic="true"
            >
              {counterLabel}
            </p>
            <div
              className="oms-services-showcase-progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={SHOWCASE_SLIDE_COUNT}
              aria-valuenow={activeIndex + 1}
              aria-label={counterLabel}
            >
              <span
                className="oms-services-showcase-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div
          className="oms-services-showcase-selector"
          role="group"
          aria-label={copy.selectorAriaLabel}
        >
          {SHOWCASE_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;
            const number = formatShowcaseSelectorNumber(index);

            return (
              <button
                key={slide.key}
                type="button"
                className={`oms-services-showcase-selector-item${
                  isActive
                    ? " oms-services-showcase-selector-item--active"
                    : ""
                }`}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${number} ${copy.selector[slide.key]}`}
                onClick={() => selectSlide(index)}
              >
                <span className="oms-services-showcase-selector-number">
                  {number}
                </span>
                <span className="oms-services-showcase-selector-label">
                  {copy.selector[slide.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="oms-services-showcase-cta-wrap">
          <Link href={quoteHref} className="oms-services-showcase-cta">
            <span>{copy.cta}</span>
            <span className="oms-services-showcase-cta-arrow" aria-hidden="true">
              {copy.ctaArrow}
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

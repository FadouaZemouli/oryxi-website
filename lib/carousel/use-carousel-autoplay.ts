"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

function subscribeMatchMedia(
  mediaQuery: MediaQueryList,
  onChange: () => void,
): () => void {
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", onChange);
    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }

  mediaQuery.addListener(onChange);
  return () => {
    mediaQuery.removeListener(onChange);
  };
}

export function canHoverPause(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  try {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  } catch {
    return false;
  }
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    return subscribeMatchMedia(mediaQuery, updatePreference);
  }, []);

  return prefersReducedMotion;
}

type UseCarouselAutoplayOptions = {
  intervalMs: number;
  enabled?: boolean;
  resetKey?: number;
  onAdvance: () => void;
};

export function useCarouselAutoplay({
  intervalMs,
  enabled = true,
  resetKey = 0,
  onAdvance,
}: UseCarouselAutoplayOptions) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const onAdvanceRef = useRef(onAdvance);
  const hoverPausedRef = useRef(false);
  const hiddenRef = useRef(false);

  onAdvanceRef.current = onAdvance;

  useEffect(() => {
    const syncVisibility = () => {
      hiddenRef.current = document.visibilityState !== "visible";
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    window.addEventListener("pageshow", syncVisibility);
    window.addEventListener("focus", syncVisibility);

    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("pageshow", syncVisibility);
      window.removeEventListener("focus", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (hoverPausedRef.current || hiddenRef.current) {
        return;
      }

      if (document.visibilityState !== "visible") {
        hiddenRef.current = true;
        return;
      }

      onAdvanceRef.current();
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, intervalMs, prefersReducedMotion, resetKey]);

  const onPointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !canHoverPause()) {
      return;
    }

    hoverPausedRef.current = true;
  }, []);

  const onPointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType && event.pointerType !== "mouse") {
      hoverPausedRef.current = false;
      return;
    }

    hoverPausedRef.current = false;
  }, []);

  const onPointerCancel = useCallback(() => {
    hoverPausedRef.current = false;
  }, []);

  return {
    prefersReducedMotion,
    onPointerEnter,
    onPointerLeave,
    onPointerCancel,
  };
}

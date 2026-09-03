"use client";

import { useEffect, useRef } from "react";

type AboutAutoplayVideoProps = {
  src: string;
  className?: string;
};

export function AboutAutoplayVideo({ src, className = "" }: AboutAutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPlayback = () => {
      if (media.matches) {
        el.pause();
        if (el.currentTime > 0.05) {
          el.currentTime = 0;
        }
        return;
      }

      const attempt = el.play();
      if (attempt) {
        attempt.catch(() => undefined);
      }
    };

    syncPlayback();
    media.addEventListener("change", syncPlayback);

    return () => {
      media.removeEventListener("change", syncPlayback);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      controls={false}
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

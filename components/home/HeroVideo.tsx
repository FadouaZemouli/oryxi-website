"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  src: string;
  active: boolean;
  preload?: "none" | "metadata" | "auto";
};

export function HeroVideo({
  src,
  active,
  preload = "metadata",
}: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    if (!active) {
      el.pause();
      return;
    }

    el.currentTime = 0;
    const attempt = el.play();
    if (attempt) {
      attempt.catch(() => undefined);
    }
  }, [active, src]);

  return (
    <video
      ref={ref}
      className="oms-hero-media-asset"
      muted
      loop
      playsInline
      autoPlay={active}
      preload={preload}
      controls={false}
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

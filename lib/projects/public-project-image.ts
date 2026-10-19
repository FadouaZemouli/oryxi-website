const PUBLIC_PROJECT_IMAGE_PREFIX = "/storage/v1/object/public/project-images/";

export function publicProjectImageUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!trimmed || !base) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    if (url.origin !== new URL(base).origin) {
      return null;
    }
    if (!url.pathname.startsWith(PUBLIC_PROJECT_IMAGE_PREFIX)) {
      return null;
    }
    if (url.search || url.username || url.password) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function galleryFrames(
  cover: string,
  gallery: readonly string[] | undefined,
): string[] {
  const frames: string[] = [];
  const seen = new Set<string>();
  const push = (url: string) => {
    if (!url || seen.has(url)) {
      return;
    }
    seen.add(url);
    frames.push(url);
  };

  const remoteCover = publicProjectImageUrl(cover);
  if (remoteCover) {
    push(remoteCover);
  } else if (cover.startsWith("/") && !cover.startsWith("//")) {
    push(cover);
  }

  for (const item of gallery ?? []) {
    const url = publicProjectImageUrl(item);
    if (url) {
      push(url);
    }
  }

  return frames;
}

export function projectCardImage(
  cover: string,
  gallery: readonly string[] | undefined,
): string {
  return gallery?.[0] ?? cover;
}

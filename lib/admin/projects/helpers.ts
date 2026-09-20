export function slugifyProjectTitle(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug;
}

export function parseGallery(value: unknown): string[] {
  if (value == null || value === "") {
    return [];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    try {
      return parseGallery(JSON.parse(trimmed));
    } catch {
      return trimmed
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string") {
        return item.trim() ? [item.trim()] : [];
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const url = record.url ?? record.src ?? record.image_url ?? record.href;
        return typeof url === "string" && url.trim() ? [url.trim()] : [];
      }

      return [];
    });
  }

  return [];
}

export function isUsableMediaUrl(value: string) {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isProjectStatus(
  value: string,
): value is "ongoing" | "completed" {
  return value === "ongoing" || value === "completed";
}

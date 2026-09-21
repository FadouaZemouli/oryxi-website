import type { SupabaseClient } from "@supabase/supabase-js";
import { parseGallery } from "@/lib/admin/projects/helpers";

export const PROJECT_IMAGES_BUCKET = "project-images";
export const MAX_PROJECT_IMAGE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_PROJECT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const PUBLIC_OBJECT_MARKER = `/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/`;
const SIGNED_OBJECT_MARKER = `/storage/v1/object/sign/${PROJECT_IMAGES_BUCKET}/`;
const AUTH_OBJECT_MARKER = `/storage/v1/object/authenticated/${PROJECT_IMAGES_BUCKET}/`;
const PLAIN_OBJECT_MARKER = `/storage/v1/object/${PROJECT_IMAGES_BUCKET}/`;

export function validateProjectImage(file: File) {
  if (
    !ALLOWED_PROJECT_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_PROJECT_IMAGE_TYPES)[number],
    )
  ) {
    return "Use a JPEG, PNG, or WebP image.";
  }

  if (file.size > MAX_PROJECT_IMAGE_BYTES) {
    return "Images must be 10 MB or smaller.";
  }

  return null;
}

function extensionFor(file: File) {
  if (file.type === "image/jpeg") {
    return "jpg";
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "";
}

function uniqueFileName(file: File) {
  const ext = extensionFor(file);
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase();
  const safe = base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  const stamp = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  return `${stamp}${safe ? `-${safe}` : ""}.${ext}`;
}

export function coverObjectPath(projectId: string, file: File) {
  return `covers/${projectId}/${uniqueFileName(file)}`;
}

export function galleryObjectPath(projectId: string, file: File) {
  return `galleries/${projectId}/${uniqueFileName(file)}`;
}

export function publicUrlForPath(
  supabase: SupabaseClient,
  objectPath: string,
) {
  return supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .getPublicUrl(objectPath).data.publicUrl;
}

function pathFromStorageUrl(url: string) {
  try {
    const parsed = new URL(url);
    const markers = [
      PUBLIC_OBJECT_MARKER,
      SIGNED_OBJECT_MARKER,
      AUTH_OBJECT_MARKER,
      PLAIN_OBJECT_MARKER,
    ];

    for (const marker of markers) {
      const index = parsed.pathname.indexOf(marker);
      if (index !== -1) {
        return decodeURIComponent(
          parsed.pathname.slice(index + marker.length),
        );
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function projectImagePathFromStoredValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^(covers|galleries|tmp)\//.test(trimmed)) {
    return trimmed.replace(/^\/+/, "");
  }

  return pathFromStorageUrl(trimmed);
}

export function storagePathFromPublicUrl(url: string) {
  return projectImagePathFromStoredValue(url);
}

const PROJECT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isSafeObjectName(value: string) {
  return Boolean(value) && !value.includes("/") && !value.includes("\\") && !value.includes("..");
}

export function ownedProjectStoragePath(url: string, projectId: string) {
  if (!PROJECT_ID_PATTERN.test(projectId)) {
    return null;
  }

  const path = projectImagePathFromStoredValue(url);
  if (!path || path.includes("..")) {
    return null;
  }

  const coverPrefix = `covers/${projectId}/`;
  const galleryPrefix = `galleries/${projectId}/`;

  if (path.startsWith(coverPrefix)) {
    const filename = path.slice(coverPrefix.length);
    return isSafeObjectName(filename) ? path : null;
  }

  if (path.startsWith(galleryPrefix)) {
    const filename = path.slice(galleryPrefix.length);
    return isSafeObjectName(filename) ? path : null;
  }

  return null;
}

export function collectOwnedProjectStoragePaths(
  projectId: string,
  coverImageUrl: string | null,
  gallery: unknown,
) {
  const urls = [
    ...(typeof coverImageUrl === "string" ? [coverImageUrl] : []),
    ...parseGallery(gallery),
  ];
  const unique = new Set<string>();

  for (const url of urls) {
    const path = ownedProjectStoragePath(url, projectId);
    if (path) {
      unique.add(path);
    }
  }

  return [...unique];
}

export function isManagedProjectImage(url: string, projectId?: string) {
  if (projectId) {
    return Boolean(ownedProjectStoragePath(url, projectId));
  }

  const path = projectImagePathFromStoredValue(url);
  if (!path) {
    return false;
  }

  return (
    path.startsWith("covers/") ||
    path.startsWith("galleries/") ||
    path.startsWith("tmp/")
  );
}

async function uploadedObjectIsReadable(href: string) {
  try {
    const head = await fetch(href, { method: "HEAD" });
    const headType = head.headers.get("content-type") ?? "";
    if (head.ok && headType.startsWith("image/")) {
      return true;
    }

    const get = await fetch(href, { method: "GET" });
    const getType = get.headers.get("content-type") ?? "";
    return get.ok && getType.startsWith("image/");
  } catch {
    return false;
  }
}

export async function uploadProjectImage(
  supabase: SupabaseClient,
  objectPath: string,
  file: File,
) {
  const { data, error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return { url: null, error: "The image could not be uploaded. Please try again." };
  }

  const storedPath = data.path || objectPath;
  const publicUrl = publicUrlForPath(supabase, storedPath);

  if (!(await uploadedObjectIsReadable(publicUrl))) {
    await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([storedPath]);
    return {
      url: null,
      error: "The image uploaded but could not be loaded. Please try again.",
    };
  }

  return { url: publicUrl, error: null };
}

export async function removeManagedProjectImage(
  supabase: SupabaseClient,
  url: string,
  projectId?: string,
) {
  const path = projectId
    ? ownedProjectStoragePath(url, projectId)
    : isManagedProjectImage(url)
      ? projectImagePathFromStoredValue(url)
      : null;
  if (!path) {
    return;
  }

  await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([path]);
}

export async function removeOwnedProjectStorageMedia(
  supabase: SupabaseClient,
  projectId: string,
  paths: string[],
) {
  const unique = [
    ...new Set(
      paths.flatMap((path) => {
        const owned = ownedProjectStoragePath(path, projectId);
        return owned ? [owned] : [];
      }),
    ),
  ];

  if (unique.length === 0) {
    return { removed: [] as string[], error: null };
  }

  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .remove(unique);

  if (error) {
    return { removed: [] as string[], error };
  }

  return { removed: unique, error: null };
}

/**
 * Removes Storage objects that were uploaded in a failed gallery batch.
 * Only owned project paths are touched; existing gallery URLs are never passed in.
 */
export async function cleanupFailedGalleryBatchUploads(
  supabase: SupabaseClient,
  projectId: string,
  uploadedUrls: string[],
) {
  const paths = collectOwnedProjectStoragePaths(projectId, null, uploadedUrls);
  if (paths.length === 0) {
    return { cleaned: 0, error: null };
  }

  const result = await removeOwnedProjectStorageMedia(
    supabase,
    projectId,
    paths,
  );

  if (result.error) {
    return { cleaned: 0, error: result.error };
  }

  return { cleaned: result.removed.length, error: null };
}

export async function uploadPendingProjectMedia(
  supabase: SupabaseClient,
  projectId: string,
  coverFile: File | null,
  galleryFiles: File[],
) {
  let coverUrl: string | null = null;
  const galleryUrls: string[] = [];

  if (coverFile) {
    const uploaded = await uploadProjectImage(
      supabase,
      coverObjectPath(projectId, coverFile),
      coverFile,
    );
    if (!uploaded.url) {
      return { coverUrl: null, galleryUrls: [], error: uploaded.error };
    }
    coverUrl = uploaded.url;
  }

  for (const file of galleryFiles) {
    const uploaded = await uploadProjectImage(
      supabase,
      galleryObjectPath(projectId, file),
      file,
    );
    if (!uploaded.url) {
      return { coverUrl, galleryUrls, error: uploaded.error };
    }
    galleryUrls.push(uploaded.url);
  }

  return { coverUrl, galleryUrls, error: null };
}

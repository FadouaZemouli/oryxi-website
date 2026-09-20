import type { SupabaseClient } from "@supabase/supabase-js";

/** Reuses the existing public project-images bucket with a client-logos/ prefix. */
export const CLIENT_LOGOS_BUCKET = "project-images";
export const MAX_CLIENT_LOGO_BYTES = 10 * 1024 * 1024;
export const ALLOWED_CLIENT_LOGO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const PUBLIC_OBJECT_MARKER = `/storage/v1/object/public/${CLIENT_LOGOS_BUCKET}/`;
const SIGNED_OBJECT_MARKER = `/storage/v1/object/sign/${CLIENT_LOGOS_BUCKET}/`;
const AUTH_OBJECT_MARKER = `/storage/v1/object/authenticated/${CLIENT_LOGOS_BUCKET}/`;
const PLAIN_OBJECT_MARKER = `/storage/v1/object/${CLIENT_LOGOS_BUCKET}/`;

const CLIENT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateClientLogo(file: File) {
  if (
    !ALLOWED_CLIENT_LOGO_TYPES.includes(
      file.type as (typeof ALLOWED_CLIENT_LOGO_TYPES)[number],
    )
  ) {
    return "Use a JPEG, PNG, or WebP image.";
  }

  if (file.size > MAX_CLIENT_LOGO_BYTES) {
    return "Logos must be 10 MB or smaller.";
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
  const safe = base
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const stamp = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  return `${stamp}${safe ? `-${safe}` : ""}.${ext}`;
}

export function clientLogoObjectPath(clientId: string, file: File) {
  return `client-logos/${clientId}/${uniqueFileName(file)}`;
}

export function publicUrlForClientLogoPath(
  supabase: SupabaseClient,
  objectPath: string,
) {
  return supabase.storage
    .from(CLIENT_LOGOS_BUCKET)
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
        return decodeURIComponent(parsed.pathname.slice(index + marker.length));
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function clientLogoPathFromStoredValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^client-logos\//.test(trimmed)) {
    return trimmed.replace(/^\/+/, "");
  }

  return pathFromStorageUrl(trimmed);
}

function isSafeObjectName(value: string) {
  return (
    Boolean(value) &&
    !value.includes("/") &&
    !value.includes("\\") &&
    !value.includes("..")
  );
}

export function ownedClientLogoStoragePath(url: string, clientId: string) {
  if (!CLIENT_ID_PATTERN.test(clientId)) {
    return null;
  }

  const path = clientLogoPathFromStoredValue(url);
  if (!path || path.includes("..")) {
    return null;
  }

  const prefix = `client-logos/${clientId}/`;
  if (!path.startsWith(prefix)) {
    return null;
  }

  const filename = path.slice(prefix.length);
  return isSafeObjectName(filename) ? path : null;
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

export async function uploadClientLogo(
  supabase: SupabaseClient,
  objectPath: string,
  file: File,
) {
  const { data, error } = await supabase.storage
    .from(CLIENT_LOGOS_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return {
      url: null,
      error: "The logo could not be uploaded. Please try again.",
    };
  }

  const storedPath = data.path || objectPath;
  const publicUrl = publicUrlForClientLogoPath(supabase, storedPath);

  if (!(await uploadedObjectIsReadable(publicUrl))) {
    await supabase.storage.from(CLIENT_LOGOS_BUCKET).remove([storedPath]);
    return {
      url: null,
      error: "The logo uploaded but could not be loaded. Please try again.",
    };
  }

  return { url: publicUrl, error: null };
}

export async function removeManagedClientLogo(
  supabase: SupabaseClient,
  url: string,
  clientId: string,
): Promise<{ removed: string | null; error: string | null }> {
  const path = ownedClientLogoStoragePath(url, clientId);
  if (!path) {
    return { removed: null, error: null };
  }

  const { error } = await supabase.storage
    .from(CLIENT_LOGOS_BUCKET)
    .remove([path]);

  if (error) {
    return {
      removed: null,
      error: "The client logo could not be removed from storage.",
    };
  }

  return { removed: path, error: null };
}

export async function uploadPendingClientLogo(
  supabase: SupabaseClient,
  clientId: string,
  file: File,
) {
  return uploadClientLogo(supabase, clientLogoObjectPath(clientId, file), file);
}

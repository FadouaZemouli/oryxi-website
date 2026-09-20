import {
  isProjectStatus,
  isUsableMediaUrl,
  parseGallery,
  slugifyProjectTitle,
} from "@/lib/admin/projects/helpers";
import { parseQcddYear, parseProjectDetailsInput } from "@/lib/admin/projects/details";
import type { ProjectWritePayload } from "@/lib/admin/projects/types";

export type ProjectFormState = {
  error: string | null;
  success: string | null;
  id: string | null;
};

export const emptyProjectFormState: ProjectFormState = {
  error: null,
  success: null,
  id: null,
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseProjectForm(formData: FormData):
  | { ok: true; payload: ProjectWritePayload }
  | { ok: false; error: string } {
  const titleEn = readString(formData, "title_en");
  const titleAr = readString(formData, "title_ar");
  const slugInput = readString(formData, "slug");
  const slug = slugInput || slugifyProjectTitle(titleEn);
  const locationEn = readString(formData, "location_en");
  const locationAr = readString(formData, "location_ar");
  const scopeEn = readString(formData, "scope_en");
  const scopeAr = readString(formData, "scope_ar");
  const status = readString(formData, "project_status");
  const cover = readString(formData, "cover_image_url");
  const gallery = parseGallery(readString(formData, "gallery"));
  const sortRaw = readString(formData, "sort_order");
  const published = formData.get("published") === "on";
  const qcddYear = parseQcddYear(formData.get("qcdd_year"));
  const projectDetails = parseProjectDetailsInput(formData.get("project_details"));

  if (!titleEn) {
    return { ok: false, error: "English title is required." };
  }

  if (!titleAr) {
    return { ok: false, error: "Arabic title is required." };
  }

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      ok: false,
      error: "Slug is required and may only contain lowercase letters, numbers, and hyphens.",
    };
  }

  if (!isProjectStatus(status)) {
    return { ok: false, error: "Select a valid project status." };
  }

  if (cover && !isUsableMediaUrl(cover)) {
    return { ok: false, error: "Cover image must be a valid URL or site path." };
  }

  if (gallery.some((url) => !isUsableMediaUrl(url))) {
    return { ok: false, error: "Each gallery item must be a valid URL or site path." };
  }

  const sortOrder = sortRaw === "" ? 0 : Number(sortRaw);
  if (!Number.isInteger(sortOrder)) {
    return { ok: false, error: "Display order must be a whole number." };
  }

  if (!qcddYear.ok) {
    return { ok: false, error: qcddYear.error };
  }

  if (!projectDetails.ok) {
    return { ok: false, error: projectDetails.error };
  }

  return {
    ok: true,
    payload: {
      slug,
      title_en: titleEn,
      title_ar: titleAr,
      location_en: locationEn,
      location_ar: locationAr,
      scope_en: scopeEn,
      scope_ar: scopeAr,
      project_status: status,
      cover_image_url: cover || null,
      gallery,
      sort_order: sortOrder,
      published,
      qcdd_year: qcddYear.value,
      project_details: projectDetails.value,
    },
  };
}

export function formatProjectError(message: string | undefined) {
  const text = (message ?? "").toLowerCase();

  if (text.includes("duplicate") || text.includes("unique")) {
    return "A project with this slug already exists.";
  }

  if (text.includes("row-level security") || text.includes("permission")) {
    return "You do not have permission to change projects.";
  }

  if (text.includes("column") && text.includes("does not exist")) {
    return "The projects table is missing an expected field. No database changes were made from the app.";
  }

  return "Unable to save this project. Please try again.";
}

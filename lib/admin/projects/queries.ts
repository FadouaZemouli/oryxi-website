import { createClient } from "@/lib/supabase/server";
import { parseGallery } from "@/lib/admin/projects/helpers";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import {
  PROJECT_SELECT,
  type AdminProject,
  type ProjectStatus,
} from "@/lib/admin/projects/types";
import { readProjectDetails } from "@/lib/admin/projects/details";

export type ProjectListFilters = {
  q?: string;
  status?: "all" | ProjectStatus;
  publication?: "all" | "published" | "draft";
};

export type ProjectQueryError = {
  message: string;
  code: string | null;
  details: string | null;
  hint: string | null;
};

function asProject(row: Record<string, unknown>): AdminProject | null {
  const id = typeof row.id === "string" ? row.id : "";
  if (!id) {
    return null;
  }

  const status = row.project_status === "completed" ? "completed" : "ongoing";

  return {
    id,
    slug: typeof row.slug === "string" ? row.slug : "",
    title_en: typeof row.title_en === "string" ? row.title_en : "",
    title_ar: typeof row.title_ar === "string" ? row.title_ar : "",
    location_en: typeof row.location_en === "string" ? row.location_en : "",
    location_ar: typeof row.location_ar === "string" ? row.location_ar : "",
    scope_en: typeof row.scope_en === "string" ? row.scope_en : "",
    scope_ar: typeof row.scope_ar === "string" ? row.scope_ar : "",
    project_status: status,
    cover_image_url:
      typeof row.cover_image_url === "string" ? row.cover_image_url : null,
    gallery: row.gallery,
    sort_order:
      typeof row.sort_order === "number" && Number.isFinite(row.sort_order)
        ? row.sort_order
        : 0,
    published: row.published === true,
    qcdd_year: typeof row.qcdd_year === "string" && row.qcdd_year.trim()
      ? row.qcdd_year.trim()
      : null,
    project_details: readProjectDetails(row.project_details),
    created_at: typeof row.created_at === "string" ? row.created_at : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function sanitizeSearch(value: string) {
  return value.replace(/[%_,.()]/g, " ").trim();
}

export async function listAdminProjects(filters: ProjectListFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (filters.status === "ongoing" || filters.status === "completed") {
    query = query.eq("project_status", filters.status);
  }

  if (filters.publication === "published") {
    query = query.eq("published", true);
  }

  if (filters.publication === "draft") {
    query = query.eq("published", false);
  }

  const search = sanitizeSearch(filters.q ?? "");
  if (search) {
    query = query.or(
      `title_en.ilike.%${search}%,title_ar.ilike.%${search}%,slug.ilike.%${search}%,location_en.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError("OMS admin projects list query failed", safeError);
    return { projects: [] as AdminProject[], error: safeError };
  }

  const projects = (data ?? [])
    .map((row) => asProject((row ?? {}) as Record<string, unknown>))
    .filter((row): row is AdminProject => Boolean(row));

  return { projects, error: null };
}

export async function listAdminProjectsBySlugs(slugs: readonly string[]) {
  const unique = [...new Set(slugs.filter(Boolean))];
  if (unique.length === 0) {
    return { projects: [] as AdminProject[], error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .in("slug", unique);

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError("OMS admin projects-by-slug query failed", safeError);
    return { projects: [] as AdminProject[], error: safeError };
  }

  const projects = (data ?? [])
    .map((row) => asProject((row ?? {}) as Record<string, unknown>))
    .filter((row): row is AdminProject => Boolean(row));

  return { projects, error: null };
}

export async function listRecentAdminProjects(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError("OMS admin recent projects query failed", safeError);
    return { projects: [] as AdminProject[], error: safeError };
  }

  const projects = (data ?? [])
    .map((row) => asProject((row ?? {}) as Record<string, unknown>))
    .filter((row): row is AdminProject => Boolean(row));

  return { projects, error: null };
}

export async function getAdminProject(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      logSafeSupabaseError(
        "OMS admin project get query failed",
        toSafeSupabaseError(error),
      );
    }
    return null;
  }

  return asProject(data as Record<string, unknown>);
}

export async function getAdminProjectCounts() {
  const supabase = await createClient();
  const [total, ongoing, completed, published] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("project_status", "ongoing"),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("project_status", "completed"),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
  ]);

  const asCount = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? value : 0;

  if (total.error) {
    logSafeSupabaseError(
      "OMS admin projects total count failed",
      toSafeSupabaseError(total.error),
    );
  }
  if (ongoing.error) {
    logSafeSupabaseError(
      "OMS admin projects ongoing count failed",
      toSafeSupabaseError(ongoing.error),
    );
  }
  if (completed.error) {
    logSafeSupabaseError(
      "OMS admin projects completed count failed",
      toSafeSupabaseError(completed.error),
    );
  }
  if (published.error) {
    logSafeSupabaseError(
      "OMS admin projects published count failed",
      toSafeSupabaseError(published.error),
    );
  }

  return {
    total: asCount(total.count),
    ongoing: asCount(ongoing.count),
    completed: asCount(completed.count),
    published: asCount(published.count),
  };
}

export function galleryUrls(project: AdminProject) {
  return parseGallery(project.gallery);
}

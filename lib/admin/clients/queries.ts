import { createClient } from "@/lib/supabase/server";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import {
  CLIENT_LINKED_PROJECT_SELECT,
  CLIENT_SELECT,
  type AdminClient,
  type ClientLinkedProject,
  type ClientStatus,
} from "@/lib/admin/clients/types";

export type ClientListFilters = {
  q?: string;
  status?: "all" | ClientStatus;
  publication?: "all" | "published" | "draft";
};

export type ClientQueryError = {
  message: string;
  code: string | null;
  details: string | null;
  hint: string | null;
};

export type ClientCounts = {
  total: number;
  active: number;
  withProjects: number;
  linkedProjects: number;
};

function asCount(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asClientStatus(value: unknown): ClientStatus {
  return value === "inactive" ? "inactive" : "active";
}

function asClient(
  row: Record<string, unknown>,
  projectCount = 0,
): AdminClient | null {
  const id = typeof row.id === "string" ? row.id : "";
  if (!id) {
    return null;
  }

  return {
    id,
    name: typeof row.name === "string" ? row.name : "",
    logo_url: typeof row.logo_url === "string" ? row.logo_url : null,
    website_url: typeof row.website_url === "string" ? row.website_url : null,
    sort_order:
      typeof row.sort_order === "number" && Number.isFinite(row.sort_order)
        ? row.sort_order
        : 0,
    published: row.published === true,
    created_at: typeof row.created_at === "string" ? row.created_at : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
    contact_person:
      typeof row.contact_person === "string" ? row.contact_person : null,
    email: typeof row.email === "string" ? row.email : null,
    phone: typeof row.phone === "string" ? row.phone : null,
    status: asClientStatus(row.status),
    notes: typeof row.notes === "string" ? row.notes : null,
    project_count: projectCount,
  };
}

function sanitizeSearch(value: string) {
  return value.replace(/[%_,.()]/g, " ").trim();
}

async function getProjectCountsByClientId() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("client_id")
    .not("client_id", "is", null);

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError(
      "OMS admin clients project-count query failed",
      safeError,
    );
    return { counts: new Map<string, number>(), error: safeError };
  }

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const clientId =
      row && typeof row === "object" && "client_id" in row
        ? (row as { client_id: unknown }).client_id
        : null;
    if (typeof clientId !== "string" || !clientId) {
      continue;
    }
    counts.set(clientId, (counts.get(clientId) ?? 0) + 1);
  }

  return { counts, error: null };
}

export async function listAdminClients(filters: ClientListFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("clients")
    .select(CLIENT_SELECT)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .order("id", { ascending: true });

  if (filters.status === "active" || filters.status === "inactive") {
    query = query.eq("status", filters.status);
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
      `name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
    );
  }

  const [{ data, error }, projectCountsResult] = await Promise.all([
    query,
    getProjectCountsByClientId(),
  ]);

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError("OMS admin clients list query failed", safeError);
    return { clients: [] as AdminClient[], error: safeError };
  }

  const projectCounts = projectCountsResult.counts;

  const clients = (data ?? [])
    .map((row) => {
      const record = (row ?? {}) as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : "";
      return asClient(record, projectCounts.get(id) ?? 0);
    })
    .filter((row): row is AdminClient => Boolean(row));

  return { clients, error: null };
}

export async function getAdminClientCounts(): Promise<ClientCounts> {
  const supabase = await createClient();
  const [total, active, linkedProjects, linkedRows] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .not("client_id", "is", null),
    supabase.from("projects").select("client_id").not("client_id", "is", null),
  ]);

  if (total.error) {
    logSafeSupabaseError(
      "OMS admin clients total count failed",
      toSafeSupabaseError(total.error),
    );
  }
  if (active.error) {
    logSafeSupabaseError(
      "OMS admin clients active count failed",
      toSafeSupabaseError(active.error),
    );
  }
  if (linkedProjects.error) {
    logSafeSupabaseError(
      "OMS admin linked projects count failed",
      toSafeSupabaseError(linkedProjects.error),
    );
  }
  if (linkedRows.error) {
    logSafeSupabaseError(
      "OMS admin clients-with-projects count failed",
      toSafeSupabaseError(linkedRows.error),
    );
  }

  const distinctClientIds = new Set<string>();
  for (const row of linkedRows.data ?? []) {
    const clientId =
      row && typeof row === "object" && "client_id" in row
        ? (row as { client_id: unknown }).client_id
        : null;
    if (typeof clientId === "string" && clientId) {
      distinctClientIds.add(clientId);
    }
  }

  return {
    total: asCount(total.count),
    active: asCount(active.count),
    withProjects: distinctClientIds.size,
    linkedProjects: asCount(linkedProjects.count),
  };
}

export async function getAdminClient(id: string) {
  if (!id) {
    return null;
  }

  const supabase = await createClient();
  const [{ data, error }, projectCountsResult] = await Promise.all([
    supabase.from("clients").select(CLIENT_SELECT).eq("id", id).maybeSingle(),
    getProjectCountsByClientId(),
  ]);

  if (error || !data) {
    if (error) {
      logSafeSupabaseError(
        "OMS admin client get query failed",
        toSafeSupabaseError(error),
      );
    }
    return null;
  }

  const record = data as Record<string, unknown>;
  const clientId = typeof record.id === "string" ? record.id : "";
  return asClient(record, projectCountsResult.counts.get(clientId) ?? 0);
}

export async function getNextClientSortOrder() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logSafeSupabaseError(
      "OMS admin next client sort_order query failed",
      toSafeSupabaseError(error),
    );
    return 1;
  }

  const max =
    data && typeof data === "object" && "sort_order" in data
      ? (data as { sort_order: unknown }).sort_order
      : null;

  if (typeof max === "number" && Number.isFinite(max)) {
    return Math.trunc(max) + 1;
  }

  return 1;
}

function asLinkedProject(
  row: Record<string, unknown>,
): ClientLinkedProject | null {
  const id = typeof row.id === "string" ? row.id : "";
  if (!id) {
    return null;
  }

  const status =
    row.project_status === "completed" ? "completed" : "ongoing";

  return {
    id,
    title_en: typeof row.title_en === "string" ? row.title_en : "",
    project_status: status,
    published: row.published === true,
  };
}

export async function listClientLinkedProjects(clientId: string) {
  if (!clientId) {
    return { projects: [] as ClientLinkedProject[], error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(CLIENT_LINKED_PROJECT_SELECT)
    .eq("client_id", clientId)
    .order("sort_order", { ascending: true })
    .order("title_en", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError(
      "OMS admin client linked projects query failed",
      safeError,
    );
    return { projects: [] as ClientLinkedProject[], error: safeError };
  }

  const projects = (data ?? [])
    .map((row) => asLinkedProject((row ?? {}) as Record<string, unknown>))
    .filter((row): row is ClientLinkedProject => Boolean(row));

  return { projects, error: null };
}

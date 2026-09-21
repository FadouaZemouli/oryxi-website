import { createClient } from "@/lib/supabase/server";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import type { ProjectClientOption } from "@/lib/admin/projects/types";

const CLIENT_PICKER_SELECT = "id, name, status, sort_order";

function asClientOption(row: Record<string, unknown>): ProjectClientOption | null {
  const id = typeof row.id === "string" ? row.id : "";
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    status: row.status === "inactive" ? "inactive" : "active",
  };
}

function sortClientOptions(left: ProjectClientOption, right: ProjectClientOption) {
  if (left.status !== right.status) {
    return left.status === "active" ? -1 : 1;
  }

  return left.name.localeCompare(right.name, "en", { sensitivity: "base" });
}

/** Lightweight client picker rows for ProjectForm (no notes or private fields). */
export async function listProjectClientOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select(CLIENT_PICKER_SELECT)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    logSafeSupabaseError(
      "OMS admin project client-options query failed",
      toSafeSupabaseError(error),
    );
    return { clients: [] as ProjectClientOption[], error: toSafeSupabaseError(error) };
  }

  const clients = (data ?? [])
    .map((row) => asClientOption((row ?? {}) as Record<string, unknown>))
    .filter((row): row is ProjectClientOption => Boolean(row))
    .sort(sortClientOptions);

  return { clients, error: null };
}

export async function assertProjectClientId(
  clientId: string | null,
): Promise<{ ok: true; clientId: string | null } | { ok: false; error: string }> {
  if (!clientId) {
    return { ok: true, clientId: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .maybeSingle();

  if (error) {
    logSafeSupabaseError(
      "OMS admin project client-id verify failed",
      toSafeSupabaseError(error),
    );
    return { ok: false, error: "Unable to verify the selected client." };
  }

  if (!data || typeof data.id !== "string") {
    return { ok: false, error: "Selected client could not be found." };
  }

  return { ok: true, clientId: data.id };
}

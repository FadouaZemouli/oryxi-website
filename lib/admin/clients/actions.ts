"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  formatClientDeleteError,
  formatClientError,
  parseClientForm,
  type ClientFormState,
} from "@/lib/admin/clients/form";
import { removeManagedClientLogo } from "@/lib/admin/clients/media";
import { listClientLinkedProjects } from "@/lib/admin/clients/queries";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import type { ClientLinkedProject } from "@/lib/admin/clients/types";

export type DeleteClientResult = {
  error: string | null;
  success: string | null;
};

function isUsableLogoUrl(value: string) {
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

function refreshClientViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/clients");
}

export async function createClientAction(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  await requireAdmin();
  const parsed = parseClientForm(formData);

  if (!parsed.ok) {
    return { error: parsed.error, success: null, id: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(parsed.payload)
    .select("id")
    .single();

  if (error || typeof data?.id !== "string") {
    return {
      error: formatClientError(error?.message),
      success: null,
      id: null,
    };
  }

  refreshClientViews();
  return { error: null, success: "Client created.", id: data.id };
}

export async function updateClientAction(
  id: string,
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  await requireAdmin();

  if (!id) {
    return {
      error: "This client could not be found.",
      success: null,
      id: null,
    };
  }

  const parsed = parseClientForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error, success: null, id };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({
      ...parsed.payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: formatClientError(error.message), success: null, id };
  }

  refreshClientViews();
  return { error: null, success: "Client updated.", id };
}

export async function updateClientLogoAction(
  id: string,
  logoUrl: string | null,
): Promise<{ error: string | null }> {
  await requireAdmin();

  if (!id) {
    return { error: "This client could not be found." };
  }

  if (logoUrl && !isUsableLogoUrl(logoUrl)) {
    return { error: "Logo must be a valid URL." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({
      logo_url: logoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: formatClientError(error.message) };
  }

  refreshClientViews();
  return { error: null };
}

export async function getClientLinkedProjectsAction(
  clientId: string,
): Promise<ClientLinkedProject[]> {
  await requireAdmin();

  if (!clientId) {
    return [];
  }

  const { projects } = await listClientLinkedProjects(clientId);
  return projects;
}

export async function deleteClientAction(
  id: string,
): Promise<DeleteClientResult> {
  await requireAdmin();

  if (!id) {
    return {
      error: "This client could not be found.",
      success: null,
    };
  }

  const supabase = await createClient();
  const { data: client, error: loadError } = await supabase
    .from("clients")
    .select("id, name, logo_url")
    .eq("id", id)
    .maybeSingle();

  if (loadError || !client || typeof client.id !== "string") {
    if (loadError) {
      logSafeSupabaseError(
        "OMS admin client delete load failed",
        toSafeSupabaseError(loadError),
      );
    }
    return {
      error: "This client could not be found.",
      success: null,
    };
  }

  const { count, error: countError } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("client_id", client.id);

  if (countError) {
    logSafeSupabaseError(
      "OMS admin client delete linked-projects count failed",
      toSafeSupabaseError(countError),
    );
    return {
      error: "Unable to verify linked projects. The client was not deleted.",
      success: null,
    };
  }

  const linkedCount = typeof count === "number" ? count : 0;
  if (linkedCount > 0) {
    return {
      error: `This client is linked to ${linkedCount} project${linkedCount === 1 ? "" : "s"} and cannot be deleted.`,
      success: null,
    };
  }

  const { error: deleteError } = await supabase
    .from("clients")
    .delete()
    .eq("id", client.id);

  if (deleteError) {
    logSafeSupabaseError(
      "OMS admin client delete failed",
      toSafeSupabaseError(deleteError),
    );
    return {
      error: formatClientDeleteError(deleteError.message),
      success: null,
    };
  }

  let logoCleanupFailed = false;
  if (typeof client.logo_url === "string" && client.logo_url.trim()) {
    const cleanup = await removeManagedClientLogo(
      supabase,
      client.logo_url,
      client.id,
    );
    if (cleanup.error) {
      logoCleanupFailed = true;
      logSafeSupabaseError(
        `OMS admin client logo cleanup failed after delete | client=${client.id}`,
        {
          message: cleanup.error,
          code: null,
          details: null,
          hint: null,
        },
      );
    }
  }

  refreshClientViews();

  if (logoCleanupFailed) {
    return {
      error: null,
      success:
        "Client deleted, but the logo could not be removed from storage.",
    };
  }

  return { error: null, success: "Client deleted." };
}

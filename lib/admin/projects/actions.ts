"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  formatProjectError,
  parseProjectForm,
  type ProjectFormState,
} from "@/lib/admin/projects/form";
import { isUsableMediaUrl } from "@/lib/admin/projects/helpers";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import {
  collectOwnedProjectStoragePaths,
  removeOwnedProjectStorageMedia,
} from "@/lib/admin/projects/media";
import { assertProjectClientId } from "@/lib/admin/projects/client-options";

const PROJECT_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function refreshProjectViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/clients");
}

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const parsed = parseProjectForm(formData);

  if (!parsed.ok) {
    return { error: parsed.error, success: null, id: null };
  }

  const clientCheck = await assertProjectClientId(parsed.payload.client_id);
  if (!clientCheck.ok) {
    return { error: clientCheck.error, success: null, id: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.payload, client_id: clientCheck.clientId })
    .select("id")
    .single();

  if (error || typeof data?.id !== "string") {
    return { error: formatProjectError(error?.message), success: null, id: null };
  }

  refreshProjectViews();
  return { error: null, success: "Project created.", id: data.id };
}

export async function updateProjectAction(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  if (!id) {
    return { error: "This project could not be found.", success: null, id: null };
  }

  const parsed = parseProjectForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error, success: null, id };
  }

  const clientCheck = await assertProjectClientId(parsed.payload.client_id);
  if (!clientCheck.ok) {
    return { error: clientCheck.error, success: null, id };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed.payload,
      client_id: clientCheck.clientId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: formatProjectError(error.message), success: null, id };
  }

  refreshProjectViews();
  return { error: null, success: "Project saved.", id };
}

export async function markProjectCompletedAction(
  id: string,
): Promise<{ error: string | null }> {
  await requireAdmin();

  if (!id || !PROJECT_ID_PATTERN.test(id)) {
    return { error: "This project could not be found." };
  }

  const supabase = await createClient();
  const { data, error: loadError } = await supabase
    .from("projects")
    .select("id, project_status")
    .eq("id", id)
    .maybeSingle();

  if (loadError || !data || typeof data.id !== "string") {
    if (loadError) {
      logSafeSupabaseError(
        "OMS admin project mark-completed load failed",
        toSafeSupabaseError(loadError),
      );
    }
    return { error: "This project could not be found." };
  }

  if (data.project_status === "completed") {
    refreshProjectViews();
    return { error: null };
  }

  if (data.project_status !== "ongoing") {
    return { error: "Only ongoing projects can be marked as completed." };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      project_status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("project_status", "ongoing");

  if (error) {
    logSafeSupabaseError(
      "OMS admin project mark-completed failed",
      toSafeSupabaseError(error),
    );
    return { error: formatProjectError(error.message) };
  }

  refreshProjectViews();
  return { error: null };
}

export async function updateProjectMediaAction(
  id: string,
  coverImageUrl: string | null,
  gallery: string[],
): Promise<{ error: string | null }> {
  await requireAdmin();

  if (!id) {
    return { error: "This project could not be found." };
  }

  if (coverImageUrl && !isUsableMediaUrl(coverImageUrl)) {
    return { error: "Cover image must be a valid URL." };
  }

  if (gallery.some((url) => !isUsableMediaUrl(url))) {
    return { error: "Gallery images must be valid URLs." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      cover_image_url: coverImageUrl,
      gallery,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: formatProjectError(error.message) };
  }

  refreshProjectViews();
  return { error: null };
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/projects?notice=error");
  }

  const supabase = await createClient();
  const { data: project, error: loadError } = await supabase
    .from("projects")
    .select("id, cover_image_url, gallery")
    .eq("id", id)
    .maybeSingle();

  if (loadError || !project || typeof project.id !== "string") {
    if (loadError) {
      logSafeSupabaseError(
        "OMS admin project delete load failed",
        toSafeSupabaseError(loadError),
      );
    }
    redirect("/admin/projects?notice=error");
  }

  const mediaPaths = collectOwnedProjectStoragePaths(
    project.id,
    typeof project.cover_image_url === "string" ? project.cover_image_url : null,
    project.gallery,
  );

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", project.id);

  if (deleteError) {
    logSafeSupabaseError(
      "OMS admin project delete failed",
      toSafeSupabaseError(deleteError),
    );
    refreshProjectViews();
    redirect("/admin/projects?notice=error");
  }

  if (mediaPaths.length > 0) {
    const cleanup = await removeOwnedProjectStorageMedia(
      supabase,
      project.id,
      mediaPaths,
    );

    if (cleanup.error) {
      logSafeSupabaseError(
        `OMS admin project media cleanup failed after delete | project=${project.id} | objects=${mediaPaths.length}`,
        toSafeSupabaseError(cleanup.error),
      );
      refreshProjectViews();
      redirect("/admin/projects?notice=deleted-media");
    }
  }

  refreshProjectViews();
  redirect("/admin/projects?notice=deleted");
}

export async function setProjectPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";

  if (!id) {
    redirect("/admin/projects?notice=error");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  refreshProjectViews();
  redirect(
    error
      ? "/admin/projects?notice=error"
      : `/admin/projects?notice=${published ? "published" : "unpublished"}`,
  );
}

export async function reorderProjectsAction(
  orderedIds: string[],
): Promise<{ error: string | null }> {
  await requireAdmin();

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { error: "Project order could not be saved." };
  }

  if (
    orderedIds.some(
      (id) => typeof id !== "string" || !PROJECT_ID_PATTERN.test(id),
    )
  ) {
    return { error: "Project order could not be saved." };
  }

  if (new Set(orderedIds).size !== orderedIds.length) {
    return { error: "Project order could not be saved." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("id");

  if (error) {
    logSafeSupabaseError(
      "OMS admin projects reorder load failed",
      toSafeSupabaseError(error),
    );
    return { error: "Project order could not be saved." };
  }

  const dbIds = (data ?? [])
    .map((row) => (typeof row.id === "string" ? row.id : ""))
    .filter(Boolean);

  if (dbIds.length !== orderedIds.length) {
    return {
      error: "Project order could not be saved. Reload and try again.",
    };
  }

  const dbSet = new Set(dbIds);
  if (!orderedIds.every((id) => dbSet.has(id))) {
    return {
      error: "Project order could not be saved. Reload and try again.",
    };
  }

  // Two-pass write avoids unique-constraint collisions while numbers shift.
  const offset = 100_000;
  for (let index = 0; index < orderedIds.length; index += 1) {
    const { error: offsetError } = await supabase
      .from("projects")
      .update({ sort_order: offset + index + 1 })
      .eq("id", orderedIds[index]);

    if (offsetError) {
      logSafeSupabaseError(
        "OMS admin projects reorder offset failed",
        toSafeSupabaseError(offsetError),
      );
      return { error: "Project order could not be saved." };
    }
  }

  for (let index = 0; index < orderedIds.length; index += 1) {
    const { error: updateError } = await supabase
      .from("projects")
      .update({ sort_order: index + 1 })
      .eq("id", orderedIds[index]);

    if (updateError) {
      logSafeSupabaseError(
        "OMS admin projects reorder write failed",
        toSafeSupabaseError(updateError),
      );
      return { error: "Project order could not be saved." };
    }
  }

  refreshProjectViews();
  return { error: null };
}

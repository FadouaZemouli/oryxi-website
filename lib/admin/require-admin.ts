import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveAdminAccess } from "@/lib/admin/is-admin";

export async function getAuthorizedAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const access = await resolveAdminAccess(supabase);

  if (access.status === "authorized") {
    return user;
  }

  if (access.status === "unauthorized") {
    await supabase.auth.signOut();
  }

  return null;
}

export async function requireAdmin() {
  const user = await getAuthorizedAdmin();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

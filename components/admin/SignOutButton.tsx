"use client";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/admin/login");
  }

  return (
    <button type="button" className="oms-admin-signout" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}

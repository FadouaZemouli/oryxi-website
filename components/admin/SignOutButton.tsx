"use client";

import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  className?: string;
  children?: ReactNode;
};

export function SignOutButton({ className, children }: SignOutButtonProps) {
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/admin/login");
  }

  return (
    <button
      type="button"
      className={["oms-admin-signout", className].filter(Boolean).join(" ")}
      onClick={handleSignOut}
    >
      {children}
      Sign Out
    </button>
  );
}

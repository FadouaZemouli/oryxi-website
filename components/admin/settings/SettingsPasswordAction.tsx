"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SettingsPasswordActionProps = {
  email: string;
};

export function SettingsPasswordAction({ email }: SettingsPasswordActionProps) {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleResetRequest() {
    const trimmed = email.trim();
    if (!trimmed) {
      setInfo(null);
      setError("No account email is available for password recovery.");
      return;
    }

    setError(null);
    setInfo(null);
    setPending(true);

    const resetMessage =
      "If an account exists for this email, a password reset link has been sent.";

    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      setInfo(resetMessage);
    } catch {
      setInfo(resetMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="oms-admin-setting-password">
      <p className="oms-admin-setting-note">
        Password changes use the existing OMS admin recovery email flow. A reset
        link will be sent to your account email.
      </p>

      {error ? (
        <p className="oms-admin-error" role="alert">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="oms-admin-success" role="status">
          {info}
        </p>
      ) : null}

      <button
        className="oms-admin-setting-secondary"
        type="button"
        onClick={handleResetRequest}
        disabled={pending || !email.trim()}
      >
        {pending ? "Sending…" : "Send password reset email"}
      </button>
    </div>
  );
}

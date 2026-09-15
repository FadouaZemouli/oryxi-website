"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { resolveAdminAccess } from "@/lib/admin/is-admin";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [forgotPending, setForgotPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data.user) {
        setError("Invalid email or password.");
        return;
      }

      if (!data.user.id || !data.session) {
        setError("Unable to verify admin access. Please try again.");
        return;
      }

      const access = await resolveAdminAccess(supabase);

      if (access.status === "error") {
        setError("Unable to verify admin access. Please try again.");
        return;
      }

      if (access.status === "unauthorized") {
        await supabase.auth.signOut();
        setError("Unauthorized. This account does not have admin access.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleForgotPassword() {
    const trimmed = email.trim();

    if (!trimmed) {
      setInfo(null);
      setError("Enter your email address first.");
      return;
    }

    setError(null);
    setInfo(null);
    setForgotPending(true);

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
      setForgotPending(false);
    }
  }

  return (
    <form className="oms-admin-form" onSubmit={handleSubmit} noValidate>
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

      <div className="oms-admin-field">
        <label className="oms-admin-label" htmlFor="oms-admin-email">
          Email
        </label>
        <input
          id="oms-admin-email"
          className="oms-admin-input"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          aria-invalid={Boolean(error) || undefined}
        />
      </div>

      <div className="oms-admin-field">
        <label className="oms-admin-label" htmlFor="oms-admin-password">
          Password
        </label>
        <div className="oms-admin-password-wrap">
          <input
            id="oms-admin-password"
            className="oms-admin-input"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            aria-invalid={Boolean(error) || undefined}
          />
          <button
            type="button"
            className="oms-admin-password-toggle"
            onClick={() => setShowPassword((open) => !open)}
            aria-pressed={showPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button className="oms-admin-submit" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <div className="oms-admin-aux-row">
        <button
          type="button"
          className="oms-admin-aux-button"
          onClick={handleForgotPassword}
          disabled={forgotPending || pending}
        >
          {forgotPending ? "Sending…" : "Forgot password?"}
        </button>
      </div>
    </form>
  );
}

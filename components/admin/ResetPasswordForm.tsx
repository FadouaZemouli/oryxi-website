"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const INVALID_LINK_MESSAGE =
  "This password reset link is invalid or has expired.";
const UNVERIFIED_LINK_MESSAGE =
  "This password reset link could not be verified. Please request a new password reset email.";
const VERIFY_TIMEOUT_MS = 8000;

type RecoveryStatus = "checking" | "form" | "invalid" | "unverified";

let recoveryExchangePromise: Promise<boolean> | null = null;

function isDev() {
  return process.env.NODE_ENV !== "production";
}

function logRecovery(message: string) {
  if (isDev()) {
    console.info(message);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);

    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function exchangeRecoveryCodeOnce(
  supabase: ReturnType<typeof createClient>,
  code: string,
) {
  if (!recoveryExchangePromise) {
    recoveryExchangePromise = supabase.auth
      .exchangeCodeForSession(code)
      .then(({ data, error: exchangeError }) =>
        Boolean(data.session) && !exchangeError,
      )
      .catch(() => false);
  }

  return recoveryExchangePromise;
}

function stripCodeFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("code")) {
    return;
  }

  url.searchParams.delete("code");
  const search = url.searchParams.toString();
  window.history.replaceState({}, "", `${url.pathname}${search ? `?${search}` : ""}`);
}

export function ResetPasswordForm() {
  const router = useRouter();
  const resolvedRef = useRef(false);
  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    let timeoutId = 0;
    let unsubscribe: (() => void) | undefined;

    function resolve(next: RecoveryStatus) {
      if (!active || resolvedRef.current) {
        return;
      }

      resolvedRef.current = true;
      setStatus(next);
    }

    timeoutId = window.setTimeout(() => {
      resolve("unverified");
    }, VERIFY_TIMEOUT_MS);

    async function establishSession() {
      try {
        const params = new URLSearchParams(window.location.search);

        if (params.get("error") === "invalid") {
          resolve("invalid");
          return;
        }

        const supabase = createClient();
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "PASSWORD_RECOVERY" && session) {
            logRecovery("Existing recovery session detected");
            resolve("form");
          }
        });
        unsubscribe = () => subscription.unsubscribe();

        const code = params.get("code");

        if (code) {
          logRecovery("Recovery code detected");

          const exchanged = await withTimeout(
            exchangeRecoveryCodeOnce(supabase, code),
            VERIFY_TIMEOUT_MS,
          );

          if (!active) {
            return;
          }

          if (exchanged) {
            logRecovery("Recovery code exchange succeeded");
            stripCodeFromUrl();
            resolve("form");
            return;
          }

          logRecovery("Recovery code exchange failed");
          resolve("invalid");
          return;
        }

        const { data } = await withTimeout(
          supabase.auth.getSession(),
          VERIFY_TIMEOUT_MS,
        );

        if (!active) {
          return;
        }

        if (data.session) {
          logRecovery("Existing recovery session detected");
          resolve("form");
          return;
        }

        logRecovery("No recovery session detected");
        resolve("invalid");
      } catch {
        if (!active || resolvedRef.current) {
          return;
        }

        const params = new URLSearchParams(window.location.search);
        if (params.get("code")) {
          logRecovery("Recovery code exchange failed");
        } else {
          logRecovery("No recovery session detected");
        }

        resolve("unverified");
      } finally {
        if (active && !resolvedRef.current) {
          resolve("unverified");
        }
      }
    }

    void establishSession();

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      unsubscribe?.();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError("Unable to update your password. Please request a new reset link.");
        return;
      }

      await supabase.auth.signOut();
      setSuccess(true);
      window.setTimeout(() => {
        router.push("/admin/login");
        router.refresh();
      }, 1600);
    } catch {
      setError("Unable to update your password. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (status === "checking") {
    return <p className="oms-admin-login-copy">Checking reset link…</p>;
  }

  if (status === "invalid" || status === "unverified") {
    return (
      <div className="oms-admin-form">
        <p className="oms-admin-error" role="alert">
          {status === "unverified"
            ? UNVERIFIED_LINK_MESSAGE
            : INVALID_LINK_MESSAGE}
        </p>
        <div className="oms-admin-aux-row">
          <Link className="oms-admin-aux-link" href="/admin/login">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <p className="oms-admin-success" role="status">
        Your password has been updated. Redirecting to sign in…
      </p>
    );
  }

  return (
    <form className="oms-admin-form" onSubmit={handleSubmit} noValidate>
      {error ? (
        <p className="oms-admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="oms-admin-field">
        <label className="oms-admin-label" htmlFor="oms-admin-new-password">
          New Password
        </label>
        <div className="oms-admin-password-wrap">
          <input
            id="oms-admin-new-password"
            className="oms-admin-input"
            name="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
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

      <div className="oms-admin-field">
        <label className="oms-admin-label" htmlFor="oms-admin-confirm-password">
          Confirm Password
        </label>
        <div className="oms-admin-password-wrap">
          <input
            id="oms-admin-confirm-password"
            className="oms-admin-input"
            name="confirm-password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
            aria-invalid={Boolean(error) || undefined}
          />
          <button
            type="button"
            className="oms-admin-password-toggle"
            onClick={() => setShowConfirm((open) => !open)}
            aria-pressed={showConfirm}
            aria-label={showConfirm ? "Hide password confirmation" : "Show password confirmation"}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button className="oms-admin-submit" type="submit" disabled={pending}>
        {pending ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}

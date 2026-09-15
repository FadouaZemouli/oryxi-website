import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_NEXT_PATH = "/admin/reset-password";
const INVALID_PATH = "/admin/reset-password?error=invalid";
const RECOVERY_TYPE: EmailOtpType = "recovery";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export function safeAdminNextPath(next: string | null): string {
  if (!next || !next.startsWith("/admin") || next.startsWith("//")) {
    return DEFAULT_NEXT_PATH;
  }

  if (next.includes("://") || next.includes("\\") || next.includes("..")) {
    return DEFAULT_NEXT_PATH;
  }

  return next;
}

function redirectWithCookies(
  request: NextRequest,
  path: string,
  cookiesToSet: CookieToSet[],
  extraHeaders?: Record<string, string>,
) {
  const response = NextResponse.redirect(new URL(path, request.url), 303);
  response.headers.set("Cache-Control", "private, no-store");

  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

export async function verifyRecoveryTokenHash(
  request: NextRequest,
  tokenHash: string,
  nextPath: string,
) {
  const cookiesToSet: CookieToSet[] = [];
  let cookieHeaders: Record<string, string> = {};
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return redirectWithCookies(request, INVALID_PATH, []);
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(incoming, headers) {
        incoming.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          cookiesToSet.push({ name, value, options });
        });
        cookieHeaders = headers;
      },
    },
  });

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: RECOVERY_TYPE,
  });

  if (error || !data.session) {
    return redirectWithCookies(request, INVALID_PATH, []);
  }

  return redirectWithCookies(request, nextPath, cookiesToSet, cookieHeaders);
}

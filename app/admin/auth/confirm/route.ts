import { NextResponse, type NextRequest } from "next/server";
import {
  safeAdminNextPath,
  verifyRecoveryTokenHash,
} from "@/lib/admin/verify-recovery";

export const dynamic = "force-dynamic";

function invalidResetRedirect(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/admin/reset-password?error=invalid", request.url),
    303,
  );
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash")?.trim();
  const type = request.nextUrl.searchParams.get("type");
  const nextPath = safeAdminNextPath(request.nextUrl.searchParams.get("next"));

  if (!tokenHash || type !== "recovery") {
    return invalidResetRedirect(request);
  }

  return verifyRecoveryTokenHash(request, tokenHash, nextPath);
}

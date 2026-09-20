type SafeSupabaseError = {
  message: string;
  code: string | null;
  details: string | null;
  hint: string | null;
};

export function toSafeSupabaseError(error: unknown): SafeSupabaseError {
  if (!error || typeof error !== "object") {
    return {
      message: String(error ?? "Unknown Supabase error"),
      code: null,
      details: null,
      hint: null,
    };
  }

  const record = error as Record<string, unknown>;
  const asText = (value: unknown) =>
    typeof value === "string" && value.length > 0 ? value : null;

  return {
    message:
      asText(record.message) ??
      (error instanceof Error ? error.message : "Unknown Supabase error"),
    code: asText(record.code),
    details: asText(record.details),
    hint: asText(record.hint),
  };
}

export function logSafeSupabaseError(context: string, error: SafeSupabaseError) {
  console.error(
    `${context} | message=${error.message} | code=${error.code ?? ""} | details=${error.details ?? ""} | hint=${error.hint ?? ""}`,
  );
}

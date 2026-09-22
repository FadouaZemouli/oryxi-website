type AdminUserLike = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

export type AdminIdentity = {
  firstName: string;
  displayName: string;
  initials: string;
  email: string;
};

function asTrimmedString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function firstToken(value: string) {
  const cleaned = value.replace(/[._-]+/g, " ").trim();
  return cleaned.split(/\s+/).filter(Boolean)[0] || value;
}

function initialsFrom(value: string) {
  const parts = value.replace(/[._-]+/g, " ").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "A";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function adminIdentityFromUser(user: AdminUserLike): AdminIdentity {
  const meta = user.user_metadata ?? {};
  const named = asTrimmedString(meta.full_name) ||
    asTrimmedString(meta.name) ||
    asTrimmedString(meta.display_name);
  const email = asTrimmedString(user.email);
  const local = email.split("@")[0] || "Administrator";
  const displayName = named || local.replace(/[._-]+/g, " ");

  return {
    firstName: firstToken(displayName),
    displayName,
    initials: initialsFrom(displayName),
    email,
  };
}

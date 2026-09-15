import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminAccess = "authorized" | "unauthorized" | "error";

export type AdminAccessResolution = {
  status: AdminAccess;
  rpcReturnedTrue: boolean;
  rpcReturnedFalse: boolean;
  rpcErrorCode: string | null;
  rpcErrorMessage: string | null;
};

function rpcErrorFields(error: {
  code?: string;
  message?: string;
} | null): Pick<AdminAccessResolution, "rpcErrorCode" | "rpcErrorMessage"> {
  if (!error) {
    return { rpcErrorCode: null, rpcErrorMessage: null };
  }

  return {
    rpcErrorCode: error.code ?? null,
    rpcErrorMessage: error.message ?? null,
  };
}

export async function resolveAdminAccess(
  supabase: SupabaseClient,
): Promise<AdminAccessResolution> {
  const { data, error } = await supabase.rpc("is_oms_admin");
  const rpcErrors = rpcErrorFields(error);

  if (error) {
    return {
      status: "error",
      rpcReturnedTrue: false,
      rpcReturnedFalse: false,
      ...rpcErrors,
    };
  }

  if (data === true) {
    return {
      status: "authorized",
      rpcReturnedTrue: true,
      rpcReturnedFalse: false,
      ...rpcErrors,
    };
  }

  if (data === false) {
    return {
      status: "unauthorized",
      rpcReturnedTrue: false,
      rpcReturnedFalse: true,
      ...rpcErrors,
    };
  }

  return {
    status: "error",
    rpcReturnedTrue: false,
    rpcReturnedFalse: false,
    rpcErrorCode: null,
    rpcErrorMessage: "malformed_rpc_result",
  };
}

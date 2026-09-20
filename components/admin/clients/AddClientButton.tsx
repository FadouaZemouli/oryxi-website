"use client";

import type { ReactNode } from "react";
import { useClientsModals } from "@/components/admin/clients/ClientsModals";

export function AddClientButton({
  className,
  children = "+ Add Client",
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { openAdd } = useClientsModals();

  return (
    <button type="button" className={className} onClick={openAdd}>
      {children}
    </button>
  );
}

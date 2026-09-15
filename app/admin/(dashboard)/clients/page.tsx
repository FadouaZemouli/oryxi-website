import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Clients",
};

export default function AdminClientsPage() {
  return (
    <ComingSoon
      title="Clients"
      description="Client management will be added in a later phase. The dashboard already shows the current client count."
    />
  );
}

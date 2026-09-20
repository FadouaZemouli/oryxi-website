import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  getAdminClient,
  listClientLinkedProjects,
} from "@/lib/admin/clients/queries";
import { ClientForm } from "@/components/admin/clients/ClientForm";

export const metadata: Metadata = {
  title: "Edit Client",
};

export default async function AdminEditClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { notice } = await searchParams;
  const client = await getAdminClient(id);

  if (!client) {
    notFound();
  }

  const { projects: linkedProjects } = await listClientLinkedProjects(client.id);

  return (
    <section
      className="oms-admin-clients"
      aria-labelledby="oms-admin-edit-client-heading"
    >
      <header className="oms-admin-page-head">
        <div>
          <h1 id="oms-admin-edit-client-heading" className="oms-admin-heading">
            Edit Client
          </h1>
          <p className="oms-admin-welcome">
            {client.name || "Update this client’s details and settings."}
          </p>
        </div>
      </header>
      <ClientForm
        client={client}
        linkedProjects={linkedProjects}
        notice={notice}
      />
    </section>
  );
}

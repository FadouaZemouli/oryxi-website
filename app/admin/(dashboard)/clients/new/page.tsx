import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getNextClientSortOrder } from "@/lib/admin/clients/queries";
import { ClientForm } from "@/components/admin/clients/ClientForm";

export const metadata: Metadata = {
  title: "Add Client",
};

export default async function AdminNewClientPage() {
  await requireAdmin();
  const nextSortOrder = await getNextClientSortOrder();

  return (
    <section
      className="oms-admin-clients"
      aria-labelledby="oms-admin-new-client-heading"
    >
      <header className="oms-admin-page-head">
        <div>
          <h1 id="oms-admin-new-client-heading" className="oms-admin-heading">
            Add Client
          </h1>
          <p className="oms-admin-welcome">
            Create a client record using the existing OMS clients table.
          </p>
        </div>
      </header>
      <ClientForm defaultSortOrder={nextSortOrder} />
    </section>
  );
}

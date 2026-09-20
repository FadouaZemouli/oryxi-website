import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/require-admin";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export const metadata: Metadata = {
  title: "Add project",
};

export default async function NewAdminProjectPage() {
  await requireAdmin();

  return (
    <section aria-labelledby="oms-admin-new-project-heading">
      <header className="oms-admin-page-head">
        <div>
          <h1 id="oms-admin-new-project-heading" className="oms-admin-heading">
            Add Project
          </h1>
          <p className="oms-admin-welcome">
            Create a project record using the existing OMS projects table.
          </p>
        </div>
      </header>
      <ProjectForm />
    </section>
  );
}

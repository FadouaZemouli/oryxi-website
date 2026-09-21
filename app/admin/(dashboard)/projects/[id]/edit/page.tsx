import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/require-admin";
import { listProjectClientOptions } from "@/lib/admin/projects/client-options";
import { getAdminProject } from "@/lib/admin/projects/queries";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export const metadata: Metadata = {
  title: "Edit project",
};

export default async function EditAdminProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { notice } = await searchParams;
  const [project, clientOptionsResult] = await Promise.all([
    getAdminProject(id),
    listProjectClientOptions(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <section aria-labelledby="oms-admin-edit-project-heading">
      <header className="oms-admin-page-head">
        <div>
          <h1 id="oms-admin-edit-project-heading" className="oms-admin-heading">
            Edit Project
          </h1>
          <p className="oms-admin-welcome">
            {project.title_en ||
              "Update this project's details and website settings."}
          </p>
        </div>
      </header>
      <ProjectForm
        project={project}
        clientOptions={clientOptionsResult.clients}
        notice={notice}
      />
    </section>
  );
}

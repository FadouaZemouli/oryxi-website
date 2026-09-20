"use client";

import { AddProjectButton } from "@/components/admin/projects/ProjectsAddProject";

export function ProjectsShowcaseCta() {
  return (
    <aside
      className="oms-admin-projects-cta"
      aria-labelledby="oms-admin-projects-cta-heading"
    >
      <div className="oms-admin-projects-cta-copy">
        <h2 id="oms-admin-projects-cta-heading">Showcase Your Work</h2>
        <p>
          Add your projects to highlight OMS&apos;s expertise and build trust
          with future clients.
        </p>
      </div>
      <AddProjectButton className="oms-admin-submit oms-admin-add-link oms-admin-projects-cta-btn">
        + Add Project
      </AddProjectButton>
    </aside>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EditProjectModal } from "@/components/admin/projects/EditProjectModal";
import type { AdminProject } from "@/lib/admin/projects/types";

type ProjectsEditProjectContextValue = {
  open: (project: AdminProject) => void;
};

const ProjectsEditProjectContext =
  createContext<ProjectsEditProjectContextValue | null>(null);

export function ProjectsEditProjectProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [project, setProject] = useState<AdminProject | null>(null);

  const open = useCallback((next: AdminProject) => {
    setProject(next);
  }, []);

  const close = useCallback(() => {
    setProject(null);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ProjectsEditProjectContext.Provider value={value}>
      {children}
      <EditProjectModal
        project={project}
        open={Boolean(project)}
        onClose={close}
      />
    </ProjectsEditProjectContext.Provider>
  );
}

export function useEditProject() {
  const ctx = useContext(ProjectsEditProjectContext);

  if (!ctx) {
    throw new Error(
      "useEditProject must be used within ProjectsEditProjectProvider",
    );
  }

  return ctx;
}

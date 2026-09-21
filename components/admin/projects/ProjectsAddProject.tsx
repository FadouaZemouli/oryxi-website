"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AddProjectModal } from "@/components/admin/projects/AddProjectModal";
import type { ProjectClientOption } from "@/lib/admin/projects/types";

type ProjectsAddProjectContextValue = {
  open: () => void;
};

const ProjectsAddProjectContext =
  createContext<ProjectsAddProjectContextValue | null>(null);

export function ProjectsAddProjectProvider({
  children,
  clientOptions,
}: {
  children: ReactNode;
  clientOptions: ProjectClientOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ProjectsAddProjectContext.Provider value={value}>
      {children}
      <AddProjectModal
        open={isOpen}
        onClose={close}
        clientOptions={clientOptions}
      />
    </ProjectsAddProjectContext.Provider>
  );
}

export function AddProjectButton({
  className,
  children = "+ Add Project",
}: {
  className?: string;
  children?: ReactNode;
}) {
  const ctx = useContext(ProjectsAddProjectContext);

  if (!ctx) {
    throw new Error("AddProjectButton must be used within ProjectsAddProjectProvider");
  }

  return (
    <button
      type="button"
      className={className}
      onClick={ctx.open}
    >
      {children}
    </button>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { DeleteProjectButton } from "@/components/admin/projects/DeleteProjectButton";
import { PublishToggle } from "@/components/admin/projects/PublishToggle";

export function ProjectActionsMenu({
  id,
  title,
  published,
}: {
  id: string;
  title: string;
  published: boolean;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!rootRef.current?.contains(target)) {
        // Keep the menu mounted while a nested confirm dialog is open.
        const dialog = document.querySelector("dialog[open]");
        if (dialog?.contains(target)) {
          return;
        }
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const dialog = document.querySelector("dialog[open]");
        if (dialog) {
          return;
        }
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="oms-admin-projects-menu" ref={rootRef}>
      <button
        type="button"
        className="oms-admin-projects-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`More actions for ${title.trim() || "project"}`}
        onClick={() => setOpen((current) => !current)}
      >
        <MoreHorizontal size={18} strokeWidth={2} aria-hidden="true" />
      </button>

      <div
        id={menuId}
        className="oms-admin-projects-menu-panel"
        role="menu"
        hidden={!open}
      >
        <div className="oms-admin-projects-menu-item" role="menuitem">
          <PublishToggle id={id} published={published} />
        </div>
        <div className="oms-admin-projects-menu-item" role="menuitem">
          <DeleteProjectButton id={id} title={title} />
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { AdminProject } from "@/lib/admin/projects/types";
import { parseGallery } from "@/lib/admin/projects/helpers";
import { reorderProjectsAction } from "@/lib/admin/projects/actions";
import {
  ProjectPublishBadge,
  ProjectStatusBadge,
} from "@/components/admin/projects/ProjectBadges";
import { ProjectActionsMenu } from "@/components/admin/projects/ProjectActionsMenu";
import { ProjectMediaThumb } from "@/components/admin/projects/ProjectMediaThumb";
import { useEditProject } from "@/components/admin/projects/ProjectsEditProject";

const PAGE_SIZE = 10;

type DropPosition = "before" | "after";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function sortProjects(projects: AdminProject[]) {
  return [...projects].sort((a, b) => {
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }

    const createdA = a.created_at ?? "";
    const createdB = b.created_at ?? "";
    if (createdA !== createdB) {
      return createdA.localeCompare(createdB);
    }

    return a.id.localeCompare(b.id);
  });
}

function withNormalizedOrder(rows: AdminProject[]) {
  return rows.map((row, index) => ({
    ...row,
    sort_order: index + 1,
  }));
}

function sameOrder(left: AdminProject[], right: AdminProject[]) {
  return (
    left.length === right.length &&
    left.every((row, index) => row.id === right[index]?.id)
  );
}

function applyDrop(
  rows: AdminProject[],
  draggedId: string,
  targetId: string,
  position: DropPosition,
) {
  if (draggedId === targetId) {
    return rows;
  }

  const from = rows.findIndex((row) => row.id === draggedId);
  if (from < 0) {
    return rows;
  }

  const next = [...rows];
  const [item] = next.splice(from, 1);
  let insertAt = next.findIndex((row) => row.id === targetId);
  if (insertAt < 0 || !item) {
    return rows;
  }

  if (position === "after") {
    insertAt += 1;
  }

  next.splice(insertAt, 0, item);
  return withNormalizedOrder(next);
}

function moveByOffset(rows: AdminProject[], id: string, offset: number) {
  const from = rows.findIndex((row) => row.id === id);
  const to = from + offset;
  if (from < 0 || to < 0 || to >= rows.length) {
    return rows;
  }

  const next = [...rows];
  const [item] = next.splice(from, 1);
  if (!item) {
    return rows;
  }

  next.splice(to, 0, item);
  return withNormalizedOrder(next);
}

function dropPositionFromEvent(event: DragEvent<HTMLTableRowElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const midpoint = rect.top + rect.height / 2;
  return event.clientY < midpoint ? "before" : "after";
}

function OrderHandleDots() {
  return (
    <span className="oms-admin-order-handle" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export function ProjectsTable({
  projects,
  canReorder,
}: {
  projects: AdminProject[];
  canReorder: boolean;
}) {
  const router = useRouter();
  const { open: openEdit } = useEditProject();
  const hintId = useId();
  const savingRef = useRef(false);
  const [rows, setRows] = useState(() => sortProjects(projects));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<"idle" | "saving" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    position: DropPosition;
  } | null>(null);

  useEffect(() => {
    if (savingRef.current) {
      return;
    }

    setRows(sortProjects(projects));
    setPage(1);
  }, [projects]);

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, total);
  const visibleRows = rows.slice(startIndex, endIndex);
  const showingFrom = total === 0 ? 0 : startIndex + 1;
  const showingTo = endIndex;

  function clearDragState() {
    setDraggingId(null);
    setDropTarget(null);
  }

  async function persistOrder(next: AdminProject[], previous: AdminProject[]) {
    try {
      const result = await reorderProjectsAction(next.map((row) => row.id));
      if (result.error) {
        setRows(previous);
        setError(result.error);
        setNotice("idle");
        router.refresh();
        return;
      }

      setNotice("success");
      router.refresh();
    } catch {
      setRows(previous);
      setError("Project order could not be saved.");
      setNotice("idle");
      router.refresh();
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  function commitOrder(next: AdminProject[]) {
    if (!canReorder || savingRef.current) {
      clearDragState();
      return;
    }

    const previous = rows;
    if (sameOrder(next, previous)) {
      clearDragState();
      return;
    }

    savingRef.current = true;
    setRows(next);
    setSaving(true);
    setError(null);
    setNotice("saving");
    clearDragState();
    void persistOrder(next, previous);
  }

  function onHandleDragStart(
    event: DragEvent<HTMLButtonElement>,
    project: AdminProject,
  ) {
    if (!canReorder || saving) {
      event.preventDefault();
      return;
    }

    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", project.id);
    const row = event.currentTarget.closest("tr");
    if (row) {
      event.dataTransfer.setDragImage(row, 24, 20);
    }
    setError(null);
    setDraggingId(project.id);
    setDropTarget(null);
  }

  function onRowDragOver(
    event: DragEvent<HTMLTableRowElement>,
    projectId: string,
  ) {
    if (!canReorder || saving || !draggingId) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (draggingId === projectId) {
      setDropTarget(null);
      return;
    }

    const position = dropPositionFromEvent(event);
    setDropTarget((current) => {
      if (current?.id === projectId && current.position === position) {
        return current;
      }
      return { id: projectId, position };
    });
  }

  function onRowDrop(
    event: DragEvent<HTMLTableRowElement>,
    projectId: string,
  ) {
    if (!canReorder || saving || !draggingId) {
      return;
    }

    event.preventDefault();
    const position =
      dropTarget?.id === projectId
        ? dropTarget.position
        : dropPositionFromEvent(event);
    commitOrder(applyDrop(rows, draggingId, projectId, position));
  }

  function onHandleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    projectId: string,
  ) {
    if (!canReorder || saving) {
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      commitOrder(moveByOffset(rows, projectId, -1));
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      commitOrder(moveByOffset(rows, projectId, 1));
    }
  }

  const reorderEnabled = canReorder && !saving;

  return (
    <div className="oms-admin-projects-table-block">
      {notice === "saving" ? (
        <p className="oms-admin-success oms-admin-reorder-status" role="status">
          Saving order...
        </p>
      ) : null}
      {notice === "success" ? (
        <p className="oms-admin-success oms-admin-reorder-status" role="status">
          Project order updated.
        </p>
      ) : null}
      {error ? (
        <p className="oms-admin-error oms-admin-reorder-status" role="alert">
          {error}
        </p>
      ) : null}
      {!canReorder ? (
        <p id={hintId} className="oms-admin-reorder-hint" role="status">
          Clear search and filters to reorder projects.
        </p>
      ) : null}

      <div className="oms-admin-table-wrap oms-admin-projects-table-wrap">
        <table className="oms-admin-table oms-admin-projects-table" aria-busy={saving}>
          <thead>
            <tr>
              <th className="oms-admin-reorder-cell" scope="col">
                <span className="oms-admin-sr-only">Reorder</span>
              </th>
              <th scope="col">Project</th>
              <th scope="col">Location</th>
              <th scope="col">Client</th>
              <th scope="col">Status</th>
              <th scope="col">Website</th>
              <th scope="col">Order</th>
              <th scope="col">Last Updated</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((project) => {
              const cover =
                project.cover_image_url || parseGallery(project.gallery)[0] || "";
              const title = project.title_en || "Untitled";
              const isDragging = draggingId === project.id;
              const rowDrop =
                dropTarget?.id === project.id ? dropTarget.position : null;
              const location = project.location_en.trim();

              return (
                <tr
                  key={project.id}
                  className={[
                    isDragging ? "oms-admin-row-dragging" : "",
                    rowDrop === "before" ? "oms-admin-drop-before" : "",
                    rowDrop === "after" ? "oms-admin-drop-after" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onDragOver={(event) => onRowDragOver(event, project.id)}
                  onDrop={(event) => onRowDrop(event, project.id)}
                  onDragEnd={clearDragState}
                >
                  <td className="oms-admin-reorder-cell">
                    <button
                      type="button"
                      className="oms-admin-row-handle"
                      draggable={reorderEnabled}
                      disabled={!reorderEnabled}
                      aria-label={`Reorder ${title}`}
                      aria-describedby={canReorder ? undefined : hintId}
                      aria-grabbed={isDragging}
                      aria-disabled={!reorderEnabled}
                      title={
                        canReorder
                          ? "Drag to reorder, or use arrow keys"
                          : "Clear search and filters to reorder projects."
                      }
                      onDragStart={(event) => onHandleDragStart(event, project)}
                      onDragEnd={clearDragState}
                      onKeyDown={(event) => onHandleKeyDown(event, project.id)}
                    >
                      <OrderHandleDots />
                    </button>
                  </td>
                  <td>
                    <div className="oms-admin-project-cell">
                      <ProjectMediaThumb
                        className="oms-admin-project-thumb"
                        url={cover || null}
                        width={56}
                        height={56}
                      />
                      <div>
                        <p className="oms-admin-project-name">{title}</p>
                        <p className="oms-admin-project-meta">
                          {project.slug || "No slug"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="oms-admin-projects-location">
                      <MapPin
                        className="oms-admin-projects-location-icon"
                        size={15}
                        strokeWidth={1.85}
                        aria-hidden="true"
                      />
                      <span>{location || "—"}</span>
                    </div>
                  </td>
                  <td>
                    <span className="oms-admin-projects-client">
                      {project.client_name?.trim() || "—"}
                    </span>
                  </td>
                  <td>
                    <ProjectStatusBadge status={project.project_status} />
                  </td>
                  <td>
                    <ProjectPublishBadge published={project.published} />
                  </td>
                  <td>
                    <span className="oms-admin-projects-order">
                      {project.sort_order}
                    </span>
                  </td>
                  <td>{formatDate(project.updated_at || project.created_at)}</td>
                  <td>
                    <div className="oms-admin-table-actions oms-admin-projects-actions">
                      <button
                        type="button"
                        className="oms-admin-table-action oms-admin-projects-edit"
                        onClick={() => openEdit(project)}
                      >
                        Edit
                      </button>
                      <ProjectActionsMenu
                        id={project.id}
                        title={project.title_en}
                        published={project.published}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="oms-admin-projects-pagination">
        <p className="oms-admin-projects-pagination-summary">
          Showing {showingFrom}–{showingTo} of {total}{" "}
          {total === 1 ? "project" : "projects"}
        </p>
        <div className="oms-admin-projects-pagination-controls">
          <button
            type="button"
            className="oms-admin-projects-page-btn"
            disabled={currentPage <= 1}
            aria-label="Previous page"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          <span className="oms-admin-projects-page-status">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            className="oms-admin-projects-page-btn"
            disabled={currentPage >= pageCount}
            aria-label="Next page"
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
          >
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

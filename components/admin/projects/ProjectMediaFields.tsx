"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProjectMediaAction } from "@/lib/admin/projects/actions";
import {
  coverObjectPath,
  galleryObjectPath,
  removeManagedProjectImage,
  uploadProjectImage,
  validateProjectImage,
} from "@/lib/admin/projects/media";

export type ProjectMediaFieldsHandle = {
  pendingCoverFile: () => File | null;
  pendingGalleryFiles: () => File[];
  persistedCoverUrl: () => string | null;
  persistedGalleryUrls: () => string[];
};

type GalleryItem = {
  key: string;
  url: string | null;
  file: File | null;
  preview: string;
};

type ProjectMediaFieldsProps = {
  projectId: string | null;
  initialCoverUrl: string | null;
  initialGalleryUrls: string[];
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
  ref?: React.Ref<ProjectMediaFieldsHandle>;
};

function newKey() {
  return crypto.randomUUID();
}

export function ProjectMediaFields({
  projectId,
  initialCoverUrl,
  initialGalleryUrls,
  disabled = false,
  onBusyChange,
  ref,
}: ProjectMediaFieldsProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialCoverUrl);
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    initialGalleryUrls.map((url) => ({
      key: newKey(),
      url,
      file: null,
      preview: url,
    })),
  );
  const [brokenCover, setBrokenCover] = useState(false);
  const [brokenGalleryKeys, setBrokenGalleryKeys] = useState<string[]>([]);

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  useImperativeHandle(ref, () => ({
    pendingCoverFile: () => coverFile,
    pendingGalleryFiles: () =>
      gallery.flatMap((item) => (item.file ? [item.file] : [])),
    persistedCoverUrl: () => coverUrl,
    persistedGalleryUrls: () =>
      gallery.flatMap((item) => (item.url ? [item.url] : [])),
  }));

  async function persistMedia(nextCover: string | null, nextGallery: GalleryItem[]) {
    if (!projectId) {
      return true;
    }

    const result = await updateProjectMediaAction(
      projectId,
      nextCover,
      nextGallery.flatMap((item) => (item.url ? [item.url] : [])),
    );

    if (result.error) {
      setError(result.error);
      return false;
    }

    return true;
  }

  async function withBusy(task: () => Promise<void>) {
    if (disabled || busy) {
      return;
    }

    setError(null);
    setBusy(true);
    try {
      await task();
    } finally {
      setBusy(false);
    }
  }

  async function handleCoverFiles(files: FileList | File[]) {
    const file = Array.from(files)[0];
    if (!file) {
      return;
    }

    const validationError = validateProjectImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    await withBusy(async () => {
      if (!projectId) {
        const preview = URL.createObjectURL(file);
        setCoverFile(file);
        setCoverPreview(preview);
        setBrokenCover(false);
        setCoverUrl(null);
        return;
      }

      const supabase = createClient();
      const uploaded = await uploadProjectImage(
        supabase,
        coverObjectPath(projectId, file),
        file,
      );

      if (!uploaded.url) {
        setError(uploaded.error);
        return;
      }

      const previous = coverUrl;
      const saved = await persistMedia(uploaded.url, gallery);
      if (!saved) {
        await removeManagedProjectImage(supabase, uploaded.url, projectId);
        return;
      }

      setCoverUrl(uploaded.url);
      setCoverPreview(uploaded.url);
      setBrokenCover(false);
      setCoverFile(null);
      if (previous) {
        await removeManagedProjectImage(supabase, previous, projectId);
      }
    });
  }

  async function removeCover() {
    await withBusy(async () => {
      if (!projectId) {
        setCoverFile(null);
        setCoverPreview(null);
        setCoverUrl(null);
        return;
      }

      const previous = coverUrl;
      const saved = await persistMedia(null, gallery);
      if (!saved) {
        return;
      }

      setCoverUrl(null);
      setCoverPreview(null);
      if (previous) {
        await removeManagedProjectImage(createClient(), previous, projectId);
      }
    });
  }

  async function addGalleryFiles(files: FileList | File[]) {
    const selected = Array.from(files);
    if (selected.length === 0) {
      return;
    }

    for (const file of selected) {
      const validationError = validateProjectImage(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    await withBusy(async () => {
      if (!projectId) {
        setGallery((current) => [
          ...current,
          ...selected.map((file) => ({
            key: newKey(),
            url: null,
            file,
            preview: URL.createObjectURL(file),
          })),
        ]);
        return;
      }

      const supabase = createClient();
      const uploadedItems: GalleryItem[] = [];

      for (const file of selected) {
        const uploaded = await uploadProjectImage(
          supabase,
          galleryObjectPath(projectId, file),
          file,
        );

        if (!uploaded.url) {
          setError(uploaded.error);
          return;
        }

        uploadedItems.push({
          key: newKey(),
          url: uploaded.url,
          file: null,
          preview: uploaded.url,
        });
      }

      const nextGallery = [...gallery, ...uploadedItems];
      const saved = await persistMedia(coverUrl, nextGallery);
      if (!saved) {
        for (const item of uploadedItems) {
          if (item.url) {
            await removeManagedProjectImage(supabase, item.url, projectId);
          }
        }
        return;
      }

      setGallery(nextGallery);
    });
  }

  async function removeGalleryItem(key: string) {
    const item = gallery.find((entry) => entry.key === key);
    if (!item) {
      return;
    }

    await withBusy(async () => {
      const nextGallery = gallery.filter((entry) => entry.key !== key);

      if (!projectId) {
        setGallery(nextGallery);
        return;
      }

      const saved = await persistMedia(coverUrl, nextGallery);
      if (!saved) {
        return;
      }

      setGallery(nextGallery);
      if (item.url) {
        await removeManagedProjectImage(createClient(), item.url, projectId);
      }
    });
  }

  async function moveGalleryItem(key: string, direction: -1 | 1) {
    const index = gallery.findIndex((entry) => entry.key === key);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= gallery.length) {
      return;
    }

    const nextGallery = [...gallery];
    const [moved] = nextGallery.splice(index, 1);
    nextGallery.splice(nextIndex, 0, moved);

    if (!projectId) {
      setGallery(nextGallery);
      return;
    }

    await withBusy(async () => {
      const saved = await persistMedia(coverUrl, nextGallery);
      if (saved) {
        setGallery(nextGallery);
      }
    });
  }

  function onDrop(event: DragEvent<HTMLElement>, target: "cover" | "gallery") {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (target === "cover") {
      void handleCoverFiles(files);
      return;
    }

    void addGalleryFiles(files);
  }

  return (
    <div className="oms-admin-media">
      {error ? (
        <p className="oms-admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="oms-admin-field">
        <p className="oms-admin-label" id="oms-project-cover-label">
          Cover image
        </p>
        <div
          className="oms-admin-media-cover"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => onDrop(event, "cover")}
        >
          {coverUrl || coverFile || coverPreview ? (
            <div className="oms-admin-media-cover-preview">
              {coverPreview && !brokenCover ? (
                // Storage public URLs are not in next.config images.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreview}
                  alt=""
                  onError={() => setBrokenCover(true)}
                />
              ) : (
                <div className="oms-admin-media-missing">
                  {brokenCover ? "Image could not be loaded." : ""}
                </div>
              )}
              <div className="oms-admin-media-cover-actions">
                <button
                  type="button"
                  className="oms-admin-media-button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={disabled || busy}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="oms-admin-media-button oms-admin-media-button-danger"
                  onClick={() => void removeCover()}
                  disabled={disabled || busy}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="oms-admin-dropzone"
              onClick={() => coverInputRef.current?.click()}
              disabled={disabled || busy}
              aria-labelledby="oms-project-cover-label"
            >
              {busy ? "Uploading…" : "Click or drop a cover image"}
            </button>
          )}
        </div>
        <input
          ref={coverInputRef}
          className="oms-admin-sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            if (event.target.files) {
              void handleCoverFiles(event.target.files);
            }
            event.target.value = "";
          }}
        />
      </div>

      <div className="oms-admin-field">
        <div className="oms-admin-media-gallery-head">
          <p className="oms-admin-label" id="oms-project-gallery-label">
            Gallery
          </p>
          <button
            type="button"
            className="oms-admin-media-button oms-admin-media-button-primary"
            onClick={() => galleryInputRef.current?.click()}
            disabled={disabled || busy}
          >
            + Add Images
          </button>
        </div>
        <div
          className="oms-admin-media-gallery"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => onDrop(event, "gallery")}
          aria-labelledby="oms-project-gallery-label"
        >
          {gallery.length === 0 ? (
            <button
              type="button"
              className="oms-admin-dropzone oms-admin-dropzone-gallery"
              onClick={() => galleryInputRef.current?.click()}
              disabled={disabled || busy}
            >
              {busy ? "Uploading…" : "Click or drop gallery images"}
            </button>
          ) : (
            <ul className="oms-admin-media-thumbs">
              {gallery.map((item, index) => (
                <li key={item.key} className="oms-admin-media-thumb">
                  {item.preview && !brokenGalleryKeys.includes(item.key) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.preview}
                      alt=""
                      onError={() =>
                        setBrokenGalleryKeys((current) =>
                          current.includes(item.key) ? current : [...current, item.key],
                        )
                      }
                    />
                  ) : (
                    <div className="oms-admin-media-missing">
                      {brokenGalleryKeys.includes(item.key)
                        ? "Image could not be loaded."
                        : ""}
                    </div>
                  )}
                  <div className="oms-admin-media-thumb-actions">
                    <button
                      type="button"
                      className="oms-admin-media-icon"
                      onClick={() => void moveGalleryItem(item.key, -1)}
                      disabled={disabled || busy || index === 0}
                      aria-label="Move image earlier"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="oms-admin-media-icon"
                      onClick={() => void moveGalleryItem(item.key, 1)}
                      disabled={disabled || busy || index === gallery.length - 1}
                      aria-label="Move image later"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="oms-admin-media-icon oms-admin-media-button-danger"
                      onClick={() => void removeGalleryItem(item.key)}
                      disabled={disabled || busy}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          ref={galleryInputRef}
          className="oms-admin-sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              void addGalleryFiles(event.target.files);
            }
            event.target.value = "";
          }}
        />
        <p className="oms-admin-field-hint">
          JPEG, PNG, or WebP. Up to 10 MB each. Gallery order is saved as stored.
        </p>
      </div>
    </div>
  );
}

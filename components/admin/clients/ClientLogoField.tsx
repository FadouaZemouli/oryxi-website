"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { updateClientLogoAction } from "@/lib/admin/clients/actions";
import {
  clientLogoObjectPath,
  removeManagedClientLogo,
  uploadClientLogo,
  validateClientLogo,
} from "@/lib/admin/clients/media";

export type ClientLogoFieldHandle = {
  pendingLogoFile: () => File | null;
  persistedLogoUrl: () => string | null;
};

type ClientLogoFieldProps = {
  clientId: string | null;
  initialLogoUrl: string | null;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
  ref?: React.Ref<ClientLogoFieldHandle>;
};

export function ClientLogoField({
  clientId,
  initialLogoUrl,
  disabled = false,
  onBusyChange,
  ref,
}: ClientLogoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialLogoUrl);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  useImperativeHandle(ref, () => ({
    pendingLogoFile: () => logoFile,
    persistedLogoUrl: () => logoUrl,
  }));

  async function persistLogo(nextUrl: string | null) {
    if (!clientId) {
      return true;
    }

    const result = await updateClientLogoAction(clientId, nextUrl);
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

  async function handleFiles(files: FileList | File[]) {
    const file = Array.from(files)[0];
    if (!file) {
      return;
    }

    const validationError = validateClientLogo(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    await withBusy(async () => {
      if (!clientId) {
        const objectUrl = URL.createObjectURL(file);
        setLogoFile(file);
        setPreview(objectUrl);
        setBroken(false);
        setLogoUrl(null);
        return;
      }

      const supabase = createClient();
      const uploaded = await uploadClientLogo(
        supabase,
        clientLogoObjectPath(clientId, file),
        file,
      );

      if (!uploaded.url) {
        setError(uploaded.error);
        return;
      }

      const previous = logoUrl;
      const saved = await persistLogo(uploaded.url);
      if (!saved) {
        await removeManagedClientLogo(supabase, uploaded.url, clientId);
        return;
      }

      setLogoUrl(uploaded.url);
      setPreview(uploaded.url);
      setBroken(false);
      setLogoFile(null);
      if (previous) {
        await removeManagedClientLogo(supabase, previous, clientId);
      }
    });
  }

  async function removeLogo() {
    await withBusy(async () => {
      if (!clientId) {
        setLogoFile(null);
        setPreview(null);
        setLogoUrl(null);
        return;
      }

      const previous = logoUrl;
      const saved = await persistLogo(null);
      if (!saved) {
        return;
      }

      setLogoUrl(null);
      setPreview(null);
      if (previous) {
        await removeManagedClientLogo(createClient(), previous, clientId);
      }
    });
  }

  function onDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    void handleFiles(event.dataTransfer.files);
  }

  return (
    <div className="oms-admin-field oms-admin-client-logo-field">
      <p className="oms-admin-label" id="oms-client-logo-label">
        Client Logo
      </p>
      {error ? (
        <p className="oms-admin-error" role="alert">
          {error}
        </p>
      ) : null}
      <div
        className="oms-admin-client-logo-drop"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        {logoUrl || logoFile || preview ? (
          <div className="oms-admin-media-cover-preview oms-admin-client-logo-preview">
            {preview && !broken ? (
              // Storage public URLs are not in next.config images.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                onError={() => setBroken(true)}
              />
            ) : (
              <div className="oms-admin-media-missing">
                {broken ? "Image could not be loaded." : ""}
              </div>
            )}
            <div className="oms-admin-media-cover-actions">
              <button
                type="button"
                className="oms-admin-media-button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || busy}
              >
                Replace
              </button>
              <button
                type="button"
                className="oms-admin-media-button oms-admin-media-button-danger"
                onClick={() => void removeLogo()}
                disabled={disabled || busy}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="oms-admin-dropzone oms-admin-client-logo-dropzone"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || busy}
            aria-labelledby="oms-client-logo-label"
          >
            {busy ? "Uploading…" : "Click or drop a client logo"}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        className="oms-admin-sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          if (event.target.files) {
            void handleFiles(event.target.files);
          }
          event.target.value = "";
        }}
      />
      <p className="oms-admin-field-hint">
        JPEG, PNG, or WebP. Up to 10 MB.
      </p>
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EnquiryDetailModal } from "@/components/admin/enquiries/EnquiryDetailModal";
import type { AdminEnquiry } from "@/lib/admin/enquiries/types";

type EnquiriesModalsContextValue = {
  openEnquiry: (enquiry: AdminEnquiry) => void;
};

const EnquiriesModalsContext =
  createContext<EnquiriesModalsContextValue | null>(null);

export function EnquiriesModalsProvider({
  children,
  enquiries,
}: {
  children: ReactNode;
  enquiries: AdminEnquiry[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected =
    enquiries.find((enquiry) => enquiry.id === selectedId) ?? null;

  const openEnquiry = useCallback((enquiry: AdminEnquiry) => {
    setSelectedId(enquiry.id);
    setOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setOpen(false);
    setSelectedId(null);
  }, []);

  const value = useMemo(() => ({ openEnquiry }), [openEnquiry]);

  return (
    <EnquiriesModalsContext.Provider value={value}>
      {children}
      <EnquiryDetailModal
        enquiry={selected}
        open={open && Boolean(selected)}
        onClose={closeEnquiry}
      />
    </EnquiriesModalsContext.Provider>
  );
}

export function useEnquiriesModals() {
  const context = useContext(EnquiriesModalsContext);
  if (!context) {
    throw new Error(
      "useEnquiriesModals must be used within EnquiriesModalsProvider",
    );
  }
  return context;
}

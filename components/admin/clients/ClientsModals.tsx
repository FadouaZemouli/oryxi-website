"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ClientModal } from "@/components/admin/clients/ClientModal";
import { getClientLinkedProjectsAction } from "@/lib/admin/clients/actions";
import type {
  AdminClient,
  ClientLinkedProject,
} from "@/lib/admin/clients/types";

type ClientsModalsContextValue = {
  openAdd: () => void;
  openEdit: (client: AdminClient) => void;
};

const ClientsModalsContext = createContext<ClientsModalsContextValue | null>(
  null,
);

export function ClientsModalsProvider({
  children,
  nextSortOrder,
}: {
  children: ReactNode;
  nextSortOrder: number;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editClient, setEditClient] = useState<AdminClient | null>(null);
  const [linkedProjects, setLinkedProjects] = useState<ClientLinkedProject[]>(
    [],
  );

  const openAdd = useCallback(() => {
    setEditOpen(false);
    setEditClient(null);
    setLinkedProjects([]);
    setAddOpen(true);
  }, []);

  const openEdit = useCallback((client: AdminClient) => {
    setAddOpen(false);
    setEditClient(client);
    setLinkedProjects([]);
    setEditOpen(true);
    void getClientLinkedProjectsAction(client.id).then((projects) => {
      setLinkedProjects(projects);
    });
  }, []);

  const closeAdd = useCallback(() => {
    setAddOpen(false);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditClient(null);
    setLinkedProjects([]);
  }, []);

  const value = useMemo(
    () => ({ openAdd, openEdit }),
    [openAdd, openEdit],
  );

  return (
    <ClientsModalsContext.Provider value={value}>
      {children}
      <ClientModal
        mode="add"
        open={addOpen}
        onClose={closeAdd}
        defaultSortOrder={nextSortOrder}
      />
      <ClientModal
        mode="edit"
        open={editOpen}
        onClose={closeEdit}
        client={editClient}
        linkedProjects={linkedProjects}
      />
    </ClientsModalsContext.Provider>
  );
}

export function useClientsModals() {
  const ctx = useContext(ClientsModalsContext);
  if (!ctx) {
    throw new Error(
      "useClientsModals must be used within ClientsModalsProvider",
    );
  }
  return ctx;
}

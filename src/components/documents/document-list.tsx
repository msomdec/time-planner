"use client";

import { useState, useEffect, useCallback } from "react";
import { DocumentCard } from "./document-card";
import { DocumentUploader } from "./document-uploader";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import type { DocumentMeta } from "@/types";
import { toast } from "sonner";

interface DocumentListProps {
  itemId?: number;
  scope?: "global" | "all";
}

export function DocumentList({ itemId, scope }: DocumentListProps) {
  const [docs, setDocs] = useState<DocumentMeta[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DocumentMeta | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDocs = useCallback(() => {
    let url = "/api/documents";
    if (itemId) {
      url += `?itemId=${itemId}`;
    } else if (scope) {
      url += `?scope=${scope}`;
    }
    fetch(url)
      .then((r) => r.json())
      .then(setDocs);
  }, [itemId, scope]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setDocs((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      toast.success("Document deleted");
    } catch {
      toast.error("Failed to delete document");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <DocumentUploader itemId={itemId} onUploaded={fetchDocs} />

      {docs.length === 0 ? (
        <EmptyState
          title="No documents"
          description="Upload your first document above"
        />
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Document"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}

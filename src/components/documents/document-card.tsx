"use client";

import { FileText, Image, FileSpreadsheet, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DocumentMeta } from "@/types";

interface DocumentCardProps {
  doc: DocumentMeta;
  onDelete: (doc: DocumentMeta) => void;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return FileSpreadsheet;
  return FileText;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  const Icon = getFileIcon(doc.mimeType);

  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3 border-rose-100 group">
      <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-rose-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{doc.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatSize(doc.size)} &middot;{" "}
          {new Date(doc.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <a href={`/api/documents/${doc.id}/download`} download>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-rose-600"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        </a>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(doc)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

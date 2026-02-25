"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileIcon } from "lucide-react";
import { toast } from "sonner";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  itemId?: number;
  onUploaded: () => void;
}

export function DocumentUploader({ itemId, onUploaded }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          if (itemId) formData.append("itemId", String(itemId));

          const res = await fetch("/api/documents", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Upload failed");
          }
        }
        toast.success(
          acceptedFiles.length === 1
            ? "Document uploaded!"
            : `${acceptedFiles.length} documents uploaded!`
        );
        onUploaded();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [itemId, onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_FILE_TYPES,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message || "File rejected";
      toast.error(msg);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-rose-400 bg-rose-50"
          : "border-rose-200 hover:border-rose-300 hover:bg-rose-50/50",
        uploading && "opacity-50 pointer-events-none"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        {uploading ? (
          <>
            <FileIcon className="w-8 h-8 text-rose-400 animate-pulse" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : isDragActive ? (
          <>
            <Upload className="w-8 h-8 text-rose-400" />
            <p className="text-sm text-rose-600">Drop files here</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-rose-300" />
            <p className="text-sm text-muted-foreground">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, images, Word, Excel, text (max 50MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
}

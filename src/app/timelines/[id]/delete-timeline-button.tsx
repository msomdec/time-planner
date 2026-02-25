"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";

interface DeleteTimelineButtonProps {
  timelineId: number;
  timelineName: string;
}

export function DeleteTimelineButton({
  timelineId,
  timelineName,
}: DeleteTimelineButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/timelines/${timelineId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Timeline deleted");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to delete timeline");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-white/70 hover:text-white hover:bg-white/20"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Timeline"
        description={`Are you sure you want to delete "${timelineName}"? This will permanently remove all items and documents.`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}

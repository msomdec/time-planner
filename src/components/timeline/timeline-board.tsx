"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TimelineCard } from "./timeline-card";
import { ItemForm } from "./item-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import type { TimelineItem } from "@/types";
import { toast } from "sonner";

interface TimelineBoardProps {
  timelineId: number;
  timelineName: string;
  timelineDescription?: string;
  initialItems: TimelineItem[];
}

export function TimelineBoard({
  timelineId,
  timelineName,
  timelineDescription,
  initialItems,
}: TimelineBoardProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TimelineItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Persist order
    try {
      const res = await fetch(`/api/timelines/${timelineId}/items/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds: newItems.map((i) => i.id) }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      setItems(items);
      toast.error("Failed to reorder");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/timelines/${timelineId}/items/${deleteTarget.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      toast.success("Item deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  function handleItemAdded() {
    setShowAddForm(false);
    router.refresh();
    // Re-fetch items
    fetch(`/api/timelines/${timelineId}/items`)
      .then((r) => r.json())
      .then(setItems);
  }

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        {items.length > 0 && (
          <Button
            variant="outline"
            className="rounded-full px-5 border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={() => {
              import("@/lib/export-pdf").then(({ exportTimelinePdf }) => {
                exportTimelinePdf({
                  timelineName,
                  timelineDescription,
                  items,
                });
              });
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        )}
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No items yet"
          description="Add your first event to this timeline"
          action={
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          }
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {items.map((item, index) => {
                const prevDate = index > 0 ? items[index - 1].startDate : undefined;
                const currentDate = item.startDate;
                const showDateHeader = currentDate !== prevDate;

                return (
                  <div key={item.id}>
                    {showDateHeader && (
                      <div className="flex items-center gap-3 mb-3 mt-2 first:mt-0">
                        <div className="w-24 shrink-0" />
                        <div className="flex-1 flex items-center gap-3">
                          <h2 className="font-script text-base font-semibold text-foreground whitespace-nowrap">
                            {currentDate
                              ? new Date(currentDate).toLocaleDateString(undefined, {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Unscheduled"}
                          </h2>
                          <div className="h-px flex-1 bg-rose-200/60" />
                        </div>
                      </div>
                    )}
                    <TimelineCard
                      item={item}
                      timelineId={timelineId}
                      onDelete={setDeleteTarget}
                    />
                  </div>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <ItemForm
            timelineId={timelineId}
            onSuccess={handleItemAdded}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Item"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove any attached documents.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}

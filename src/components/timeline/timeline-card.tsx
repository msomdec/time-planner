"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineItem } from "@/types";
import { formatTime } from "@/lib/format-time";
import Link from "next/link";

interface TimelineCardProps {
  item: TimelineItem;
  timelineId: number;
  onDelete: (item: TimelineItem) => void;
}

export function TimelineCard({
  item,
  timelineId,
  onDelete,
}: TimelineCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isRange = item.startTime && item.endTime;

  return (
    <div ref={setNodeRef} style={style} className="flex gap-4 group">
      {/* Time column */}
      <div className="w-24 shrink-0 text-right pt-4">
        {item.startTime ? (
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {formatTime(item.startTime)}
            </p>
            {isRange && (
              <p className="text-xs text-muted-foreground mt-0.5">
                to {formatTime(item.endTime!)}
              </p>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">—</div>
        )}
      </div>

      {/* Timeline connector */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-3 h-3 rounded-full border-2 border-white mt-4 shadow-sm shrink-0"
          style={{ backgroundColor: item.color ?? "#f43f5e" }}
        />
        <div className="w-px flex-1 bg-rose-200/60" />
      </div>

      {/* Card */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="bg-white rounded-xl border border-rose-100/80 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-2">
            <button
              {...attributes}
              {...listeners}
              className="mt-0.5 cursor-grab active:cursor-grabbing text-rose-200 hover:text-rose-400 transition-colors shrink-0"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-foreground truncate">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/timelines/${timelineId}/items/${item.id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(item)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

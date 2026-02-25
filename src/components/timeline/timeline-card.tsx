"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, Clock, Trash2, Eye } from "lucide-react";
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
    opacity: isDragging ? 0.5 : 1,
  };

  function timeLabel() {
    if (!item.startTime && !item.endTime) return null;
    if (item.startTime && item.endTime)
      return `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`;
    if (item.startTime) return formatTime(item.startTime);
    return `ends ${formatTime(item.endTime!)}`;
  }

  const time = timeLabel();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-xl p-4 flex items-start gap-3 border-rose-100 group"
    >
      <div
        className="w-1 self-stretch rounded-full shrink-0"
        style={{ backgroundColor: item.color ?? "#f43f5e" }}
      />
      <button
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {item.startDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(item.startDate).toLocaleDateString()}
            </span>
          )}
          {time && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {time}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
  );
}

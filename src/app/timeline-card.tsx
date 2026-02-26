"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TimelineCardProps {
  timeline: {
    id: number;
    name: string;
    description: string | null;
    updatedAt: string;
  };
  itemCount: number;
}

export function TimelineCard({ timeline, itemCount }: TimelineCardProps) {
  const router = useRouter();

  async function handleDuplicate(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch(`/api/timelines/${timeline.id}/duplicate`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to duplicate timeline");
      }

      toast.success(`Duplicated "${timeline.name}"`);
      router.refresh();
    } catch {
      toast.error("Failed to duplicate timeline");
    }
  }

  return (
    <Link href={`/timelines/${timeline.id}`}>
      <div className="bg-white rounded-2xl border border-rose-100/80 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group relative">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-foreground group-hover:text-rose-600 transition-colors pr-8">
            {timeline.name}
          </h3>
          <ArrowRight className="w-4 h-4 text-rose-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
        {timeline.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {timeline.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">
            {itemCount} items
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(timeline.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-10 h-7 w-7 text-muted-foreground hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDuplicate}
          title="Duplicate timeline"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Link>
  );
}

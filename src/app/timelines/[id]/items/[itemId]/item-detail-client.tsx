"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemForm } from "@/components/timeline/item-form";
import { DocumentList } from "@/components/documents/document-list";
import { formatTime } from "@/lib/format-time";
import type { TimelineItem } from "@/types";

interface ItemDetailClientProps {
  timelineId: number;
  item: TimelineItem;
}

export function ItemDetailClient({
  timelineId,
  item,
}: ItemDetailClientProps) {
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Item Details Card */}
      <Card className="glass border-rose-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditForm(true)}
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <Pencil className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Color</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full border"
                  style={{ backgroundColor: item.color ?? "#f43f5e" }}
                />
                <span className="text-sm">{item.color}</span>
              </div>
            </div>
            {item.startDate && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="text-sm">
                  {new Date(item.startDate + "T00:00:00").toLocaleDateString()}
                </p>
              </div>
            )}
            {item.startTime && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Start Time</p>
                <p className="text-sm">{formatTime(item.startTime)}</p>
              </div>
            )}
            {item.endTime && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">End Time</p>
                <p className="text-sm">{formatTime(item.endTime)}</p>
              </div>
            )}
            {item.description && (
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm whitespace-pre-wrap">{item.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="glass border-rose-100">
        <CardHeader>
          <CardTitle className="text-lg">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList itemId={item.id} />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <ItemForm
            timelineId={timelineId}
            initial={{
              id: item.id,
              name: item.name,
              description: item.description ?? "",
              color: item.color ?? "#f43f5e",
              startDate: item.startDate,
              startTime: item.startTime,
              endTime: item.endTime,
            }}
            onSuccess={() => {
              setShowEditForm(false);
              router.refresh();
            }}
            onCancel={() => setShowEditForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

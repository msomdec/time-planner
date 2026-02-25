"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./color-picker";
import { toast } from "sonner";

interface ItemFormProps {
  timelineId: number;
  initial?: {
    id: number;
    name: string;
    description: string;
    color: string;
    startDate: string | null;
    startTime: string | null;
    endDate: string | null;
    endTime: string | null;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function ItemForm({
  timelineId,
  initial,
  onSuccess,
  onCancel,
}: ItemFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [color, setColor] = useState(initial?.color ?? "#f43f5e");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [startTime, setStartTime] = useState(initial?.startTime ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "");
  const [loading, setLoading] = useState(false);

  const isEditing = !!initial;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const url = isEditing
        ? `/api/timelines/${timelineId}/items/${initial.id}`
        : `/api/timelines/${timelineId}/items`;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          color,
          startDate: startDate || null,
          startTime: startTime || null,
          endDate: endDate || null,
          endTime: endTime || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save item");

      toast.success(isEditing ? "Item updated!" : "Item added!");
      onSuccess();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="item-name">Name</Label>
        <Input
          id="item-name"
          placeholder="e.g., Welcome Dinner"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-rose-200 focus-visible:ring-rose-400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-desc">Description</Label>
        <Textarea
          id="item-desc"
          placeholder="Details about this event..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="border-rose-200 focus-visible:ring-rose-400"
        />
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-rose-200 focus-visible:ring-rose-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border-rose-200 focus-visible:ring-rose-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-rose-200 focus-visible:ring-rose-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border-rose-200 focus-visible:ring-rose-400"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          {loading ? "Saving..." : isEditing ? "Update" : "Add Item"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-rose-200"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

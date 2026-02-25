"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface TimelineFormProps {
  initial?: { id: number; name: string; description: string };
}

export function TimelineForm({ initial }: TimelineFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [loading, setLoading] = useState(false);

  const isEditing = !!initial;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const url = isEditing
        ? `/api/timelines/${initial.id}`
        : "/api/timelines";
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      if (!res.ok) throw new Error("Failed to save timeline");

      const timeline = await res.json();
      toast.success(isEditing ? "Timeline updated!" : "Timeline created!");
      router.push(`/timelines/${timeline.id}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass border-rose-100 max-w-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Timeline Name</Label>
            <Input
              id="name"
              placeholder="e.g., Santorini Wedding Weekend"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-rose-200 focus-visible:ring-rose-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A few words about this timeline..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-rose-200 focus-visible:ring-rose-400"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Timeline"
                  : "Create Timeline"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-rose-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

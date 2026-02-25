"use client";

import { useState } from "react";
import { Share2, Copy, Check, Trash2, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ShareButtonProps {
  timelineId: number;
}

export function ShareButton({ timelineId }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleOpen() {
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/timelines/${timelineId}/share`);
      const data = await res.json();
      setToken(data.token);
    } catch {
      toast.error("Failed to check share status");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/timelines/${timelineId}/share`, {
        method: "POST",
      });
      const data = await res.json();
      setToken(data.token);
      toast.success("Share link created");
    } catch {
      toast.error("Failed to generate link");
    } finally {
      setLoading(false);
    }
  }

  async function handleRevoke() {
    setLoading(true);
    try {
      await fetch(`/api/timelines/${timelineId}/share`, {
        method: "DELETE",
      });
      setToken(null);
      setCopied(false);
      toast.success("Share link revoked");
    } catch {
      toast.error("Failed to revoke link");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  const shareUrl = token
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${token}`
    : "";

  return (
    <>
      <Button
        variant="outline"
        className="rounded-full px-5 border-rose-200 text-rose-600 hover:bg-rose-50"
        onClick={handleOpen}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Timeline</DialogTitle>
          </DialogHeader>

          {loading && !token ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Loading...
            </p>
          ) : token ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Anyone with this link can view this timeline in read-only mode.
              </p>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20"
                onClick={handleRevoke}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate a shareable link so vendors, wedding party members, and
                guests can view this timeline.
              </p>
              <Button
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                onClick={handleGenerate}
                disabled={loading}
              >
                <Link className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

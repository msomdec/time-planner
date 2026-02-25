import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { timelineItems, timelines, documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ItemDetailClient } from "./item-detail-client";

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;

  const item = await db.query.timelineItems.findFirst({
    where: eq(timelineItems.id, Number(itemId)),
  });

  if (!item) notFound();

  const timeline = await db.query.timelines.findFirst({
    where: eq(timelines.id, Number(id)),
  });

  if (!timeline) notFound();

  return (
    <>
      <div className="mb-4">
        <Link href={`/timelines/${id}`}>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-rose-600">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {timeline.name}
          </Button>
        </Link>
      </div>

      <PageHeader
        title={item.name}
        description={item.description || undefined}
      />

      <ItemDetailClient
        timelineId={Number(id)}
        item={item}
      />
    </>
  );
}

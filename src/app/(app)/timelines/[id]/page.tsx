import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { timelines } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TimelineBoard } from "@/components/timeline/timeline-board";
import { DeleteTimelineButton } from "./delete-timeline-button";
import { ShareButton } from "@/components/timeline/share-button";

export const dynamic = "force-dynamic";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const timeline = await db.query.timelines.findFirst({
    where: eq(timelines.id, Number(id)),
    with: {
      items: {
        orderBy: (items, { asc }) => [asc(items.position)],
      },
    },
  });

  if (!timeline) notFound();

  return (
    <>
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            All Timelines
          </Button>
        </Link>
      </div>

      <PageHeader
        title={timeline.name}
        description={timeline.description || undefined}
        action={
          <div className="flex items-center gap-2">
            <ShareButton timelineId={timeline.id} />
            <DeleteTimelineButton
              timelineId={timeline.id}
              timelineName={timeline.name}
            />
          </div>
        }
      />

      <TimelineBoard
        timelineId={timeline.id}
        timelineName={timeline.name}
        timelineDescription={timeline.description || undefined}
        initialItems={timeline.items}
      />
    </>
  );
}

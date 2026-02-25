import { notFound } from "next/navigation";
import { db } from "@/db";
import { shareTokens, timelines } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/shared/page-header";
import { TimelineBoard } from "@/components/timeline/timeline-board";

export const dynamic = "force-dynamic";

export default async function SharedTimelinePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const shareToken = await db.query.shareTokens.findFirst({
    where: eq(shareTokens.token, token),
  });

  if (!shareToken) notFound();

  const timeline = await db.query.timelines.findFirst({
    where: eq(timelines.id, shareToken.timelineId),
    with: {
      items: {
        orderBy: (items, { asc }) => [asc(items.position)],
      },
    },
  });

  if (!timeline) notFound();

  return (
    <>
      <PageHeader
        title={timeline.name}
        description={timeline.description || undefined}
      />

      <TimelineBoard
        timelineId={timeline.id}
        timelineName={timeline.name}
        timelineDescription={timeline.description || undefined}
        initialItems={timeline.items}
        readOnly
      />
    </>
  );
}

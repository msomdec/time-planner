import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { timelines, timelineItems } from "@/db/schema";
import { desc, count } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { TimelineCard } from "./timeline-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allTimelines = await db
    .select()
    .from(timelines)
    .orderBy(desc(timelines.updatedAt));

  const itemCounts = await db
    .select({
      timelineId: timelineItems.timelineId,
      count: count(),
    })
    .from(timelineItems)
    .groupBy(timelineItems.timelineId);

  const countMap = new Map(
    itemCounts.map((ic) => [ic.timelineId, ic.count])
  );

  return (
    <>
      <PageHeader
        title="Your Timelines"
        description="Plan every moment of your dream destination wedding"
        action={
          <Link href="/timelines/new">
            <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5">
              <Plus className="w-4 h-4 mr-2" />
              New Timeline
            </Button>
          </Link>
        }
      />

      {allTimelines.length === 0 ? (
        <EmptyState
          title="No timelines yet"
          description="Create your first wedding timeline to start planning your special day!"
          action={
            <Link href="/timelines/new">
              <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-5">
                <Plus className="w-4 h-4 mr-2" />
                Create Timeline
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTimelines.map((timeline) => (
            <TimelineCard
              key={timeline.id}
              timeline={timeline}
              itemCount={countMap.get(timeline.id) ?? 0}
            />
          ))}
        </div>
      )}
    </>
  );
}

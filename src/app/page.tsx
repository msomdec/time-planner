import Link from "next/link";
import { Plus, ArrowRight, Clock } from "lucide-react";
import { db } from "@/db";
import { timelines, timelineItems } from "@/db/schema";
import { desc, count } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

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
            <Link key={timeline.id} href={`/timelines/${timeline.id}`}>
              <div className="bg-white rounded-2xl border border-rose-100/80 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground group-hover:text-rose-600 transition-colors">
                    {timeline.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-rose-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                {timeline.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {timeline.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">
                    {countMap.get(timeline.id) ?? 0} items
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(timeline.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

import Link from "next/link";
import { Plus, CalendarHeart, Clock } from "lucide-react";
import { db } from "@/db";
import { timelines, timelineItems } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allTimelines = await db
    .select()
    .from(timelines)
    .orderBy(desc(timelines.updatedAt));

  // Get item counts per timeline
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
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
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
              <Button className="bg-rose-500 hover:bg-rose-600 text-white">
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
              <Card className="glass hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer border-rose-100 group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg group-hover:text-rose-600 transition-colors">
                      {timeline.name}
                    </CardTitle>
                    <CalendarHeart className="w-5 h-5 text-rose-300" />
                  </div>
                </CardHeader>
                <CardContent>
                  {timeline.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {timeline.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-rose-50 text-rose-600">
                      {countMap.get(timeline.id) ?? 0} items
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(timeline.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

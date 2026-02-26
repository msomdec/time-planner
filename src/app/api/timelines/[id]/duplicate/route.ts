import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timelines, timelineItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const sourceId = Number(id);

  const source = await db.query.timelines.findFirst({
    where: eq(timelines.id, sourceId),
  });

  if (!source) {
    return NextResponse.json({ error: "Timeline not found" }, { status: 404 });
  }

  const items = await db
    .select({
      name: timelineItems.name,
      description: timelineItems.description,
      color: timelineItems.color,
      position: timelineItems.position,
      startDate: timelineItems.startDate,
      startTime: timelineItems.startTime,
      endTime: timelineItems.endTime,
    })
    .from(timelineItems)
    .where(eq(timelineItems.timelineId, sourceId))
    .orderBy(asc(timelineItems.position));

  const [newTimeline] = await db
    .insert(timelines)
    .values({
      name: `${source.name} (Copy)`,
      description: source.description,
    })
    .returning();

  if (items.length > 0) {
    await db.insert(timelineItems).values(
      items.map((item) => ({
        ...item,
        timelineId: newTimeline.id,
      }))
    );
  }

  return NextResponse.json(newTimeline, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timelineItems, timelines } from "@/db/schema";
import { createTimelineItemSchema } from "@/lib/validators";
import { eq, asc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const items = await db
    .select()
    .from(timelineItems)
    .where(eq(timelineItems.timelineId, Number(id)))
    .orderBy(asc(timelineItems.position));

  return NextResponse.json(items);
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const timelineId = Number(id);

  // Verify timeline exists
  const timeline = await db
    .select()
    .from(timelines)
    .where(eq(timelines.id, timelineId))
    .limit(1);

  if (timeline.length === 0) {
    return NextResponse.json({ error: "Timeline not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = createTimelineItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Get max position for this timeline
  const existing = await db
    .select({ position: timelineItems.position })
    .from(timelineItems)
    .where(eq(timelineItems.timelineId, timelineId))
    .orderBy(asc(timelineItems.position));

  const nextPosition =
    existing.length > 0 ? existing[existing.length - 1].position + 1 : 0;

  const [item] = await db
    .insert(timelineItems)
    .values({
      timelineId,
      name: parsed.data.name,
      description: parsed.data.description ?? "",
      color: parsed.data.color ?? "#f43f5e",
      position: nextPosition,
      startDate: parsed.data.startDate ?? null,
      endDate: parsed.data.endDate ?? null,
    })
    .returning();

  // Update timeline timestamp
  await db
    .update(timelines)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(timelines.id, timelineId));

  return NextResponse.json(item, { status: 201 });
}

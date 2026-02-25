import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timelines } from "@/db/schema";
import { updateTimelineSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const timeline = await db.query.timelines.findFirst({
    where: eq(timelines.id, Number(id)),
    with: { items: { orderBy: (items, { asc }) => [asc(items.position)] } },
  });

  if (!timeline) {
    return NextResponse.json({ error: "Timeline not found" }, { status: 404 });
  }

  return NextResponse.json(timeline);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateTimelineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(timelines)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(timelines.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Timeline not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const [deleted] = await db
    .delete(timelines)
    .where(eq(timelines.id, Number(id)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Timeline not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

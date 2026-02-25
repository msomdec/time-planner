import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timelineItems, documents, timelines } from "@/db/schema";
import { updateTimelineItemSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string; itemId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { itemId } = await params;

  const item = await db.query.timelineItems.findFirst({
    where: eq(timelineItems.id, Number(itemId)),
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // Get document metadata (without BLOB data)
  const docs = await db
    .select({
      id: documents.id,
      timelineItemId: documents.timelineItemId,
      name: documents.name,
      mimeType: documents.mimeType,
      size: documents.size,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.timelineItemId, Number(itemId)));

  return NextResponse.json({ ...item, documents: docs });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id, itemId } = await params;
  const body = await request.json();
  const parsed = updateTimelineItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(timelineItems)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(timelineItems.id, Number(itemId)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // Update timeline timestamp
  await db
    .update(timelines)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(timelines.id, Number(id)));

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id, itemId } = await params;

  const [deleted] = await db
    .delete(timelineItems)
    .where(eq(timelineItems.id, Number(itemId)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  await db
    .update(timelines)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(timelines.id, Number(id)));

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const [doc] = await db
    .select({
      id: documents.id,
      timelineItemId: documents.timelineItemId,
      name: documents.name,
      mimeType: documents.mimeType,
      size: documents.size,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.id, Number(id)));

  if (!doc) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(doc);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const [deleted] = await db
    .delete(documents)
    .where(eq(documents.id, Number(id)))
    .returning({ id: documents.id });

  if (!deleted) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

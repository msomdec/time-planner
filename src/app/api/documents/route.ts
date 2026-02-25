import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import { MAX_FILE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  // Select without BLOB data
  const cols = {
    id: documents.id,
    timelineItemId: documents.timelineItemId,
    name: documents.name,
    mimeType: documents.mimeType,
    size: documents.size,
    createdAt: documents.createdAt,
  };

  let docs;
  if (itemId) {
    docs = await db
      .select(cols)
      .from(documents)
      .where(eq(documents.timelineItemId, Number(itemId)))
      .orderBy(desc(documents.createdAt));
  } else {
    // Global documents (no item attached) or all
    const scope = searchParams.get("scope");
    if (scope === "global") {
      docs = await db
        .select(cols)
        .from(documents)
        .where(isNull(documents.timelineItemId))
        .orderBy(desc(documents.createdAt));
    } else {
      docs = await db
        .select(cols)
        .from(documents)
        .orderBy(desc(documents.createdAt));
    }
  }

  return NextResponse.json(docs);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const itemId = formData.get("itemId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds 50MB limit" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const [doc] = await db
    .insert(documents)
    .values({
      timelineItemId: itemId ? Number(itemId) : null,
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      data: buffer,
    })
    .returning({
      id: documents.id,
      timelineItemId: documents.timelineItemId,
      name: documents.name,
      mimeType: documents.mimeType,
      size: documents.size,
      createdAt: documents.createdAt,
    });

  return NextResponse.json(doc, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timelineItems, timelines } from "@/db/schema";
import { reorderItemsSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import Database from "better-sqlite3";
import path from "path";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const timelineId = Number(id);
  const body = await request.json();
  const parsed = reorderItemsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Use raw sqlite for transaction
  const dbPath = path.join(process.cwd(), "data", "wedding-planner.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("foreign_keys = ON");

  const updateStmt = sqlite.prepare(
    "UPDATE timeline_items SET position = ?, updated_at = ? WHERE id = ? AND timeline_id = ?"
  );

  const now = new Date().toISOString();

  const transaction = sqlite.transaction(() => {
    for (let i = 0; i < parsed.data.itemIds.length; i++) {
      updateStmt.run(i, now, parsed.data.itemIds[i], timelineId);
    }
  });

  transaction();
  sqlite.close();

  // Update timeline timestamp
  await db
    .update(timelines)
    .set({ updatedAt: now })
    .where(eq(timelines.id, timelineId));

  return NextResponse.json({ success: true });
}

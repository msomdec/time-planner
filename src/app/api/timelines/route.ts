import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { timelines } from "@/db/schema";
import { createTimelineSchema } from "@/lib/validators";
import { desc } from "drizzle-orm";

export async function GET() {
  const allTimelines = await db
    .select()
    .from(timelines)
    .orderBy(desc(timelines.createdAt));
  return NextResponse.json(allTimelines);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createTimelineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const [timeline] = await db
    .insert(timelines)
    .values({
      name: parsed.data.name,
      description: parsed.data.description ?? "",
    })
    .returning();

  return NextResponse.json(timeline, { status: 201 });
}

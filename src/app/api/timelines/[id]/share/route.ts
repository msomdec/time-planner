import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shareTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const existing = await db.query.shareTokens.findFirst({
    where: eq(shareTokens.timelineId, Number(id)),
  });

  return NextResponse.json({ token: existing?.token ?? null });
}

export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const timelineId = Number(id);

  // Return existing token if one exists
  const existing = await db.query.shareTokens.findFirst({
    where: eq(shareTokens.timelineId, timelineId),
  });

  if (existing) {
    return NextResponse.json({ token: existing.token });
  }

  const token = randomUUID();
  await db.insert(shareTokens).values({ timelineId, token });

  return NextResponse.json({ token }, { status: 201 });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  await db
    .delete(shareTokens)
    .where(eq(shareTokens.timelineId, Number(id)));

  return NextResponse.json({ success: true });
}

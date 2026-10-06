import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, service: "calledit", database: "ok" });
  } catch {
    return NextResponse.json(
      { ok: false, service: "calledit", database: "unavailable" },
      { status: 503 },
    );
  }
}

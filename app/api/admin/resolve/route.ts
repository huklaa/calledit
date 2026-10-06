import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolveSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const key = request.headers.get("x-admin-key");
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const number = Number(body.number);
  const parsed = resolveSchema.safeParse(body);
  if (!Number.isInteger(number) || !parsed.success) {
    return NextResponse.json({ error: "Invalid resolution" }, { status: 400 });
  }

  const prediction = await db.prediction.update({
    where: { number },
    data: {
      status: parsed.data.status,
      evidenceUrl: parsed.data.evidenceUrl || null,
      resolutionNote: parsed.data.resolutionNote || null,
      resolvedAt: new Date(),
    },
  });

  return NextResponse.json({ number: prediction.number, status: prediction.status });
}

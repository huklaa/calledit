import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const alt = "Called It prediction proof";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const prediction = await db.prediction.findUnique({ where: { number: Number(number) } });

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", background: "#0a0a0a", color: "#f4f4f4",
        display: "flex", flexDirection: "column", padding: 64, fontFamily: "sans-serif"
      }}>
        <div style={{ color: "#d8ff3e", fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>
          CALLED IT · #{prediction?.number ?? number}
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", fontSize: 62, lineHeight: 1.08, fontWeight: 800 }}>
          “{prediction?.text ?? "Prediction"}”
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 25, color: "#aaa" }}>
          <span>@{prediction?.creatorHandle ?? "unknown"}</span>
          <span>PROOF BEATS MEMORY.</span>
        </div>
      </div>
    ),
    size,
  );
}

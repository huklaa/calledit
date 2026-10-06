import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate, statusLabel } from "@/lib/format";
import { shortHash } from "@/lib/proof";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const prediction = await db.prediction.findUnique({ where: { number: Number(number) } });
  if (!prediction) return {};
  return {
    title: `Called It #${prediction.number} — @${prediction.creatorHandle}`,
    description: prediction.text,
    openGraph: {
      title: `Called It #${prediction.number}`,
      description: prediction.text,
      images: [`/p/${prediction.number}/opengraph-image`],
    },
  };
}

export default async function PredictionPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const prediction = await db.prediction.findUnique({ where: { number: Number(number) } });

  if (!prediction || !["FREE", "PAID"].includes(prediction.paymentStatus)) notFound();

  const shareText = encodeURIComponent(
    `I called it: “${prediction.text}” — locked as prediction #${prediction.number}`,
  );

  return (
    <main>
      <section className="proof">
        <div className="proofBox">
          <div className="proofNumber">CALLED IT · PREDICTION #{prediction.number}</div>
          <div className="predictionText">“{prediction.text}”</div>
          <div className="cardMeta" style={{ marginBottom: 24 }}>
            <span className="pill">{prediction.category}</span>
            <span className={prediction.status === "CORRECT" ? "correct" : prediction.status === "WRONG" ? "wrong" : ""}>
              {statusLabel(prediction.status)}
            </span>
          </div>
          <div className="proofGrid">
            <div>CALLED BY<b>@{prediction.creatorHandle}{prediction.creatorName ? ` · ${prediction.creatorName}` : ""}</b></div>
            <div>LOCKED AT<b>{formatDate(prediction.createdAt)}</b></div>
            <div>RESOLUTION DATE<b>{formatDate(prediction.resolutionDate)}</b></div>
            <div>PROOF HASH<b className="hash">{shortHash(prediction.proofHash)}</b></div>
          </div>
          {prediction.resolutionNote && (
            <p className="muted" style={{ marginTop: 24 }}>{prediction.resolutionNote}</p>
          )}
          {prediction.evidenceUrl && (
            <p><a className="button secondary" href={prediction.evidenceUrl} target="_blank" rel="noreferrer">View evidence ↗</a></p>
          )}
        </div>

        <div className="heroActions">
          <a
            className="button"
            href={`https://x.com/intent/post?text=${shareText}&url=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL || "") + `/p/${prediction.number}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            Share on X
          </a>
          <a className="button secondary" href="/new">Make your own call</a>
        </div>
      </section>
    </main>
  );
}

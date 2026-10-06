import { db } from "@/lib/db";
import { formatDate, statusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [predictions, total, resolved, correct] = await Promise.all([
    db.prediction.findMany({
      where: { paymentStatus: { in: ["FREE", "PAID"] } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    db.prediction.count({ where: { paymentStatus: { in: ["FREE", "PAID"] } } }),
    db.prediction.count({ where: { status: { in: ["CORRECT", "WRONG"] } } }),
    db.prediction.count({ where: { status: "CORRECT" } }),
  ]);

  const accuracy = resolved ? Math.round((correct / resolved) * 100) : 0;

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Proof beats memory</div>
        <h1>Say it before it happens.</h1>
        <p>
          Lock a prediction in time. Share the proof. When everyone says “I knew it,”
          you’ll have the receipt.
        </p>
        <div className="heroActions">
          <a className="button" href="/new">Make a prediction</a>
          <a className="button secondary" href="#feed">See the calls</a>
        </div>
      </section>

      <section className="stats">
        <div className="stat"><b>{total}</b><span>public predictions</span></div>
        <div className="stat"><b>{resolved}</b><span>resolved calls</span></div>
        <div className="stat"><b>{accuracy}%</b><span>community accuracy</span></div>
      </section>

      <section id="feed">
        <div className="sectionHead">
          <div><div className="eyebrow">Latest</div><h2>People called it</h2></div>
          <a className="muted" href="/leaderboard">Leaderboard →</a>
        </div>
        <div className="feed">
          {predictions.length === 0 ? (
            <a className="card" href="/new">
              <div className="cardMeta"><span className="pill">Be first</span></div>
              <h3>No predictions yet. Make the first call.</h3>
              <span className="muted">Your proof will live here permanently.</span>
            </a>
          ) : predictions.map((p) => (
            <a className="card" key={p.id} href={`/p/${p.number}`}>
              <div className="cardMeta">
                <span className="pill">#{p.number}</span>
                <span className="pill">{p.category}</span>
                <span className={p.status === "CORRECT" ? "correct" : p.status === "WRONG" ? "wrong" : ""}>
                  {statusLabel(p.status)}
                </span>
                <span>@{p.creatorHandle}</span>
              </div>
              <h3>{p.text}</h3>
              <span className="muted">Locked {formatDate(p.createdAt)} · resolves {formatDate(p.resolutionDate)}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

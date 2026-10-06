import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const resolved = await db.prediction.findMany({
    where: {
      status: { in: ["CORRECT", "WRONG"] },
      paymentStatus: { in: ["FREE", "PAID"] },
    },
    select: { creatorHandle: true, status: true },
  });

  const map = new Map<string, { correct: number; total: number }>();
  for (const p of resolved) {
    const current = map.get(p.creatorHandle) || { correct: 0, total: 0 };
    current.total++;
    if (p.status === "CORRECT") current.correct++;
    map.set(p.creatorHandle, current);
  }

  const rows = [...map.entries()]
    .map(([handle, stats]) => ({ handle, ...stats, accuracy: Math.round((stats.correct / stats.total) * 100) }))
    .sort((a, b) => b.correct - a.correct || b.accuracy - a.accuracy || b.total - a.total)
    .slice(0, 100);

  return (
    <main>
      <section className="formWrap" style={{ maxWidth: 900 }}>
        <div className="eyebrow">Receipts only</div>
        <h1>Leaderboard.</h1>
        <p className="muted">Only resolved predictions count. No deleting the misses.</p>
        <table className="table">
          <thead><tr><th>#</th><th>Caller</th><th>Correct</th><th>Resolved</th><th>Accuracy</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="muted">No resolved predictions yet.</td></tr>
            ) : rows.map((r, i) => (
              <tr key={r.handle}><td>{i + 1}</td><td>@{r.handle}</td><td>{r.correct}</td><td>{r.total}</td><td>{r.accuracy}%</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

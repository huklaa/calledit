import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PaymentStatusPage({ searchParams }: { searchParams: Promise<{ prediction?: string }> }) {
  const { prediction: number } = await searchParams;
  const numericNumber = Number(number);
  const prediction = Number.isSafeInteger(numericNumber) && numericNumber > 0
    ? await db.prediction.findUnique({ where: { number: numericNumber }, select: { number: true, paymentStatus: true } })
    : null;

  return (
    <main>
      <section className="formWrap">
        <div className="eyebrow">Prediction payment</div>
        {prediction?.paymentStatus === "PAID" ? (
          <>
            <h1>Payment confirmed.</h1>
            <p>Your $1 prediction is now public.</p>
            <Link className="button" href={`/p/${prediction.number}`}>View your proof</Link>
          </>
        ) : prediction?.paymentStatus === "PENDING" ? (
          <>
            <h1>Confirming your payment.</h1>
            <p>Your prediction is not public yet. Payment confirmation may take a moment; refresh this page to check again. Do not pay a second time.</p>
            <Link className="button secondary" href={`/payment/status?prediction=${prediction.number}`}>Check again</Link>
          </>
        ) : (
          <>
            <h1>No confirmed payment found.</h1>
            <p>Check the payment status or start a new prediction.</p>
            <Link className="button" href="/new">Make a prediction</Link>
          </>
        )}
      </section>
    </main>
  );
}

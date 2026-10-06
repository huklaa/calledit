"use client";

import { FormEvent, useState } from "react";

export default function PredictionForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not publish prediction");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      window.location.href = `/p/${data.number}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Your prediction
        <textarea
          name="text"
          required
          minLength={8}
          maxLength={280}
          placeholder="ETH will trade above $6,000 before the end of 2026."
          onChange={(e) => setCount(e.target.value.length)}
        />
        <span className="hint">{count}/280 · This cannot be edited after publishing.</span>
      </label>

      <label>
        Category
        <select name="category" defaultValue="crypto">
          <option value="crypto">Crypto</option>
          <option value="markets">Markets</option>
          <option value="sports">Sports</option>
          <option value="tech">Tech</option>
          <option value="world">World</option>
          <option value="culture">Culture</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Resolution date
        <input name="resolutionDate" type="datetime-local" required />
        <span className="hint">When should the world be able to judge this call?</span>
      </label>

      <label>
        Handle
        <input name="creatorHandle" required minLength={2} maxLength={30} placeholder="haluk" />
        <span className="hint">Shown publicly as @handle. Accounts are coming later.</span>
      </label>

      <label>
        Display name <span className="muted">(optional)</span>
        <input name="creatorName" maxLength={60} placeholder="Haluk" />
      </label>

      {error && <div className="error">{error}</div>}
      <button className="button" type="submit" disabled={busy}>
        {busy ? "Locking…" : "Lock prediction"}
      </button>
      <span className="hint">
        Beta can run free. Paid verification can be enabled with one environment flag.
      </span>
    </form>
  );
}

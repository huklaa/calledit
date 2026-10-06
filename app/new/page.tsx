import PredictionForm from "./prediction-form";

export default function NewPredictionPage() {
  return (
    <main>
      <section className="formWrap">
        <div className="eyebrow">Put it on the record</div>
        <h1>Call it.</h1>
        <p className="muted">
          Your prediction text and timestamps become immutable once published.
          Keep it specific enough that someone can later tell whether you were right.
        </p>
        <PredictionForm />
      </section>
    </main>
  );
}

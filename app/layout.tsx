import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Called It — Prove you said it first",
  description: "Lock a prediction in time. Share the proof. Come back when you were right.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Called It",
    description: "Make a prediction. Lock it. Prove you called it.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <a className="brand" href="/">CALLED IT<span>.</span></a>
          <nav>
            <a href="/#feed">Predictions</a>
            <a href="/leaderboard">Leaderboard</a>
            <a className="navCta" href="/new">Call it</a>
          </nav>
        </header>
        {children}
        <footer>
          <strong>Called It</strong>
          <span>Say it before it happens.</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </body>
    </html>
  );
}

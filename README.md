# Called It

**Make a prediction. Lock it. Prove you called it.**

Called It is a timestamped prediction platform. Users publish a prediction, choose a resolution date and category, and receive a permanent public proof page they can share later.

## MVP

- Create timestamped predictions
- Immutable prediction text after publishing
- Public proof pages with prediction number and timestamps
- Categories and discovery feed
- Resolution workflow: correct / wrong / void
- User profiles and accuracy leaderboard
- Shareable social cards
- Optional paid verification / paid prediction flow
- Responsive dark-first UI
- PostgreSQL-ready data model
- Stripe-ready payments
- Domain planned: `calledit.it`

## Stack

- Next.js + TypeScript
- PostgreSQL + Prisma
- Stripe Checkout
- Vitest

## Local setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run dev
```

The app can boot without Stripe configured. Publishing paid predictions is disabled until Stripe environment variables are present.

## Product principle

The prediction itself is the product. Once published, its wording, target date, and timestamp are preserved so the user can later prove: **I called it.**

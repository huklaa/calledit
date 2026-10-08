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
- Fixed $1 USD Stripe Checkout (card, no wallet required)
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

For $1 USD paid predictions, set `NEXT_PUBLIC_REQUIRE_PAYMENT=true` and configure `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the `/api/stripe/webhook` endpoint in Stripe. Payment is verified by the webhook before a prediction becomes public. Without Stripe keys, paid prediction creation returns an error rather than publishing for free. For the planned OpenSea / Base NFT alternative, see `docs/OPENSEA-BASE-INTEGRATION.md`; NFT mint checkout is not yet implemented.

## Product principle

The prediction itself is the product. Once published, its wording, target date, and timestamp are preserved so the user can later prove: **I called it.**

# Called It — Base / OpenSea mint payment plan

Price: **$1 USD per prediction** (product policy).

## Why OpenSea alone is not a prediction checkout

A general public SeaDrop mint cannot securely identify which particular Called It prediction should be unlocked. A user's mint transaction can prove ownership, but it does not prove which unpublished prediction the payment is for. Do not grant publishing rights based only on a copied transaction hash, an OpenSea redirect, or an unverified client-provided wallet address.

## Required implementation before activation

1. Create/deploy an official Called It ERC-721 drop on Base via SeaDrop and configure a creator payout address. Verify that the mint price is USD-equivalent to $1 at checkout; native ETH mint prices are denominated in ETH and fluctuate.
2. Choose a one-to-one payment-binding protocol, preferably a unique prediction-bound authorization/signature or dedicated contract emitting a prediction identifier. A single generic NFT mint is insufficient for secure automated reconciliation.
3. Store mint intents with unique prediction IDs, nonces, chain ID 8453, token contract address, expiry and status in the database.
4. Verify receipts server-side with a trusted Base RPC: successful finalized transaction, correct NFT contract, mint transfer log, correct payment, authorized recipient and exact one-time prediction binding. Claim atomically to prevent replay.
5. Only after confirmed payment mark the prediction PAID and publish it. Handle chain reorgs, timeouts, refunds/cancellations and duplicate attempts.
6. Add clearly labelled OpenSea checkout only after the drop exists and checkout verification is end-to-end tested. Never make Called It wallet connection mandatory. OpenSea itself can still require a wallet or supported purchase method.

The Stripe card checkout is a separate wallet-free payment path. No OpenSea mint link, contract, or API key is configured in this repository yet.

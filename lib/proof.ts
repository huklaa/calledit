import { createHash } from "node:crypto";

export function createProofHash(input: {
  text: string;
  category: string;
  creatorHandle: string;
  resolutionDate: string;
  createdAt: string;
}) {
  return createHash("sha256")
    .update(
      [
        input.text.trim(),
        input.category.trim().toLowerCase(),
        input.creatorHandle.trim().toLowerCase(),
        input.resolutionDate,
        input.createdAt,
      ].join("|"),
    )
    .digest("hex");
}

export function shortHash(hash: string) {
  return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
}

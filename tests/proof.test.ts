import { describe, expect, it } from "vitest";
import { createProofHash } from "@/lib/proof";

describe("prediction proof", () => {
  it("is deterministic", () => {
    const input = {
      text: "ETH will be above $6,000",
      category: "crypto",
      creatorHandle: "haluk",
      resolutionDate: "2026-12-31T23:59:00.000Z",
      createdAt: "2026-10-06T06:30:00.000Z",
    };
    expect(createProofHash(input)).toBe(createProofHash(input));
  });

  it("changes when prediction text changes", () => {
    const base = {
      text: "ETH will be above $6,000",
      category: "crypto",
      creatorHandle: "haluk",
      resolutionDate: "2026-12-31T23:59:00.000Z",
      createdAt: "2026-10-06T06:30:00.000Z",
    };
    expect(createProofHash(base)).not.toBe(createProofHash({ ...base, text: "ETH will be above $7,000" }));
  });
});

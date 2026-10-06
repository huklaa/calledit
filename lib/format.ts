export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
}

export function statusLabel(status: string) {
  if (status === "CORRECT") return "✓ CORRECT";
  if (status === "WRONG") return "✕ WRONG";
  if (status === "VOID") return "— VOID";
  return "● PENDING";
}

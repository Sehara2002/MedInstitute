export function parsePriceToNumber(fee?: string | null): number | null {
  if (!fee) return null;
  // Remove common words and symbols, keep digits and separators
  // Examples: "LKR 35,000", "LKR 16,000 per slot", "On Request"
  const cleaned = fee.replace(/[^0-9.,]/g, "").replace(/,/g, "");
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (isNaN(num)) return null;
  return num;
}

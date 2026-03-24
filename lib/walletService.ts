import type { Transaction } from "@/types/wallet";

export function calculateBlockedAmount(transactions: Transaction[]) {
  return transactions
    .filter((t) => t.status === "BLOCKED")
    .reduce((sum, t) => sum + (typeof t.amount === "number" ? t.amount : 0), 0);
}

export function calculateWithdrawableBalance(
  generatedBalance: number,
  blockedAmount: number
) {
  return (generatedBalance || 0) - (blockedAmount || 0);
}

export function formatCurrency(amount: number) {
  const safe = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  return `₹${safe.toLocaleString("en-IN")}`;
}

export function formatTransactionType(type: Transaction["type"]) {
  switch (type) {
    case "CREDIT":
      return "Credit";
    case "DEBIT":
      return "Debit";
    default:
      return type;
  }
}

"use client";

import { useWalletContext } from "@/context/WalletContext";

export function useWallet() {
  const ctx = useWalletContext();
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}

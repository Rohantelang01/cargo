"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Transaction, WalletBalance, WalletContextType } from "@/types/wallet";

const WalletContext = createContext<WalletContextType | undefined>(undefined);

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wallet/balance", { method: "GET" });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.message || "Failed to fetch wallet";
        setError(msg);
        toast.error(msg);
        return;
      }

      setWallet(data);
    } catch (e) {
      console.error("fetchWallet error:", e);
      setError("Failed to fetch wallet");
      toast.error("Failed to fetch wallet");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/wallet/transactions?page=${page}&limit=20`, {
        method: "GET",
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.message || "Failed to fetch transactions";
        setError(msg);
        toast.error(msg);
        return;
      }

      setTransactions(data?.transactions || []);
    } catch (e) {
      console.error("fetchTransactions error:", e);
      setError("Failed to fetch transactions");
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  const addMoney = useCallback(async (amount: number, note?: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wallet/add-money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, note }),
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.message || "Failed to add money";
        setError(msg);
        toast.error(msg);
        return;
      }

      setWallet(data);
      toast.success("Money added");
      await fetchTransactions(1);
    } catch (e) {
      console.error("addMoney error:", e);
      setError("Failed to add money");
      toast.error("Failed to add money");
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const withdrawMoney = useCallback(async (amount: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.message || "Failed to withdraw";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success(data?.message || "Withdrawal processed");
      await fetchWallet();
      await fetchTransactions(1);
    } catch (e) {
      console.error("withdrawMoney error:", e);
      setError("Failed to withdraw");
      toast.error("Failed to withdraw");
    } finally {
      setLoading(false);
    }
  }, [fetchWallet, fetchTransactions]);

  const blockAmount = useCallback(async (amount: number, bookingId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wallet/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "BLOCK", amount, bookingId }),
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.message || "Failed to block amount";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Amount blocked");
      await fetchWallet();
      await fetchTransactions(1);
    } catch (e) {
      console.error("blockAmount error:", e);
      setError("Failed to block amount");
      toast.error("Failed to block amount");
    } finally {
      setLoading(false);
    }
  }, [fetchWallet, fetchTransactions]);

  const releaseAmount = useCallback(async (bookingId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wallet/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RELEASE", bookingId }),
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.message || "Failed to release amount";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Escrow released");
      await fetchWallet();
      await fetchTransactions(1);
    } catch (e) {
      console.error("releaseAmount error:", e);
      setError("Failed to release amount");
      toast.error("Failed to release amount");
    } finally {
      setLoading(false);
    }
  }, [fetchWallet, fetchTransactions]);

  useEffect(() => {
    fetchWallet();
    fetchTransactions(1);
  }, [fetchWallet, fetchTransactions]);

  const value = useMemo<WalletContextType>(
    () => ({
      wallet,
      transactions,
      loading,
      error,
      fetchWallet,
      fetchTransactions,
      addMoney,
      withdrawMoney,
      blockAmount,
      releaseAmount,
    }),
    [
      wallet,
      transactions,
      loading,
      error,
      fetchWallet,
      fetchTransactions,
      addMoney,
      withdrawMoney,
      blockAmount,
      releaseAmount,
    ]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletContext() {
  return useContext(WalletContext);
}

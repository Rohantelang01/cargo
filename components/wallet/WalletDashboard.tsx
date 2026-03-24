"use client";

import React, { useState } from "react";
import { Wallet as WalletIcon } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import BalanceCards from "@/components/wallet/BalanceCards";
import TransactionList from "@/components/wallet/TransactionList";
import AddMoneyModal from "@/components/wallet/AddMoneyModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import ModeToggle from "@/components/wallet/ModeToggle";
import ProductionDemo from "@/components/wallet/ProductionDemo";

export default function WalletDashboard() {
  const { wallet, transactions, loading, error } = useWallet();
  const [mode, setMode] = useState<'testing' | 'production'>('testing');

  if (loading && !wallet) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="text-sm text-muted-foreground">Loading wallet...</div>
      </div>
    );
  }

  if (error && !wallet) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="text-sm text-muted-foreground">Wallet not available</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
      {mode === 'testing' ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-lg font-semibold">Wallet</h1>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle onModeChange={setMode} />
              <AddMoneyModal />
              <WithdrawModal />
            </div>
          </div>
          <BalanceCards wallet={wallet} transactions={transactions} />
          <TransactionList transactions={transactions} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-lg font-semibold">Wallet</h1>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle onModeChange={setMode} />
            </div>
          </div>
          <ProductionDemo />
        </>
      )}
    </div>
  );
}

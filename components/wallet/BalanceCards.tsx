"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/walletService";
import type { WalletBalance, Transaction } from "@/types/wallet";

export default function BalanceCards({
  wallet,
  transactions,
}: {
  wallet: WalletBalance;
  transactions: Transaction[];
}) {
  const activeBookings = transactions.filter((t) => t.status === "BLOCKED").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Added Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{formatCurrency(wallet.addedBalance)}</div>
          <p className="text-xs text-muted-foreground mt-1">For booking payments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Generated Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{formatCurrency(wallet.generatedBalance)}</div>
          <p className="text-xs text-muted-foreground mt-1">Trip earnings • Withdrawable</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-400">
        <CardHeader>
          <CardTitle className="text-sm">Blocked Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{formatCurrency(wallet.blockedAmount)}</div>
          <p className="text-xs text-muted-foreground mt-1">{activeBookings} active bookings</p>
        </CardContent>
      </Card>
    </div>
  );
}

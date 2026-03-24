"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/walletService";
import type { Transaction } from "@/types/wallet";

function statusVariant(status: Transaction["status"]) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "BLOCKED":
      return "secondary";
    case "PENDING":
      return "outline";
    default:
      return "outline";
  }
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const recent = (transactions || []).slice(0, 5);

  return (
    <div className="rounded-md border border-border bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Recent transactions</h3>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/wallet/transactions">View All</Link>
        </Button>
      </div>

      <div className="p-4">
        {recent.length === 0 ? (
          <div className="text-sm text-muted-foreground">No transactions yet</div>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => {
              const isCredit = t.type === "CREDIT";
              const Icon = isCredit ? ArrowUp : ArrowDown;
              const iconClass = isCredit ? "text-green-600" : "text-red-600";

              return (
                <div key={t._id} className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 ${iconClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{t.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(t.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {isCredit ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </div>
                    <Badge variant={statusVariant(t.status)} className="mt-1">
                      {t.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

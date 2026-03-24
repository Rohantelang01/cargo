"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/walletService";
import { useWallet } from "@/hooks/useWallet";

export default function WithdrawModal() {
  const { wallet, withdrawMoney, loading } = useWallet();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [bank, setBank] = useState<string>("hdfc");

  const available = wallet?.generatedBalance || 0;
  const parsedAmount = useMemo(() => Number(amount), [amount]);
  const valid = Number.isFinite(parsedAmount) && parsedAmount > 0 && parsedAmount <= available;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) {
      toast.error("Wallet not loaded");
      return;
    }
    if (!valid) {
      toast.error("Enter a valid amount");
      return;
    }

    await withdrawMoney(parsedAmount);
    setOpen(false);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle>Withdraw (testing)</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          Available: <span className="font-medium text-foreground">{formatCurrency(available)}</span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              max={available}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Bank account</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hdfc">HDFC ****4567</SelectItem>
                <SelectItem value="sbi">SBI ****8901</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">Selected: {bank}</div>
          </div>

          <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-2">
            Testing mode - no actual transfer
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

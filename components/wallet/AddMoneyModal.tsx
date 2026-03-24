"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/hooks/useWallet";

export default function AddMoneyModal() {
  const { addMoney, loading } = useWallet();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const parsedAmount = useMemo(() => Number(amount), [amount]);

  const valid = Number.isFinite(parsedAmount) && parsedAmount > 0 && parsedAmount <= 50000;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      toast.error("Enter a valid amount (1 - 50000)");
      return;
    }

    await addMoney(parsedAmount, note.trim() || undefined);
    setOpen(false);
    setAmount("");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Money</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle>Add money (testing)</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              max={50000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Manual add (testing)"
              className="w-full"
            />
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WaitingScreenProps {
  open: boolean;
  driverName: string;
  onCancel: () => void;
  onTimeout: () => void;
}

export default function WaitingScreen({ open, driverName, onCancel, onTimeout }: WaitingScreenProps) {
  const totalSeconds = 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(totalSeconds);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (secondsLeft <= 0) return;

    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [open, secondsLeft]);

  useEffect(() => {
    if (!open) return;
    if (secondsLeft !== 0) return;
    onTimeout();
  }, [open, onTimeout, secondsLeft]);

  const pct = useMemo(() => {
    return Math.max(0, Math.min(100, Math.round((secondsLeft / totalSeconds) * 100)));
  }, [secondsLeft]);

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onCancel() : null)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Waiting for response...</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin" />

          <div>
            <div className="text-sm font-medium">{driverName}</div>
            <div className="text-xs text-muted-foreground">Waiting for driver to accept</div>
          </div>

          <div className="w-full space-y-2">
            <div className="text-xs text-muted-foreground">⏱ {secondsLeft} seconds remaining</div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Cancel Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { WaitingScreenProps };

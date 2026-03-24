import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { Wallet } from "@/models/Wallet";

type EscrowAction = "BLOCK" | "RELEASE" | "REFUND";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const body = await req.json();
    const action = body?.action as EscrowAction;
    const amount = Number(body?.amount);
    const bookingId = typeof body?.bookingId === "string" ? body.bookingId : "";

    if (!action || !["BLOCK", "RELEASE", "REFUND"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    if (!bookingId) {
      return NextResponse.json(
        { message: "bookingId is required" },
        { status: 400 }
      );
    }

    if (action === "BLOCK") {
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { message: "Invalid amount" },
          { status: 400 }
        );
      }
    }

    let wallet = await Wallet.findOne({ user: decoded.id });

    if (!wallet) {
      wallet = await Wallet.create({
        user: decoded.id,
        generatedBalance: 0,
        addedBalance: 0,
        rentalBalance: 0,
        withdrawableBalance: 0,
        transactions: [],
      });
    }

    if (action === "BLOCK") {
      wallet.transactions.push({
        type: "DEBIT",
        walletType: "ADDED",
        status: "BLOCKED",
        amount,
        description: `Escrow blocked for booking ${bookingId}`,
        relatedBooking: bookingId,
        timestamp: new Date(),
      } as any);

      await wallet.save();
      return NextResponse.json(wallet);
    }

    const idx = (wallet.transactions || []).findIndex(
      (t: any) =>
        String(t.relatedBooking || "") === String(bookingId) && t.status === "BLOCKED"
    );

    if (idx === -1) {
      return NextResponse.json(
        { message: "Blocked transaction not found" },
        { status: 404 }
      );
    }

    const blockedTx: any = wallet.transactions[idx];
    const blockedAmount = Number(blockedTx?.amount || 0);

    if (action === "RELEASE") {
      if (!Number.isFinite(blockedAmount) || blockedAmount <= 0) {
        return NextResponse.json(
          { message: "Blocked transaction amount invalid" },
          { status: 400 }
        );
      }

      if ((wallet.addedBalance || 0) < blockedAmount) {
        return NextResponse.json(
          { message: "Insufficient added balance to release escrow" },
          { status: 400 }
        );
      }

      wallet.transactions[idx].status = "COMPLETED";
      wallet.addedBalance = (wallet.addedBalance || 0) - blockedAmount;
      await wallet.save();
      return NextResponse.json(wallet);
    }

    // REFUND
    wallet.transactions[idx].status = "REFUNDED";
    await wallet.save();
    return NextResponse.json(wallet);
  } catch (error) {
    console.error("Wallet Escrow Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

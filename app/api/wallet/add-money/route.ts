import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { Wallet } from "@/models/Wallet";

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
    const amount = Number(body?.amount);
    const note = typeof body?.note === "string" ? body.note.trim() : "";

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    if (amount > 50000) {
      return NextResponse.json(
        { message: "Amount exceeds limit" },
        { status: 400 }
      );
    }

    const description = note || "Manual add (testing)";

    const wallet = await Wallet.findOneAndUpdate(
      { user: decoded.id },
      {
        $inc: { addedBalance: amount },
        $push: {
          transactions: {
            type: "CREDIT",
            walletType: "ADDED",
            status: "COMPLETED",
            amount,
            description,
            timestamp: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );

    const blockedAmount = (wallet.transactions || [])
      .filter((t: any) => t.status === "BLOCKED")
      .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const generatedBalance = wallet.generatedBalance || 0;
    const withdrawableBalance = generatedBalance - blockedAmount;

    return NextResponse.json({
      addedBalance: wallet.addedBalance || 0,
      generatedBalance,
      blockedAmount,
      withdrawableBalance,
    });
  } catch (error) {
    console.error("Wallet Add Money Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

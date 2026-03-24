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

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    const wallet = await Wallet.findOne({ user: decoded.id });

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    }

    if (amount > (wallet.generatedBalance || 0)) {
      return NextResponse.json(
        { message: "Insufficient generated balance" },
        { status: 400 }
      );
    }

    await Wallet.findOneAndUpdate(
      { user: decoded.id },
      {
        $inc: { generatedBalance: -amount },
        $push: {
          transactions: {
            type: "DEBIT",
            walletType: "GENERATED",
            status: "COMPLETED",
            amount,
            description: "Withdrawal (testing)",
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Withdrawal processed",
    });
  } catch (error) {
    console.error("Wallet Withdraw Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

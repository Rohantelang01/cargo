import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { Wallet } from "@/models/Wallet";

export async function GET(req: NextRequest) {
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
    console.error("Wallet Balance Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

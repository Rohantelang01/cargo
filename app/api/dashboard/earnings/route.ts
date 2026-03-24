import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectToDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || user.roles[0];
    const period = searchParams.get("period") || "7d"; // 7d, 30d, all

    const wallet = await Wallet.findOne({ user: user._id }).lean();
    if (!wallet) {
      return NextResponse.json({ earnings: [], totalEarnings: 0 }, { status: 200 });
    }

    // Filter transactions for earnings
    const transactions = (wallet as any).transactions || [];
    
    // Period filtering logic
    const now = new Date();
    let filteredTransactions = transactions;
    if (period === '7d') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      filteredTransactions = transactions.filter((t: any) => new Date(t.timestamp) >= sevenDaysAgo);
    } else if (period === '30d') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      filteredTransactions = transactions.filter((t: any) => new Date(t.timestamp) >= thirtyDaysAgo);
    }

    const earnings = filteredTransactions.filter((t: any) => 
      (t.type === 'CREDIT' || t.type === 'RENTAL_INCOME') && t.status === 'COMPLETED'
    );

    const totalEarnings = earnings.reduce((sum: number, t: any) => sum + t.amount, 0);

    return NextResponse.json({ 
      earnings, 
      totalEarnings,
      generatedBalance: wallet.generatedBalance,
      role 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Dashboard earnings error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

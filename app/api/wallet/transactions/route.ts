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

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit") || 20)));
    const type = searchParams.get("type");
    const status = searchParams.get("status");

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

    let transactions = [...(wallet.transactions || [])] as any[];

    transactions.sort((a, b) => {
      const at = new Date(a.timestamp).getTime();
      const bt = new Date(b.timestamp).getTime();
      return bt - at;
    });

    if (type) {
      transactions = transactions.filter((t) => t.type === type);
    }

    if (status) {
      transactions = transactions.filter((t) => t.status === status);
    }

    const total = transactions.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paginated = transactions.slice(start, start + limit);

    return NextResponse.json({
      transactions: paginated,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Wallet Transactions Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

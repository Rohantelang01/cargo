import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import WalletDashboard from "@/components/wallet/WalletDashboard";

export default async function WalletPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    redirect("/login");
  }

  return <div className="max-w-7xl mx-auto px-4 md:px-6 py-6"><WalletDashboard /></div>;
}

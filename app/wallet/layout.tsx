import { WalletProvider } from "@/context/WalletContext";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}

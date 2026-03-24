export interface WalletBalance {
  addedBalance: number;
  generatedBalance: number;
  blockedAmount: number;
  withdrawableBalance: number;
}

export interface Transaction {
  _id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  walletType: "GENERATED" | "ADDED";
  status: "PENDING" | "COMPLETED" | "FAILED" | "BLOCKED" | "REFUNDED";
  description: string;
  timestamp: Date;
  relatedBooking?: string;
}

export interface WalletContextType {
  wallet: WalletBalance | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchWallet: () => Promise<void>;
  fetchTransactions: (page?: number) => Promise<void>;
  addMoney: (amount: number, note?: string) => Promise<void>;
  withdrawMoney: (amount: number) => Promise<void>;
  blockAmount: (amount: number, bookingId: string) => Promise<void>;
  releaseAmount: (bookingId: string) => Promise<void>;
}

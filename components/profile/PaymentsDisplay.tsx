
"use client";
import { Button } from "@/components/ui/button";
import { Edit, Wallet, TrendingUp, TrendingDown, History } from "lucide-react";
import { IWallet } from "@/types/profile";
import { Badge } from "@/components/ui/badge";

interface PaymentsDisplayProps {
  wallet: IWallet | null;
  onEdit: () => void;
}

const PaymentsDisplay = ({ wallet, onEdit }: PaymentsDisplayProps) => {

  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  if (!wallet) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No payment information available.</p>
        <Button onClick={onEdit} className="mt-4">
          Add Payment Information
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Wallet Information */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Wallet Balance
            </h3>
            <Button onClick={onEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Payment Methods
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Total Balance</span>
            </div>
            <p className="text-2xl font-bold mt-2">₹{wallet.balance.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span className="text-sm font-medium">Recent Transactions</span>
            </div>
            <p className="text-2xl font-bold mt-2">{wallet.transactions?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      {wallet.transactions && wallet.transactions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Recent Transactions</h4>
          <div className="border rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {wallet.transactions.slice(0, 5).map((txn) => (
                <div key={txn.transactionId} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    {txn.type === 'credit' ? (
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className={`font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                     </p>
                     <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                        {txn.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsDisplay;

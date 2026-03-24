"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wallet, CreditCard, Building2, Shield, Download, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Global tab state for ProductionDemo
let globalSetActiveTab: ((tab: 'overview' | 'transactions' | 'accounts') => void) | null = null;

// Helper to get tab setter
function getTabSetter() {
  return globalSetActiveTab || (() => {});
}

export default function ProductionDemo() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'accounts'>('overview');
  globalSetActiveTab = setActiveTab;

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          🎨 <strong>Production Demo Mode</strong> - This is a static UI preview. All data is fake, no actual transactions will occur.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`px-3 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'border-b-2 border-primary text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('transactions')} 
          className={`px-3 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
            activeTab === 'transactions' 
              ? 'border-b-2 border-primary text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Transactions
        </button>
        <button 
          onClick={() => setActiveTab('accounts')} 
          className={`px-3 py-2 font-medium transition-colors text-sm whitespace-nowrap ${
            activeTab === 'accounts' 
              ? 'border-b-2 border-primary text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Bank Accounts
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'transactions' && <TransactionsTab />}
      {activeTab === 'accounts' && <AccountsTab />}
    </div>
  );
}

// Sub-components for each tab
function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Added Balance</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">₹5,480</p>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">For booking payments</p>
            </div>
            <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-2" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Generated Balance</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">₹12,340</p>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Trip earnings • Withdrawable</p>
            </div>
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 ml-2" />
          </div>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-400 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Blocked Amount</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">₹800</p>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">2 active bookings</p>
            </div>
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0 ml-2" />
          </div>
        </Card>
      </div>
      
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Add Money Card */}
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Money
          </h3>
          <Input type="number" placeholder="Enter amount" className="mb-3 sm:mb-4" />
          
          {/* Payment Gateway Mockup */}
          <div className="space-y-2 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Choose payment method:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => alert('Demo: Razorpay UPI payment')} className="text-xs">
                📱 UPI
              </Button>
              <Button variant="outline" size="sm" onClick={() => alert('Demo: Razorpay Card payment')} className="text-xs">
                💳 Card
              </Button>
              <Button variant="outline" size="sm" onClick={() => alert('Demo: Razorpay Net Banking')} className="text-xs">
                🏦 Bank
              </Button>
            </div>
          </div>
          
          <Button className="w-full text-sm" onClick={() => alert('Demo mode - Payment flow would start here via Razorpay')}>
            Proceed to Payment
          </Button>
        </Card>

        {/* Withdraw Card */}
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Withdraw to Bank
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm text-muted-foreground">Available: ₹12,340</label>
              <Input type="number" placeholder="Enter amount" className="mt-1" />
            </div>
            
            <div>
              <label className="text-xs sm:text-sm text-muted-foreground">Bank Account</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                <option>HDFC Bank - ****4567 ✓</option>
                <option>SBI - ****8901 ✓</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs sm:text-sm text-muted-foreground">Transaction PIN</label>
              <Input type="password" placeholder="Enter 4-digit PIN" maxLength={4} className="mt-1" />
            </div>
            
            <div className="bg-muted p-3 rounded-md text-xs sm:text-sm">
              <p className="text-muted-foreground">Daily limit: ₹8,000 / ₹10,000 used</p>
              <p className="text-muted-foreground mt-1">Processing time: 1-3 business days</p>
            </div>
            
            <Button className="w-full text-sm" onClick={() => alert('Demo mode - Bank transfer would be initiated')}>
              Request Withdrawal
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Preview */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h3 className="font-semibold text-sm sm:text-base">Recent Transactions</h3>
          <Button variant="ghost" size="sm" onClick={() => alert('Demo: View all transactions')} className="text-xs sm:text-sm self-end sm:self-auto">
            View All →
          </Button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {FAKE_TRANSACTIONS.slice(0, 3).map((txn) => (
            <div key={txn.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${txn.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {txn.type === 'CREDIT' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm truncate">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className={`font-semibold text-xs sm:text-sm ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                </p>
                <Badge variant={txn.status === 'COMPLETED' ? 'default' : txn.status === 'PENDING' ? 'secondary' : 'outline'} className="text-xs">
                  {txn.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TransactionsTab() {
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <Input type="date" className="w-auto text-sm" />
          <span className="text-muted-foreground text-sm">to</span>
          <Input type="date" className="w-auto text-sm" />
          
          <select className="px-2 py-1 sm:px-3 sm:py-2 border rounded-md text-sm">
            <option>All Types</option>
            <option>Credit</option>
            <option>Debit</option>
          </select>
          
          <select className="px-2 py-1 sm:px-3 sm:py-2 border rounded-md text-sm">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Blocked</option>
          </select>
          
          <Button variant="outline" size="sm" className="ml-auto text-xs sm:text-sm" onClick={() => alert('Demo: Export PDF')}>
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Export PDF
          </Button>
        </div>
      </Card>

      {/* Transaction List */}
      <Card className="divide-y">
        {FAKE_TRANSACTIONS.map((txn) => (
          <div key={txn.id} className="p-3 sm:p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${txn.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {txn.type === 'CREDIT' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm truncate">{txn.description}</p>
                <p className="text-xs text-muted-foreground">{txn.date}</p>
                {txn.razorpayId && (
                  <p className="text-xs text-muted-foreground">ID: {txn.razorpayId}</p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className={`font-semibold text-xs sm:text-sm ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString()}
              </p>
              <Badge variant={txn.status === 'COMPLETED' ? 'default' : txn.status === 'PENDING' ? 'secondary' : 'outline'} className="text-xs">
                {txn.status}
              </Badge>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AccountsTab() {
  return (
    <div className="space-y-4">
      {/* Bank Account Cards */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm sm:text-base">HDFC Bank</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Account: ****4567</p>
            <p className="text-xs text-muted-foreground mt-1">IFSC: HDFC0001234</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="default" className="text-xs">Primary</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
              Verified
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm sm:text-base">State Bank of India</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Account: ****8901</p>
            <p className="text-xs text-muted-foreground mt-1">IFSC: SBIN0005678</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => alert('Demo: Set as primary')} className="text-xs">
              Set Primary
            </Button>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
              Verified
            </Badge>
          </div>
        </div>
      </Card>

      <Button variant="outline" className="w-full text-sm" onClick={() => alert('Demo: Add bank account form would open')}>
        + Add New Bank Account
      </Button>

      {/* Security Settings */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          Security Settings
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <p className="font-medium text-sm sm:text-base">Transaction PIN</p>
              <p className="text-xs sm:text-sm text-muted-foreground">4-digit PIN for withdrawals</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
              Setup Complete
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <p className="font-medium text-sm sm:text-base">Two-Factor Authentication</p>
              <p className="text-xs sm:text-sm text-muted-foreground">SMS OTP for large transactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked disabled />
              <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Last login: Just now from 192.168.1.1
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Fake transaction data
const FAKE_TRANSACTIONS = [
  { id: 1, type: 'CREDIT', amount: 2500, description: 'Added via Razorpay UPI', date: 'Today, 2:30 PM', status: 'COMPLETED' as const, razorpayId: 'pay_NjF8xK9lPdR2Vy' },
  { id: 2, type: 'CREDIT', amount: 850, description: 'Trip Earning - Booking #BK240345', date: 'Today, 11:45 AM', status: 'COMPLETED' as const },
  { id: 3, type: 'DEBIT', amount: 1200, description: 'Withdrawal to HDFC Bank', date: 'Yesterday, 4:20 PM', status: 'PENDING' as const },
  { id: 4, type: 'DEBIT', amount: 600, description: 'Booking Payment - #BK240342', date: 'Yesterday, 10:15 AM', status: 'BLOCKED' as const },
  { id: 5, type: 'CREDIT', amount: 3000, description: 'Added via Razorpay Card', date: 'Mar 19, 3:30 PM', status: 'COMPLETED' as const, razorpayId: 'pay_NjA2mK4lPdR8Xy' },
  { id: 6, type: 'CREDIT', amount: 450, description: 'Refund - Booking #BK240338', date: 'Mar 19, 10:00 AM', status: 'COMPLETED' as const },
  { id: 7, type: 'DEBIT', amount: 320, description: 'Service Fee', date: 'Mar 18, 6:45 PM', status: 'COMPLETED' as const },
  { id: 8, type: 'CREDIT', amount: 1800, description: 'Trip Earning - Booking #BK240335', date: 'Mar 18, 2:15 PM', status: 'COMPLETED' as const },
  { id: 9, type: 'DEBIT', amount: 750, description: 'Withdrawal to SBI', date: 'Mar 17, 11:30 AM', status: 'COMPLETED' as const },
  { id: 10, type: 'CREDIT', amount: 2200, description: 'Added via Razorpay Net Banking', date: 'Mar 16, 4:00 PM', status: 'COMPLETED' as const, razorpayId: 'pay_NjB3nL5mPdR9Zz' },
  { id: 11, type: 'DEBIT', amount: 500, description: 'Booking Payment - #BK240320', date: 'Mar 16, 9:30 AM', status: 'BLOCKED' as const },
  { id: 12, type: 'CREDIT', amount: 950, description: 'Trip Earning - Booking #BK240318', date: 'Mar 15, 7:20 PM', status: 'COMPLETED' as const },
  { id: 13, type: 'DEBIT', amount: 1800, description: 'Withdrawal to HDFC Bank', date: 'Mar 15, 3:45 PM', status: 'PENDING' as const },
  { id: 14, type: 'CREDIT', amount: 600, description: 'Refund - Booking #BK240315', date: 'Mar 14, 12:00 PM', status: 'COMPLETED' as const },
  { id: 15, type: 'DEBIT', amount: 280, description: 'Service Fee', date: 'Mar 14, 8:15 AM', status: 'COMPLETED' as const },
];

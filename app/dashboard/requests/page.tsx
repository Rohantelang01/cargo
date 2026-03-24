"use client";

import React, { useState } from 'react';
import { useDashboardRequests } from "@/hooks/useDashboardRequests";
import { RequestCard } from "@/components/dashboard/requests/RequestCard";
import { LoadingCard } from "@/components/dashboard/common/LoadingCard";
import { ErrorState } from "@/components/dashboard/common/ErrorState";
import { EmptyState } from "@/components/dashboard/common/EmptyState";
import { useDashboard } from "@/context/DashboardContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Filter, Inbox } from 'lucide-react';
import { Input } from "@/components/ui/input";

export default function RequestsPage() {
  const { currentRole } = useDashboard();
  const [activeTab, setActiveTab] = useState('PENDING');
  const { requests, loading, error, refetch, respond } = useDashboardRequests(activeTab);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRespond = async (requestId: string, response: 'ACCEPTED' | 'REJECTED') => {
    const result = await respond(requestId, response);
    if (result.success) {
      refetch();
    } else {
      alert(result.error || 'Failed to respond');
    }
  };

  const filteredRequests = requests.filter(req => 
    req.booking?.pickup?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.booking?.dropoff?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.passenger?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Requests</h1>
          <p className="text-muted-foreground">Manage your incoming and outgoing trip requests</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search address or passenger..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="BOTH_ACCEPTED">Accepted</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <LoadingCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filteredRequests.length === 0 ? (
        <EmptyState 
          icon={<Inbox className="w-12 h-12" />}
          title="No requests found"
          description={searchQuery ? "Try adjusting your search filters" : "You don't have any requests in this category."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <RequestCard 
              key={request._id} 
              request={request} 
              role={currentRole}
              onRespond={handleRespond}
            />
          ))}
        </div>
      )}
    </div>
  );
}

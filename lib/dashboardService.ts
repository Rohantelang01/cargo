export const dashboardService = {
  // Stats
  getStats: async (role: string) => {
    const response = await fetch(`/api/dashboard/stats?role=${role}`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
  
  // Requests
  getRequests: async (role: string, status?: string) => {
    const query = new URLSearchParams({ role });
    if (status) query.append('status', status);
    const response = await fetch(`/api/dashboard/requests?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
  },

  respondToRequest: async (requestId: string, response: 'ACCEPTED' | 'REJECTED') => {
    const res = await fetch('/api/dashboard/requests/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, response })
    });
    if (!res.ok) throw new Error('Failed to respond to request');
    return res.json();
  },

  approveRequest: async (requestId: string) => {
    const res = await fetch('/api/dashboard/requests/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId })
    });
    if (!res.ok) throw new Error('Failed to approve request');
    return res.json();
  },
  
  // Trips
  getTrips: async (role: string, status?: string) => {
    const query = new URLSearchParams({ role });
    if (status) query.append('status', status);
    const response = await fetch(`/api/dashboard/trips?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch trips');
    return response.json();
  },

  startJourney: async (bookingId: string) => {
    const res = await fetch('/api/dashboard/trips/start-journey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId })
    });
    if (!res.ok) throw new Error('Failed to start journey');
    return res.json();
  },

  startTrip: async (bookingId: string) => {
    const res = await fetch('/api/dashboard/trips/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId })
    });
    if (!res.ok) throw new Error('Failed to start trip');
    return res.json();
  },

  endTrip: async (bookingId: string) => {
    const res = await fetch('/api/dashboard/trips/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId })
    });
    if (!res.ok) throw new Error('Failed to end trip');
    return res.json();
  },
  
  // History
  getHistory: async (role: string, limit?: number) => {
    const query = new URLSearchParams({ role });
    if (limit) query.append('limit', limit.toString());
    const response = await fetch(`/api/dashboard/history?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },
  
  // Earnings
  getEarnings: async (role: string, period?: string) => {
    const query = new URLSearchParams({ role });
    if (period) query.append('period', period);
    const response = await fetch(`/api/dashboard/earnings?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch earnings');
    return response.json();
  },
  
  // Driver
  toggleStatus: async (status: 'ONLINE' | 'OFFLINE') => {
    const res = await fetch('/api/dashboard/driver/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to toggle status');
    return res.json();
  }
};

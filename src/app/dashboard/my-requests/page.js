'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { toast } from 'sonner';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await axios.get('/api/requests/mine');
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      toast.error('Could not load your requests');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Ride Join Requests</h1>

      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">You haven't requested to join any rides yet.</p>
      ) : (
        requests.map((req) => (
          <Card key={req._id} className="p-4">
            <h2 className="text-lg font-semibold">
              Ride: {req.ride.source} → {req.ride.destination}
            </h2>
            <p className="text-sm text-muted-foreground">
              Date: {new Date(req.ride.date).toLocaleString()}
            </p>
            <p className="mt-2">
              <span className="font-medium">Status:</span>{' '}
              <span
                className={
                  req.status === 'approved'
                    ? 'text-green-600'
                    : req.status === 'rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }
              >
                {req.status}
              </span>
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Ride by: {req.ride.creator.name} ({req.ride.creator.email})
            </p>
          </Card>
        ))
      )}
    </div>
  );
}

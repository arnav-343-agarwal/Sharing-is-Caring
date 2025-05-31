'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

export default function MyRidesPage() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchRides();
  }, []);

  async function fetchRides() {
    try {
      const res = await axios.get('/api/requests');
      setRides(res.data.rides || []);
    } catch (err) {
      console.error('Failed to fetch rides', err);
      toast.error('Error loading ride requests');
    }
  }

  async function handleAction(requestId, status) {
    try {
      await axios.put(`/api/requests/${requestId}`, { status });
      toast.success(`Request ${status}`);
      fetchRides();
    } catch (err) {
      console.error('Error updating request', err);
      toast.error('Failed to update request');
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Rides & Requests</h1>
      {rides.length === 0 && <p>No rides found.</p>}
      {rides.map((ride) => (
        <Card key={ride._id} className="p-4">
          <h2 className="text-xl font-semibold mb-2">Ride from {ride.source} to {ride.destination}</h2>
          <p className="text-sm text-muted-foreground mb-4">Date: {new Date(ride.date).toLocaleString()}</p>

          <h3 className="font-medium mb-2">Join Requests:</h3>
          {ride.requests.length === 0 ? (
            <p className="text-sm text-gray-500">No requests yet.</p>
          ) : (
            <div className="space-y-2">
              {ride.requests.map((req) => (
                <CardContent key={req._id} className="flex items-center justify-between border rounded px-4 py-2 bg-gray-50">
                  <div>
                    <p>{req.user.name} ({req.user.email})</p>
                    <p className="text-xs text-gray-500">Status: {req.status}</p>
                  </div>
                  {req.status === 'pending' && (
                    <div className="space-x-2">
                      <Button variant="success" onClick={() => handleAction(req._id, 'approved')}>Approve</Button>
                      <Button variant="destructive" onClick={() => handleAction(req._id, 'rejected')}>Reject</Button>
                    </div>
                  )}
                </CardContent>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

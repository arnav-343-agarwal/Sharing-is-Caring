'use client';

import { useState, useEffect } from 'react';

export default function RequestsList({ userId }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchRequests() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/requests?creatorId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setRides(data.rides);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function updateRequestStatus(requestId, newStatus) {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update request');
      await fetchRequests(); // refresh after update
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (rides.length === 0) return <p>No rides or requests found.</p>;

  return (
    <div>
      {rides.map((ride) => (
        <div key={ride._id} className="mb-8 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">{ride.title || 'Ride'}</h2>
          <p>From: {ride.startLocation}</p>
          <p>To: {ride.endLocation}</p>

          {ride.requests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <table className="w-full mt-4 border-collapse border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Requester</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ride.requests.map((req) => (
                  <tr key={req._id}>
                    <td className="border px-2 py-1">{req.user.name || req.user.email}</td>
                    <td className="border px-2 py-1 capitalize">{req.status}</td>
                    <td className="border px-2 py-1">
                      {req.status === 'pending' && (
                        <>
                          <button
                            className="mr-2 btn btn-success"
                            onClick={() => updateRequestStatus(req._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-error"
                            onClick={() => updateRequestStatus(req._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(req.status === 'approved' || req.status === 'rejected') && (
                        <span>No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

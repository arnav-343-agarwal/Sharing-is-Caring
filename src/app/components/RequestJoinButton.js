'use client';

import { useState } from 'react';

export default function RequestJoinButton({ rideId }) {
  const [status, setStatus] = useState(''); // '', 'pending', 'approved', 'rejected', 'error'
  const [loading, setLoading] = useState(false);

  async function sendJoinRequest() {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId }),
      });
      if (!res.ok) throw new Error('Failed to send request');
      const data = await res.json();
      setStatus('pending');
    } catch (e) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {status === '' && (
        <button
          onClick={sendJoinRequest}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Sending...' : 'Request to Join Ride'}
        </button>
      )}

      {status === 'pending' && <p className="text-yellow-600">Request Pending</p>}
      {status === 'approved' && <p className="text-green-600">Request Approved</p>}
      {status === 'rejected' && <p className="text-red-600">Request Rejected</p>}
      {status === 'error' && <p className="text-red-600">Error sending request</p>}
    </div>
  );
}

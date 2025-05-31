import { connectDB } from '@/lib/db';
import Request from '@/models/Request';
import Ride from '@/models/Ride';
import { requireAuth } from '@/lib/requireAuth';

export async function PUT(req, { params }) {
  const auth = await requireAuth(req);
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  const { status } = await req.json(); // 'approved' or 'rejected'
  await connectDB();

  const request = await Request.findById(params.id);
  if (!request) return new Response(JSON.stringify({ error: 'Request not found' }), { status: 404 });

  // Check if the ride belongs to current user
  const ride = await Ride.findById(request.ride);
  if (!ride) return new Response(JSON.stringify({ error: 'Ride not found' }), { status: 404 });
  if (ride.user.toString() !== auth.user._id.toString()) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 403 });
  }

  request.status = status;
  await request.save();

  // If approved, add user to ride.participants if not already there
  if (status === 'approved') {
    if (!ride.participants.includes(request.user)) {
      ride.participants.push(request.user);
      await ride.save();
    }
  } else if (status === 'rejected') {
    // Optionally remove from participants if present
    ride.participants = ride.participants.filter((p) => p.toString() !== request.user.toString());
    await ride.save();
  }

  return new Response(JSON.stringify({ message: `Request ${status}`, request }), { status: 200 });
}

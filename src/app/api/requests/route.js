import { connectDB } from '@/lib/db';
import Request from '@/models/Request';
import Ride from '@/models/Ride';
import { requireAuth } from '@/lib/requireAuth';

export async function POST(req) {
  const auth = await requireAuth(req);
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  const { rideId } = await req.json();
  await connectDB();

  // Check if request already exists for this user and ride
  const existing = await Request.findOne({ ride: rideId, user: auth.user._id });
  if (existing) return new Response(JSON.stringify({ error: 'Request already sent' }), { status: 400 });

  // Create new join request
  const request = await Request.create({
    ride: rideId,
    user: auth.user._id,
  });

  return new Response(JSON.stringify({ message: 'Request sent', request }), { status: 201 });
}

export async function GET(req) {
  const auth = await requireAuth(req);
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });

  await connectDB();

  // Get requests for rides owned by this user (ride creator)
  const url = new URL(req.url);
  const rideId = url.searchParams.get('rideId');

  let filter = {};
  if (rideId) filter.ride = rideId;

  // Find requests where ride.creator === auth.user._id
  // So we join with Ride to filter requests for rides created by this user
  const requests = await Request.find(filter)
    .populate('user', 'name email')
    .populate({
      path: 'ride',
      match: { user: auth.user._id }, // rides owned by this user
    });

  // Filter requests where ride matched (owner)
  const filtered = requests.filter((r) => r.ride !== null);

  return new Response(JSON.stringify(filtered), { status: 200 });
}

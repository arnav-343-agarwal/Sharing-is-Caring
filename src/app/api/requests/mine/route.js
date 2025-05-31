import { connectDB } from '@/lib/db';
import Request from '@/models/Request';
import Ride from '@/models/Ride';
import User from '@/models/User';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req) {
  const auth = await requireAuth(req);
  if (auth.error)
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
    });

  await connectDB();

  const requests = await Request.find({ user: auth.user._id })
    .populate({
      path: 'ride',
      populate: {
        path: 'user',
        model: User,
        select: 'name email',
      },
    });

  return new Response(JSON.stringify({ requests }), { status: 200 });
}

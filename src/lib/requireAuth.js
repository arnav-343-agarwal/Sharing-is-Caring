import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import User from '@/models/User';

export async function requireAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return { error: 'User not found', status: 401 };

    return { user }; // pass to your route logic
  } catch (err) {
    return { error: 'Invalid or expired token', status: 401 };
  }
}

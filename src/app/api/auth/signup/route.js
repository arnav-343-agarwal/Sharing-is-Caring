import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing) {
    return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });

  return new Response(JSON.stringify({ msg: 'Signup successful', user }), { status: 201 });
}

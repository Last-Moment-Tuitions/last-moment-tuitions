import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Please provide email/phone and password' }, { status: 400 });
    }

    await connectDB();

    const normalizedIdentifier = typeof identifier === 'string' ? identifier.toLowerCase() : '';

    const user = await User.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: identifier }]
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '30d' }
      );

      return NextResponse.json({
        _id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token
      });
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

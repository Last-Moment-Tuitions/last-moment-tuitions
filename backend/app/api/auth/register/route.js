import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      password
    } = await req.json();

    if (!firstName || !email || !phone || !password) {
      return NextResponse.json(
        { message: 'Please provide all required fields (firstName, email, phone, password)' },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email?.toLowerCase();

    const userExistsEmail = await User.findOne({ email: normalizedEmail });
    if (userExistsEmail) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 });
    }

    const userExistsPhone = await User.findOne({ phone });
    if (userExistsPhone) {
      return NextResponse.json({ message: 'User already exists with this phone number' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      dateOfBirth,
      gender,
      password: hashedPassword,
      role: 'user'
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }

    return NextResponse.json(
      {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        message: 'User registered successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    console.log('--- Register Request Started ---');
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, password } = body;

        console.log('Payload Received:', { firstName, lastName, email, phone, password: '***' });

        // 1. Basic Validation
        if (!firstName || !email || !phone || !password) {
            console.log('Validation Failed: Missing fields');
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        console.log('Connecting to DB...');
        await dbConnect();
        console.log('DB Connected.');

        // 2. Check for existing user (case insensitive email)
        console.log('Checking for existing user...');
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone }
            ]
        });

        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            if (existingUser.email === email.toLowerCase()) {
                return NextResponse.json(
                    { error: 'Email already exists' },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: 'Phone number already exists' },
                { status: 409 }
            );
        }

        // 3. Hash Password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User
        console.log('Creating new user document...');
        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
        });
        console.log('User created:', newUser._id);

        // 5. Return safe response
        const userResponse = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
        };

        return NextResponse.json(
            { message: 'User registered successfully', user: userResponse },
            { status: 201 }
        );

    } catch (error) {
        console.error('CRITICAL REGISTER ERROR:', error);

        // Handle Mongoose Validation Errors specifically if needed
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { error: Object.values(error.errors).map(e => e.message).join(', ') },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Internal Server Error', stack: error.stack }, // Return error details to frontend for debugging
            { status: 500 }
        );
    }
}

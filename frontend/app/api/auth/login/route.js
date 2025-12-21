import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Session from '@/models/Session'; // Import Session Model
import crypto from 'crypto'; // For generating token

export async function POST(req) {
    try {
        const body = await req.json();
        const { identifier, password } = body; // identifier can be email or phone

        if (!identifier || !password) {
            return NextResponse.json(
                { error: 'Please provide email/phone and password' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find user by email or phone
        // We use $or to allow login with either
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { phone: identifier }
            ]
        });

        if (!user) {
            console.log('Login failed: User not found for identifier:', identifier);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check Password
        console.log('Verifying password for user:', user.email);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password mismatch');
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if user is active
        if (user.status !== 'active') {
            return NextResponse.json(
                { error: 'Account is deactivated. Please contact support.' },
                { status: 403 }
            );
        }

        // GENERATE SESSION TOKEN
        const token = crypto.randomUUID();
        console.log(`[AUTH] Generating session for ${user.email}`);

        // MAX 3 ACTIVE SESSIONS (FIFO Logic)
        const existingSessions = await Session.find({ userId: user._id }).sort({ createdAt: 1 });
        console.log(`[AUTH] Current active sessions: ${existingSessions.length}`);

        if (existingSessions.length >= 3) {
            // How many we need to remove to make room for 1 more while keeping total <= 3?
            // If length is 3, we remove 1 (oldest). 3 - 1 + 1 = 3.
            // If length is 4 (bug recovery), we remove 2. 4 - 2 + 1 = 3.
            const countToRemove = (existingSessions.length - 3) + 1;
            console.log(`[AUTH] Limit reached. Removing ${countToRemove} oldest session(s).`);

            const sessionsToDelete = existingSessions.slice(0, countToRemove);
            for (const s of sessionsToDelete) {
                await Session.findByIdAndDelete(s._id);
                console.log(`[AUTH] Deleted oldest session token: ${s.token.substring(0, 8)}...`);
            }
        }

        // Save new session to DB
        await Session.create({
            userId: user._id,
            token: token,
            createdAt: new Date() // Explicitly set to ensure sorting works best
        });
        console.log(`[AUTH] New session stored in DB.`);

        // Return user info (excluding password)
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            token: token // Send token to frontend
        };

        return NextResponse.json(
            { message: 'Login successful', user: userResponse },
            { status: 200 }
        );

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

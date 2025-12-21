import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

export async function POST(req) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Remove token from DB
        const deletedSession = await Session.findOneAndDelete({ token });

        if (!deletedSession) {
            console.log('Logout warning: Session not found in DB or already deleted.');
        } else {
            console.log('Session deleted from DB for user:', deletedSession.userId);
        }

        return NextResponse.json(
            { message: 'Logged out successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Logout Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// READ: Get User Details
export async function GET(request, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        const user = await User.findById(id).select('-password'); // Exclude password from result

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { user },
            { status: 200 }
        );
    } catch (error) {
        console.error('Fetch User Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// UPDATE: Modify User Information
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json(); // Wait, mistake here, request.json()

        // Remove sensitive fields or handle them separately if needed
        // For now, allow updating basic info
        const { firstName, lastName, phone, email, password } = body;

        await dbConnect();

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phone) updateData.phone = phone;
        if (email) updateData.email = email.toLowerCase();

        // If updating password, hash it
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true } // Return the updated document
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User updated successfully', user: updatedUser },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update User Error:', error);
        // Handle unique constraint violation (e.g. duplicate email)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Email or Phone already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// DELETE: Deactivate User (Soft Delete)
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        // Option 1: Soft Delete (Set status to blocked/deactivated)
        const deactivatedUser = await User.findByIdAndUpdate(
            id,
            { status: 'blocked' }, // Using 'blocked' as per User model enum ['active', 'blocked']
            { new: true }
        );

        if (!deactivatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User account deactivated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Delete User Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

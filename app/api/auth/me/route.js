import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const authResult = await authenticate(req);

        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(authResult.user.userId)
            .select('-password -verificationToken -passwordResetToken -passwordResetExpires');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    address: user.address,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
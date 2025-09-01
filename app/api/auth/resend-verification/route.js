import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req) {
    try {
        await connectDB();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if user exists or not for security
            return NextResponse.json(
                { message: 'If an account exists, verification email has been sent' },
                { status: 200 }
            );
        }

        // Check if already verified
        if (user.isVerified) {
            return NextResponse.json(
                { error: 'Account is already verified' },
                { status: 400 }
            );
        }

        // Generate new verification token
        const verificationToken = jwt.sign(
            {
                email: user.email,
                type: 'email_verification',
                timestamp: Date.now()
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update user with new token
        user.verificationToken = verificationToken;
        user.updatedAt = new Date();
        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(user.email, verificationToken, user.name);
            console.log('📧 Verification email resent successfully to:', user.email);
        } catch (emailError) {
            console.error('📧 Email sending failed:', emailError.message);
        }

        return NextResponse.json(
            { message: 'Verification email has been resent' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
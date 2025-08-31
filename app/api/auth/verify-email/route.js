export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Find and verify user
        const user = await User.findOneAndUpdate(
            {
                email: decoded.email,
                verificationToken: token,
                isVerified: false
            },
            {
                isVerified: true,
                verificationToken: null,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: 'User not found or already verified' },
                { status: 400 }
            );
        }

        // Generate auth token for auto-login
        const authToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json(
            {
                message: 'Email verified successfully',
                token: authToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
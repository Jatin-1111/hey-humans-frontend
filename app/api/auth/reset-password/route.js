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

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if user exists or not
            return NextResponse.json(
                { message: 'If an account exists, password reset email has been sent' },
                { status: 200 }
            );
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Save reset token to user
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
        user.updatedAt = new Date();
        await user.save();

        // Send reset email
        try {
            await sendPasswordResetEmail(user.email, resetToken);
        } catch (emailError) {
            console.error('Reset email failed:', emailError);
        }

        return NextResponse.json(
            { message: 'If an account exists, password reset email has been sent' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
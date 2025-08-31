import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: `"Hey Humanz" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify Your Email - Hey Humanz',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to Hey Humanz! 🎬</h2>
                <p>Thank you for joining our creative community. Please verify your email address by clicking the button below:</p>
                <a href="${verificationUrl}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                    Verify Email Address
                </a>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <p><small>This link will expire in 24 hours.</small></p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px;">
                    If you didn't create an account with Hey Humanz, you can safely ignore this email.
                </p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Hey Humanz" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset Your Password - Hey Humanz',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested to reset your password. Click the button below to set a new password:</p>
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                    Reset Password
                </a>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p><small>This link will expire in 1 hour.</small></p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px;">
                    If you didn't request a password reset, you can safely ignore this email.
                </p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}
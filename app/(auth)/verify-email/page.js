"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Mail, Loader, Sparkles } from 'lucide-react';

export default function VerifyEmailPage() {
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        // Get user email from localStorage if available
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserEmail(user.email);
        }

        if (token) {
            verifyEmail(token);
        } else {
            setStatus('waiting');
            setMessage('Check your email for a verification link.');
        }
    }, [searchParams]);

    const verifyEmail = async (token) => {
        try {
            const response = await fetch(`/api/auth/verify-email?token=${token}`);
            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Email verified successfully!');

                // Store new token and redirect
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Verification failed');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    const resendVerification = async () => {
        if (!userEmail) {
            setMessage('Please log in again to resend verification.');
            return;
        }

        // Implementation for resend would go here
        setMessage('Verification email resent! Check your inbox.');
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Header */}
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-8">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold font-space">Hey Humanz</span>
                    </Link>
                </div>

                {/* Status Icon */}
                <div className="flex justify-center">
                    {status === 'loading' && <Loader className="w-16 h-16 text-blue-400 animate-spin" />}
                    {status === 'success' && <CheckCircle className="w-16 h-16 text-green-400" />}
                    {status === 'error' && <AlertCircle className="w-16 h-16 text-red-400" />}
                    {status === 'waiting' && <Mail className="w-16 h-16 text-blue-400" />}
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-white font-outfit">
                        {status === 'loading' && 'Verifying Email...'}
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                        {status === 'waiting' && 'Check Your Email'}
                    </h1>

                    <p className="text-gray-400 font-inter">{message}</p>

                    {userEmail && status === 'waiting' && (
                        <p className="text-sm text-gray-500 font-inter">
                            Sent to: {userEmail}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    {status === 'error' && (
                        <button
                            onClick={resendVerification}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-geist"
                        >
                            Resend Verification Email
                        </button>
                    )}

                    <div className="space-y-2">
                        <Link
                            href="/login"
                            className="block w-full py-3 px-4 border border-gray-700 text-white hover:bg-gray-800 rounded-lg transition-colors font-geist"
                        >
                            Back to Login
                        </Link>

                        <Link
                            href="/"
                            className="block text-blue-400 hover:text-blue-300 transition-colors font-inter"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
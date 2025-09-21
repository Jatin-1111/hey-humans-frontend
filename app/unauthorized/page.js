"use client";
import { useAuth } from '@/hooks/useAuth';
import { Shield, ArrowLeft, Home, AlertTriangle, UserCheck, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingComponent from '@/components/ui/LoadingComponent';

export default function UnauthorizedPage() {
    const { user, loading, isAuthenticated, isAdmin, canFreelance, enableFreelancerMode } = useAuth();
    const router = useRouter();
    const [isEnabling, setIsEnabling] = useState(false);

    useEffect(() => {
        // If user is admin, redirect to dashboard since they have access to everything
        if (!loading && isAdmin) {
            router.push('/dashboard');
        }
    }, [isAdmin, loading, router]);

    const handleEnableFreelancer = async () => {
        setIsEnabling(true);
        try {
            const result = await enableFreelancerMode();
            if (result.success) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Failed to enable freelancer mode:', error);
        } finally {
            setIsEnabling(false);
        }
    };

    if (loading) {
        return (
            <LoadingComponent
                fullScreen={true}
                message="Checking permissions..."
                showLogo={true}
                size="large"
            />
        );
    }

    // Redirect admin users
    if (isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="max-w-md mx-auto text-center p-8">
                {/* Icon based on user status */}
                <div className="w-20 h-20 mx-auto mb-6 bg-yellow-600/20 rounded-full flex items-center justify-center">
                    {!isAuthenticated ? (
                        <Shield className="w-10 h-10 text-yellow-400" />
                    ) : (
                        <AlertTriangle className="w-10 h-10 text-yellow-400" />
                    )}
                </div>

                {/* Title based on authentication status */}
                <h1 className="text-2xl font-bold text-white mb-4 font-outfit">
                    {!isAuthenticated ? 'Authentication Required' : 'Access Restricted'}
                </h1>

                {/* Content based on user state */}
                {!isAuthenticated ? (
                    <>
                        <p className="text-gray-400 mb-6 font-inter">
                            You need to be logged in to access this page. Please sign in to continue.
                        </p>

                        <div className="space-y-4">
                            <Link
                                href="/login"
                                className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Sign In
                            </Link>

                            <p className="text-sm text-gray-400 font-inter">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-blue-400 hover:text-blue-300">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </>
                ) : user?.role === 'user' && !canFreelance ? (
                    <>
                        <p className="text-gray-400 mb-6 font-inter">
                            This feature requires freelancer access. Enable freelancer mode to unlock additional features and start earning money.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={handleEnableFreelancer}
                                disabled={isEnabling}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isEnabling ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Enabling...
                                    </>
                                ) : (
                                    <>
                                        <UserCheck className="w-5 h-5" />
                                        Enable Freelancer Mode
                                    </>
                                )}
                            </button>

                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-left">
                                <h3 className="font-semibold text-green-400 mb-2 font-outfit">What you&apos;ll get:</h3>
                                <ul className="text-sm text-gray-300 space-y-1 font-inter">
                                    <li>• Browse and bid on video projects</li>
                                    <li>• Set your hourly rates</li>
                                    <li>• Build your portfolio</li>
                                    <li>• Earn money from your skills</li>
                                    <li>• Access freelancer dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-400 mb-6 font-inter">
                            You don&apos;t have permission to access this resource. This might be due to insufficient role permissions or account restrictions.
                        </p>

                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 text-left">
                            <h3 className="font-semibold text-yellow-400 mb-2 font-outfit">Your Current Access:</h3>
                            <div className="space-y-2 text-sm font-inter">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">Account Status:</span>
                                    <span className="text-green-400">Active</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">Role:</span>
                                    <span className="text-blue-400 capitalize">{user?.role || 'User'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">Freelancer Mode:</span>
                                    <span className={canFreelance ? 'text-green-400' : 'text-gray-400'}>
                                        {canFreelance ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">Email Verified:</span>
                                    <span className={user?.isVerified ? 'text-green-400' : 'text-yellow-400'}>
                                        {user?.isVerified ? 'Yes' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Common action buttons */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>

                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                    )}
                </div>

                {/* Additional help for authenticated users */}
                {isAuthenticated && (
                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <p className="text-sm text-gray-400 mb-3 font-inter">
                            Need help with access permissions?
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                href="/dashboard?tab=settings"
                                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                            >
                                <Settings className="w-4 h-4" />
                                Account Settings
                            </Link>
                            <Link
                                href="/contact"
                                className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
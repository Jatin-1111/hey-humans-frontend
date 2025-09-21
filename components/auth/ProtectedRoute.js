"use client";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingComponent from '@/components/ui/LoadingComponent';
import { AlertTriangle, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProtectedRoute({
    children,
    requiredRole = null,
    requireFreelancer = false,
    requireVerified = false,
    redirectTo = '/login',
    loadingMessage = "Checking access..."
}) {
    const { user, loading, isAuthenticated, isAdmin, canFreelance } = useAuth();
    const router = useRouter();
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (!loading) {
            // Check authentication
            if (!isAuthenticated) {
                router.push(redirectTo);
                return;
            }

            // Check role requirements
            if (requiredRole && user.role !== requiredRole && !isAdmin) {
                setShowError(true);
                return;
            }

            // Check freelancer requirements
            if (requireFreelancer && !canFreelancer) {
                setShowError(true);
                return;
            }

            // Check email verification
            if (requireVerified && !user.isVerified) {
                router.push('/verify-email');
                return;
            }

            setShowError(false);
        }
    }, [user, loading, isAuthenticated, requiredRole, requireFreelancer, requireVerified, router, redirectTo, isAdmin, canFreelance]);

    // Show loading state
    if (loading) {
        return (
            <LoadingComponent
                fullScreen={true}
                message={loadingMessage}
                showLogo={true}
                size="large"
            />
        );
    }

    // Show error state for insufficient permissions
    if (showError) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-600/20 rounded-full flex items-center justify-center">
                        {requiredRole ? (
                            <Lock className="w-10 h-10 text-red-400" />
                        ) : (
                            <AlertTriangle className="w-10 h-10 text-yellow-400" />
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-4 font-outfit">
                        {requiredRole ? 'Access Denied' : 'Additional Setup Required'}
                    </h1>

                    <p className="text-gray-400 mb-6 font-inter">
                        {requiredRole && `This page requires ${requiredRole} access.`}
                        {requireFreelancer && !canFreelance && 'You need to enable freelancer mode to access this page.'}
                        {requireVerified && !user?.isVerified && 'Please verify your email address to continue.'}
                    </p>

                    <div className="space-y-4">
                        {requireFreelancer && !canFreelance && (
                            <Link
                                href="/dashboard"
                                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Enable Freelancer Mode
                            </Link>
                        )}

                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </button>

                            <Link
                                href="/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show unauthorized message if not authenticated
    if (!isAuthenticated) {
        return null; // Router will handle redirect
    }

    return children;
}
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <Shield className="w-16 h-16 text-red-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white font-outfit">Access Denied</h1>
                    <p className="text-gray-400 font-inter">You don&apos;t have permission to access this page.</p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-geist"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>

                    <div>
                        <Link
                            href="/"
                            className="text-blue-400 hover:text-blue-300 transition-colors font-inter"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
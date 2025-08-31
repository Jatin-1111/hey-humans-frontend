"use client";
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { User, Mail, Phone, MapPin, Calendar, Shield, LogOut } from 'lucide-react';

function DashboardContent() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-bold font-space">Hey Humanz Dashboard</h1>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-xl font-bold font-outfit">{user?.name}</h2>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${user?.role === 'admin'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-blue-600 text-white'
                                        }`}>
                                        {user?.role}
                                    </span>
                                    {user?.isVerified ? (
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-600 text-white">
                                            Unverified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-inter">{user?.email}</span>
                                </div>
                                {user?.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-inter">{user.phone}</span>
                                    </div>
                                )}
                                {user?.address && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-inter">{user.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-inter">
                                        Joined {new Date(user?.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                            <h3 className="text-lg font-bold font-outfit mb-6">Welcome to Hey Humanz!</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-400 mb-2 font-outfit">Find Video Editors</h4>
                                    <p className="text-sm text-gray-300 font-inter mb-3">Connect with professional video editors for your projects.</p>
                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                        Browse Editors →
                                    </button>
                                </div>

                                <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-400 mb-2 font-outfit">LED Displays</h4>
                                    <p className="text-sm text-gray-300 font-inter mb-3">Shop premium LED screens and video walls.</p>
                                    <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                                        Shop Displays →
                                    </button>
                                </div>

                                <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4">
                                    <h4 className="font-semibold text-purple-400 mb-2 font-outfit">Equipment Rental</h4>
                                    <p className="text-sm text-gray-300 font-inter mb-3">Rent equipment for your events and projects.</p>
                                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                                        Browse Rentals →
                                    </button>
                                </div>

                                {user?.role === 'admin' && (
                                    <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield className="w-4 h-4 text-yellow-400" />
                                            <h4 className="font-semibold text-yellow-400 font-outfit">Admin Panel</h4>
                                        </div>
                                        <p className="text-sm text-gray-300 font-inter mb-3">Manage users, orders, and system settings.</p>
                                        <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                                            Open Admin →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
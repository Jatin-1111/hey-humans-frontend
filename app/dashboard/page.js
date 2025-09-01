// app/dashboard/page.js
"use client";
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { User, Mail, Phone, MapPin, Calendar, Shield, LogOut, Briefcase, Play, ShoppingCart, Star, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

function DashboardContent() {
    const { user, logout, enableFreelancerMode, profileCompletion } = useAuth();

    const handleEnableFreelancer = async () => {
        const result = await enableFreelancerMode();
        if (result.success) {
            // Refresh page or show success message
            window.location.reload();
        }
    };

    // Calculate dashboard stats
    const totalActivity = user?.activityStats?.projectsPosted + user?.activityStats?.projectsCompleted + user?.activityStats?.ordersPlaced || 0;
    const isNewUser = totalActivity === 0;

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
                                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${user?.role === 'admin'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-blue-600 text-white'
                                        }`}>
                                        {user?.role}
                                    </span>
                                    {user?.canFreelance && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white">
                                            Freelancer
                                        </span>
                                    )}
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

                            {/* Profile Completion Progress */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-300">Profile Completion</span>
                                    <span className="text-sm font-medium text-blue-400">{profileCompletion}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${profileCompletion}%` }}
                                    ></div>
                                </div>
                                {profileCompletion < 100 && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Complete your profile to unlock more features
                                    </p>
                                )}
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

                            {/* Freelancer Stats */}
                            {user?.canFreelance && user?.freelancerProfile && (
                                <div className="mt-6 pt-6 border-t border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Freelancer Stats</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Rating</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-white">
                                                    {user.freelancerProfile.rating?.average?.toFixed(1) || '0.0'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Completed Projects</span>
                                            <span className="text-sm text-white">{user.freelancerProfile.completedProjects}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Hourly Rate</span>
                                            <span className="text-sm text-white">
                                                ${user.freelancerProfile.hourlyRate || 0}/hr
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Availability</span>
                                            <span className={`text-sm px-2 py-1 rounded-full text-xs ${user.freelancerProfile.availability === 'available'
                                                ? 'bg-green-600 text-white'
                                                : user.freelancerProfile.availability === 'busy'
                                                    ? 'bg-yellow-600 text-white'
                                                    : 'bg-red-600 text-white'
                                                }`}>
                                                {user.freelancerProfile.availability}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {/* Welcome Banner for New Users */}
                            {isNewUser && (
                                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
                                    <h3 className="text-lg font-bold text-white mb-2 font-outfit">
                                        Welcome to Hey Humanz! 🎉
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-4 font-inter">
                                        You now have access to our complete platform - post projects, browse freelancers, and shop LED displays all in one place!
                                    </p>
                                    {!user?.canFreelance && (
                                        <button
                                            onClick={handleEnableFreelancer}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Enable Freelancer Mode
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                <h3 className="text-lg font-bold font-outfit mb-6">Quick Actions</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Client Actions */}
                                    <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Play className="w-5 h-5 text-blue-400" />
                                            <h4 className="font-semibold text-blue-400 font-outfit">As a Client</h4>
                                        </div>
                                        <p className="text-sm text-gray-300 font-inter mb-3">
                                            Need video editing work done? Post a project and hire talented freelancers.
                                        </p>
                                        <div className="space-y-2">
                                            <button className="w-full text-left text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                                                Post New Project →
                                            </button>
                                            <button className="w-full text-left text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                                                Browse Freelancers →
                                            </button>
                                        </div>
                                    </div>

                                    {/* Freelancer Actions */}
                                    {user?.canFreelance ? (
                                        <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Briefcase className="w-5 h-5 text-green-400" />
                                                <h4 className="font-semibold text-green-400 font-outfit">As a Freelancer</h4>
                                            </div>
                                            <p className="text-sm text-gray-300 font-inter mb-3">
                                                Find exciting projects and grow your freelancing career.
                                            </p>
                                            <div className="space-y-2">
                                                <button className="w-full text-left text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                                                    Browse Projects →
                                                </button>
                                                <button className="w-full text-left text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                                                    Update Portfolio →
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-600/10 border border-gray-600/20 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Briefcase className="w-5 h-5 text-gray-400" />
                                                <h4 className="font-semibold text-gray-400 font-outfit">Become a Freelancer</h4>
                                            </div>
                                            <p className="text-sm text-gray-300 font-inter mb-3">
                                                Start earning money by offering your creative services.
                                            </p>
                                            <button
                                                onClick={handleEnableFreelancer}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Enable Freelancer Mode
                                            </button>
                                        </div>
                                    )}

                                    {/* Marketplace Actions */}
                                    <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <ShoppingCart className="w-5 h-5 text-purple-400" />
                                            <h4 className="font-semibold text-purple-400 font-outfit">LED Marketplace</h4>
                                        </div>
                                        <p className="text-sm text-gray-300 font-inter mb-3">
                                            Shop premium LED displays or rent equipment for events.
                                        </p>
                                        <div className="space-y-2">
                                            <button className="w-full text-left text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                                Browse Displays →
                                            </button>
                                            <button className="w-full text-left text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                                Rental Options →
                                            </button>
                                        </div>
                                    </div>

                                    {/* Admin Panel */}
                                    {user?.role === 'admin' && (
                                        <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Shield className="w-5 h-5 text-yellow-400" />
                                                <h4 className="font-semibold text-yellow-400 font-outfit">Admin Panel</h4>
                                            </div>
                                            <p className="text-sm text-gray-300 font-inter mb-3">
                                                Manage platform, users, products, and orders.
                                            </p>
                                            <div className="space-y-2">
                                                <button className="w-full text-left text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
                                                    Manage Products →
                                                </button>
                                                <button className="w-full text-left text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
                                                    View Orders →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Stats */}
                            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                <h3 className="text-lg font-bold font-outfit mb-6">Activity Overview</h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400 font-geist">
                                            {user?.activityStats?.projectsPosted || 0}
                                        </div>
                                        <div className="text-sm text-gray-400 font-inter">Projects Posted</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-400 font-geist">
                                            {user?.activityStats?.projectsCompleted || 0}
                                        </div>
                                        <div className="text-sm text-gray-400 font-inter">Projects Completed</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-400 font-geist">
                                            {user?.activityStats?.ordersPlaced || 0}
                                        </div>
                                        <div className="text-sm text-gray-400 font-inter">Orders Placed</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-400 font-geist">
                                            ${user?.activityStats?.totalEarned || 0}
                                        </div>
                                        <div className="text-sm text-gray-400 font-inter">Total Earned</div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Completion Tasks */}
                            {profileCompletion < 100 && (
                                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                        <h3 className="text-lg font-bold font-outfit">Complete Your Profile</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {!user?.phone && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-300 flex-1">Add your phone number</span>
                                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                                    Add →
                                                </button>
                                            </div>
                                        )}

                                        {!user?.address && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-300 flex-1">Add your address</span>
                                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                                    Add →
                                                </button>
                                            </div>
                                        )}

                                        {user?.canFreelance && !user?.freelancerProfile?.profileCompleted && (
                                            <>
                                                {(!user?.freelancerProfile?.skills || user.freelancerProfile.skills.length === 0) && (
                                                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                                        <TrendingUp className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-300 flex-1">Add your skills</span>
                                                        <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                                                            Add →
                                                        </button>
                                                    </div>
                                                )}

                                                {user?.freelancerProfile?.hourlyRate === 0 && (
                                                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                                        <TrendingUp className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-300 flex-1">Set your hourly rate</span>
                                                        <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                                                            Set →
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
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
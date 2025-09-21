// app/dashboard/page.js
"use client";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
    User, Mail, Phone, MapPin, Calendar, Shield, LogOut, Briefcase, Play, ShoppingCart,
    Star, TrendingUp, CheckCircle, AlertTriangle, Home, Settings, Package, FileText,
    CreditCard, MessageSquare, BarChart3, Users, PlusCircle, Eye, Heart, Clock,
    Menu, X, Bell, Search
} from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
    const { user, logout, enableFreelancerMode, profileCompletion } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    // Navigation items based on user role and status
    const navigationItems = [
        { id: 'overview', label: 'Overview', icon: Home, description: 'Dashboard overview' },
        { id: 'projects', label: 'Projects', icon: Briefcase, description: 'Manage your projects' },
        { id: 'orders', label: 'Orders', icon: Package, description: 'Track your orders' },
        { id: 'profile', label: 'Profile', icon: User, description: 'Edit your profile' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'Your conversations' },
        { id: 'favorites', label: 'Favorites', icon: Heart, description: 'Saved items' },
        { id: 'settings', label: 'Settings', icon: Settings, description: 'Account settings' },
    ];

    // Add freelancer-specific items
    if (user?.canFreelance) {
        navigationItems.splice(2, 0,
            { id: 'freelancer', label: 'Freelancer Hub', icon: Star, description: 'Freelancer dashboard' }
        );
    }

    // Add admin-specific items
    if (user?.role === 'admin') {
        navigationItems.push(
            { id: 'admin', label: 'Admin Panel', icon: Shield, description: 'Platform management' }
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverviewTab();
            case 'projects':
                return renderProjectsTab();
            case 'orders':
                return renderOrdersTab();
            case 'freelancer':
                return renderFreelancerTab();
            case 'profile':
                return renderProfileTab();
            case 'messages':
                return renderMessagesTab();
            case 'favorites':
                return renderFavoritesTab();
            case 'settings':
                return renderSettingsTab();
            case 'admin':
                return renderAdminTab();
            default:
                return renderOverviewTab();
        }
    };

    const renderOverviewTab = () => (
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

            {/* Activity Stats */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold font-outfit mb-6">Activity Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400 font-geist">
                            {user?.activityStats?.projectsPosted || 0}
                        </div>
                        <div className="text-sm text-gray-400 font-inter">Projects Posted</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-green-400 font-geist">
                            {user?.activityStats?.projectsCompleted || 0}
                        </div>
                        <div className="text-sm text-gray-400 font-inter">Projects Completed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400 font-geist">
                            {user?.activityStats?.ordersPlaced || 0}
                        </div>
                        <div className="text-sm text-gray-400 font-inter">Orders Placed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400 font-geist">
                            ${user?.activityStats?.totalEarned || 0}
                        </div>
                        <div className="text-sm text-gray-400 font-inter">Total Earned</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold font-outfit mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/projects/create" className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 hover:bg-blue-600/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <PlusCircle className="w-5 h-5 text-blue-400" />
                            <h4 className="font-semibold text-blue-400 font-outfit">Post Project</h4>
                        </div>
                        <p className="text-sm text-gray-300 font-inter">
                            Hire freelancers for your video projects
                        </p>
                    </Link>

                    <Link href="/products" className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4 hover:bg-purple-600/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <ShoppingCart className="w-5 h-5 text-purple-400" />
                            <h4 className="font-semibold text-purple-400 font-outfit">Shop Displays</h4>
                        </div>
                        <p className="text-sm text-gray-300 font-inter">
                            Browse premium LED displays
                        </p>
                    </Link>

                    <Link href="/projects" className="bg-green-600/10 border border-green-600/20 rounded-lg p-4 hover:bg-green-600/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <Eye className="w-5 h-5 text-green-400" />
                            <h4 className="font-semibold text-green-400 font-outfit">Browse Projects</h4>
                        </div>
                        <p className="text-sm text-gray-300 font-inter">
                            Find exciting freelance opportunities
                        </p>
                    </Link>
                </div>
            </div>

            {/* Profile Completion Tasks */}
            {profileCompletion < 100 && (
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-lg font-bold font-outfit">Complete Your Profile</h3>
                        <span className="ml-auto text-sm text-gray-400">{profileCompletion}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                        <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${profileCompletion}%` }}
                        ></div>
                    </div>
                    <div className="space-y-3">
                        {!user?.phone && (
                            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-300 flex-1">Add your phone number</span>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                >
                                    Add →
                                </button>
                            </div>
                        )}
                        {!user?.address && (
                            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-300 flex-1">Add your address</span>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                >
                                    Add →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const renderProjectsTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-space">My Projects</h2>
                <Link href="/projects/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Post New Project
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2 font-geist">
                        {user?.activityStats?.projectsPosted || 0}
                    </div>
                    <p className="text-gray-400 font-inter">Projects Posted</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2 font-geist">
                        {user?.activityStats?.projectsCompleted || 0}
                    </div>
                    <p className="text-gray-400 font-inter">Completed</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2 font-geist">
                        {user?.activityStats?.projectsActive || 0}
                    </div>
                    <p className="text-gray-400 font-inter">Active</p>
                </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold font-outfit mb-4">Recent Projects</h3>
                <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 font-inter">No projects yet. Start by posting your first project!</p>
                    <Link href="/projects/create" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                        Post Your First Project
                    </Link>
                </div>
            </div>
        </div>
    );

    const renderOrdersTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-space">My Orders</h2>
                <Link href="/products" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Browse Products
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2 font-geist">
                        {user?.activityStats?.ordersPlaced || 0}
                    </div>
                    <p className="text-gray-400 font-inter">Total Orders</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2 font-geist">
                        ${user?.activityStats?.totalSpent || 0}
                    </div>
                    <p className="text-gray-400 font-inter">Total Spent</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2 font-geist">
                        {user?.activityStats?.ordersActive || 0}
                    </div>
                    <p className="text-gray-400 font-inter">Active Orders</p>
                </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold font-outfit mb-4">Order History</h3>
                <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 font-inter">No orders yet. Start shopping for LED displays!</p>
                    <Link href="/products" className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );

    const renderFreelancerTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-space">Freelancer Hub</h2>
                <div className="flex gap-2">
                    <Link href="/projects" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Browse Projects
                    </Link>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Edit Portfolio
                    </button>
                </div>
            </div>

            {user?.freelancerProfile ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                            <div className="flex items-center justify-center gap-1 mb-2">
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <span className="text-2xl font-bold text-yellow-400 font-geist">
                                    {user.freelancerProfile.rating?.average?.toFixed(1) || '0.0'}
                                </span>
                            </div>
                            <p className="text-gray-400 font-inter">Rating</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                            <div className="text-2xl font-bold text-green-400 mb-2 font-geist">
                                {user.freelancerProfile.completedProjects || 0}
                            </div>
                            <p className="text-gray-400 font-inter">Projects Done</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-2 font-geist">
                                ${user.freelancerProfile.hourlyRate || 0}
                            </div>
                            <p className="text-gray-400 font-inter">Hourly Rate</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.freelancerProfile.availability === 'available'
                                    ? 'bg-green-600 text-white'
                                    : user.freelancerProfile.availability === 'busy'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-red-600 text-white'
                                }`}>
                                {user.freelancerProfile.availability || 'Not Set'}
                            </div>
                            <p className="text-gray-400 font-inter mt-2">Status</p>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                        <h3 className="text-lg font-bold font-outfit mb-4">Active Proposals</h3>
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 font-inter">No active proposals. Browse projects to submit proposals!</p>
                            <Link href="/projects" className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                Find Projects
                            </Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-4 font-outfit">Complete Your Freelancer Profile</h3>
                    <p className="text-gray-400 mb-6 font-inter">Set up your freelancer profile to start earning money!</p>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Complete Profile
                    </button>
                </div>
            )}
        </div>
    );

    const renderProfileTab = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-space">Profile Settings</h2>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold font-outfit mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 font-outfit">Full Name</label>
                        <input
                            type="text"
                            value={user?.name || ''}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-inter"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 font-outfit">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-inter"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 font-outfit">Phone</label>
                        <input
                            type="tel"
                            placeholder="Add your phone number"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-inter"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 font-outfit">Address</label>
                        <input
                            type="text"
                            placeholder="Add your address"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-inter"
                        />
                    </div>
                </div>
                <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Update Profile
                </button>
            </div>

            {user?.canFreelance && (
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                    <h3 className="text-lg font-bold font-outfit mb-6">Freelancer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 font-outfit">Hourly Rate ($)</label>
                            <input
                                type="number"
                                placeholder="Set your hourly rate"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-inter"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 font-outfit">Availability</label>
                            <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-inter">
                                <option value="available">Available</option>
                                <option value="busy">Busy</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 font-outfit">Bio</label>
                            <textarea
                                rows={4}
                                placeholder="Tell clients about your experience and skills"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-inter"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 font-outfit">Skills</label>
                            <input
                                type="text"
                                placeholder="Video Editing, Motion Graphics, Color Grading..."
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-inter"
                            />
                        </div>
                    </div>
                    <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Update Freelancer Profile
                    </button>
                </div>
            )}
        </div>
    );

    const renderMessagesTab = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-space">Messages</h2>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 font-inter">No messages yet. Start a conversation with clients or freelancers!</p>
                </div>
            </div>
        </div>
    );

    const renderFavoritesTab = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-space">Favorites</h2>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 font-inter">No favorites yet. Save your favorite projects, products, or freelancers!</p>
                </div>
            </div>
        </div>
    );

    const renderSettingsTab = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-space">Account Settings</h2>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold font-outfit mb-6">Notifications</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-inter">Email notifications</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-inter">Project updates</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-inter">Order updates</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold font-outfit mb-6">Privacy & Security</h3>
                <div className="space-y-4">
                    <button className="w-full text-left p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="font-inter">Change Password</span>
                            <span className="text-gray-400">→</span>
                        </div>
                    </button>
                    <button className="w-full text-left p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="font-inter">Two-Factor Authentication</span>
                            <span className="text-gray-400">→</span>
                        </div>
                    </button>
                    <button className="w-full text-left p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="font-inter">Privacy Settings</span>
                            <span className="text-gray-400">→</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAdminTab = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-space">Admin Panel</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold font-outfit mb-2">Users</h3>
                    <p className="text-gray-400 text-sm font-inter mb-4">Manage platform users</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Manage Users
                    </button>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <Package className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold font-outfit mb-2">Products</h3>
                    <p className="text-gray-400 text-sm font-inter mb-4">Manage LED displays</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Manage Products
                    </button>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
                    <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold font-outfit mb-2">Analytics</h3>
                    <p className="text-gray-400 text-sm font-inter mb-4">Platform insights</p>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        View Analytics
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header with Mobile Menu Toggle */}
            <div className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                            <h1 className="text-xl font-bold font-space">Hey Humanz Dashboard</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 text-gray-300 hover:text-white transition-colors">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-300 hover:text-white transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar Navigation */}
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out`}>
                    <div className="flex flex-col h-full">
                        {/* Profile Section */}
                        <div className="p-6 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate font-outfit">
                                        {user?.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${user?.role === 'admin'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-blue-600 text-white'
                                            }`}>
                                            {user?.role}
                                        </span>
                                        {user?.canFreelance && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-600 text-white">
                                                Freelancer
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-400 font-inter">Profile Complete</span>
                                    <span className="text-xs text-blue-400 font-inter">{profileCompletion}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${profileCompletion}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {navigationItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                        <span className="font-inter">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Freelancer Mode Toggle */}
                        {!user?.canFreelance && (
                            <div className="p-4 border-t border-gray-800">
                                <button
                                    onClick={handleEnableFreelancer}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Enable Freelancer Mode
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {renderTabContent()}
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
"use client";
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import LoadingComponent from '@/components/ui/LoadingComponent';
import { Bell, MessageSquare, X } from 'lucide-react';

export default function ConditionalLayout({ children }) {
    const { user, loading, isAuthenticated, notifications } = useAuth();
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Pages that should have minimal layout (auth pages)
    const authPages = ['/login', '/signup', '/forgot-password', '/verify-email'];
    const isAuthPage = authPages.some(page => pathname.startsWith(page));

    // Pages that should be full-width without footer
    const fullWidthPages = ['/dashboard', '/admin'];
    const isFullWidthPage = fullWidthPages.some(page => pathname.startsWith(page));

    // Pages that should hide navbar
    const noNavPages = ['/unauthorized'];
    const shouldHideNav = noNavPages.includes(pathname);

    useEffect(() => {
        if (notifications) {
            setUnreadCount(notifications.filter(n => !n.read).length);
        }
    }, [notifications]);

    // Show loading for initial page load
    if (loading && pathname !== '/') {
        return (
            <LoadingComponent
                fullScreen={true}
                message="Loading..."
                showLogo={true}
                size="large"
                variant="spinner"
            />
        );
    }

    // Minimal layout for auth pages
    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="flex flex-col min-h-screen">
                    {children}
                </div>
            </div>
        );
    }

    // Full-width layout for dashboard and admin
    if (isFullWidthPage) {
        return (
            <div className="min-h-screen bg-black text-white">
                {/* Optional: Compact header for dashboard pages */}
                {isAuthenticated && (
                    <NotificationOverlay
                        show={showNotifications}
                        onClose={() => setShowNotifications(false)}
                        notifications={notifications}
                    />
                )}
                {children}
            </div>
        );
    }

    // Standard layout with conditional navigation
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navbar - conditionally rendered */}
            {!shouldHideNav && (
                <div className="relative">
                    <Navbar />

                    {/* Floating notifications for authenticated users */}
                    {isAuthenticated && unreadCount > 0 && (
                        <button
                            onClick={() => setShowNotifications(true)}
                            className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        </button>
                    )}
                </div>
            )}

            {/* Main content area */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer - conditionally rendered */}
            {!isFullWidthPage && !shouldHideNav && (
                <FooterSection />
            )}

            {/* Notification overlay for authenticated users */}
            {isAuthenticated && (
                <NotificationOverlay
                    show={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    notifications={notifications}
                />
            )}

            {/* Quick access floating buttons for authenticated users */}
            {isAuthenticated && !isFullWidthPage && pathname === '/' && (
                <QuickAccessButtons user={user} />
            )}
        </div>
    );
}

// Notification overlay component
function NotificationOverlay({ show, onClose, notifications = [] }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-end p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md mt-16 max-h-96 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-lg font-bold font-outfit">Notifications</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-80">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div
                                key={index}
                                className={`p-4 border-b border-gray-800 last:border-b-0 ${!notification.read ? 'bg-blue-600/10' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-400' : 'bg-gray-600'
                                        }`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium font-inter">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 font-inter">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2 font-inter">
                                            {notification.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 font-inter">No notifications yet</p>
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="p-4 border-t border-gray-800">
                        <button className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium">
                            Mark all as read
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Quick access buttons for homepage
function QuickAccessButtons({ user }) {
    const [expanded, setExpanded] = useState(false);

    const quickActions = [
        {
            label: 'Messages',
            icon: MessageSquare,
            href: '/dashboard?tab=messages',
            color: 'bg-blue-600 hover:bg-blue-700',
            show: true
        },
        {
            label: 'Post Project',
            icon: () => (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            ),
            href: '/projects/create',
            color: 'bg-green-600 hover:bg-green-700',
            show: true
        },
        {
            label: 'Browse Projects',
            icon: () => (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            href: '/projects',
            color: 'bg-purple-600 hover:bg-purple-700',
            show: user?.canFreelance
        }
    ].filter(action => action.show);

    return (
        <div className="fixed bottom-6 right-6 z-40">
            <div className={`flex flex-col-reverse gap-3 transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <a
                            key={index}
                            href={action.href}
                            className={`${action.color} text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 group`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <Icon />
                            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-200 text-sm font-medium">
                                {action.label}
                            </span>
                        </a>
                    );
                })}
            </div>

            <button
                onClick={() => setExpanded(!expanded)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 mt-3"
            >
                <svg
                    className={`w-6 h-6 transition-transform duration-200 ${expanded ? 'rotate-45' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}

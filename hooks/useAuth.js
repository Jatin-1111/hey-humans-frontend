// hooks/useAuth.js
"use client";
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Token is invalid
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    // NEW: Update user data without full re-auth
    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    // NEW: Enable freelancer mode
    const enableFreelancerMode = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    freelancerProfile: {
                        isFreelancer: true
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                updateUser(data.user);
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.error };
            }
        } catch (error) {
            console.error('Enable freelancer mode failed:', error);
            return { success: false, error: 'Network error' };
        }
    };

    // NEW: Update freelancer profile
    const updateFreelancerProfile = async (profileData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    freelancerProfile: profileData
                })
            });

            if (response.ok) {
                const data = await response.json();
                updateUser(data.user);
                return { success: true, user: data.user };
            } else {
                const error = await response.json();
                return { success: false, error: error.error };
            }
        } catch (error) {
            console.error('Update freelancer profile failed:', error);
            return { success: false, error: 'Network error' };
        }
    };

    // NEW: Update basic profile
    const updateProfile = async (profileData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                const data = await response.json();
                updateUser(data.user);
                return { success: true, user: data.user };
            } else {
                const error = await response.json();
                return { success: false, error: error.error };
            }
        } catch (error) {
            console.error('Update profile failed:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        updateProfile,
        enableFreelancerMode,
        updateFreelancerProfile,

        // Enhanced user state checks
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        canFreelance: user?.canFreelance || false,
        isFreelancerProfileComplete: user?.freelancerProfile?.profileCompleted || false,
        profileCompletion: user?.profileCompletion || 0,

        // User capabilities
        canPostProjects: !!user, // Any user can post projects
        canBidOnProjects: user?.canFreelance || false,
        canShopMarketplace: !!user, // Any user can shop

        // User activity stats
        activityStats: user?.activityStats || {
            projectsPosted: 0,
            projectsCompleted: 0,
            ordersPlaced: 0,
            totalSpent: 0,
            totalEarned: 0
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
"use client";
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
// Remove: import jwt from 'jsonwebtoken'; ❌

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // ✅ FIXED: Manual JWT decode (browser-safe)
    const decodeToken = (token) => {
        try {
            // Split JWT into parts
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            // Decode payload (middle part)
            const payload = parts[1];

            // Add padding if needed
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);

            // Decode base64
            const decoded = JSON.parse(atob(paddedPayload));

            // Check expiration
            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                console.log('Token expired');
                return null;
            }

            // Return user data from token
            return {
                id: decoded.userId,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
                phone: decoded.phone,
                address: decoded.address,
                isVerified: decoded.verified,
                createdAt: decoded.createdAt,
                lastLogin: decoded.lastLogin,
                canFreelance: decoded.canFreelance,
                freelancerProfile: decoded.freelancerProfile,
                activityStats: decoded.activityStats,
                profileCompletion: decoded.profileCompletion
            };
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log('No token found');
                setUser(null);
                setLoading(false);
                return;
            }

            const userData = decodeToken(token);

            if (userData) {
                console.log('✅ User authenticated:', userData.email);
                setUser(userData);
            } else {
                console.log('❌ Invalid/expired token');
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (token) => {
        console.log('🔐 Logging in with token');
        localStorage.setItem('token', token);
        const userData = decodeToken(token);
        if (userData) {
            setUser(userData);
            console.log('✅ Login successful:', userData.email);
        } else {
            console.error('❌ Invalid token received');
        }
    };

    const logout = () => {
        console.log('🚪 Logging out');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        canFreelance: user?.canFreelance || false,
        profileCompletion: user?.profileCompletion || 0,
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
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function authenticate(req) {
    try {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { success: false, error: 'No token provided' };
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return { success: false, error: 'No token provided' };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get fresh user data from database
        await connectDB();
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (!user.isVerified) {
            return { success: false, error: 'Email not verified' };
        }

        return {
            success: true,
            user: user,
            decoded: decoded
        };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { success: false, error: 'Token expired' };
        }

        if (error.name === 'JsonWebTokenError') {
            return { success: false, error: 'Invalid token' };
        }

        return { success: false, error: 'Authentication failed' };
    }
}

export async function requireAuth(req, allowedRoles = []) {
    const authResult = await authenticate(req);

    if (!authResult.success) {
        return authResult;
    }

    // Check role if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(authResult.user.role)) {
        return { success: false, error: 'Insufficient permissions' };
    }

    return authResult;
}

// Helper function to extract user from token (for API routes)
export async function getUserFromRequest(req) {
    const authResult = await authenticate(req);
    if (!authResult.success) {
        throw new Error(authResult.error);
    }
    return authResult.user;
}

// Helper function to generate JWT token
export function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            address: user.address,
            verified: user.isVerified,
            profileCompletion: user.profileCompletion,
            canFreelance: user.freelancerProfile?.isFreelancer || false,
            freelancerProfile: user.freelancerProfile?.isFreelancer ? {
                skills: user.freelancerProfile.skills,
                hourlyRate: user.freelancerProfile.hourlyRate,
                bio: user.freelancerProfile.bio,
                rating: user.freelancerProfile.rating,
                availability: user.freelancerProfile.availability,
                profileCompleted: user.freelancerProfile.profileCompleted,
                completedProjects: user.freelancerProfile.completedProjects
            } : null,
            activityStats: user.activityStats,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
}

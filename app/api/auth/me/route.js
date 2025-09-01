// app/api/auth/me/route.js
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const authResult = await authenticate(req);

        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(authResult.user.userId)
            .select('-password -verificationToken -passwordResetToken -passwordResetExpires');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Enhanced user data response
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,

            // Freelancer capabilities
            canFreelance: user.freelancerProfile?.isFreelancer || false,
            freelancerProfile: user.freelancerProfile?.isFreelancer ? {
                skills: user.freelancerProfile.skills,
                portfolio: user.freelancerProfile.portfolio,
                hourlyRate: user.freelancerProfile.hourlyRate,
                bio: user.freelancerProfile.bio,
                rating: user.freelancerProfile.rating,
                availability: user.freelancerProfile.availability,
                profileCompleted: user.freelancerProfile.profileCompleted,
                completedProjects: user.freelancerProfile.completedProjects
            } : null,

            // Activity stats
            activityStats: user.activityStats,

            // Profile completion percentage
            profileCompletion: user.profileCompletion
        };

        // Calculate recommendations/next steps
        const recommendations = [];

        if (user.profileCompletion < 100) {
            if (!user.phone) recommendations.push({ type: 'profile', action: 'add_phone', message: 'Add your phone number' });
            if (!user.address) recommendations.push({ type: 'profile', action: 'add_address', message: 'Add your address' });
        }

        if (user.freelancerProfile?.isFreelancer && !user.freelancerProfile.profileCompleted) {
            if (!user.freelancerProfile.bio) recommendations.push({ type: 'freelancer', action: 'add_bio', message: 'Add your professional bio' });
            if (!user.freelancerProfile.skills || user.freelancerProfile.skills.length === 0) recommendations.push({ type: 'freelancer', action: 'add_skills', message: 'Add your skills' });
            if (user.freelancerProfile.hourlyRate === 0) recommendations.push({ type: 'freelancer', action: 'set_rate', message: 'Set your hourly rate' });
            if (!user.freelancerProfile.portfolio || user.freelancerProfile.portfolio.length === 0) recommendations.push({ type: 'freelancer', action: 'add_portfolio', message: 'Add portfolio items' });
        }

        // Suggest freelancer mode if not enabled but user is active
        if (!user.freelancerProfile?.isFreelancer && user.activityStats.projectsPosted > 2) {
            recommendations.push({ type: 'suggestion', action: 'enable_freelancer', message: 'Start offering your services as a freelancer' });
        }

        return NextResponse.json(
            {
                user: userData,
                recommendations,

                // Dashboard insights
                insights: {
                    isNewUser: !user.lastLogin || (Date.now() - new Date(user.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000), // Less than 7 days old
                    profileStrength: user.profileCompletion,
                    totalActivity: user.activityStats.projectsPosted + user.activityStats.projectsCompleted + user.activityStats.ordersPlaced,
                    canEarnMoney: user.freelancerProfile?.isFreelancer && user.freelancerProfile.profileCompleted,
                    suggestedActions: recommendations.slice(0, 3) // Top 3 recommendations
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// New PUT endpoint to update user profile
export async function PUT(req) {
    try {
        const authResult = await authenticate(req);

        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(authResult.user.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const updates = await req.json();
        const allowedUpdates = ['name', 'phone', 'address', 'freelancerProfile'];
        const actualUpdates = {};

        // Process basic profile updates
        for (const key of allowedUpdates) {
            if (updates[key] !== undefined && key !== 'freelancerProfile') {
                actualUpdates[key] = updates[key];
            }
        }

        // Handle freelancer profile updates
        if (updates.freelancerProfile) {
            const freelancerUpdates = updates.freelancerProfile;
            const allowedFreelancerFields = ['isFreelancer', 'skills', 'hourlyRate', 'bio', 'availability'];

            if (!user.freelancerProfile) {
                user.freelancerProfile = {
                    isFreelancer: false,
                    skills: [],
                    portfolio: [],
                    hourlyRate: 0,
                    bio: '',
                    rating: { average: 0, count: 0 },
                    availability: 'available',
                    profileCompleted: false,
                    completedProjects: 0
                };
            }

            for (const field of allowedFreelancerFields) {
                if (freelancerUpdates[field] !== undefined) {
                    user.freelancerProfile[field] = freelancerUpdates[field];
                }
            }

            // Handle portfolio updates separately (array of objects)
            if (freelancerUpdates.portfolio) {
                user.freelancerProfile.portfolio = freelancerUpdates.portfolio;
            }
        }

        // Apply updates to user
        Object.assign(user, actualUpdates);

        // Save and let pre-save middleware handle profile completion
        await user.save();

        // Return updated user data
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            canFreelance: user.freelancerProfile?.isFreelancer || false,
            freelancerProfile: user.freelancerProfile?.isFreelancer ? {
                skills: user.freelancerProfile.skills,
                portfolio: user.freelancerProfile.portfolio,
                hourlyRate: user.freelancerProfile.hourlyRate,
                bio: user.freelancerProfile.bio,
                rating: user.freelancerProfile.rating,
                availability: user.freelancerProfile.availability,
                profileCompleted: user.freelancerProfile.profileCompleted
            } : null,
            profileCompletion: user.profileCompletion,
            updatedAt: user.updatedAt
        };

        return NextResponse.json(
            {
                message: 'Profile updated successfully',
                user: userData
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Profile update error:', error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(e => e.message);
            return NextResponse.json(
                { error: 'Validation failed', details: validationErrors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
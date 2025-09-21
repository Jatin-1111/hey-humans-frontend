// app/api/users/portfolio/route.js - Freelancer portfolio management
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { User } from '@/models/User';

// GET - Get freelancer portfolio
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        let targetUserId;
        if (userId) {
            // Public portfolio view
            targetUserId = userId;
        } else {
            // Own portfolio
            const authResult = await authenticate(req);
            if (!authResult.success) {
                return NextResponse.json(
                    { error: authResult.error },
                    { status: 401 }
                );
            }
            targetUserId = authResult.user.userId;
        }

        const user = await User.findById(targetUserId)
            .select('name email freelancerProfile activityStats createdAt');

        if (!user || !user.freelancerProfile?.isFreelancer) {
            return NextResponse.json(
                { error: 'Freelancer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            freelancer: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile: user.freelancerProfile,
                stats: user.activityStats,
                memberSince: user.createdAt,
                profileCompletion: user.profileCompletion
            }
        });

    } catch (error) {
        console.error('Portfolio fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch portfolio' },
            { status: 500 }
        );
    }
}

// PUT - Update freelancer portfolio
export async function PUT(req) {
    try {
        await connectDB();

        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        const user = await User.findById(authResult.user.userId);
        if (!user.freelancerProfile?.isFreelancer) {
            return NextResponse.json(
                { error: 'User is not a freelancer' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const {
            bio,
            skills,
            hourlyRate,
            portfolio,
            availability,
            services
        } = body;

        const updateData = {
            'freelancerProfile.bio': bio,
            'freelancerProfile.skills': skills,
            'freelancerProfile.hourlyRate': hourlyRate,
            'freelancerProfile.portfolio': portfolio,
            'freelancerProfile.availability': availability,
            'freelancerProfile.services': services,
            updatedAt: new Date()
        };

        const updatedUser = await User.findByIdAndUpdate(
            authResult.user.userId,
            { $set: updateData },
            { new: true }
        ).select('-password -verificationToken -passwordResetToken');

        return NextResponse.json({
            message: 'Portfolio updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Portfolio update error:', error);
        return NextResponse.json(
            { error: 'Failed to update portfolio' },
            { status: 500 }
        );
    }
}

// POST - Add portfolio item
export async function POST(req) {
    try {
        await connectDB();

        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        const user = await User.findById(authResult.user.userId);
        if (!user.freelancerProfile?.isFreelancer) {
            return NextResponse.json(
                { error: 'User is not a freelancer' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { title, url, description, thumbnail, category } = body;

        if (!title || !url) {
            return NextResponse.json(
                { error: 'Title and URL are required' },
                { status: 400 }
            );
        }

        const portfolioItem = {
            title,
            url,
            description: description || '',
            thumbnail: thumbnail || '',
            category: category || 'video-editing',
            createdAt: new Date()
        };

        await User.findByIdAndUpdate(
            authResult.user.userId,
            {
                $push: { 'freelancerProfile.portfolio': portfolioItem },
                $set: { updatedAt: new Date() }
            }
        );

        return NextResponse.json({
            message: 'Portfolio item added successfully',
            portfolioItem
        });

    } catch (error) {
        console.error('Portfolio item creation error:', error);
        return NextResponse.json(
            { error: 'Failed to add portfolio item' },
            { status: 500 }
        );
    }
}

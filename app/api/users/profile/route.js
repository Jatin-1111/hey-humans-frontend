// app/api/users/profile/route.js - Extended profile management
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { User } from '@/models/User';
import { validateData, userValidation, createResponse } from '@/lib/validation';

// GET - Get user profile
export async function GET(req) {
    try {
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                createResponse(null, authResult.error, false, 401),
                { status: 401 }
            );
        }

        const user = authResult.user;

        // Return user profile data
        const profileData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            isVerified: user.isVerified,
            profileCompletion: user.profileCompletion,
            freelancerProfile: user.freelancerProfile,
            activityStats: user.activityStats,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        };

        return NextResponse.json(
            createResponse(profileData, 'Profile retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to retrieve profile', false, 500),
            { status: 500 }
        );
    }
}

// PUT - Update user profile
export async function PUT(req) {
    try {
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                createResponse(null, authResult.error, false, 401),
                { status: 401 }
            );
        }

        const user = authResult.user;
        const body = await req.json();

        // Validate input data
        const validatedData = validateData(userValidation.profile, body);

        await connectDB();

        // Update basic profile fields
        const updateFields = {};
        if (validatedData.name) updateFields.name = validatedData.name;
        if (validatedData.phone) updateFields.phone = validatedData.phone;
        if (validatedData.address) updateFields.address = validatedData.address;

        // Update freelancer profile fields if user is a freelancer
        if (user.freelancerProfile?.isFreelancer) {
            if (validatedData.bio !== undefined) {
                updateFields['freelancerProfile.bio'] = validatedData.bio;
            }
            if (validatedData.skills) {
                updateFields['freelancerProfile.skills'] = validatedData.skills;
            }
            if (validatedData.hourlyRate !== undefined) {
                updateFields['freelancerProfile.hourlyRate'] = validatedData.hourlyRate;
            }
            if (validatedData.availability) {
                updateFields['freelancerProfile.availability'] = validatedData.availability;
            }
        }

        updateFields.updatedAt = new Date();

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json(
                createResponse(null, 'User not found', false, 404),
                { status: 404 }
            );
        }

        return NextResponse.json(
            createResponse(updatedUser, 'Profile updated successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Update profile error:', error);

        if (error.message.includes('validation')) {
            return NextResponse.json(
                createResponse(null, 'Validation failed', false, 400),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse(null, 'Failed to update profile', false, 500),
            { status: 500 }
        );
    }
}

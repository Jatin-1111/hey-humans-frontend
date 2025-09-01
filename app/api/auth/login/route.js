// app/api/auth/login/route.js
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user with populated freelancer profile
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if verified
        if (!user.isVerified) {
            return NextResponse.json(
                {
                    error: 'Please verify your email before logging in',
                    requiresVerification: true,
                    email: user.email
                },
                { status: 401 }
            );
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT with enhanced payload
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
                verified: user.isVerified,
                canFreelance: user.freelancerProfile?.isFreelancer || false,
                profileCompleted: user.freelancerProfile?.profileCompleted || false
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update last login
        user.lastLogin = new Date();
        user.updatedAt = new Date();
        await user.save();

        // Enhanced user response data
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
                hourlyRate: user.freelancerProfile.hourlyRate,
                bio: user.freelancerProfile.bio,
                rating: user.freelancerProfile.rating,
                availability: user.freelancerProfile.availability,
                profileCompleted: user.freelancerProfile.profileCompleted,
                completedProjects: user.freelancerProfile.completedProjects
            } : null,

            // Activity stats
            activityStats: user.activityStats,

            // Profile completion
            profileCompletion: user.profileCompletion
        };

        // Determine next steps for user guidance
        const nextSteps = {
            profileCompletion: user.profileCompletion < 100,
            freelancerSetup: user.freelancerProfile?.isFreelancer && !user.freelancerProfile?.profileCompleted,
            addSkills: user.freelancerProfile?.isFreelancer && (!user.freelancerProfile?.skills || user.freelancerProfile.skills.length === 0),
            setHourlyRate: user.freelancerProfile?.isFreelancer && user.freelancerProfile.hourlyRate === 0,
            addPortfolio: user.freelancerProfile?.isFreelancer && (!user.freelancerProfile?.portfolio || user.freelancerProfile.portfolio.length === 0)
        };

        return NextResponse.json(
            {
                message: 'Login successful',
                token,
                user: userData,
                nextSteps,

                // Dashboard insights
                dashboardData: {
                    totalProjects: user.activityStats.projectsPosted + user.activityStats.projectsCompleted,
                    totalOrders: user.activityStats.ordersPlaced,
                    canFreelance: user.freelancerProfile?.isFreelancer || false,
                    isAdmin: user.role === 'admin'
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
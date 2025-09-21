// app/api/bids/route.js - Bid management for freelancers
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Bid } from '@/models/Bid';
import { Project } from '@/models/Project';
import { User } from '@/models/User';
import { validateData, bidValidation, createResponse } from '@/lib/validation';

// GET - Get bids for a project or by a freelancer
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('project') || searchParams.get('projectId');
        const freelancerId = searchParams.get('freelancer') || searchParams.get('freelancerId');
        const userId = searchParams.get('user');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        let query = {};

        if (projectId) query.project = projectId;
        if (freelancerId) query.freelancer = freelancerId;
        if (userId) query.freelancer = userId;
        if (status) query.status = status;

        const skip = (page - 1) * limit;

        const bids = await Bid.find(query)
            .populate('freelancer', 'name email freelancerProfile')
            .populate('project', 'title budget status client')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Bid.countDocuments(query);

        // Add calculated fields
        const bidsWithTimeAgo = bids.map(bid => ({
            ...bid,
            timeAgo: getTimeAgo(bid.createdAt)
        }));

        const response = {
            bids: bidsWithTimeAgo,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };

        return NextResponse.json(
            createResponse(response, 'Bids retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Get bids error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to retrieve bids', false, 500),
            { status: 500 }
        );
    }
}

// POST - Submit a bid (Freelancers only)
export async function POST(req) {
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

        await connectDB();

        // Validate input data
        const validatedData = validateData(bidValidation.create, body);

        // Check if project exists and is open for bidding
        const project = await Project.findById(validatedData.project);
        if (!project) {
            return NextResponse.json(
                createResponse(null, 'Project not found', false, 404),
                { status: 404 }
            );
        }

        if (project.status !== 'open') {
            return NextResponse.json(
                createResponse(null, 'Project is not open for bidding', false, 400),
                { status: 400 }
            );
        }

        // Check if user is the project owner
        if (project.client.toString() === user._id.toString()) {
            return NextResponse.json(
                createResponse(null, 'Cannot bid on your own project', false, 400),
                { status: 400 }
            );
        }

        // Check if user has already bid on this project
        const existingBid = await Bid.findOne({
            project: validatedData.project,
            freelancer: user._id
        });

        if (existingBid) {
            return NextResponse.json(
                createResponse(null, 'You have already bid on this project', false, 400),
                { status: 400 }
            );
        }

        // Check if user is a freelancer
        if (!user.freelancerProfile || !user.freelancerProfile.isFreelancer) {
            return NextResponse.json(
                createResponse(null, 'Only freelancers can place bids', false, 403),
                { status: 403 }
            );
        }

        // Create new bid
        const bid = new Bid({
            project: validatedData.project,
            freelancer: user._id,
            amount: validatedData.amount,
            deliveryTime: validatedData.deliveryTime,
            proposal: validatedData.proposal,
            milestones: validatedData.milestones || [],
            status: 'pending'
        });

        await bid.save();

        // Add bid to project's bids array
        await Project.findByIdAndUpdate(
            validatedData.project,
            {
                $push: { bids: bid._id },
                $set: { lastActivity: new Date() }
            }
        );

        // Populate bid data for response
        const populatedBid = await Bid.findById(bid._id)
            .populate('freelancer', 'name email freelancerProfile')
            .populate('project', 'title budget');

        return NextResponse.json(
            createResponse(populatedBid, 'Bid placed successfully'),
            { status: 201 }
        );

    } catch (error) {
        console.error('Create bid error:', error);

        if (error.message.includes('validation')) {
            return NextResponse.json(
                createResponse(null, 'Validation failed', false, 400),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse(null, 'Failed to place bid', false, 500),
            { status: 500 }
        );
    }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
}

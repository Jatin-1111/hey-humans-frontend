import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Bid } from '@/models/Bid';
import { Project } from '@/models/Project';
import { authenticate } from '@/middleware/auth';
import { validateData, bidValidation, createResponse } from '@/lib/validation';

// GET - Get single bid by ID
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                createResponse(null, 'Bid ID is required', false, 400),
                { status: 400 }
            );
        }

        const bid = await Bid.findById(id)
            .populate('freelancer', 'name email freelancerProfile')
            .populate('project', 'title budget status client')
            .lean();

        if (!bid) {
            return NextResponse.json(
                createResponse(null, 'Bid not found', false, 404),
                { status: 404 }
            );
        }

        // Add calculated fields
        bid.timeAgo = getTimeAgo(bid.createdAt);

        return NextResponse.json(
            createResponse(bid, 'Bid retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Get bid error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to retrieve bid', false, 500),
            { status: 500 }
        );
    }
}

// PUT - Update bid (freelancer can update their own bid if still pending)
export async function PUT(req, { params }) {
    try {
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                createResponse(null, authResult.error, false, 401),
                { status: 401 }
            );
        }

        const user = authResult.user;
        const { id } = params;
        const body = await req.json();

        await connectDB();

        // Check if bid exists
        const existingBid = await Bid.findById(id).populate('project');
        if (!existingBid) {
            return NextResponse.json(
                createResponse(null, 'Bid not found', false, 404),
                { status: 404 }
            );
        }

        // Check ownership (only bid owner can update)
        if (existingBid.freelancer.toString() !== user._id.toString()) {
            return NextResponse.json(
                createResponse(null, 'Not authorized to update this bid', false, 403),
                { status: 403 }
            );
        }

        // Can only update pending bids
        if (existingBid.status !== 'pending') {
            return NextResponse.json(
                createResponse(null, 'Can only update pending bids', false, 400),
                { status: 400 }
            );
        }

        // Check if project is still open
        if (existingBid.project.status !== 'open') {
            return NextResponse.json(
                createResponse(null, 'Project is no longer accepting bid updates', false, 400),
                { status: 400 }
            );
        }

        // Validate input data
        const validatedData = validateData(bidValidation.update, body);

        // Update bid
        const updatedBid = await Bid.findByIdAndUpdate(
            id,
            {
                ...validatedData,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('freelancer', 'name email freelancerProfile')
            .populate('project', 'title budget status');

        return NextResponse.json(
            createResponse(updatedBid, 'Bid updated successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Update bid error:', error);

        if (error.message.includes('validation')) {
            return NextResponse.json(
                createResponse(null, 'Validation failed', false, 400),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse(null, 'Failed to update bid', false, 500),
            { status: 500 }
        );
    }
}

// DELETE - Delete/withdraw bid
export async function DELETE(req, { params }) {
    try {
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                createResponse(null, authResult.error, false, 401),
                { status: 401 }
            );
        }

        const user = authResult.user;
        const { id } = params;

        await connectDB();

        // Check if bid exists
        const bid = await Bid.findById(id).populate('project');
        if (!bid) {
            return NextResponse.json(
                createResponse(null, 'Bid not found', false, 404),
                { status: 404 }
            );
        }

        // Check ownership (only bid owner can delete)
        if (bid.freelancer.toString() !== user._id.toString()) {
            return NextResponse.json(
                createResponse(null, 'Not authorized to delete this bid', false, 403),
                { status: 403 }
            );
        }

        // Can only delete pending bids
        if (bid.status !== 'pending') {
            return NextResponse.json(
                createResponse(null, 'Can only withdraw pending bids', false, 400),
                { status: 400 }
            );
        }

        // Remove bid from project's bids array
        await Project.findByIdAndUpdate(
            bid.project._id,
            { $pull: { bids: id } }
        );

        // Delete the bid
        await Bid.findByIdAndDelete(id);

        return NextResponse.json(
            createResponse(null, 'Bid withdrawn successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Delete bid error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to withdraw bid', false, 500),
            { status: 500 }
        );
    }
}

// PATCH - Accept/reject bid (project owner only)
export async function PATCH(req, { params }) {
    try {
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                createResponse(null, authResult.error, false, 401),
                { status: 401 }
            );
        }

        const user = authResult.user;
        const { id } = params;
        const { action } = await req.json();

        await connectDB();

        // Validate action
        if (!['accept', 'reject'].includes(action)) {
            return NextResponse.json(
                createResponse(null, 'Action must be either "accept" or "reject"', false, 400),
                { status: 400 }
            );
        }

        // Check if bid exists
        const bid = await Bid.findById(id).populate('project');
        if (!bid) {
            return NextResponse.json(
                createResponse(null, 'Bid not found', false, 404),
                { status: 404 }
            );
        }

        // Check if user is the project owner
        if (bid.project.client.toString() !== user._id.toString()) {
            return NextResponse.json(
                createResponse(null, 'Only project owner can accept/reject bids', false, 403),
                { status: 403 }
            );
        }

        // Can only accept/reject pending bids
        if (bid.status !== 'pending') {
            return NextResponse.json(
                createResponse(null, 'Bid is no longer pending', false, 400),
                { status: 400 }
            );
        }

        if (action === 'accept') {
            // Accept the bid
            bid.status = 'accepted';
            bid.acceptedAt = new Date();
            await bid.save();

            // Update project status and assign freelancer
            await Project.findByIdAndUpdate(
                bid.project._id,
                {
                    status: 'in-progress',
                    selectedEditor: bid.freelancer,
                    acceptedBid: bid._id
                }
            );

            // Reject all other pending bids for this project
            await Bid.updateMany(
                {
                    project: bid.project._id,
                    _id: { $ne: bid._id },
                    status: 'pending'
                },
                {
                    status: 'rejected',
                    rejectedAt: new Date()
                }
            );

        } else {
            // Reject the bid
            bid.status = 'rejected';
            bid.rejectedAt = new Date();
            await bid.save();
        }

        const updatedBid = await Bid.findById(id)
            .populate('freelancer', 'name email freelancerProfile')
            .populate('project', 'title budget status');

        return NextResponse.json(
            createResponse(updatedBid, `Bid ${action}ed successfully`),
            { status: 200 }
        );

    } catch (error) {
        console.error('Accept/reject bid error:', error);
        return NextResponse.json(
            createResponse(null, `Failed to ${action} bid`, false, 500),
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

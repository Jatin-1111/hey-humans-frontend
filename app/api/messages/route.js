// app/api/messages/route.js - Client-freelancer chat system
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Message } from '@/models/Message';
import { User } from '@/models/User';
import { validateData, messageValidation, createResponse } from '@/lib/validation';

// GET - Get messages/conversations
export async function GET(req) {
    try {
        await connectDB();

        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                createResponse(null, authResult.error, false, 401),
                { status: 401 }
            );
        }

        const user = authResult.user;
        const { searchParams } = new URL(req.url);
        const otherUserId = searchParams.get('otherUserId') || searchParams.get('with');
        const projectId = searchParams.get('project');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 50;
        const type = searchParams.get('type') || 'conversation';

        if (type === 'conversations') {
            // Get list of all conversations for the user
            const conversations = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { sender: user._id },
                            { recipient: user._id }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ['$sender', user._id] },
                                '$recipient',
                                '$sender'
                            ]
                        },
                        lastMessage: { $first: '$$ROOT' },
                        unreadCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ['$recipient', user._id] },
                                            { $eq: ['$isRead', false] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'otherUser'
                    }
                },
                {
                    $unwind: '$otherUser'
                },
                {
                    $project: {
                        _id: 1,
                        otherUser: {
                            _id: '$otherUser._id',
                            name: '$otherUser.name',
                            email: '$otherUser.email',
                            avatar: '$otherUser.avatar'
                        },
                        lastMessage: 1,
                        unreadCount: 1
                    }
                },
                {
                    $sort: { 'lastMessage.createdAt': -1 }
                }
            ]);

            return NextResponse.json(
                createResponse({ conversations }, 'Conversations retrieved successfully'),
                { status: 200 }
            );
        }

        if (!otherUserId) {
            return NextResponse.json(
                createResponse(null, 'Other user ID is required', false, 400),
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;

        // Build query
        let query = {
            $or: [
                { sender: user._id, recipient: otherUserId },
                { sender: otherUserId, recipient: user._id }
            ]
        };

        if (projectId) {
            query.project = projectId;
        }

        // Get messages between current user and other user
        const messages = await Message.find(query)
            .populate('sender', 'name email avatar')
            .populate('recipient', 'name email avatar')
            .populate('project', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Message.countDocuments(query);

        // Mark messages as read
        await Message.updateMany(
            {
                sender: otherUserId,
                recipient: user._id,
                isRead: false
            },
            { isRead: true, readAt: new Date() }
        );

        // Add calculated fields
        const messagesWithTimeAgo = messages.reverse().map(message => ({
            ...message,
            timeAgo: getTimeAgo(message.createdAt),
            isOwn: message.sender._id.toString() === user._id.toString()
        }));

        const response = {
            messages: messagesWithTimeAgo,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
                hasMore: messages.length === limit
            }
        };

        return NextResponse.json(
            createResponse(response, 'Messages retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Messages fetch error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to fetch messages', false, 500),
            { status: 500 }
        );
    }
}

// POST - Send message
export async function POST(req) {
    try {
        await connectDB();

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
        const validatedData = validateData(messageValidation.create, body);

        // Verify recipient exists
        const recipient = await User.findById(validatedData.recipient || validatedData.recipientId);
        if (!recipient) {
            return NextResponse.json(
                createResponse(null, 'Recipient not found', false, 404),
                { status: 404 }
            );
        }

        // Create message
        const message = new Message({
            sender: user._id,
            recipient: validatedData.recipient || validatedData.recipientId,
            content: validatedData.content,
            type: validatedData.type || 'text',
            project: validatedData.project || null,
            attachments: validatedData.attachments || [],
            isRead: false
        });

        await message.save();

        // Populate message for response
        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name email avatar')
            .populate('recipient', 'name email avatar')
            .populate('project', 'title');

        return NextResponse.json(
            createResponse(populatedMessage, 'Message sent successfully'),
            { status: 201 }
        );

    } catch (error) {
        console.error('Message send error:', error);

        if (error.message.includes('validation')) {
            return NextResponse.json(
                createResponse(null, 'Validation failed', false, 400),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse(null, 'Failed to send message', false, 500),
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

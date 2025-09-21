import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/models/Contact';
import { validateData, contactValidation, createResponse } from '@/lib/validation';

// GET - Get contact submissions (Admin only)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const status = searchParams.get('status'); // 'new', 'in-progress', 'resolved'
        const type = searchParams.get('type');

        await connectDB();

        let query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const skip = (page - 1) * limit;

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Contact.countDocuments(query);

        // Add calculated fields
        const contactsWithTimeAgo = contacts.map(contact => ({
            ...contact,
            timeAgo: getTimeAgo(contact.createdAt)
        }));

        const response = {
            contacts: contactsWithTimeAgo,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            stats: {
                total: await Contact.countDocuments(),
                new: await Contact.countDocuments({ status: 'new' }),
                inProgress: await Contact.countDocuments({ status: 'in-progress' }),
                resolved: await Contact.countDocuments({ status: 'resolved' })
            }
        };

        return NextResponse.json(
            createResponse(response, 'Contact submissions retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Get contacts error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to retrieve contact submissions', false, 500),
            { status: 500 }
        );
    }
}

// POST - Submit contact form (Public)
export async function POST(req) {
    try {
        const body = await req.json();

        await connectDB();

        // Validate input data
        const validatedData = validateData(contactValidation.create, body);

        // Check for recent submissions from same email (spam protection)
        const recentSubmission = await Contact.findOne({
            email: validatedData.email,
            createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes
        });

        if (recentSubmission) {
            return NextResponse.json(
                createResponse(null, 'Please wait a few minutes before submitting another message', false, 429),
                { status: 429 }
            );
        }

        // Create contact submission
        const contact = new Contact({
            ...validatedData,
            status: 'new',
            ipAddress: getClientIP(req),
            userAgent: req.headers.get('user-agent') || ''
        });

        await contact.save();

        // Send notification email (optional - implement if needed)
        // await sendContactNotification(contact);

        return NextResponse.json(
            createResponse(
                { id: contact._id, submittedAt: contact.createdAt },
                'Thank you for your message. We will get back to you soon!'
            ),
            { status: 201 }
        );

    } catch (error) {
        console.error('Contact form error:', error);

        if (error.message.includes('validation')) {
            return NextResponse.json(
                createResponse(null, 'Please check your input and try again', false, 400),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse(null, 'Failed to submit contact form. Please try again.', false, 500),
            { status: 500 }
        );
    }
}

// Helper function to get client IP
function getClientIP(req) {
    const forwarded = req.headers.get('x-forwarded-for');
    const real = req.headers.get('x-real-ip');
    const remoteAddress = req.ip;

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    return real || remoteAddress || 'unknown';
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

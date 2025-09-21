import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { createResponse } from '@/lib/validation';

// GET - Get freelancers list
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 12;
        const skip = (page - 1) * limit;

        // Filter parameters
        const skills = searchParams.get('skills');
        const minRate = searchParams.get('minRate');
        const maxRate = searchParams.get('maxRate');
        const availability = searchParams.get('availability');
        const minRating = searchParams.get('minRating');
        const search = searchParams.get('search');

        // Build filter query
        const filter = {
            'freelancerProfile.isFreelancer': true,
            isVerified: true
        };

        // Skills filter
        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            filter['freelancerProfile.skills'] = { $in: skillsArray };
        }

        // Rate filter
        if (minRate || maxRate) {
            filter['freelancerProfile.hourlyRate'] = {};
            if (minRate) filter['freelancerProfile.hourlyRate'].$gte = parseFloat(minRate);
            if (maxRate) filter['freelancerProfile.hourlyRate'].$lte = parseFloat(maxRate);
        }

        // Availability filter
        if (availability) {
            filter['freelancerProfile.availability'] = availability;
        }

        // Rating filter
        if (minRating) {
            filter['freelancerProfile.rating.average'] = { $gte: parseFloat(minRating) };
        }

        // Search filter
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'freelancerProfile.bio': { $regex: search, $options: 'i' } },
                { 'freelancerProfile.skills': { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Execute query
        const freelancers = await User.find(filter)
            .select('name email freelancerProfile createdAt activityStats')
            .sort({ 'freelancerProfile.rating.average': -1, 'freelancerProfile.completedProjects': -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const total = await User.countDocuments(filter);

        // Format response data
        const formattedFreelancers = freelancers.map(freelancer => ({
            _id: freelancer._id,
            name: freelancer.name,
            bio: freelancer.freelancerProfile?.bio || '',
            skills: freelancer.freelancerProfile?.skills || [],
            hourlyRate: freelancer.freelancerProfile?.hourlyRate || 0,
            rating: freelancer.freelancerProfile?.rating || { average: 0, count: 0 },
            availability: freelancer.freelancerProfile?.availability || 'available',
            completedProjects: freelancer.freelancerProfile?.completedProjects || 0,
            joinedDate: freelancer.createdAt
        }));

        const pagination = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        };

        return NextResponse.json(
            createResponse(
                { freelancers: formattedFreelancers, pagination },
                'Freelancers retrieved successfully'
            ),
            { status: 200 }
        );

    } catch (error) {
        console.error('Get freelancers error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to retrieve freelancers', false, 500),
            { status: 500 }
        );
    }
}

// GET method info
export async function OPTIONS() {
    return NextResponse.json({
        endpoint: '/api/users/freelancers',
        method: 'GET',
        description: 'Get list of verified freelancers',
        parameters: {
            page: 'number (default: 1)',
            limit: 'number (default: 12, max: 50)',
            skills: 'string (comma-separated)',
            minRate: 'number',
            maxRate: 'number',
            availability: 'string (available|busy|unavailable)',
            minRating: 'number (0-5)',
            search: 'string (name, bio, skills)'
        },
        responses: {
            200: 'Freelancers list with pagination',
            500: 'Internal server error'
        }
    });
}

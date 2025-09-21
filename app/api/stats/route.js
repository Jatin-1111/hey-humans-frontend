import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { User } from '@/models/User';
import { Project } from '@/models/Project';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { Bid } from '@/models/Bid';
import { Message } from '@/models/Message';
import { createResponse } from '@/lib/validation';

// GET - Get platform statistics
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
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'overview'; // 'overview', 'user', 'admin'
        const period = searchParams.get('period') || '30d'; // '7d', '30d', '90d', '1y'

        await connectDB();

        // Calculate date range
        const now = new Date();
        let startDate;
        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        if (type === 'user') {
            // User-specific statistics
            const userStats = await getUserStats(user._id, startDate);
            return NextResponse.json(
                createResponse(userStats, 'User statistics retrieved successfully'),
                { status: 200 }
            );
        }

        if (type === 'admin') {
            // Admin-only comprehensive statistics
            if (user.role !== 'admin') {
                return NextResponse.json(
                    createResponse(null, 'Admin access required', false, 403),
                    { status: 403 }
                );
            }

            const adminStats = await getAdminStats(startDate);
            return NextResponse.json(
                createResponse(adminStats, 'Admin statistics retrieved successfully'),
                { status: 200 }
            );
        }

        // Public overview statistics
        const overviewStats = await getOverviewStats(startDate);
        return NextResponse.json(
            createResponse(overviewStats, 'Overview statistics retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Get stats error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to retrieve statistics', false, 500),
            { status: 500 }
        );
    }
}

// Get user-specific statistics
async function getUserStats(userId, startDate) {
    const [
        projectsCreated,
        projectsCompleted,
        bidsPlaced,
        bidsWon,
        ordersPlaced,
        productsListed,
        messagesReceived,
        totalEarnings
    ] = await Promise.all([
        Project.countDocuments({ client: userId }),
        Project.countDocuments({ client: userId, status: 'completed' }),
        Bid.countDocuments({ freelancer: userId }),
        Bid.countDocuments({ freelancer: userId, status: 'accepted' }),
        Order.countDocuments({ customer: userId }),
        Product.countDocuments({ seller: userId, isActive: true }),
        Message.countDocuments({ recipient: userId, createdAt: { $gte: startDate } }),
        Order.aggregate([
            { $match: { seller: userId, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
    ]);

    // Get recent activity
    const recentProjects = await Project.find({ client: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status budget createdAt');

    const recentBids = await Bid.find({ freelancer: userId })
        .populate('project', 'title')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('amount status createdAt project');

    return {
        overview: {
            projectsCreated,
            projectsCompleted,
            bidsPlaced,
            bidsWon,
            ordersPlaced,
            productsListed,
            messagesReceived,
            totalEarnings: totalEarnings[0]?.total || 0,
            successRate: bidsPlaced > 0 ? Math.round((bidsWon / bidsPlaced) * 100) : 0
        },
        recentActivity: {
            projects: recentProjects,
            bids: recentBids
        }
    };
}

// Get admin-only comprehensive statistics
async function getAdminStats(startDate) {
    const [
        totalUsers,
        newUsers,
        activeUsers,
        freelancers,
        totalProjects,
        activeProjects,
        completedProjects,
        totalProducts,
        activeProducts,
        totalOrders,
        revenueData,
        messageStats
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: startDate } }),
        User.countDocuments({ lastLogin: { $gte: startDate } }),
        User.countDocuments({ 'freelancerProfile.isFreelancer': true }),
        Project.countDocuments(),
        Project.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
        Project.countDocuments({ status: 'completed' }),
        Product.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        Message.countDocuments({ createdAt: { $gte: startDate } })
    ]);

    // Get growth data by day
    const growthData = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Get top categories
    const topCategories = await Project.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    return {
        overview: {
            totalUsers,
            newUsers,
            activeUsers,
            freelancers,
            totalProjects,
            activeProjects,
            completedProjects,
            totalProducts,
            activeProducts,
            totalOrders,
            totalRevenue: revenueData[0]?.total || 0,
            totalMessages: messageStats
        },
        growth: growthData,
        categories: topCategories,
        metrics: {
            userGrowthRate: newUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0,
            projectCompletionRate: totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0,
            averageOrderValue: totalOrders > 0 ? ((revenueData[0]?.total || 0) / totalOrders).toFixed(2) : 0
        }
    };
}

// Get public overview statistics
async function getOverviewStats(startDate) {
    const [
        totalFreelancers,
        totalProjects,
        completedProjects,
        totalProducts,
        activeProjects
    ] = await Promise.all([
        User.countDocuments({ 'freelancerProfile.isFreelancer': true }),
        Project.countDocuments(),
        Project.countDocuments({ status: 'completed' }),
        Product.countDocuments({ isActive: true }),
        Project.countDocuments({ status: { $in: ['open', 'in-progress'] } })
    ]);

    // Get trending categories
    const trendingCategories = await Project.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    return {
        overview: {
            totalFreelancers,
            totalProjects,
            completedProjects,
            totalProducts,
            activeProjects,
            completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
        },
        trending: trendingCategories
    };
}

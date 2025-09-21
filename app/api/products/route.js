// app/api/products/route.js - LED Display products management
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Product } from '@/models/Product';
import { validateData, productValidation, createResponse } from '@/lib/validation';

// GET - Browse LED displays (Public)
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 12;
        const category = searchParams.get('category');
        const pixelPitch = searchParams.get('pixelPitch');
        const minPrice = parseFloat(searchParams.get('minPrice'));
        const maxPrice = parseFloat(searchParams.get('maxPrice'));
        const location = searchParams.get('location');
        const availability = searchParams.get('availability');
        const search = searchParams.get('search');
        const seller = searchParams.get('seller');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const featured = searchParams.get('featured') === 'true';

        // Build filter object
        const filter = { isActive: true };

        if (category) filter.category = category;
        if (pixelPitch) filter['specifications.pixelPitch'] = pixelPitch;
        if (location) filter.location = new RegExp(location, 'i');
        if (availability) filter.availability = { $in: [availability, 'both'] };
        if (seller) filter.seller = seller;
        if (featured) filter.featured = true;

        // Text search across name and description
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { category: new RegExp(search, 'i') }
            ];
        }

        // Price filter
        if (minPrice || maxPrice) {
            filter.$or = [
                // Sale price filter
                ...(minPrice || maxPrice ? [{
                    'pricing.salePrice': {
                        ...(minPrice && { $gte: minPrice }),
                        ...(maxPrice && { $lte: maxPrice })
                    }
                }] : []),
                // Rental price filter (daily rate)
                ...(minPrice || maxPrice ? [{
                    'pricing.rentalRates.daily': {
                        ...(minPrice && { $gte: minPrice }),
                        ...(maxPrice && { $lte: maxPrice })
                    }
                }] : [])
            ];
        }

        const skip = (page - 1) * limit;

        // Build sort object
        const sort = {};
        if (sortBy === 'price') {
            sort['pricing.salePrice'] = sortOrder;
        } else if (sortBy === 'popularity') {
            sort['views'] = sortOrder;
        } else {
            sort[sortBy] = sortOrder;
        }

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('seller', 'name email contactInfo')
                .lean(),
            Product.countDocuments(filter)
        ]);

        // Add calculated fields
        const productsWithCalcs = products.map(product => ({
            ...product,
            timeAgo: getTimeAgo(product.createdAt),
            isInStock: (product.stock?.sale > 0) || (product.stock?.rental > 0),
            minPrice: Math.min(
                product.pricing.salePrice || Infinity,
                product.pricing.rentalRates?.daily || Infinity
            )
        }));

        const response = {
            products: productsWithCalcs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            filters: {
                categories: await Product.distinct('category', { isActive: true }),
                pixelPitches: await Product.distinct('specifications.pixelPitch', { isActive: true }),
                locations: await Product.distinct('location', { isActive: true })
            }
        };

        return NextResponse.json(
            createResponse(response, 'Products retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to fetch products', false, 500),
            { status: 500 }
        );
    }
}

// POST - Create new product (Admin/Seller only)
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

        // Check if user can create products (admin or verified seller)
        if (user.role !== 'admin' && (!user.freelancerProfile?.isFreelancer || !user.freelancerProfile?.isVerified)) {
            return NextResponse.json(
                createResponse(null, 'Only verified sellers can create products', false, 403),
                { status: 403 }
            );
        }

        // Validate input data
        const validatedData = validateData(productValidation.create, body);

        // Create product
        const product = new Product({
            ...validatedData,
            seller: user._id,
            isActive: true,
            views: 0,
            featured: user.role === 'admin' ? validatedData.featured : false
        });

        await product.save();

        // Populate seller info for response
        const populatedProduct = await Product.findById(product._id)
            .populate('seller', 'name email contactInfo');

        return NextResponse.json(
            createResponse(populatedProduct, 'Product created successfully'),
            { status: 201 }
        );

    } catch (error) {
        console.error('Product creation error:', error);

        if (error.message.includes('validation')) {
            return NextResponse.json(
                createResponse(null, 'Validation failed', false, 400),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse(null, 'Failed to create product', false, 500),
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

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { authenticate } from '@/middleware/auth';
import { validateData, productValidation, createResponse } from '@/lib/validation';

// GET - Get single product by ID (Public)
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                createResponse(null, 'Product ID is required', false, 400),
                { status: 400 }
            );
        }

        const product = await Product.findById(id)
            .populate('seller', 'name email contactInfo freelancerProfile')
            .lean();

        if (!product || !product.isActive) {
            return NextResponse.json(
                createResponse(null, 'Product not found', false, 404),
                { status: 404 }
            );
        }

        // Increment view count
        await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

        // Add calculated fields
        product.timeAgo = getTimeAgo(product.createdAt);
        product.isInStock = (product.stock?.sale > 0) || (product.stock?.rental > 0);
        product.viewCount = (product.views || 0) + 1;

        // Get related products (same category, different seller)
        const relatedProducts = await Product.find({
            _id: { $ne: id },
            category: product.category,
            seller: { $ne: product.seller._id },
            isActive: true
        }).limit(4).select('name pricing.salePrice images category');

        const response = {
            product,
            relatedProducts
        };

        return NextResponse.json(
            createResponse(response, 'Product retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to retrieve product', false, 500),
            { status: 500 }
        );
    }
}

// PUT - Update product
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

        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return NextResponse.json(
                createResponse(null, 'Product not found', false, 404),
                { status: 404 }
            );
        }

        // Check ownership (only product owner or admin can update)
        if (existingProduct.seller.toString() !== user._id.toString() && user.role !== 'admin') {
            return NextResponse.json(
                createResponse(null, 'Not authorized to update this product', false, 403),
                { status: 403 }
            );
        }

        // Validate input data
        const validatedData = validateData(productValidation.update, body);

        // Only admin can set featured status
        if ('featured' in validatedData && user.role !== 'admin') {
            delete validatedData.featured;
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                ...validatedData,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('seller', 'name email contactInfo');

        return NextResponse.json(
            createResponse(updatedProduct, 'Product updated successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Update product error:', error);

        if (error.message.includes('validation')) {
            return NextResponse.json(
                createResponse(null, 'Validation failed', false, 400),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse(null, 'Failed to update product', false, 500),
            { status: 500 }
        );
    }
}

// DELETE - Delete product
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

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                createResponse(null, 'Product not found', false, 404),
                { status: 404 }
            );
        }

        // Check ownership (only product owner or admin can delete)
        if (product.seller.toString() !== user._id.toString() && user.role !== 'admin') {
            return NextResponse.json(
                createResponse(null, 'Not authorized to delete this product', false, 403),
                { status: 403 }
            );
        }

        // Soft delete by setting isActive to false
        await Product.findByIdAndUpdate(id, {
            isActive: false,
            deletedAt: new Date()
        });

        return NextResponse.json(
            createResponse(null, 'Product deleted successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to delete product', false, 500),
            { status: 500 }
        );
    }
}

// PATCH - Update product stock/availability
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
        const { action, stock, availability } = await req.json();

        await connectDB();

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                createResponse(null, 'Product not found', false, 404),
                { status: 404 }
            );
        }

        // Check ownership
        if (product.seller.toString() !== user._id.toString() && user.role !== 'admin') {
            return NextResponse.json(
                createResponse(null, 'Not authorized to update this product', false, 403),
                { status: 403 }
            );
        }

        let updateData = {};

        if (action === 'updateStock' && stock) {
            updateData.stock = stock;
        }

        if (action === 'updateAvailability' && availability) {
            updateData.availability = availability;
        }

        if (action === 'toggleActive') {
            updateData.isActive = !product.isActive;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                ...updateData,
                updatedAt: new Date()
            },
            { new: true }
        ).populate('seller', 'name email contactInfo');

        return NextResponse.json(
            createResponse(updatedProduct, 'Product updated successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Patch product error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to update product', false, 500),
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

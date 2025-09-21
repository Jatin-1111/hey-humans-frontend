// app/api/orders/route.js - Order management for purchases
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { validateData, orderValidation, createResponse } from '@/lib/validation';

// GET - Get orders (Admin sees all, users see their own)
export async function GET(req) {
    try {
        await connectDB();

        // Authenticate user
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                createResponse(null, authResult.error, false, 401),
                { status: 401 }
            );
        }

        const user = authResult.user;
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const status = searchParams.get('status');
        const type = searchParams.get('type'); // 'purchase' or 'rental'
        const seller = searchParams.get('seller');

        // Build filter
        let filter = {};

        // Non-admin users can only see their own orders or orders they're selling
        if (user.role !== 'admin') {
            if (seller === 'true') {
                // Get orders where user is the seller
                filter.seller = user._id;
            } else {
                // Get orders where user is the customer
                filter.customer = user._id;
            }
        }

        if (status) filter.status = status;
        if (type) filter.type = type;

        const skip = (page - 1) * limit;

        const orders = await Order.find(filter)
            .populate('customer', 'name email phone')
            .populate('seller', 'name email contactInfo')
            .populate('items.product', 'name images pricing category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Order.countDocuments(filter);

        // Add calculated fields
        const ordersWithTimeAgo = orders.map(order => ({
            ...order,
            timeAgo: getTimeAgo(order.createdAt)
        }));

        const response = {
            orders: ordersWithTimeAgo,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };

        return NextResponse.json(
            createResponse(response, 'Orders retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to fetch orders', false, 500),
            { status: 500 }
        );
    }
}

// POST - Create new order
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
        const validatedData = validateData(orderValidation.create, body);

        // Process items and calculate totals
        let subtotal = 0;
        const processedItems = [];
        let sellerId = null;

        for (const item of validatedData.items) {
            const product = await Product.findById(item.productId || item.product);
            if (!product || !product.isActive) {
                return NextResponse.json(
                    createResponse(null, `Product ${item.productId || item.product} not found or inactive`, false, 400),
                    { status: 400 }
                );
            }

            // Ensure all products are from the same seller (for simplicity)
            if (!sellerId) {
                sellerId = product.seller;
            } else if (sellerId.toString() !== product.seller.toString()) {
                return NextResponse.json(
                    createResponse(null, 'All items must be from the same seller', false, 400),
                    { status: 400 }
                );
            }

            // Check stock availability
            const stockType = validatedData.type === 'purchase' ? 'sale' : 'rental';
            if (product.stock[stockType] < item.quantity) {
                return NextResponse.json(
                    createResponse(null, `Insufficient stock for ${product.name}`, false, 400),
                    { status: 400 }
                );
            }

            // Calculate price
            let unitPrice;
            if (validatedData.type === 'purchase') {
                unitPrice = product.pricing.salePrice;
            } else {
                // Rental pricing
                const period = validatedData.rentalPeriod?.unit || 'day';
                const duration = validatedData.rentalPeriod?.duration || 1;

                if (period === 'day') {
                    unitPrice = product.pricing.rentalRates?.daily * duration;
                } else if (period === 'week') {
                    unitPrice = product.pricing.rentalRates?.weekly * duration;
                } else if (period === 'month') {
                    unitPrice = product.pricing.rentalRates?.monthly * duration;
                }
            }

            const itemTotal = unitPrice * item.quantity;
            subtotal += itemTotal;

            processedItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice,
                totalPrice: itemTotal,
                specifications: item.specifications || {}
            });
        }

        // Calculate totals
        const tax = subtotal * 0.1; // 10% tax
        const shipping = validatedData.type === 'rental' ? 0 : 50; // Shipping for purchases only
        const total = subtotal + tax + shipping;

        // Generate order number
        const orderNumber = `HH${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        // Create order
        const order = new Order({
            orderNumber,
            customer: user._id,
            seller: sellerId,
            type: validatedData.type,
            items: processedItems,
            pricing: {
                subtotal,
                tax,
                shipping,
                total
            },
            totalAmount: total,
            shippingAddress: validatedData.shippingAddress,
            billingAddress: validatedData.billingAddress || validatedData.shippingAddress,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: validatedData.paymentMethod,
            rentalPeriod: validatedData.type === 'rental' ? validatedData.rentalPeriod : undefined,
            notes: validatedData.notes || ''
        });

        await order.save();

        // Update product stock
        for (const item of validatedData.items) {
            const stockType = validatedData.type === 'purchase' ? 'sale' : 'rental';
            await Product.findByIdAndUpdate(
                item.productId || item.product,
                {
                    $inc: { [`stock.${stockType}`]: -item.quantity },
                    $set: { lastActivity: new Date() }
                }
            );
        }

        // Update user activity stats
        await User.findByIdAndUpdate(
            user._id,
            {
                $inc: { 'activityStats.ordersPlaced': 1 },
                $set: { updatedAt: new Date() }
            }
        );

        // Populate order for response
        const populatedOrder = await Order.findById(order._id)
            .populate('customer', 'name email phone')
            .populate('seller', 'name email contactInfo')
            .populate('items.product', 'name images pricing category');

        return NextResponse.json(
            createResponse(populatedOrder, 'Order created successfully'),
            { status: 201 }
        );

    } catch (error) {
        console.error('Order creation error:', error);

        if (error.message.includes('validation')) {
            return NextResponse.json(
                createResponse(null, 'Validation failed', false, 400),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse(null, 'Failed to create order', false, 500),
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

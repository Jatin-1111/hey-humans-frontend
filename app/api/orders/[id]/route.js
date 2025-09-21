import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { authenticate } from '@/middleware/auth';
import { createResponse } from '@/lib/validation';

// GET - Get single order by ID
export async function GET(req, { params }) {
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

        if (!id) {
            return NextResponse.json(
                createResponse(null, 'Order ID is required', false, 400),
                { status: 400 }
            );
        }

        const order = await Order.findById(id)
            .populate('customer', 'name email phone')
            .populate('seller', 'name email contactInfo')
            .populate('items.product', 'name images pricing category specifications')
            .lean();

        if (!order) {
            return NextResponse.json(
                createResponse(null, 'Order not found', false, 404),
                { status: 404 }
            );
        }

        // Check access permissions
        const canAccess = user.role === 'admin' ||
            order.customer._id.toString() === user._id.toString() ||
            order.seller._id.toString() === user._id.toString();

        if (!canAccess) {
            return NextResponse.json(
                createResponse(null, 'Not authorized to view this order', false, 403),
                { status: 403 }
            );
        }

        // Add calculated fields
        order.timeAgo = getTimeAgo(order.createdAt);
        order.canCancel = order.status === 'pending' && order.customer._id.toString() === user._id.toString();
        order.canUpdate = (order.status === 'pending' || order.status === 'confirmed') &&
            (order.seller._id.toString() === user._id.toString() || user.role === 'admin');

        return NextResponse.json(
            createResponse(order, 'Order retrieved successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to retrieve order', false, 500),
            { status: 500 }
        );
    }
}

// PATCH - Update order status
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
        const { action, status, paymentStatus, trackingInfo, notes } = await req.json();

        await connectDB();

        // Check if order exists
        const order = await Order.findById(id).populate('customer seller');
        if (!order) {
            return NextResponse.json(
                createResponse(null, 'Order not found', false, 404),
                { status: 404 }
            );
        }

        let updateData = {};
        let responseMessage = '';

        switch (action) {
            case 'cancel':
                // Only customer can cancel pending orders
                if (order.customer._id.toString() !== user._id.toString()) {
                    return NextResponse.json(
                        createResponse(null, 'Only customer can cancel orders', false, 403),
                        { status: 403 }
                    );
                }
                if (order.status !== 'pending') {
                    return NextResponse.json(
                        createResponse(null, 'Can only cancel pending orders', false, 400),
                        { status: 400 }
                    );
                }
                updateData.status = 'cancelled';
                updateData.cancelledAt = new Date();
                responseMessage = 'Order cancelled successfully';

                // Restore product stock
                for (const item of order.items) {
                    const stockType = order.type === 'purchase' ? 'sale' : 'rental';
                    await Product.findByIdAndUpdate(
                        item.product,
                        { $inc: { [`stock.${stockType}`]: item.quantity } }
                    );
                }
                break;

            case 'confirm':
                // Only seller or admin can confirm orders
                if (order.seller._id.toString() !== user._id.toString() && user.role !== 'admin') {
                    return NextResponse.json(
                        createResponse(null, 'Not authorized to confirm this order', false, 403),
                        { status: 403 }
                    );
                }
                if (order.status !== 'pending') {
                    return NextResponse.json(
                        createResponse(null, 'Can only confirm pending orders', false, 400),
                        { status: 400 }
                    );
                }
                updateData.status = 'confirmed';
                updateData.confirmedAt = new Date();
                responseMessage = 'Order confirmed successfully';
                break;

            case 'ship':
                // Only seller or admin can ship orders
                if (order.seller._id.toString() !== user._id.toString() && user.role !== 'admin') {
                    return NextResponse.json(
                        createResponse(null, 'Not authorized to ship this order', false, 403),
                        { status: 403 }
                    );
                }
                if (order.status !== 'confirmed') {
                    return NextResponse.json(
                        createResponse(null, 'Can only ship confirmed orders', false, 400),
                        { status: 400 }
                    );
                }
                updateData.status = 'shipped';
                updateData.shippedAt = new Date();
                if (trackingInfo) updateData.trackingInfo = trackingInfo;
                responseMessage = 'Order shipped successfully';
                break;

            case 'deliver':
                // Only seller, admin, or customer can mark as delivered
                const canDeliver = order.seller._id.toString() === user._id.toString() ||
                    order.customer._id.toString() === user._id.toString() ||
                    user.role === 'admin';
                if (!canDeliver) {
                    return NextResponse.json(
                        createResponse(null, 'Not authorized to mark order as delivered', false, 403),
                        { status: 403 }
                    );
                }
                if (order.status !== 'shipped') {
                    return NextResponse.json(
                        createResponse(null, 'Can only deliver shipped orders', false, 400),
                        { status: 400 }
                    );
                }
                updateData.status = 'delivered';
                updateData.deliveredAt = new Date();
                responseMessage = 'Order marked as delivered';
                break;

            case 'complete':
                // Auto-complete or customer confirmation
                if (order.status !== 'delivered') {
                    return NextResponse.json(
                        createResponse(null, 'Can only complete delivered orders', false, 400),
                        { status: 400 }
                    );
                }
                updateData.status = 'completed';
                updateData.completedAt = new Date();
                responseMessage = 'Order completed successfully';
                break;

            case 'updatePayment':
                // Only admin or seller can update payment status
                if (order.seller._id.toString() !== user._id.toString() && user.role !== 'admin') {
                    return NextResponse.json(
                        createResponse(null, 'Not authorized to update payment status', false, 403),
                        { status: 403 }
                    );
                }
                if (paymentStatus && ['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
                    updateData.paymentStatus = paymentStatus;
                    if (paymentStatus === 'paid') updateData.paidAt = new Date();
                    responseMessage = `Payment status updated to ${paymentStatus}`;
                }
                break;

            default:
                return NextResponse.json(
                    createResponse(null, 'Invalid action', false, 400),
                    { status: 400 }
                );
        }

        if (notes) updateData.notes = (order.notes || '') + '\n' + notes;
        updateData.updatedAt = new Date();

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('customer', 'name email phone')
            .populate('seller', 'name email contactInfo')
            .populate('items.product', 'name images pricing category');

        return NextResponse.json(
            createResponse(updatedOrder, responseMessage),
            { status: 200 }
        );

    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to update order', false, 500),
            { status: 500 }
        );
    }
}

// DELETE - Delete order (admin only, or customer for pending orders)
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

        // Check if order exists
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json(
                createResponse(null, 'Order not found', false, 404),
                { status: 404 }
            );
        }

        // Check permissions
        const canDelete = user.role === 'admin' ||
            (order.customer.toString() === user._id.toString() && order.status === 'pending');

        if (!canDelete) {
            return NextResponse.json(
                createResponse(null, 'Not authorized to delete this order', false, 403),
                { status: 403 }
            );
        }

        // Restore product stock if order was not cancelled
        if (order.status !== 'cancelled') {
            for (const item of order.items) {
                const stockType = order.type === 'purchase' ? 'sale' : 'rental';
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { [`stock.${stockType}`]: item.quantity } }
                );
            }
        }

        // Delete the order
        await Order.findByIdAndDelete(id);

        return NextResponse.json(
            createResponse(null, 'Order deleted successfully'),
            { status: 200 }
        );

    } catch (error) {
        console.error('Delete order error:', error);
        return NextResponse.json(
            createResponse(null, 'Failed to delete order', false, 500),
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

// app/api/cart/route.js - Shopping cart functionality
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { authenticate } from '@/middleware/auth';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';

// GET - Get user's cart
export async function GET(req) {
    try {
        await connectDB();

        // Authenticate user
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        const cart = await Cart.findOne({ user: authResult.user.userId })
            .populate('items.product', 'name images pricing availability stock specifications');

        if (!cart) {
            return NextResponse.json({
                cart: {
                    user: authResult.user.userId,
                    items: [],
                    totals: { subtotal: 0, tax: 0, shipping: 0, total: 0 }
                }
            });
        }

        return NextResponse.json({ cart });

    } catch (error) {
        console.error('Cart fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}

// POST - Add item to cart
export async function POST(req) {
    try {
        await connectDB();

        // Authenticate user
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { productId, quantity, type, rentalPeriod } = body;

        // Validation
        if (!productId || !quantity || !type) {
            return NextResponse.json(
                { error: 'Product ID, quantity, and type are required' },
                { status: 400 }
            );
        }

        if (!['purchase', 'rental'].includes(type)) {
            return NextResponse.json(
                { error: 'Type must be purchase or rental' },
                { status: 400 }
            );
        }

        if (type === 'rental' && !rentalPeriod) {
            return NextResponse.json(
                { error: 'Rental period is required for rental items' },
                { status: 400 }
            );
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return NextResponse.json(
                { error: 'Product not found or unavailable' },
                { status: 404 }
            );
        }

        // Check stock availability
        const stockType = type === 'purchase' ? 'sale' : 'rental';
        if (product.stock[stockType] < quantity) {
            return NextResponse.json(
                { error: 'Insufficient stock' },
                { status: 400 }
            );
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: authResult.user.userId });
        if (!cart) {
            cart = new Cart({
                user: authResult.user.userId,
                items: [],
                totals: { subtotal: 0, tax: 0, shipping: 0, total: 0 }
            });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
                item.type === type &&
                JSON.stringify(item.rentalPeriod) === JSON.stringify(rentalPeriod)
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            const newItem = {
                product: productId,
                quantity,
                type,
                addedAt: new Date()
            };

            if (type === 'rental') {
                newItem.rentalPeriod = rentalPeriod;
            }

            cart.items.push(newItem);
        }

        // Recalculate totals
        await cart.calculateTotals();
        await cart.save();
        await cart.populate('items.product', 'name images pricing availability stock specifications');

        return NextResponse.json({
            message: 'Item added to cart',
            cart
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        return NextResponse.json(
            { error: 'Failed to add item to cart' },
            { status: 500 }
        );
    }
}

// PUT - Update cart item
export async function PUT(req) {
    try {
        await connectDB();

        // Authenticate user
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { itemId, quantity } = body;

        if (!itemId || quantity < 0) {
            return NextResponse.json(
                { error: 'Valid item ID and quantity are required' },
                { status: 400 }
            );
        }

        const cart = await Cart.findOne({ user: authResult.user.userId });
        if (!cart) {
            return NextResponse.json(
                { error: 'Cart not found' },
                { status: 404 }
            );
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return NextResponse.json(
                { error: 'Item not found in cart' },
                { status: 404 }
            );
        }

        if (quantity === 0) {
            // Remove item
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.calculateTotals();
        await cart.save();
        await cart.populate('items.product', 'name images pricing availability stock specifications');

        return NextResponse.json({
            message: 'Cart updated',
            cart
        });

    } catch (error) {
        console.error('Cart update error:', error);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}

// DELETE - Clear cart or remove item
export async function DELETE(req) {
    try {
        await connectDB();

        // Authenticate user
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get('itemId');

        const cart = await Cart.findOne({ user: authResult.user.userId });
        if (!cart) {
            return NextResponse.json(
                { error: 'Cart not found' },
                { status: 404 }
            );
        }

        if (itemId) {
            // Remove specific item
            cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        } else {
            // Clear entire cart
            cart.items = [];
        }

        await cart.calculateTotals();
        await cart.save();

        return NextResponse.json({
            message: itemId ? 'Item removed from cart' : 'Cart cleared',
            cart
        });

    } catch (error) {
        console.error('Cart delete error:', error);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}

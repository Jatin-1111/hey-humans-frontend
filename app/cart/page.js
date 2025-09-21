"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Trash2, Plus, Minus, ShoppingBag, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { user, isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            const data = await response.json();

            if (response.ok) {
                setCart(data.cart);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItem(itemId);
        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId,
                    quantity: newQuantity
                }),
            });

            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setUpdatingItem(null);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await fetch(`/api/cart?itemId=${itemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const calculateItemPrice = (item) => {
        if (item.type === 'rental') {
            const days = item.rentalPeriod || 1;
            return item.product.pricing.rent.daily * days * item.quantity;
        } else {
            const salePrice = item.product.pricing.sale.discount > 0
                ? item.product.pricing.sale.price * (1 - item.product.pricing.sale.discount / 100)
                : item.product.pricing.sale.price;
            return salePrice * item.quantity;
        }
    };

    const CartItem = ({ item }) => {
        const itemPrice = calculateItemPrice(item);
        const isRental = item.type === 'rental';

        return (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                            <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-white font-outfit">
                                {item.product.name}
                            </h3>
                            <button
                                onClick={() => removeItem(item._id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded font-inter">
                                {item.product.category}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded font-inter ${isRental
                                    ? 'bg-purple-600/20 text-purple-400'
                                    : 'bg-green-600/20 text-green-400'
                                }`}>
                                {isRental ? 'Rental' : 'Purchase'}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400 font-inter">Quantity:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || updatingItem === item._id}
                                        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded flex items-center justify-center transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center text-white font-inter">
                                        {updatingItem === item._id ? '...' : item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        disabled={updatingItem === item._id}
                                        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Rental Period (if applicable) */}
                            {isRental && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-400 font-inter">
                                        {item.rentalPeriod || 1} days
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="text-right">
                                <div className="text-xl font-bold text-green-400 font-geist">
                                    ${itemPrice.toFixed(2)}
                                </div>
                                {isRental && (
                                    <div className="text-sm text-gray-400 font-inter">
                                        ${item.product.pricing.rent.daily}/day
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4 font-space">Please Sign In</h1>
                    <p className="text-gray-400 mb-8 font-inter">You need to be logged in to view your cart.</p>
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center mb-8">
                        <Link
                            href="/products"
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-inter"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Continue Shopping
                        </Link>
                    </div>

                    <div className="text-center py-16">
                        <ShoppingBag className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold mb-4 font-space">Your Cart is Empty</h1>
                        <p className="text-gray-400 mb-8 font-inter">
                            Looks like you haven&apos;t added any items to your cart yet.
                        </p>
                        <Link
                            href="/products"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Link
                            href="/products"
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mr-6 font-inter"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Continue Shopping
                        </Link>
                        <h1 className="text-3xl font-bold font-space">Shopping Cart</h1>
                    </div>
                    <div className="text-gray-400 font-inter">
                        {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <CartItem key={item._id} item={item} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-8">
                            <h2 className="text-xl font-semibold mb-6 font-outfit">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cart.items.map((item) => {
                                    const itemPrice = calculateItemPrice(item);
                                    return (
                                        <div key={item._id} className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-inter">
                                                {item.product.name} x{item.quantity}
                                                {item.type === 'rental' && ` (${item.rentalPeriod || 1}d)`}
                                            </span>
                                            <span className="text-white font-inter">${itemPrice.toFixed(2)}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-800 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-white font-inter">Total</span>
                                    <span className="text-2xl font-bold text-green-400 font-geist">
                                        ${cart.totalAmount?.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter flex items-center justify-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Proceed to Checkout
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500 font-inter">
                                    Secure checkout with SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

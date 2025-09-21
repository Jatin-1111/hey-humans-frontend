"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Calendar, Star, Monitor, Zap, Palette, Package, Truck, Shield, Check, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailsPage() {
    const { user, isAuthenticated } = useAuth();
    const params = useParams();
    const productId = params.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [rentalDays, setRentalDays] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;

            try {
                const response = await fetch(`/api/products/${productId}`);
                const data = await response.json();

                if (response.ok) {
                    setProduct(data.product);
                } else {
                    console.error('Failed to fetch product:', data.message);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    const addToCart = async (type = 'purchase') => {
        if (!isAuthenticated) {
            alert('Please login to add items to cart');
            return;
        }

        setAddingToCart(true);
        try {
            const cartData = {
                productId,
                quantity,
                type
            };

            if (type === 'rental') {
                cartData.rentalPeriod = rentalDays;
            }

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Product added to cart for ${type}!`);
            } else {
                alert(data.message || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred');
        } finally {
            setAddingToCart(false);
        }
    };

    const calculateSalePrice = () => {
        if (!product?.pricing?.sale) return 0;
        const basePrice = product.pricing.sale.price;
        const discount = product.pricing.sale.discount || 0;
        return basePrice * (1 - discount / 100);
    };

    const calculateRentalTotal = () => {
        if (!product?.pricing?.rent) return 0;
        return product.pricing.rent.daily * rentalDays * quantity;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 font-space">Product Not Found</h1>
                    <p className="text-gray-400 mb-8 font-inter">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/products"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    const salePrice = calculateSalePrice();
    const hasDiscount = product.pricing.sale?.discount > 0;
    const isInStock = product.stock.available > 0;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center mb-8">
                    <Link
                        href="/products"
                        className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mr-6 font-inter"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Products
                    </Link>
                    <span className="text-gray-400 text-sm font-inter">
                        {product.category} / {product.name}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Monitor className="w-24 h-24 text-gray-600" />
                                </div>
                            )}
                        </div>

                        {/* Image Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                                ? 'border-blue-500'
                                                : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full font-inter">
                                    {product.category}
                                </span>
                                {!isInStock && (
                                    <span className="px-3 py-1 bg-red-600/20 text-red-400 text-sm rounded-full font-inter">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4 font-space">
                                {product.name}
                            </h1>
                            <p className="text-gray-300 text-lg font-inter">
                                {product.description}
                            </p>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Pricing</h3>

                            {product.pricing.sale && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm text-gray-400 font-inter">Purchase:</span>
                                        {hasDiscount && (
                                            <>
                                                <span className="text-lg text-gray-500 line-through font-inter">
                                                    ${product.pricing.sale.price}
                                                </span>
                                                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded font-inter">
                                                    {product.pricing.sale.discount}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-3xl font-bold text-green-400 font-geist">
                                        ${salePrice.toFixed(2)}
                                    </div>
                                </div>
                            )}

                            {product.pricing.rent && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-gray-400 font-inter">Rental:</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-400 font-geist">
                                        ${product.pricing.rent.daily}/day
                                    </div>
                                    {product.pricing.rent.weekly && (
                                        <div className="text-lg text-gray-300 font-inter">
                                            ${product.pricing.rent.weekly}/week
                                        </div>
                                    )}
                                    {product.pricing.rent.monthly && (
                                        <div className="text-lg text-gray-300 font-inter">
                                            ${product.pricing.rent.monthly}/month
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Specifications</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-400 font-inter">Size</div>
                                        <div className="text-white font-inter">{product.specifications.size}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-400 font-inter">Pixel Pitch</div>
                                        <div className="text-white font-inter">{product.specifications.pixelPitch}mm</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-400 font-inter">Brightness</div>
                                        <div className="text-white font-inter">{product.specifications.brightness} nits</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Palette className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-400 font-inter">Color Depth</div>
                                        <div className="text-white font-inter">{product.specifications.colorDepth} bit</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Monitor className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-400 font-inter">Refresh Rate</div>
                                        <div className="text-white font-inter">{product.specifications.refreshRate}Hz</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-400 font-inter">Resolution</div>
                                        <div className="text-white font-inter">
                                            {product.specifications.resolution.width} x {product.specifications.resolution.height}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Purchase/Rental Options */}
                        {isInStock && (
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h3 className="text-lg font-semibold mb-4 font-outfit">Add to Cart</h3>

                                {/* Quantity */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-16 text-center text-lg font-inter">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock.available, quantity + 1))}
                                            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm text-gray-400 font-inter">
                                            ({product.stock.available} available)
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {product.pricing.sale && (
                                        <button
                                            onClick={() => addToCart('purchase')}
                                            disabled={addingToCart}
                                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center font-inter"
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            {addingToCart ? 'Adding...' : `Buy Now - $${(salePrice * quantity).toFixed(2)}`}
                                        </button>
                                    )}

                                    {product.pricing.rent && (
                                        <>
                                            {/* Rental Days */}
                                            <div className="flex items-center gap-3 py-2">
                                                <Calendar className="w-5 h-5 text-gray-400" />
                                                <span className="text-sm text-gray-400 font-inter">Rental days:</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                                                        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-12 text-center font-inter">{rentalDays}</span>
                                                    <button
                                                        onClick={() => setRentalDays(rentalDays + 1)}
                                                        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => addToCart('rental')}
                                                disabled={addingToCart}
                                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center font-inter"
                                            >
                                                <Calendar className="w-5 h-5 mr-2" />
                                                {addingToCart ? 'Adding...' : `Rent for ${rentalDays} day${rentalDays > 1 ? 's' : ''} - $${calculateRentalTotal().toFixed(2)}`}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Features</h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-400" />
                                    <span className="text-gray-300 font-inter">Professional grade LED display</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-400" />
                                    <span className="text-gray-300 font-inter">High brightness for outdoor use</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-400" />
                                    <span className="text-gray-300 font-inter">Easy installation and setup</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-400" />
                                    <span className="text-gray-300 font-inter">Remote content management</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Truck className="w-5 h-5 text-blue-400" />
                                    <span className="text-gray-300 font-inter">Free shipping and delivery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                    <span className="text-gray-300 font-inter">1 year warranty included</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

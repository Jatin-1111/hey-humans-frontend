"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Clock, Star, ShoppingCart, Filter, Grid, Info, ArrowRight, Package, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ShortTermRentalPage() {
    const { user, isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        location: '',
        sortBy: 'newest'
    });

    useEffect(() => {
        const fetchRentalProducts = async () => {
            try {
                const queryParams = new URLSearchParams({
                    rental: 'true',
                    rentalType: 'short-term',
                    ...filters
                });

                const response = await fetch(`/api/products?${queryParams}`);
                const data = await response.json();

                if (response.ok) {
                    setProducts(data.products || []);
                }
            } catch (error) {
                console.error('Error fetching rental products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRentalProducts();
    }, [filters]);

    const addToCart = async (productId, rentalDays = 1) => {
        if (!isAuthenticated) {
            alert('Please login to rent equipment');
            return;
        }

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId,
                    quantity: 1,
                    type: 'rental',
                    rentalDays
                })
            });

            if (response.ok) {
                alert('Item added to cart for rental!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const ProductCard = ({ product }) => (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
            <div className="aspect-video bg-gray-800 relative">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Package className="w-16 h-16 text-gray-600" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-inter">
                        Short-term Rental
                    </span>
                </div>
                {product.availability?.available && (
                    <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-inter">
                            Available
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 font-outfit line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2 font-inter">
                    {product.description}
                </p>

                {/* Rental Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Daily Rate</div>
                        <div className="text-white font-semibold font-geist">
                            ${product.rentalPrice || 25}/day
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Min. Period</div>
                        <div className="text-white font-semibold font-geist">
                            {product.rental?.minDays || 1} day(s)
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Location</div>
                        <div className="text-white font-semibold font-geist">
                            {product.rental?.location || 'Local'}
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Deposit</div>
                        <div className="text-white font-semibold font-geist">
                            ${product.rental?.deposit || 100}
                        </div>
                    </div>
                </div>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.rating.average)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-600'}`}
                                />
                            ))}
                        </div>
                        <span className="text-white font-inter">
                            {product.rating.average.toFixed(1)}
                        </span>
                        <span className="text-gray-400 text-sm font-inter">
                            ({product.rating.count} reviews)
                        </span>
                    </div>
                )}

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-bold text-blue-400 font-geist">
                            ${product.rentalPrice || 25}/day
                        </div>
                        <div className="text-sm text-gray-400 font-inter">
                            Weekly: ${((product.rentalPrice || 25) * 7 * 0.9).toFixed(0)}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => addToCart(product._id, 1)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                        >
                            <Calendar className="w-4 h-4" />
                        </button>
                        <Link
                            href={`/products/${product._id}`}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-inter"
                        >
                            Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                                <Calendar className="w-12 h-12 text-blue-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            Short-Term Equipment Rental
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Rent professional LED displays and equipment for your short-term projects.
                            Perfect for events, presentations, and temporary installations.
                        </p>

                        {/* Key Features */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Flexible Periods</h3>
                                <p className="text-gray-400 text-sm font-inter">From 1 day to several weeks</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Delivery & Setup</h3>
                                <p className="text-gray-400 text-sm font-inter">Professional installation included</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">24/7 Support</h3>
                                <p className="text-gray-400 text-sm font-inter">Technical support during rental</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Competitive Rates</h3>
                                <p className="text-gray-400 text-sm font-inter">Best prices for quality equipment</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Filter className="w-5 h-5 text-blue-400" />
                        <h2 className="text-lg font-semibold font-outfit">Filter Equipment</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">All Categories</option>
                            <option value="led-displays">LED Displays</option>
                            <option value="video-walls">Video Walls</option>
                            <option value="accessories">Accessories</option>
                            <option value="controllers">Controllers</option>
                        </select>

                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.priceRange}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        >
                            <option value="">All Daily Rates</option>
                            <option value="0-50">Under $50/day</option>
                            <option value="50-100">$50 - $100/day</option>
                            <option value="100-200">$100 - $200/day</option>
                            <option value="200+">Over $200/day</option>
                        </select>

                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        >
                            <option value="">All Locations</option>
                            <option value="local">Local Pickup</option>
                            <option value="delivery">Delivery Available</option>
                            <option value="nationwide">Nationwide</option>
                        </select>

                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold font-space">Available for Short-Term Rental</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 font-inter">
                                {products.length} items available
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 bg-blue-600 text-white rounded-lg">
                                    <Grid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 animate-pulse">
                                    <div className="aspect-video bg-gray-800"></div>
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-700 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-700 rounded mb-4"></div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="h-16 bg-gray-800 rounded"></div>
                                            <div className="h-16 bg-gray-800 rounded"></div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="h-8 bg-gray-700 rounded w-20"></div>
                                            <div className="h-8 bg-gray-700 rounded w-24"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
                            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 font-outfit">No Equipment Available</h3>
                            <p className="text-gray-400 mb-4 font-inter">Try adjusting your filters or contact us for custom requirements.</p>
                            <Link
                                href="/contact"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                            >
                                Contact Us
                            </Link>
                        </div>
                    )}
                </div>

                {/* Information Section */}
                <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <Info className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold font-space">Short-Term Rental Information</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Rental Process:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Browse and select equipment</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Choose rental period and dates</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Provide delivery details</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Professional setup and testing</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">24/7 support during rental</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Pickup and return coordination</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 font-outfit">What&apos;s Included:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Professional delivery and setup</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">All necessary cables and accessories</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Basic training and operation guide</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Technical support hotline</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Insurance coverage</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Pickup and return service</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

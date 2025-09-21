"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CalendarDays, Clock, Star, ShoppingCart, Filter, Grid, Info, ArrowRight, Package, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function MonthlyRentalPage() {
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
                    rentalType: 'monthly',
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

    const addToCart = async (productId, rentalMonths = 1) => {
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
                    rentalMonths
                })
            });

            if (response.ok) {
                alert('Item added to cart for monthly rental!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const ProductCard = ({ product }) => {
        const monthlyRate = product.rentalPrice ? (product.rentalPrice * 30 * 0.8).toFixed(0) : 600;
        const dailyEquivalent = (monthlyRate / 30).toFixed(0);

        return (
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
                        <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-inter">
                            Monthly Rental
                        </span>
                    </div>
                    <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded font-inter">
                            20% Off Daily Rate
                        </span>
                    </div>
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
                            <div className="text-gray-400 font-inter">Monthly Rate</div>
                            <div className="text-white font-semibold font-geist">
                                ${monthlyRate}/month
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                            <div className="text-gray-400 font-inter">Daily Equivalent</div>
                            <div className="text-white font-semibold font-geist">
                                ${dailyEquivalent}/day
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                            <div className="text-gray-400 font-inter">Min. Period</div>
                            <div className="text-white font-semibold font-geist">
                                {product.rental?.minMonths || 1} month(s)
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                            <div className="text-gray-400 font-inter">Savings</div>
                            <div className="text-green-400 font-semibold font-geist">
                                ${((product.rentalPrice || 25) * 30 * 0.2).toFixed(0)}/mo
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
                            <div className="text-lg font-bold text-green-400 font-geist">
                                ${monthlyRate}/month
                            </div>
                            <div className="text-sm text-gray-400 font-inter">
                                Save 20% vs daily rate
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => addToCart(product._id, 1)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter"
                            >
                                <CalendarDays className="w-4 h-4" />
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
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-green-600/20 rounded-2xl border border-green-500/30">
                                <CalendarDays className="w-12 h-12 text-green-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            Monthly Equipment Rental
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Long-term monthly rentals with significant savings for extended projects.
                            Perfect for campaigns, seasonal installations, and ongoing productions.
                        </p>

                        {/* Key Features */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="flex items-center justify-center mb-2">
                                    <TrendingDown className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="font-semibold mb-2 font-outfit">20% Savings</h3>
                                <p className="text-gray-400 text-sm font-inter">Compared to daily rates</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Extended Support</h3>
                                <p className="text-gray-400 text-sm font-inter">Dedicated technical assistance</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Maintenance Included</h3>
                                <p className="text-gray-400 text-sm font-inter">Regular check-ups and service</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Flexible Terms</h3>
                                <p className="text-gray-400 text-sm font-inter">1-12 month periods available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Filter className="w-5 h-5 text-green-400" />
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
                            <option value="">All Monthly Rates</option>
                            <option value="0-500">Under $500/month</option>
                            <option value="500-1000">$500 - $1,000/month</option>
                            <option value="1000-2000">$1,000 - $2,000/month</option>
                            <option value="2000+">Over $2,000/month</option>
                        </select>

                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        >
                            <option value="">All Locations</option>
                            <option value="local">Local Service</option>
                            <option value="regional">Regional Coverage</option>
                            <option value="nationwide">Nationwide Available</option>
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
                        <h2 className="text-2xl font-bold font-space">Available for Monthly Rental</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 font-inter">
                                {products.length} items available
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 bg-green-600 text-white rounded-lg">
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
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter"
                            >
                                Contact Us
                            </Link>
                        </div>
                    )}
                </div>

                {/* Information Section */}
                <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <Info className="w-6 h-6 text-green-400" />
                        <h2 className="text-2xl font-bold font-space">Monthly Rental Benefits</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Cost Advantages:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">20% discount compared to daily rates</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Predictable monthly budgeting</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">No setup fees for extensions</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Volume discounts for multiple units</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Service Benefits:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Monthly maintenance and calibration</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Priority technical support</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Replacement guarantee within 24 hours</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Flexible upgrade options</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

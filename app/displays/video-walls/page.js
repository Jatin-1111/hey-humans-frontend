"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Monitor, Star, ShoppingCart, Filter, Grid, Info, ArrowRight, Package, Layout } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function VideoWallsPage() {
    const { user, isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        priceRange: '',
        brand: '',
        resolution: '',
        sortBy: 'newest'
    });

    useEffect(() => {
        const fetchVideoWalls = async () => {
            try {
                const queryParams = new URLSearchParams({
                    category: 'video-walls',
                    ...filters
                });

                const response = await fetch(`/api/products?${queryParams}`);
                const data = await response.json();

                if (response.ok) {
                    setProducts(data.products || []);
                }
            } catch (error) {
                console.error('Error fetching video walls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoWalls();
    }, [filters]);

    const addToCart = async (productId) => {
        if (!isAuthenticated) {
            alert('Please login to add items to cart');
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
                    type: 'purchase'
                })
            });

            if (response.ok) {
                alert('Product added to cart!');
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
                        <Layout className="w-16 h-16 text-gray-600" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full font-inter">
                        Video Wall
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

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Configuration</div>
                        <div className="text-white font-semibold font-geist">
                            {product.specifications?.configuration || '2x2'} Grid
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Bezel Width</div>
                        <div className="text-white font-semibold font-geist">
                            {product.specifications?.bezelWidth || '3.5'}mm
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Screen Size</div>
                        <div className="text-white font-semibold font-geist">
                            {product.specifications?.screenSize || '55'}&quot;
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Resolution</div>
                        <div className="text-white font-semibold font-geist">
                            {product.specifications?.resolution || '4K'}
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
                        <div className="text-2xl font-bold text-green-400 font-geist">
                            ${product.price?.toLocaleString() || 2999}
                        </div>
                        {product.rentalPrice && (
                            <div className="text-sm text-gray-400 font-inter">
                                Rent: ${product.rentalPrice}/day
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => addToCart(product._id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter"
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </button>
                        <Link
                            href={`/products/${product._id}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
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
            <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-600/20 rounded-2xl border border-red-500/30">
                                <Layout className="w-12 h-12 text-red-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            LED Video Walls
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Create stunning video wall displays with seamless LED panels.
                            Perfect for command centers, digital signage, and immersive visual experiences.
                        </p>

                        {/* Key Features */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Seamless Design</h3>
                                <p className="text-gray-400 text-sm font-inter">Ultra-narrow bezels for continuous display</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Scalable Solutions</h3>
                                <p className="text-gray-400 text-sm font-inter">From 2x2 to large-scale configurations</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">4K & Beyond</h3>
                                <p className="text-gray-400 text-sm font-inter">Ultra-high resolution displays</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">24/7 Operation</h3>
                                <p className="text-gray-400 text-sm font-inter">Industrial-grade reliability</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Filter className="w-5 h-5 text-red-400" />
                        <h2 className="text-lg font-semibold font-outfit">Filter Products</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.priceRange}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        >
                            <option value="">All Prices</option>
                            <option value="0-5000">Under $5,000</option>
                            <option value="5000-15000">$5,000 - $15,000</option>
                            <option value="15000-30000">$15,000 - $30,000</option>
                            <option value="30000+">Over $30,000</option>
                        </select>

                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.brand}
                            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                        >
                            <option value="">All Brands</option>
                            <option value="samsung">Samsung</option>
                            <option value="lg">LG</option>
                            <option value="sony">Sony</option>
                            <option value="planar">Planar</option>
                        </select>

                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.resolution}
                            onChange={(e) => setFilters({ ...filters, resolution: e.target.value })}
                        >
                            <option value="">All Resolutions</option>
                            <option value="full-hd">Full HD</option>
                            <option value="4k">4K UHD</option>
                            <option value="8k">8K</option>
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
                        <h2 className="text-2xl font-bold font-space">Available Video Wall Solutions</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 font-inter">
                                {products.length} products found
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 bg-red-600 text-white rounded-lg">
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
                            <h3 className="text-xl font-semibold mb-2 font-outfit">No Video Walls Found</h3>
                            <p className="text-gray-400 mb-4 font-inter">Try adjusting your filters or check back later for new products.</p>
                            <Link
                                href="/products"
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-inter"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>

                {/* Information Section */}
                <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <Info className="w-6 h-6 text-red-400" />
                        <h2 className="text-2xl font-bold font-space">About LED Video Walls</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Perfect For:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-red-400" />
                                    <span className="font-inter">Control rooms and monitoring centers</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-red-400" />
                                    <span className="font-inter">Corporate lobbies and conference rooms</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-red-400" />
                                    <span className="font-inter">Retail flagship stores</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-red-400" />
                                    <span className="font-inter">Broadcasting and studio environments</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-red-400" />
                                    <span className="font-inter">Event venues and exhibition halls</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Technical Advantages:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Ultra-narrow bezel for seamless appearance</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Advanced video processing capabilities</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Hot-swappable components</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Remote monitoring and management</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Multiple input format support</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Monitor, Star, ShoppingCart, Filter, Grid, Info, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function P4DisplaysPage() {
    const { user, isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        priceRange: '',
        brand: '',
        size: '',
        sortBy: 'newest'
    });

    useEffect(() => {
        const fetchP4Displays = async () => {
            try {
                const queryParams = new URLSearchParams({
                    category: 'led-displays',
                    pixelPitch: '4',
                    ...filters
                });

                const response = await fetch(`/api/products?${queryParams}`);
                const data = await response.json();

                if (response.ok) {
                    setProducts(data.products || []);
                }
            } catch (error) {
                console.error('Error fetching P4 displays:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchP4Displays();
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
                        <Monitor className="w-16 h-16 text-gray-600" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-inter">
                        P4 Display
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
                        <div className="text-gray-400 font-inter">Pixel Pitch</div>
                        <div className="text-white font-semibold font-geist">4mm</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Brightness</div>
                        <div className="text-white font-semibold font-geist">
                            {product.specifications?.brightness || '1000'} nits
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Size</div>
                        <div className="text-white font-semibold font-geist">
                            {product.specifications?.dimensions || '512x512'}mm
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 font-inter">Refresh Rate</div>
                        <div className="text-white font-semibold font-geist">
                            {product.specifications?.refreshRate || '1920'}Hz
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
                            ${product.price?.toLocaleString() || 199}
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
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-green-600/20 rounded-2xl border border-green-500/30">
                                <Monitor className="w-12 h-12 text-green-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            P4 LED Displays
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Versatile P4 LED displays offering the perfect balance of resolution and cost-effectiveness.
                            Ideal for retail environments, corporate displays, and mid-range indoor applications.
                        </p>

                        {/* Key Features */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">High Resolution</h3>
                                <p className="text-gray-400 text-sm font-inter">4mm pixel pitch for sharp imagery</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Cost Effective</h3>
                                <p className="text-gray-400 text-sm font-inter">Balanced performance and price</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Reliable Operation</h3>
                                <p className="text-gray-400 text-sm font-inter">24/7 continuous operation capability</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <h3 className="font-semibold mb-2 font-outfit">Easy Installation</h3>
                                <p className="text-gray-400 text-sm font-inter">Lightweight modular design</p>
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
                        <h2 className="text-lg font-semibold font-outfit">Filter Products</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.priceRange}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        >
                            <option value="">All Prices</option>
                            <option value="0-300">Under $300</option>
                            <option value="300-600">$300 - $600</option>
                            <option value="600-1000">$600 - $1,000</option>
                            <option value="1000+">Over $1,000</option>
                        </select>

                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.brand}
                            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                        >
                            <option value="">All Brands</option>
                            <option value="novastar">NovaStar</option>
                            <option value="linsn">Linsn</option>
                            <option value="colorlight">Colorlight</option>
                            <option value="kystar">Kystar</option>
                        </select>

                        <select
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-inter"
                            value={filters.size}
                            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                        >
                            <option value="">All Sizes</option>
                            <option value="512x512">512x512mm</option>
                            <option value="768x768">768x768mm</option>
                            <option value="1024x1024">1024x1024mm</option>
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
                        <h2 className="text-2xl font-bold font-space">Available P4 Displays</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 font-inter">
                                {products.length} products found
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
                            <h3 className="text-xl font-semibold mb-2 font-outfit">No P4 Displays Found</h3>
                            <p className="text-gray-400 mb-4 font-inter">Try adjusting your filters or check back later for new products.</p>
                            <Link
                                href="/products"
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>

                {/* Information Section */}
                <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <Info className="w-6 h-6 text-green-400" />
                        <h2 className="text-2xl font-bold font-space">About P4 LED Displays</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Perfect For:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Retail stores and shopping centers</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Corporate lobbies and reception areas</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Event spaces and exhibition halls</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Transportation hubs</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                    <span className="font-inter">Educational institutions</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Technical Advantages:</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Optimal viewing distance of 4-15 meters</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Energy-efficient LED technology</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Seamless modular construction</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Wide viewing angles</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">Excellent color uniformity</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

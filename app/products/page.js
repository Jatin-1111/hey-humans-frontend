"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Search, Filter, ShoppingCart, Eye, Star, Zap, Monitor, Palette, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsPage() {
    const { user, isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        availability: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0
    });

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'indoor', label: 'Indoor LED' },
        { value: 'outdoor', label: 'Outdoor LED' },
        { value: 'flexible', label: 'Flexible LED' },
        { value: 'transparent', label: 'Transparent LED' },
        { value: 'interactive', label: 'Interactive LED' },
        { value: 'rental', label: 'Rental LED' }
    ];

    const availabilityTypes = [
        { value: '', label: 'All Types' },
        { value: 'sale', label: 'For Sale' },
        { value: 'rent', label: 'For Rent' },
        { value: 'both', label: 'Sale & Rent' }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const queryParams = new URLSearchParams({
                    page: pagination.currentPage.toString(),
                    limit: '12',
                    ...(filters.category && { category: filters.category }),
                    ...(filters.minPrice && { minPrice: filters.minPrice }),
                    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                    ...(filters.type && { type: filters.type }),
                    ...(filters.availability && { availability: filters.availability }),
                    ...(filters.search && { search: filters.search })
                });

                const response = await fetch(`/api/products?${queryParams}`);
                const data = await response.json();

                if (response.ok) {
                    setProducts(data.products);
                    setPagination(data.pagination);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters, pagination.currentPage]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const addToCart = async (productId, type = 'purchase') => {
        if (!isAuthenticated) {
            alert('Please login to add items to cart');
            return;
        }

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    quantity: 1,
                    type
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Product added to cart!');
            } else {
                alert(data.message || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred');
        }
    };

    const ProductCard = ({ product }) => {
        const hasDiscount = product.pricing.sale?.discount > 0;
        const salePrice = hasDiscount
            ? product.pricing.sale.price * (1 - product.pricing.sale.discount / 100)
            : product.pricing.sale?.price;

        return (
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors group">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-800 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Monitor className="w-16 h-16 text-gray-600" />
                        </div>
                    )}

                    {hasDiscount && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                            {product.pricing.sale.discount}% OFF
                        </div>
                    )}

                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {product.specifications.size}
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 font-outfit line-clamp-2">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded font-inter">
                            {product.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded font-inter">
                            {product.specifications.pixelPitch}mm pitch
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 font-inter">
                        {product.description}
                    </p>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-400">
                            <Zap className="w-4 h-4 mr-1" />
                            <span className="font-inter">{product.specifications.brightness} nits</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Palette className="w-4 h-4 mr-1" />
                            <span className="font-inter">{product.specifications.colorDepth}bit</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Monitor className="w-4 h-4 mr-1" />
                            <span className="font-inter">{product.specifications.refreshRate}Hz</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Package className="w-4 h-4 mr-1" />
                            <span className="font-inter">{product.stock.available} units</span>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                        {product.pricing.sale && (
                            <div className="mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400 font-inter">Sale:</span>
                                    {hasDiscount && (
                                        <span className="text-sm text-gray-500 line-through font-inter">
                                            ${product.pricing.sale.price}
                                        </span>
                                    )}
                                    <span className="text-lg font-bold text-green-400 font-geist">
                                        ${salePrice?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {product.pricing.rent && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400 font-inter">Rent:</span>
                                    <span className="text-lg font-bold text-blue-400 font-geist">
                                        ${product.pricing.rent.daily}/day
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Link
                            href={`/products/${product._id}`}
                            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-center font-inter"
                        >
                            View Details
                        </Link>

                        {product.pricing.sale && (
                            <button
                                onClick={() => addToCart(product._id, 'purchase')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter"
                                title="Buy"
                            >
                                <ShoppingCart className="w-4 h-4" />
                            </button>
                        )}

                        {product.pricing.rent && (
                            <button
                                onClick={() => addToCart(product._id, 'rental')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                                title="Rent"
                            >
                                📅
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold font-space mb-2">
                                LED Display Marketplace
                            </h1>
                            <p className="text-gray-400 font-inter">
                                Buy or rent professional LED displays for your events and businesses
                            </p>
                        </div>

                        {isAuthenticated && (
                            <Link
                                href="/cart"
                                className="mt-4 lg:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                View Cart
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search LED displays..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Availability Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                Availability
                            </label>
                            <select
                                value={filters.availability}
                                onChange={(e) => handleFilterChange('availability', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                            >
                                {availabilityTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                Min Price
                            </label>
                            <input
                                type="number"
                                placeholder="Min $"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                Max Price
                            </label>
                            <input
                                type="number"
                                placeholder="Max $"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                            />
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setFilters({
                                        category: '',
                                        minPrice: '',
                                        maxPrice: '',
                                        type: '',
                                        availability: '',
                                        search: ''
                                    });
                                }}
                                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-inter"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 animate-pulse">
                                <div className="h-48 bg-gray-800"></div>
                                <div className="p-6">
                                    <div className="h-6 bg-gray-800 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-800 rounded"></div>
                                        <div className="h-3 bg-gray-800 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center space-x-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                                    disabled={pagination.currentPage === 1}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-inter"
                                >
                                    Previous
                                </button>

                                <span className="px-4 py-2 bg-gray-900 text-white rounded-lg font-inter">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>

                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-inter"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg font-inter">
                            No products found matching your criteria
                        </div>
                        <p className="text-gray-500 mt-2 font-inter">
                            Try adjusting your filters or check back later for new products
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

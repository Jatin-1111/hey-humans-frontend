"use client";
import { useState, useEffect } from 'react';
import { PartyPopper, Star, Calendar, Clock, Users, Music, ArrowRight, Package, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventRentalPage() {
    const [eventPackages, setEventPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching event rental packages
        setTimeout(() => {
            setEventPackages([
                {
                    id: 1,
                    name: "Small Event Package",
                    description: "Perfect for small gatherings, presentations, and intimate events",
                    price: 299,
                    duration: "1-3 days",
                    attendees: "Up to 50 people",
                    includes: ["2x P4 LED Panels", "Basic Controller", "Setup & Breakdown", "Technical Support"],
                    image: "/api/placeholder/400/250"
                },
                {
                    id: 2,
                    name: "Medium Event Package",
                    description: "Ideal for conferences, trade shows, and corporate events",
                    price: 599,
                    duration: "1-5 days",
                    attendees: "50-200 people",
                    includes: ["4x P2.5 LED Panels", "Advanced Controller", "Setup & Breakdown", "On-site Technician", "Live Streaming Setup"],
                    image: "/api/placeholder/400/250"
                },
                {
                    id: 3,
                    name: "Large Event Package",
                    description: "Complete solution for festivals, concerts, and major events",
                    price: 1299,
                    duration: "1-7 days",
                    attendees: "200+ people",
                    includes: ["8x P6 LED Panels", "Professional Controller", "Video Wall Configuration", "Full Technical Crew", "Live Streaming", "24/7 Support"],
                    image: "/api/placeholder/400/250"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const eventTypes = [
        {
            title: "Corporate Events",
            description: "Conferences, product launches, and business meetings",
            icon: Users,
            features: ["Professional presentation displays", "Live streaming capabilities", "Brand customization"]
        },
        {
            title: "Entertainment Events",
            description: "Concerts, festivals, and entertainment shows",
            icon: Music,
            features: ["High-brightness outdoor displays", "Stage backdrop screens", "Audience engagement displays"]
        },
        {
            title: "Special Occasions",
            description: "Weddings, parties, and celebrations",
            icon: PartyPopper,
            features: ["Custom content displays", "Photo slideshow capabilities", "Ambient lighting effects"]
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-purple-600/20 rounded-2xl border border-purple-500/30">
                                <PartyPopper className="w-12 h-12 text-purple-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            Event Equipment Rental
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Make your event unforgettable with our professional LED display rental packages.
                            From corporate conferences to outdoor festivals, we have the perfect solution.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-inter">
                                View Packages
                            </button>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-inter"
                            >
                                Custom Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Event Types */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Event Types We Serve</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {eventTypes.map((type, index) => {
                            const IconComponent = type.icon;
                            return (
                                <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                    <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-center mb-4 font-outfit">{type.title}</h3>
                                    <p className="text-gray-400 text-center mb-6 font-inter">{type.description}</p>
                                    <ul className="space-y-2">
                                        {type.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-gray-300">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="font-inter">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Event Packages */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Event Rental Packages</h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse">
                                    <div className="h-48 bg-gray-800 rounded mb-4"></div>
                                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                                    <div className="h-8 bg-gray-700 rounded mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-700 rounded"></div>
                                        <div className="h-4 bg-gray-700 rounded"></div>
                                        <div className="h-4 bg-gray-700 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {eventPackages.map((pkg) => (
                                <div key={pkg.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                                    <div className="aspect-video bg-gray-800 relative">
                                        <div className="flex items-center justify-center h-full">
                                            <Package className="w-16 h-16 text-gray-600" />
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2 font-outfit">{pkg.name}</h3>
                                        <p className="text-gray-400 text-sm mb-4 font-inter">{pkg.description}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                            <div className="bg-gray-800 rounded-lg p-3">
                                                <div className="text-gray-400 font-inter">Duration</div>
                                                <div className="text-white font-semibold font-geist">{pkg.duration}</div>
                                            </div>
                                            <div className="bg-gray-800 rounded-lg p-3">
                                                <div className="text-gray-400 font-inter">Capacity</div>
                                                <div className="text-white font-semibold font-geist">{pkg.attendees}</div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold mb-2 font-outfit">Package Includes:</h4>
                                            <ul className="space-y-1">
                                                {pkg.includes.map((item, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                                        <span className="font-inter">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-green-400 font-geist">
                                                    ${pkg.price}
                                                </div>
                                                <div className="text-sm text-gray-400 font-inter">Starting price</div>
                                            </div>
                                            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-inter">
                                                Select Package
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Process */}
                <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Event Rental Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-400 font-geist">1</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Consultation</h3>
                            <p className="text-gray-400 text-sm font-inter">Discuss your event requirements and choose the perfect package</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-green-400 font-geist">2</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Planning</h3>
                            <p className="text-gray-400 text-sm font-inter">Site survey and detailed planning for optimal display placement</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-400 font-geist">3</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Setup</h3>
                            <p className="text-gray-400 text-sm font-inter">Professional installation and testing before your event</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-yellow-400 font-geist">4</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Support</h3>
                            <p className="text-gray-400 text-sm font-inter">On-site technical support throughout your event</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

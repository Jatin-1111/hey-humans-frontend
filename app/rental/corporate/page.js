"use client";
import { useState, useEffect } from 'react';
import { Building, Star, Calendar, Users, Briefcase, TrendingUp, ArrowRight, Package, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CorporateRentalPage() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching corporate packages
        setTimeout(() => {
            setPackages([
                {
                    id: 1,
                    name: "Executive Boardroom",
                    description: "Premium displays for C-suite presentations and board meetings",
                    monthlyRate: 899,
                    setup: "Professional installation",
                    support: "Dedicated account manager",
                    features: ["4K Video Wall", "Wireless Presentation", "Video Conferencing Ready", "Content Management"],
                    ideal: "10-20 person boardrooms"
                },
                {
                    id: 2,
                    name: "Conference Center",
                    description: "Scalable solution for large conference rooms and auditoriums",
                    monthlyRate: 1499,
                    setup: "Full system integration",
                    support: "On-site technical team",
                    features: ["Large Format Displays", "Multi-source Input", "Live Streaming", "Interactive Capabilities", "Mobile Control"],
                    ideal: "50-200 person venues"
                },
                {
                    id: 3,
                    name: "Corporate Campus",
                    description: "Enterprise-wide digital signage and communication displays",
                    monthlyRate: 2999,
                    setup: "Campus-wide deployment",
                    support: "24/7 monitoring & support",
                    features: ["Multiple Display Network", "Content Distribution", "Central Management", "Analytics Dashboard", "Custom Integration"],
                    ideal: "Multi-building facilities"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const benefits = [
        {
            title: "Predictable Costs",
            description: "Fixed monthly rates for better budget planning",
            icon: TrendingUp
        },
        {
            title: "Professional Support",
            description: "Dedicated account management and technical support",
            icon: Users
        },
        {
            title: "Scalable Solutions",
            description: "Easily add or modify displays as your needs grow",
            icon: Building
        },
        {
            title: "Latest Technology",
            description: "Regular updates and access to newest display technology",
            icon: Briefcase
        }
    ];

    const industries = [
        "Financial Services",
        "Healthcare Systems",
        "Technology Companies",
        "Manufacturing",
        "Education Institutions",
        "Government Agencies"
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                                <Building className="w-12 h-12 text-blue-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            Corporate Equipment Rental
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Transform your corporate communications with professional LED display solutions.
                            Long-term rentals designed for businesses that demand reliability and excellence.
                        </p>

                        {/* Key Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-blue-400 mb-1 font-geist">500+</div>
                                <p className="text-gray-400 text-sm font-inter">Corporate clients</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-green-400 mb-1 font-geist">99.9%</div>
                                <p className="text-gray-400 text-sm font-inter">Uptime guarantee</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-purple-400 mb-1 font-geist">24/7</div>
                                <p className="text-gray-400 text-sm font-inter">Technical support</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-yellow-400 mb-1 font-geist">30%</div>
                                <p className="text-gray-400 text-sm font-inter">Cost savings vs purchase</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Corporate Benefits */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Corporate Rental Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => {
                            const IconComponent = benefit.icon;
                            return (
                                <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                                    <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3 font-outfit">{benefit.title}</h3>
                                    <p className="text-gray-400 text-sm font-inter">{benefit.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Corporate Packages */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Corporate Rental Packages</h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-pulse">
                                    <div className="h-6 bg-gray-700 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-700 rounded mb-6"></div>
                                    <div className="h-8 bg-gray-700 rounded mb-6"></div>
                                    <div className="space-y-2 mb-6">
                                        <div className="h-4 bg-gray-700 rounded"></div>
                                        <div className="h-4 bg-gray-700 rounded"></div>
                                        <div className="h-4 bg-gray-700 rounded"></div>
                                    </div>
                                    <div className="h-10 bg-gray-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {packages.map((pkg) => (
                                <div key={pkg.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                                    <h3 className="text-xl font-semibold mb-2 font-outfit">{pkg.name}</h3>
                                    <p className="text-gray-400 text-sm mb-6 font-inter">{pkg.description}</p>

                                    <div className="text-center mb-6">
                                        <div className="text-3xl font-bold text-green-400 mb-1 font-geist">
                                            ${pkg.monthlyRate.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-400 font-inter">per month</div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                            <span className="text-gray-300 font-inter">{pkg.setup}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-green-400" />
                                            <span className="text-gray-300 font-inter">{pkg.support}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Building className="w-4 h-4 text-purple-400" />
                                            <span className="text-gray-300 font-inter">{pkg.ideal}</span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold mb-3 font-outfit">Package Features:</h4>
                                        <ul className="space-y-2">
                                            {pkg.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                                    <span className="font-inter">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter">
                                        Request Quote
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Industries Served */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Industries We Serve</h2>
                    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {industries.map((industry, index) => (
                                <div key={index} className="flex items-center gap-2 text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                    <span className="font-inter">{industry}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Process */}
                <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Corporate Rental Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-blue-400 font-geist">1</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Consultation</h3>
                            <p className="text-gray-400 text-sm font-inter">Assess your corporate communication needs</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-green-400 font-geist">2</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Site Survey</h3>
                            <p className="text-gray-400 text-sm font-inter">Professional assessment of your facilities</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-purple-400 font-geist">3</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Custom Design</h3>
                            <p className="text-gray-400 text-sm font-inter">Tailored solution for your brand and space</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-yellow-400 font-geist">4</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Installation</h3>
                            <p className="text-gray-400 text-sm font-inter">Professional deployment and testing</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-red-400 font-geist">5</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 font-outfit">Ongoing Support</h3>
                            <p className="text-gray-400 text-sm font-inter">Dedicated account management and maintenance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

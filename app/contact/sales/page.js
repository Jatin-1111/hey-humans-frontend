"use client";
import { useState } from 'react';
import { User, Mail, Phone, Building2, DollarSign, Calendar, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SalesInquiryPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: '',
        budget: '',
        timeline: '',
        description: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sales inquiry submitted:', formData);
        // Handle form submission
    };

    const salesTeam = [
        {
            name: "Sarah Chen",
            role: "Senior Sales Director",
            speciality: "Enterprise Solutions",
            email: "sarah.chen@heyhumans.com",
            phone: "+1 (555) 123-4567",
            image: "/api/placeholder/100/100"
        },
        {
            name: "Marcus Rodriguez",
            role: "Regional Sales Manager",
            speciality: "Mid-Market & SMB",
            email: "marcus.r@heyhumans.com",
            phone: "+1 (555) 234-5678",
            image: "/api/placeholder/100/100"
        },
        {
            name: "Emma Thompson",
            role: "Technical Sales Specialist",
            speciality: "Custom Integrations",
            email: "emma.t@heyhumans.com",
            phone: "+1 (555) 345-6789",
            image: "/api/placeholder/100/100"
        }
    ];

    const inquiryTypes = [
        "LED Display Purchase",
        "Video Wall Installation",
        "Rental Services",
        "Custom Integration",
        "Maintenance Contract",
        "Training Services",
        "Other"
    ];

    const budgetRanges = [
        "Under $5,000",
        "$5,000 - $25,000",
        "$25,000 - $100,000",
        "$100,000 - $500,000",
        "$500,000+",
        "Need consultation"
    ];

    const timelines = [
        "Immediate (Within 30 days)",
        "Short-term (1-3 months)",
        "Medium-term (3-6 months)",
        "Long-term (6+ months)",
        "Planning phase"
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-green-600/20 rounded-2xl border border-green-500/30">
                                <DollarSign className="w-12 h-12 text-green-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            Sales Inquiry
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Ready to transform your visual communications? Our sales team is here to help you find the perfect LED display solution for your needs.
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-green-400 mb-1 font-geist">24hrs</div>
                                <p className="text-gray-400 text-sm font-inter">Response time</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-blue-400 mb-1 font-geist">98%</div>
                                <p className="text-gray-400 text-sm font-inter">Customer satisfaction</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-purple-400 mb-1 font-geist">5000+</div>
                                <p className="text-gray-400 text-sm font-inter">Projects delivered</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Sales Form */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8 font-space">Get a Custom Quote</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                                            placeholder="your.email@company.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Company Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                                            placeholder="Your company name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 font-outfit">Inquiry Type *</label>
                                <select
                                    name="inquiryType"
                                    value={formData.inquiryType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                                    required
                                >
                                    <option value="">Select inquiry type</option>
                                    {inquiryTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Budget Range</label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                                    >
                                        <option value="">Select budget range</option>
                                        {budgetRanges.map((range) => (
                                            <option key={range} value={range}>{range}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Timeline</label>
                                    <select
                                        name="timeline"
                                        value={formData.timeline}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                                    >
                                        <option value="">Select timeline</option>
                                        {timelines.map((timeline) => (
                                            <option key={timeline} value={timeline}>{timeline}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 font-outfit">Project Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
                                    placeholder="Please describe your project requirements, desired features, installation location, and any specific needs..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter font-medium flex items-center justify-center gap-2"
                            >
                                Submit Sales Inquiry
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Sales Team */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8 font-space">Meet Our Sales Team</h2>
                        <div className="space-y-6">
                            {salesTeam.map((member, index) => (
                                <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-1 font-outfit">{member.name}</h3>
                                            <p className="text-green-400 text-sm mb-2 font-inter">{member.role}</p>
                                            <p className="text-gray-400 text-sm mb-4 font-inter">Specializes in {member.speciality}</p>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <a href={`mailto:${member.email}`} className="text-blue-400 hover:text-blue-300 font-inter">
                                                        {member.email}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <a href={`tel:${member.phone}`} className="text-blue-400 hover:text-blue-300 font-inter">
                                                        {member.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sales Process */}
                        <div className="mt-12 bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h3 className="text-xl font-semibold mb-6 font-outfit">Our Sales Process</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="font-inter">Initial consultation & needs assessment</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="font-inter">Site survey & technical evaluation</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="font-inter">Custom proposal & detailed quote</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="font-inter">Contract negotiation & finalization</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="font-inter">Project management & delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

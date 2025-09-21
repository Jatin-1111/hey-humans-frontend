"use client";
import { useState } from 'react';
import { Headphones, AlertCircle, Clock, CheckCircle, User, Mail, Phone, FileText, Wrench, Monitor } from 'lucide-react';
import Link from 'next/link';

export default function TechnicalSupportPage() {
    const [ticketForm, setTicketForm] = useState({
        name: '',
        email: '',
        phone: '',
        priority: '',
        category: '',
        subject: '',
        description: ''
    });

    const handleInputChange = (e) => {
        setTicketForm({
            ...ticketForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Support ticket submitted:', ticketForm);
        // Handle form submission
    };

    const supportCategories = [
        "Display Issues",
        "Installation Support",
        "Software Configuration",
        "Network Connectivity",
        "Hardware Troubleshooting",
        "Maintenance Request",
        "Training & Documentation",
        "Other Technical Issues"
    ];

    const priorityLevels = [
        { value: "low", label: "Low - General inquiry", color: "text-blue-400" },
        { value: "medium", label: "Medium - Non-critical issue", color: "text-yellow-400" },
        { value: "high", label: "High - Business impact", color: "text-orange-400" },
        { value: "critical", label: "Critical - System down", color: "text-red-400" }
    ];

    const supportTeam = [
        {
            name: "David Park",
            role: "Senior Technical Support Engineer",
            speciality: "Hardware & Installation",
            availability: "Mon-Fri 8AM-6PM EST",
            languages: ["English", "Korean"]
        },
        {
            name: "Lisa Johnson",
            role: "Software Support Specialist",
            speciality: "Configuration & Integration",
            availability: "Mon-Fri 9AM-5PM EST",
            languages: ["English", "Spanish"]
        },
        {
            name: "Ahmed Hassan",
            role: "24/7 Emergency Support",
            speciality: "Critical Issue Resolution",
            availability: "24/7 On-call",
            languages: ["English", "Arabic"]
        }
    ];

    const supportChannels = [
        {
            title: "24/7 Phone Support",
            description: "Immediate assistance for critical issues",
            contact: "+1 (800) SUPPORT",
            availability: "24/7",
            icon: Phone,
            color: "text-green-400"
        },
        {
            title: "Email Support",
            description: "Detailed technical assistance",
            contact: "support@heyhumans.com",
            availability: "Response within 4 hours",
            icon: Mail,
            color: "text-blue-400"
        },
        {
            title: "Remote Assistance",
            description: "Screen sharing for complex issues",
            contact: "Schedule via support portal",
            availability: "Mon-Fri business hours",
            icon: Monitor,
            color: "text-purple-400"
        }
    ];

    const commonIssues = [
        {
            title: "Display Not Turning On",
            description: "Check power connections and LED indicators",
            steps: ["Verify power cable connection", "Check wall outlet", "Inspect LED status lights", "Test with different power source"]
        },
        {
            title: "Poor Image Quality",
            description: "Optimize display settings and connections",
            steps: ["Check input resolution settings", "Verify cable connections", "Adjust brightness and contrast", "Update display drivers"]
        },
        {
            title: "Network Connectivity Issues",
            description: "Troubleshoot network and streaming problems",
            steps: ["Check network cable connection", "Verify IP settings", "Test network speed", "Restart network equipment"]
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                                <Headphones className="w-12 h-12 text-blue-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            Technical Support
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Get expert technical assistance for your LED displays and installations. Our support team is available 24/7 to help you resolve any issues quickly.
                        </p>

                        {/* Support Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-green-400 mb-1 font-geist">24/7</div>
                                <p className="text-gray-400 text-sm font-inter">Support availability</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-blue-400 mb-1 font-geist">&lt;15min</div>
                                <p className="text-gray-400 text-sm font-inter">Average response time</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-purple-400 mb-1 font-geist">99.5%</div>
                                <p className="text-gray-400 text-sm font-inter">First-call resolution</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <div className="text-2xl font-bold text-yellow-400 mb-1 font-geist">4.9/5</div>
                                <p className="text-gray-400 text-sm font-inter">Customer satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Support Channels */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Support Channels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {supportChannels.map((channel, index) => {
                            const IconComponent = channel.icon;
                            return (
                                <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className={`w-8 h-8 ${channel.color}`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3 font-outfit">{channel.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 font-inter">{channel.description}</p>
                                    <div className="space-y-2">
                                        <p className={`font-medium ${channel.color} font-inter`}>{channel.contact}</p>
                                        <p className="text-gray-500 text-xs font-inter">{channel.availability}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Support Ticket Form */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8 font-space">Submit Support Ticket</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={ticketForm.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
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
                                            value={ticketForm.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                            placeholder="your.email@company.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 font-outfit">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={ticketForm.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Priority Level *</label>
                                    <select
                                        name="priority"
                                        value={ticketForm.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                        required
                                    >
                                        <option value="">Select priority</option>
                                        {priorityLevels.map((level) => (
                                            <option key={level.value} value={level.value}>{level.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 font-outfit">Issue Category *</label>
                                    <select
                                        name="category"
                                        value={ticketForm.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {supportCategories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 font-outfit">Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={ticketForm.subject}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                    placeholder="Brief description of the issue"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 font-outfit">Detailed Description *</label>
                                <textarea
                                    name="description"
                                    value={ticketForm.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                    placeholder="Please provide detailed information about the issue, error messages, steps to reproduce, and any troubleshooting already attempted..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter font-medium flex items-center justify-center gap-2"
                            >
                                <FileText className="w-5 h-5" />
                                Submit Support Ticket
                            </button>
                        </form>
                    </div>

                    {/* Support Information */}
                    <div className="space-y-8">
                        {/* Support Team */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8 font-space">Support Team</h2>
                            <div className="space-y-6">
                                {supportTeam.map((member, index) => (
                                    <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold mb-1 font-outfit">{member.name}</h3>
                                                <p className="text-blue-400 text-sm mb-2 font-inter">{member.role}</p>
                                                <p className="text-gray-400 text-sm mb-3 font-inter">{member.speciality}</p>

                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-300 font-inter">{member.availability}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-400 font-inter">Languages:</span>
                                                        <span className="text-gray-300 font-inter">{member.languages.join(", ")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Common Issues */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 font-space">Common Issues & Solutions</h3>
                            <div className="space-y-6">
                                {commonIssues.map((issue, index) => (
                                    <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                        <h4 className="text-lg font-semibold mb-2 font-outfit">{issue.title}</h4>
                                        <p className="text-gray-400 text-sm mb-4 font-inter">{issue.description}</p>
                                        <div className="space-y-2">
                                            {issue.steps.map((step, stepIndex) => (
                                                <div key={stepIndex} className="flex items-center gap-2 text-sm">
                                                    <span className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center text-xs text-blue-400 font-geist">
                                                        {stepIndex + 1}
                                                    </span>
                                                    <span className="text-gray-300 font-inter">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

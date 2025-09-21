"use client";
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        urgency: 'normal'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    category: 'general',
                    message: '',
                    urgency: 'normal'
                });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Get help via email with detailed responses',
            value: 'support@heyhumans.com',
            action: 'mailto:support@heyhumans.com',
            response: '24 hours'
        },
        {
            icon: Phone,
            title: 'Phone Support',
            description: 'Speak directly with our support team',
            value: '+1 (555) 123-4567',
            action: 'tel:+15551234567',
            response: 'Immediate'
        },
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Real-time chat with our experts',
            value: 'Available 9 AM - 6 PM EST',
            action: '/contact/chat',
            response: 'Instant'
        }
    ];

    const departments = [
        {
            title: 'Sales Department',
            description: 'Product inquiries, quotes, and purchase assistance',
            icon: ShoppingBag,
            link: '/contact/sales',
            hours: '9 AM - 7 PM EST',
            specialization: 'Product recommendations, pricing, bulk orders'
        },
        {
            title: 'Technical Support',
            description: 'Installation help, troubleshooting, and technical questions',
            icon: Headphones,
            link: '/contact/support',
            hours: '24/7 Support',
            specialization: 'Setup assistance, repairs, maintenance'
        },
        {
            title: 'Live Chat',
            description: 'Instant messaging with our customer service team',
            icon: MessageCircle,
            link: '/contact/chat',
            hours: '9 AM - 6 PM EST',
            specialization: 'Quick questions, order status, general help'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-space">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter">
                            Have questions about our products or services? Our team is here to help.
                            Choose the best way to reach us based on your needs.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {contactMethods.map((method, index) => {
                        const IconComponent = method.icon;
                        return (
                            <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
                                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IconComponent className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 font-outfit">{method.title}</h3>
                                <p className="text-gray-400 mb-4 font-inter">{method.description}</p>
                                <div className="text-blue-400 font-semibold mb-2 font-geist">{method.value}</div>
                                <div className="text-sm text-gray-500 mb-4 font-inter">Response: {method.response}</div>
                                <Link
                                    href={method.action}
                                    className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                                >
                                    Contact Now
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Specialized Departments */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12 font-space">Specialized Support</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {departments.map((dept, index) => {
                            const IconComponent = dept.icon;
                            return (
                                <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                            <IconComponent className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold font-outfit">{dept.title}</h3>
                                            <div className="text-sm text-gray-400 font-inter">{dept.hours}</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-4 font-inter">{dept.description}</p>
                                    <div className="text-sm text-gray-500 mb-4 font-inter">
                                        <strong>Specializes in:</strong> {dept.specialization}
                                    </div>
                                    <Link
                                        href={dept.link}
                                        className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-inter"
                                    >
                                        Contact Department
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-8 font-space">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-inter">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none font-inter"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-inter">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none font-inter"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-inter">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none font-inter"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="sales">Sales</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="feedback">Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 font-inter">Urgency</label>
                                    <select
                                        name="urgency"
                                        value={formData.urgency}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none font-inter"
                                    >
                                        <option value="low">Low - General question</option>
                                        <option value="normal">Normal - Standard inquiry</option>
                                        <option value="high">High - Urgent matter</option>
                                        <option value="critical">Critical - Emergency</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 font-inter">Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none font-inter"
                                    placeholder="Brief description of your inquiry"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 font-inter">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none font-inter"
                                    placeholder="Please provide details about your inquiry..."
                                />
                            </div>

                            {submitStatus === 'success' && (
                                <div className="p-4 bg-green-600/20 border border-green-600 rounded-lg">
                                    <p className="text-green-400 font-inter">Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.</p>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="p-4 bg-red-600/20 border border-red-600 rounded-lg">
                                    <p className="text-red-400 font-inter">Sorry, there was an error sending your message. Please try again or contact us directly.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-inter"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8 font-space">Contact Information</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 font-outfit">Office Address</h3>
                                    <p className="text-gray-300 font-inter">
                                        123 Innovation Drive<br />
                                        Tech Valley, CA 94025<br />
                                        United States
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 font-outfit">Business Hours</h3>
                                    <div className="text-gray-300 space-y-1 font-inter">
                                        <p>Monday - Friday: 9:00 AM - 7:00 PM EST</p>
                                        <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                                        <p>Sunday: Closed</p>
                                        <p className="text-blue-400 mt-2">Emergency support: 24/7</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 font-outfit">Email Addresses</h3>
                                    <div className="text-gray-300 space-y-1 font-inter">
                                        <p>General: info@heyhumans.com</p>
                                        <p>Sales: sales@heyhumans.com</p>
                                        <p>Support: support@heyhumans.com</p>
                                        <p>Partnerships: partners@heyhumans.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Response Times */}
                        <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-800">
                            <h3 className="text-lg font-semibold mb-4 font-outfit">Expected Response Times</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 font-inter">General Inquiries:</span>
                                    <span className="text-white font-inter">24-48 hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 font-inter">Sales Questions:</span>
                                    <span className="text-white font-inter">4-8 hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 font-inter">Technical Support:</span>
                                    <span className="text-white font-inter">2-4 hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 font-inter">Critical Issues:</span>
                                    <span className="text-green-400 font-inter">Within 1 hour</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

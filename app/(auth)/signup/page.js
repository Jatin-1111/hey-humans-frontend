"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle, Sparkles, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        interestedInFreelancing: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        // Clear errors when user starts typing
        if (errors.length > 0) setErrors([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully!');

                // ONLY use the token if provided
                if (data.token) {
                    login(data.token); // Pass only token
                }

                setTimeout(() => {
                    router.push(data.requiresVerification ? '/verify-email' : '/dashboard');
                }, 2000);
            } else {
                setErrors(data.details || [data.error]);
            }
        } catch (err) {
            setErrors(['Network error. Please try again.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-8">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold font-space">Hey Humanz</span>
                    </Link>
                    <h2 className="text-3xl font-bold text-white font-outfit">Create your account</h2>
                    <p className="mt-2 text-gray-400 font-inter">Join the unified creative platform</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                            Full Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                            Email Address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                            Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                placeholder="Create a strong password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                )}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 font-inter">
                            Must include uppercase, lowercase, number, and special character
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                            Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                                placeholder="Enter your address"
                            />
                        </div>
                    </div>

                    {/* NEW: Freelancer Interest */}
                    <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 pt-0.5">
                                <input
                                    id="interestedInFreelancing"
                                    name="interestedInFreelancing"
                                    type="checkbox"
                                    checked={formData.interestedInFreelancing}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="interestedInFreelancing" className="flex items-center cursor-pointer">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Briefcase className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm font-medium text-blue-400 font-outfit">
                                            I want to offer freelancing services
                                        </span>
                                    </div>
                                </label>
                                <p className="text-xs text-gray-400 font-inter">
                                    Enable freelancer mode to start offering video editing, motion graphics, and other creative services
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error Messages */}
                    {errors.length > 0 && (
                        <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-red-400 font-medium font-inter mb-2">Please fix the following issues:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {errors.map((error, index) => (
                                            <li key={index} className="text-red-300 text-sm font-inter">{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-inter">{success}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-geist"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                Creating account...
                            </div>
                        ) : (
                            'Create account'
                        )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center">
                        <span className="text-gray-400 font-inter">Already have an account? </span>
                        <Link
                            href="/login"
                            className="text-blue-400 hover:text-blue-300 transition-colors font-medium font-inter"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>

                {/* Feature Preview */}
                {formData.interestedInFreelancing && (
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-6">
                        <h3 className="text-white font-medium mb-2 font-outfit">What you&apos;ll be able to do:</h3>
                        <ul className="space-y-1 text-sm text-gray-300 font-inter">
                            <li>• Browse and bid on video editing projects</li>
                            <li>• Showcase your portfolio to potential clients</li>
                            <li>• Set your own hourly rates</li>
                            <li>• Build your reputation with reviews</li>
                            <li>• Plus: Shop LED displays and place orders</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
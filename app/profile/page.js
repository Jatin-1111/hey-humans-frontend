"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Star, Briefcase, Plus, Edit, Save, X, ExternalLink, Award, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        freelancerProfile: {
            title: '',
            hourlyRate: '',
            skills: [],
            bio: '',
            experience: '',
            education: [],
            certifications: [],
            portfolio: [],
            services: [],
            availability: 'available'
        }
    });
    const [newSkill, setNewSkill] = useState('');
    const [newService, setNewService] = useState('');
    const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });
    const [newCertification, setNewCertification] = useState({ name: '', issuer: '', year: '' });
    const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', url: '' });

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/users/profile');
            const data = await response.json();

            if (response.ok) {
                setProfile(data.user);
                setFormData({
                    name: data.user.name || '',
                    email: data.user.email || '',
                    phone: data.user.phone || '',
                    address: data.user.address || '',
                    freelancerProfile: {
                        title: data.user.freelancerProfile?.title || '',
                        hourlyRate: data.user.freelancerProfile?.hourlyRate || '',
                        skills: data.user.freelancerProfile?.skills || [],
                        bio: data.user.freelancerProfile?.bio || '',
                        experience: data.user.freelancerProfile?.experience || '',
                        education: data.user.freelancerProfile?.education || [],
                        certifications: data.user.freelancerProfile?.certifications || [],
                        portfolio: data.user.freelancerProfile?.portfolio || [],
                        services: data.user.freelancerProfile?.services || [],
                        availability: data.user.freelancerProfile?.availability || 'available'
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.user);
                setEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating profile');
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.freelancerProfile.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                freelancerProfile: {
                    ...prev.freelancerProfile,
                    skills: [...prev.freelancerProfile.skills, newSkill.trim()]
                }
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            freelancerProfile: {
                ...prev.freelancerProfile,
                skills: prev.freelancerProfile.skills.filter(s => s !== skill)
            }
        }));
    };

    const addService = () => {
        if (newService.trim() && !formData.freelancerProfile.services.includes(newService.trim())) {
            setFormData(prev => ({
                ...prev,
                freelancerProfile: {
                    ...prev.freelancerProfile,
                    services: [...prev.freelancerProfile.services, newService.trim()]
                }
            }));
            setNewService('');
        }
    };

    const removeService = (service) => {
        setFormData(prev => ({
            ...prev,
            freelancerProfile: {
                ...prev.freelancerProfile,
                services: prev.freelancerProfile.services.filter(s => s !== service)
            }
        }));
    };

    const addEducation = () => {
        if (newEducation.degree && newEducation.institution) {
            setFormData(prev => ({
                ...prev,
                freelancerProfile: {
                    ...prev.freelancerProfile,
                    education: [...prev.freelancerProfile.education, newEducation]
                }
            }));
            setNewEducation({ degree: '', institution: '', year: '' });
        }
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            freelancerProfile: {
                ...prev.freelancerProfile,
                education: prev.freelancerProfile.education.filter((_, i) => i !== index)
            }
        }));
    };

    const addCertification = () => {
        if (newCertification.name && newCertification.issuer) {
            setFormData(prev => ({
                ...prev,
                freelancerProfile: {
                    ...prev.freelancerProfile,
                    certifications: [...prev.freelancerProfile.certifications, newCertification]
                }
            }));
            setNewCertification({ name: '', issuer: '', year: '' });
        }
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            freelancerProfile: {
                ...prev.freelancerProfile,
                certifications: prev.freelancerProfile.certifications.filter((_, i) => i !== index)
            }
        }));
    };

    const addPortfolio = () => {
        if (newPortfolio.title && newPortfolio.url) {
            setFormData(prev => ({
                ...prev,
                freelancerProfile: {
                    ...prev.freelancerProfile,
                    portfolio: [...prev.freelancerProfile.portfolio, newPortfolio]
                }
            }));
            setNewPortfolio({ title: '', description: '', url: '' });
        }
    };

    const removePortfolio = (index) => {
        setFormData(prev => ({
            ...prev,
            freelancerProfile: {
                ...prev.freelancerProfile,
                portfolio: prev.freelancerProfile.portfolio.filter((_, i) => i !== index)
            }
        }));
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 font-space">Please Sign In</h1>
                    <p className="text-gray-400 mb-8 font-inter">You need to be logged in to view your profile.</p>
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Link
                            href="/dashboard"
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mr-6 font-inter"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold font-space">My Profile</h1>
                    </div>
                    <button
                        onClick={() => editing ? handleSave() : setEditing(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                    >
                        {editing ? (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        ) : (
                            <>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <h2 className="text-xl font-semibold mb-6 font-outfit">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                    Full Name
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                    />
                                ) : (
                                    <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-inter">
                                        {profile?.name || 'Not provided'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                    Email
                                </label>
                                <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-inter">
                                    {profile?.email}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                    Phone
                                </label>
                                {editing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                        placeholder="Your phone number"
                                    />
                                ) : (
                                    <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-inter">
                                        {profile?.phone || 'Not provided'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                    Address
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                        placeholder="Your address"
                                    />
                                ) : (
                                    <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-inter">
                                        {profile?.address || 'Not provided'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Freelancer Profile */}
                    {(profile?.canFreelance || user?.canFreelance) && (
                        <>
                            {/* Professional Info */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-6 font-outfit">Professional Information</h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                                Professional Title
                                            </label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.freelancerProfile.title}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        freelancerProfile: { ...prev.freelancerProfile, title: e.target.value }
                                                    }))}
                                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                                    placeholder="e.g. Senior Video Editor"
                                                />
                                            ) : (
                                                <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-inter">
                                                    {profile?.freelancerProfile?.title || 'Not provided'}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                                Hourly Rate ($)
                                            </label>
                                            {editing ? (
                                                <input
                                                    type="number"
                                                    value={formData.freelancerProfile.hourlyRate}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        freelancerProfile: { ...prev.freelancerProfile, hourlyRate: e.target.value }
                                                    }))}
                                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                                    placeholder="50"
                                                    min="1"
                                                />
                                            ) : (
                                                <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-inter">
                                                    ${profile?.freelancerProfile?.hourlyRate || 0}/hour
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                            Professional Bio
                                        </label>
                                        {editing ? (
                                            <textarea
                                                value={formData.freelancerProfile.bio}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    freelancerProfile: { ...prev.freelancerProfile, bio: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                                rows="4"
                                                placeholder="Tell clients about your experience and expertise..."
                                            />
                                        ) : (
                                            <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-inter">
                                                {profile?.freelancerProfile?.bio || 'Not provided'}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                            Experience Level
                                        </label>
                                        {editing ? (
                                            <select
                                                value={formData.freelancerProfile.experience}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    freelancerProfile: { ...prev.freelancerProfile, experience: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                            >
                                                <option value="">Select experience level</option>
                                                <option value="beginner">Beginner (0-1 years)</option>
                                                <option value="intermediate">Intermediate (1-3 years)</option>
                                                <option value="advanced">Advanced (3-5 years)</option>
                                                <option value="expert">Expert (5+ years)</option>
                                            </select>
                                        ) : (
                                            <div className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-inter capitalize">
                                                {profile?.freelancerProfile?.experience || 'Not provided'}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                                            Availability Status
                                        </label>
                                        {editing ? (
                                            <select
                                                value={formData.freelancerProfile.availability}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    freelancerProfile: { ...prev.freelancerProfile, availability: e.target.value }
                                                }))}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                            >
                                                <option value="available">Available</option>
                                                <option value="busy">Busy</option>
                                                <option value="unavailable">Unavailable</option>
                                            </select>
                                        ) : (
                                            <div className={`px-4 py-2 rounded-lg font-inter capitalize ${profile?.freelancerProfile?.availability === 'available'
                                                    ? 'bg-green-600/20 text-green-400'
                                                    : profile?.freelancerProfile?.availability === 'busy'
                                                        ? 'bg-yellow-600/20 text-yellow-400'
                                                        : 'bg-red-600/20 text-red-400'
                                                }`}>
                                                {profile?.freelancerProfile?.availability || 'available'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-6 font-outfit">Skills</h2>

                                {editing && (
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                            placeholder="Add a skill..."
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {(editing ? formData.freelancerProfile.skills : profile?.freelancerProfile?.skills || []).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-inter"
                                        >
                                            {skill}
                                            {editing && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="text-blue-400 hover:text-red-400"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Services */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-6 font-outfit">Services Offered</h2>

                                {editing && (
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={newService}
                                            onChange={(e) => setNewService(e.target.value)}
                                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                            placeholder="Add a service..."
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addService}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {(editing ? formData.freelancerProfile.services : profile?.freelancerProfile?.services || []).map((service, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-inter"
                                        >
                                            {service}
                                            {editing && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeService(service)}
                                                    className="text-green-400 hover:text-red-400"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Portfolio */}
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-6 font-outfit">Portfolio</h2>

                                {editing && (
                                    <div className="space-y-3 mb-6 p-4 bg-gray-800 rounded-lg">
                                        <input
                                            type="text"
                                            value={newPortfolio.title}
                                            onChange={(e) => setNewPortfolio(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                            placeholder="Project title..."
                                        />
                                        <input
                                            type="url"
                                            value={newPortfolio.url}
                                            onChange={(e) => setNewPortfolio(prev => ({ ...prev, url: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                            placeholder="Project URL..."
                                        />
                                        <textarea
                                            value={newPortfolio.description}
                                            onChange={(e) => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                                            placeholder="Project description..."
                                            rows="2"
                                        />
                                        <button
                                            type="button"
                                            onClick={addPortfolio}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-inter"
                                        >
                                            Add Portfolio Item
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {(editing ? formData.freelancerProfile.portfolio : profile?.freelancerProfile?.portfolio || []).map((item, index) => (
                                        <div key={index} className="bg-gray-800 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-white font-semibold font-outfit">{item.title}</h3>
                                                    {item.description && (
                                                        <p className="text-gray-400 text-sm mt-1 font-inter">{item.description}</p>
                                                    )}
                                                    <a
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mt-2 font-inter"
                                                    >
                                                        View Project <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                                {editing && (
                                                    <button
                                                        onClick={() => removePortfolio(index)}
                                                        className="text-red-400 hover:text-red-300 ml-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Stats */}
                    {profile?.freelancerProfile && (
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h2 className="text-xl font-semibold mb-6 font-outfit">Statistics</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-400 font-geist">
                                        {profile.freelancerProfile.completedProjects || 0}
                                    </div>
                                    <div className="text-sm text-gray-400 font-inter">Completed Projects</div>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                        <span className="text-2xl font-bold text-yellow-400 font-geist">
                                            {profile.freelancerProfile.rating?.average?.toFixed(1) || '0.0'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400 font-inter">Average Rating</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400 font-geist">
                                        ${profile.freelancerProfile.totalEarnings || 0}
                                    </div>
                                    <div className="text-sm text-gray-400 font-inter">Total Earnings</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400 font-geist">
                                        {profile.freelancerProfile.rating?.count || 0}
                                    </div>
                                    <div className="text-sm text-gray-400 font-inter">Reviews</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {editing && (
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => setEditing(false)}
                            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-inter"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

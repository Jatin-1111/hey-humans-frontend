"use client";
import React, { useState, useEffect } from "react";
import { MenuItem, Menu, ProductItem, HoveredLink } from "@/components/ui/NavbarMenu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Monitor, Calendar, ShoppingCart, ChevronDown, ArrowRight, Sparkles, Menu as MenuIcon, User, LogIn, Phone, Mail, MessageCircle, MapPin } from "lucide-react";

const Navbar = ({ className }) => {
    const [active, setActive] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setExpandedSection(null);
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const menuSections = [
        {
            id: 'services',
            title: 'Video Services',
            icon: <Play size={20} />,
            color: 'blue',
            description: 'Professional video editing & creation',
            items: [
                { title: 'Video Editing', href: '/video-editing', desc: 'Professional cuts & transitions' },
                { title: 'Motion Graphics', href: '/motion-graphics', desc: 'Animations & visual effects' },
                { title: 'Color Grading', href: '/color-grading', desc: 'Professional color correction' },
                { title: 'Audio Post', href: '/audio-post', desc: 'Sound design & mixing' }
            ]
        },
        {
            id: 'displays',
            title: 'LED Displays',
            icon: <Monitor size={20} />,
            color: 'green',
            description: 'Premium LED screens & video walls',
            items: [
                { title: 'P2.5 Indoor LED', href: '/displays/p2-5', desc: 'High-resolution indoor displays', badge: 'Popular' },
                { title: 'P4 Outdoor LED', href: '/displays/p4', desc: 'Weather-resistant screens' },
                { title: 'P6 Event Screens', href: '/displays/p6', desc: 'Perfect for concerts & festivals' },
                { title: 'Video Wall Solutions', href: '/displays/video-walls', desc: 'Custom configurations' }
            ]
        },
        {
            id: 'rental',
            title: 'Equipment Rental',
            icon: <Calendar size={20} />,
            color: 'purple',
            description: 'Flexible rental solutions',
            items: [
                { title: 'Short Term (1-7 days)', href: '/rental/short-term', desc: 'Events & conferences' },
                { title: 'Monthly Packages', href: '/rental/monthly', desc: 'Extended installations' },
                { title: 'Event Rentals', href: '/rental/events', desc: 'Complete event solutions' },
                { title: 'Corporate Solutions', href: '/rental/corporate', desc: 'Business installations' }
            ]
        },
        {
            id: 'marketplace',
            title: 'Marketplace',
            icon: <ShoppingCart size={20} />,
            color: 'yellow',
            description: 'Browse everything in one place',
            items: [
                { title: 'Browse All', href: '/marketplace', desc: 'Complete marketplace view', featured: true }
            ]
        },
        {
            id: 'contact',
            title: 'Contact',
            icon: <Phone size={20} />,
            color: 'orange',
            description: 'Get in touch with our team',
            items: [
                { title: 'Sales Inquiry', href: '/contact/sales', desc: 'Quote requests & purchases' },
                { title: 'Technical Support', href: '/contact/support', desc: '24/7 technical assistance' },
                { title: 'General Contact', href: '/contact', desc: 'Questions & feedback' },
                { title: 'Live Chat', href: '/contact/chat', desc: 'Instant messaging support', badge: 'Live' }
            ]
        },
        {
            id: 'account',
            title: 'Account',
            icon: <User size={20} />,
            color: 'indigo',
            description: 'Sign in or create account',
            items: [
                { title: 'Login', href: '/login', desc: 'Access your account' },
                { title: 'Sign Up', href: '/signup', desc: 'Create a new account', badge: 'Free' }
            ]
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
            green: 'text-green-400 bg-green-400/10 border-green-400/20',
            purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
            yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
            indigo: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20'
        };
        return colors[color] || colors.blue;
    };

    return (
        <>
            {/* Desktop Navbar */}
            <div className={cn("hidden lg:block fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
                <Menu setActive={setActive}>
                    <MenuItem setActive={setActive} active={active} item="Services">
                        <div className="flex flex-col space-y-4 text-sm">
                            <HoveredLink href="/video-editing">Video Editing</HoveredLink>
                            <HoveredLink href="/motion-graphics">Motion Graphics</HoveredLink>
                            <HoveredLink href="/color-grading">Color Grading</HoveredLink>
                            <HoveredLink href="/audio-post">Audio Post-Production</HoveredLink>
                        </div>
                    </MenuItem>

                    <MenuItem setActive={setActive} active={active} item="LED Displays">
                        <div className="text-sm grid grid-cols-2 gap-10 p-4">
                            <ProductItem
                                title="P2.5 Indoor LED"
                                href="/displays/p2-5"
                                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
                                description="High-resolution indoor displays for premium viewing experience"
                            />
                            <ProductItem
                                title="P4 Outdoor LED"
                                href="/displays/p4"
                                src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop"
                                description="Weather-resistant outdoor screens for events and advertising"
                            />
                            <ProductItem
                                title="P6 Event Screens"
                                href="/displays/p6"
                                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop"
                                description="Large format displays perfect for concerts and festivals"
                            />
                            <ProductItem
                                title="Video Wall Solutions"
                                href="/displays/video-walls"
                                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop"
                                description="Custom video wall configurations for corporate spaces"
                            />
                        </div>
                    </MenuItem>

                    <MenuItem setActive={setActive} active={active} item="Rental">
                        <div className="flex flex-col space-y-4 text-sm">
                            <HoveredLink href="/rental/short-term">Short Term (1-7 days)</HoveredLink>
                            <HoveredLink href="/rental/monthly">Monthly Packages</HoveredLink>
                            <HoveredLink href="/rental/events">Event Rentals</HoveredLink>
                            <HoveredLink href="/rental/corporate">Corporate Solutions</HoveredLink>
                        </div>
                    </MenuItem>

                    <MenuItem setActive={setActive} active={active} item="Marketplace">
                        <div className="text-sm grid grid-cols-1 gap-10 p-4">
                            <ProductItem
                                title="Browse All"
                                href="/marketplace"
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop"
                                description="Explore our complete marketplace of services and displays"
                            />
                        </div>
                    </MenuItem>

                    <MenuItem setActive={setActive} active={active} item="Contact">
                        <div className="text-sm grid grid-cols-2 gap-10 p-4">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Phone className="text-blue-500" size={20} />
                                    <div>
                                        <h4 className="font-bold text-black dark:text-white font-outfit">Phone</h4>
                                        <p className="text-neutral-700 dark:text-neutral-300 font-inter">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="text-green-500" size={20} />
                                    <div>
                                        <h4 className="font-bold text-black dark:text-white font-outfit">Email</h4>
                                        <p className="text-neutral-700 dark:text-neutral-300 font-inter">hello@heyhumanz.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MessageCircle className="text-purple-500" size={20} />
                                    <div>
                                        <HoveredLink href="/contact/chat">
                                            <h4 className="font-bold font-outfit">Live Chat</h4>
                                            <p className="text-neutral-700 dark:text-neutral-300 font-inter">Available 24/7</p>
                                        </HoveredLink>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <HoveredLink href="/contact/sales">Sales Inquiry</HoveredLink>
                                <HoveredLink href="/contact/support">Technical Support</HoveredLink>
                                <HoveredLink href="/contact">General Contact</HoveredLink>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="text-orange-500" size={16} />
                                    <p className="text-neutral-700 dark:text-neutral-300 text-xs font-inter">
                                        San Francisco, CA
                                    </p>
                                </div>
                            </div>
                        </div>
                    </MenuItem>

                    <MenuItem setActive={setActive} active={active} item="Account">
                        <div className="text-sm grid grid-cols-1 gap-4 p-4 min-w-[280px]">
                            <div className="space-y-4">
                                <a
                                    href="/login"
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <LogIn className="text-blue-500" size={20} />
                                    <div>
                                        <h4 className="font-bold text-black dark:text-white font-outfit">Login</h4>
                                        <p className="text-neutral-700 dark:text-neutral-300 text-xs font-inter">Access your account</p>
                                    </div>
                                </a>
                                <a
                                    href="/signup"
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-green-500/20 bg-green-50/50 dark:bg-green-900/20"
                                >
                                    <User className="text-green-500" size={20} />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h4 className="font-bold text-black dark:text-white font-outfit">Sign Up</h4>
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full font-geist font-medium">Free</span>
                                        </div>
                                        <p className="text-neutral-700 dark:text-neutral-300 text-xs font-inter">Create a new account</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </MenuItem>
                </Menu>
            </div>

            {/* Mobile Navbar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center justify-between px-6 py-4">
                    {/* Logo - Space Grotesk for brand consistency */}
                    <motion.div
                        className="text-white font-bold text-xl flex items-center gap-2 font-space tracking-tight"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Sparkles className="text-blue-400" size={24} />
                        Hey Humanz
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="relative w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors z-[110]"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <MenuIcon size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={closeMobileMenu}
                        />

                        {/* Mobile Menu Content */}
                        <motion.div
                            className="fixed top-[73px] left-0 right-0 bottom-0 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl overflow-y-auto z-[95]"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 100, damping: 25 }}
                        >
                            <div className="px-6 py-8 space-y-6">
                                {/* Menu Sections */}
                                {menuSections.map((section, index) => (
                                    <motion.div
                                        key={section.id}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden"
                                    >
                                        <motion.button
                                            onClick={() => toggleSection(section.id)}
                                            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-3 rounded-xl border",
                                                    getColorClasses(section.color)
                                                )}>
                                                    {section.icon}
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-white font-semibold text-lg font-outfit">
                                                        {section.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm font-inter">
                                                        {section.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ChevronDown className="text-gray-400" size={20} />
                                            </motion.div>
                                        </motion.button>

                                        <AnimatePresence>
                                            {expandedSection === section.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="border-t border-white/10"
                                                >
                                                    <div className="p-6 space-y-3">
                                                        {section.items.map((item, itemIndex) => (
                                                            <motion.a
                                                                key={item.title}
                                                                href={item.href}
                                                                onClick={closeMobileMenu}
                                                                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
                                                                initial={{ opacity: 0, x: 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.05 * itemIndex }}
                                                                whileHover={{ scale: 1.02, x: 10 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3">
                                                                        <h4 className="text-white font-medium font-outfit">
                                                                            {item.title}
                                                                        </h4>
                                                                        {item.badge && (
                                                                            <span className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded-full font-geist font-medium">
                                                                                {item.badge}
                                                                            </span>
                                                                        )}
                                                                        {item.featured && (
                                                                            <Sparkles className="text-yellow-400" size={16} />
                                                                        )}
                                                                    </div>
                                                                    <p className="text-gray-400 text-sm mt-1 font-inter">
                                                                        {item.desc}
                                                                    </p>
                                                                </div>
                                                                <ArrowRight
                                                                    className="text-gray-400 group-hover:text-white transition-colors"
                                                                    size={16}
                                                                />
                                                            </motion.a>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}

                                {/* CTA Buttons */}
                                <motion.div
                                    className="pt-6 space-y-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <motion.button
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl font-geist"
                                        onClick={closeMobileMenu}
                                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Get Started Today
                                    </motion.button>
                                    <motion.button
                                        className="w-full border-2 border-white/20 text-white py-4 rounded-2xl font-semibold hover:bg-white/10 transition-colors font-geist"
                                        onClick={closeMobileMenu}
                                        whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.4)" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Contact Sales
                                    </motion.button>
                                </motion.div>

                                {/* Bottom padding for scroll */}
                                <div className="h-20"></div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
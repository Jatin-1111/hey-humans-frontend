"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Play, ShoppingCart, Calendar, Star, Users, Clock, Zap, Shield, Award } from "lucide-react";

// Tabs Component
const Tabs = ({
    tabs: propTabs,
    containerClassName,
    activeTabClassName,
    tabClassName,
    contentClassName
}) => {
    const [active, setActive] = useState(propTabs[0]);
    const [tabs, setTabs] = useState(propTabs);

    const moveSelectedTabToTop = (idx) => {
        const newTabs = [...propTabs];
        const selectedTab = newTabs.splice(idx, 1);
        newTabs.unshift(selectedTab[0]);
        setTabs(newTabs);
        setActive(newTabs[0]);
    };

    const [hovering, setHovering] = useState(false);

    return (
        <>
            <div className={cn(
                "flex flex-row items-center justify-center [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full mb-16",
                containerClassName
            )}>
                {propTabs.map((tab, idx) => (
                    <button
                        key={tab.title}
                        onClick={() => moveSelectedTabToTop(idx)}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                        className={cn(
                            "relative px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 mx-2",
                            tabClassName
                        )}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {active.value === tab.value && (
                            <motion.div
                                layoutId="clickedbutton"
                                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                className={cn(
                                    "absolute inset-0 bg-white rounded-full shadow-xl",
                                    activeTabClassName
                                )}
                            />
                        )}
                        <span className={cn(
                            "relative block flex items-center gap-2 transition-colors",
                            active.value === tab.value ? "text-black" : "text-white"
                        )}>
                            {tab.icon}
                            {tab.title}
                        </span>
                    </button>
                ))}
            </div>
            <FadeInDiv
                tabs={tabs}
                active={active}
                key={active.value}
                hovering={hovering}
                className={cn("", contentClassName)}
            />
        </>
    );
};

const FadeInDiv = ({ className, tabs, hovering }) => {
    const isActive = (tab) => tab.value === tabs[0].value;

    return (
        <div className="relative w-full h-full">
            {tabs.map((tab, idx) => (
                <motion.div
                    key={tab.value}
                    layoutId={tab.value}
                    style={{
                        scale: 1 - idx * 0.05,
                        top: hovering ? idx * -30 : 0,
                        zIndex: -idx,
                        opacity: idx < 3 ? 1 - idx * 0.15 : 0,
                    }}
                    animate={{
                        y: isActive(tab) ? [0, 20, 0] : 0,
                    }}
                    className={cn("w-full h-full absolute top-0 left-0", className)}
                >
                    {tab.content}
                </motion.div>
            ))}
        </div>
    );
};

// Content Components
const VideoEditingContent = () => (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Video Editing Services
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                    Connect with professional video editors, motion graphics artists, and creative specialists
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Star className="text-yellow-400" size={20} />
                        <span>4.9★ Average Rating</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="text-blue-400" size={20} />
                        <span>1000+ Professional Editors</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="text-green-400" size={20} />
                        <span>24-48 Hour Turnaround</span>
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                        Find Editors
                    </button>
                    <button className="border border-white/30 px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                        View Portfolio
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Play className="mx-auto mb-2 text-blue-400" size={24} />
                    <h4 className="font-semibold">Video Editing</h4>
                    <p className="text-sm text-gray-400">Professional cuts & transitions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Zap className="mx-auto mb-2 text-purple-400" size={24} />
                    <h4 className="font-semibold">Motion Graphics</h4>
                    <p className="text-sm text-gray-400">Animations & visual effects</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Shield className="mx-auto mb-2 text-green-400" size={24} />
                    <h4 className="font-semibold">Color Grading</h4>
                    <p className="text-sm text-gray-400">Professional color correction</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Award className="mx-auto mb-2 text-yellow-400" size={24} />
                    <h4 className="font-semibold">Audio Post</h4>
                    <p className="text-sm text-gray-400">Sound design & mixing</p>
                </div>
            </div>
        </div>
    </div>
);

const SellingContent = () => (
    <div className="bg-gradient-to-br from-green-900 to-black rounded-3xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    LED Display Sales
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                    Purchase premium LED screens and video walls for permanent installations
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Shield className="text-green-400" size={20} />
                        <span>2-Year Warranty</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Zap className="text-blue-400" size={20} />
                        <span>P2.5 - P10 Pixel Range</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="text-purple-400" size={20} />
                        <span>Installation Support</span>
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                        Shop Displays
                    </button>
                    <button className="border border-white/30 px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                        Get Quote
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-green-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-green-400 font-bold">P2.5</span>
                    </div>
                    <h4 className="font-semibold">Indoor HD</h4>
                    <p className="text-sm text-gray-400">Premium indoor displays</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-blue-400 font-bold">P4</span>
                    </div>
                    <h4 className="font-semibold">Outdoor</h4>
                    <p className="text-sm text-gray-400">Weather-resistant screens</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-purple-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-purple-400 font-bold">P6</span>
                    </div>
                    <h4 className="font-semibold">Events</h4>
                    <p className="text-sm text-gray-400">Large format displays</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-yellow-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-yellow-400 font-bold">Wall</span>
                    </div>
                    <h4 className="font-semibold">Video Walls</h4>
                    <p className="text-sm text-gray-400">Custom configurations</p>
                </div>
            </div>
        </div>
    </div>
);

const RentalContent = () => (
    <div className="bg-gradient-to-br from-purple-900 to-black rounded-3xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Equipment Rental
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                    Rent LED displays for events, conferences, and temporary installations
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-purple-400" size={20} />
                        <span>Flexible Duration</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="text-green-400" size={20} />
                        <span>Setup & Support Included</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="text-blue-400" size={20} />
                        <span>Same-Day Delivery</span>
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                        Browse Rentals
                    </button>
                    <button className="border border-white/30 px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                        Calculate Cost
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Calendar className="mx-auto mb-2 text-purple-400" size={24} />
                    <h4 className="font-semibold">Daily</h4>
                    <p className="text-sm text-gray-400">Short-term events</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Clock className="mx-auto mb-2 text-blue-400" size={24} />
                    <h4 className="font-semibold">Weekly</h4>
                    <p className="text-sm text-gray-400">Conference packages</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Users className="mx-auto mb-2 text-green-400" size={24} />
                    <h4 className="font-semibold">Monthly</h4>
                    <p className="text-sm text-gray-400">Long-term installations</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <Award className="mx-auto mb-2 text-yellow-400" size={24} />
                    <h4 className="font-semibold">Custom</h4>
                    <p className="text-sm text-gray-400">Tailored solutions</p>
                </div>
            </div>
        </div>
    </div>
);

// Main Component
const MarketplaceTabsSection = () => {
    const tabs = [
        {
            title: "Video Editing",
            value: "editing",
            icon: <Play size={20} />,
            content: <VideoEditingContent />
        },
        {
            title: "LED Displays",
            value: "selling",
            icon: <ShoppingCart size={20} />,
            content: <SellingContent />
        },
        {
            title: "Equipment Rental",
            value: "rental",
            icon: <Calendar size={20} />,
            content: <RentalContent />
        }
    ];

    return (
        <section className="py-20 bg-black text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Your Complete Digital Ecosystem
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        From content creation to display solutions - everything you need in one platform
                    </motion.p>
                </div>

                <Tabs
                    tabs={tabs}
                    containerClassName="mb-12"
                    activeTabClassName="bg-white shadow-2xl"
                    tabClassName="hover:scale-105"
                    contentClassName="min-h-[500px]"
                />
            </div>
        </section>
    );
};

export default MarketplaceTabsSection;
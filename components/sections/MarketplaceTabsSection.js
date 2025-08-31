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
            {/* Responsive Tab Navigation */}
            <div className={cn(
                "flex flex-col sm:flex-row items-center justify-center [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full mb-8 sm:mb-12 lg:mb-16",
                containerClassName
            )}>
                <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto justify-center">
                    {propTabs.map((tab, idx) => (
                        <button
                            key={tab.title}
                            onClick={() => moveSelectedTabToTop(idx)}
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}
                            className={cn(
                                "relative px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-geist font-semibold transition-all duration-300 flex-shrink-0",
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
                                "relative flex items-center gap-1.5 sm:gap-2 transition-colors",
                                active.value === tab.value ? "text-black" : "text-white"
                            )}>
                                <span className="w-4 h-4 sm:w-5 sm:h-5">
                                    {tab.icon}
                                </span>
                                <span className="hidden sm:inline lg:inline">
                                    {tab.title}
                                </span>
                                {/* Mobile short titles */}
                                <span className="sm:hidden lg:hidden text-xs">
                                    {tab.title.split(' ')[0]}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
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
        <div className="relative w-full min-h-[600px] sm:min-h-[700px] lg:min-h-[500px] overflow-hidden">
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
                    className={cn("w-full min-h-[600px] sm:min-h-[700px] lg:min-h-[500px] absolute top-0 left-0 overflow-hidden", className)}
                >
                    {tab.content}
                </motion.div>
            ))}
        </div>
    );
};

// Content Components - Mobile Optimized
const VideoEditingContent = () => (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white w-full max-w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="order-2 lg:order-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-space tracking-tight leading-tight">
                    Video Editing Services
                </h3>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6 font-inter leading-relaxed">
                    Connect with professional video editors, motion graphics artists, and creative specialists
                </p>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                        <Star className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">4.9★ Average Rating</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">1000+ Professional Editors</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="text-green-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">24-48 Hour Turnaround</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-geist font-semibold hover:scale-105 transition-transform text-sm sm:text-base w-full sm:w-auto">
                        Find Editors
                    </button>
                    <button className="border border-white/30 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-white/10 transition-colors font-geist font-medium text-sm sm:text-base w-full sm:w-auto">
                        View Portfolio
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 order-1 lg:order-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <Play className="mx-auto mb-2 text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Video Editing</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Professional cuts & transitions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <Zap className="mx-auto mb-2 text-purple-400 w-5 h-5 sm:w-6 sm:h-6" />
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Motion Graphics</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Animations & visual effects</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <Shield className="mx-auto mb-2 text-green-400 w-5 h-5 sm:w-6 sm:h-6" />
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Color Grading</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Professional color correction</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <Award className="mx-auto mb-2 text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Audio Post</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Sound design & mixing</p>
                </div>
            </div>
        </div>
    </div>
);

const SellingContent = () => (
    <div className="bg-gradient-to-br from-green-900 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white w-full max-w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="order-2 lg:order-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-space tracking-tight leading-tight">
                    LED Display Sales
                </h3>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6 font-inter leading-relaxed">
                    Purchase premium LED screens and video walls for permanent installations
                </p>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                        <Shield className="text-green-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">2-Year Warranty</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Zap className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">P2.5 - P10 Pixel Range</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">Installation Support</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-geist font-semibold hover:scale-105 transition-transform text-sm sm:text-base w-full sm:w-auto">
                        Shop Displays
                    </button>
                    <button className="border border-white/30 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-white/10 transition-colors font-geist font-medium text-sm sm:text-base w-full sm:w-auto">
                        Get Quote
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 order-1 lg:order-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-green-400 font-bold font-geist text-sm sm:text-base">P2.5</span>
                    </div>
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Indoor HD</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Premium indoor displays</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-blue-400 font-bold font-geist text-sm sm:text-base">P4</span>
                    </div>
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Outdoor</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Weather-resistant screens</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-purple-400 font-bold font-geist text-sm sm:text-base">P6</span>
                    </div>
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Events</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Large format displays</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-yellow-400 font-bold font-geist text-sm sm:text-base">Wall</span>
                    </div>
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Video Walls</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Custom configurations</p>
                </div>
            </div>
        </div>
    </div>
);

const RentalContent = () => (
    <div className="bg-gradient-to-br from-purple-900 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white w-full max-w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="order-2 lg:order-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-space tracking-tight leading-tight">
                    Equipment Rental
                </h3>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6 font-inter leading-relaxed">
                    Rent LED displays for events, conferences, and temporary installations
                </p>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">Flexible Duration</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="text-green-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">Setup & Support Included</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-inter font-medium text-sm sm:text-base">Same-Day Delivery</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-geist font-semibold hover:scale-105 transition-transform text-sm sm:text-base w-full sm:w-auto">
                        Browse Rentals
                    </button>
                    <button className="border border-white/30 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-white/10 transition-colors font-geist font-medium text-sm sm:text-base w-full sm:w-auto">
                        Calculate Cost
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 order-1 lg:order-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <Calendar className="mx-auto mb-2 text-purple-400 w-5 h-5 sm:w-6 sm:h-6" />
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Daily</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Short-term events</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <Clock className="mx-auto mb-2 text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Weekly</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Conference packages</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <Users className="mx-auto mb-2 text-green-400 w-5 h-5 sm:w-6 sm:h-6" />
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Monthly</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Long-term installations</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <Award className="mx-auto mb-2 text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
                    <h4 className="font-outfit font-semibold text-sm sm:text-base">Custom</h4>
                    <p className="text-xs sm:text-sm text-gray-400 font-inter">Tailored solutions</p>
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
        <section className="py-12 sm:py-16 lg:py-20 bg-black text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header - Fully Responsive */}
                <div className="text-center mb-12 sm:mb-16">
                    <motion.h2
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent mb-4 sm:mb-6 font-space tracking-tight leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Your Complete Digital Ecosystem
                    </motion.h2>
                    <motion.p
                        className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-400 max-w-xs sm:max-w-md lg:max-w-3xl mx-auto font-inter leading-relaxed px-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        From content creation to display solutions - everything you need in one platform
                    </motion.p>
                </div>

                {/* Responsive Tabs */}
                <div className="w-full overflow-hidden">
                    <Tabs
                        tabs={tabs}
                        containerClassName="mb-8 sm:mb-12"
                        activeTabClassName="bg-white shadow-2xl"
                        tabClassName="hover:scale-105"
                        contentClassName="min-h-[600px] sm:min-h-[700px] lg:min-h-[500px] w-full"
                    />
                </div>
            </div>
        </section>
    );
};

export default MarketplaceTabsSection;
"use client";
import React, { useState } from "react";
import { ImagesSlider } from "../ui/ImageSlider";
import { motion } from "framer-motion";
import { Play, Monitor, ShoppingCart } from "lucide-react";

const HeroSection = () => {
    const [activeTab, setActiveTab] = useState("services");

    const images = [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    ];

    const tabContent = {
        services: {
            title: "Video Creation Services",
            subtitle: "Connect with professional video editors & creators",
            buttons: [
                { text: "Find Video Editors", primary: true },
                { text: "Start Creating", primary: false }
            ],
            stats: [
                { value: "1000+", label: "Professional Editors" },
                { value: "50K+", label: "Projects Completed" },
                { value: "4.9★", label: "Average Rating" }
            ]
        },
        displays: {
            title: "LED Display Solutions",
            subtitle: "Buy or rent premium LED screens & video walls",
            buttons: [
                { text: "Shop Displays", primary: true },
                { text: "View Rentals", primary: false }
            ],
            stats: [
                { value: "P2.5-P10", label: "Pixel Pitch Range" },
                { value: "500+", label: "Screens Available" },
                { value: "24/7", label: "Support & Setup" }
            ]
        },
        marketplace: {
            title: "Complete Digital Ecosystem",
            subtitle: "Create content + Display it = One powerful platform",
            buttons: [
                { text: "Explore Marketplace", primary: true },
                { text: "Get Started", primary: false }
            ],
            stats: [
                { value: "All-in-One", label: "Solution" },
                { value: "100K+", label: "Happy Clients" },
                { value: "Global", label: "Reach" }
            ]
        }
    };

    const currentContent = tabContent[activeTab];

    return (
        <ImagesSlider className="h-screen" images={images}>
            <motion.div
                initial={{
                    opacity: 0,
                    y: -80,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.6,
                }}
                className="z-50 flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10"
            >
                {/* Brand Logo - Fully Responsive */}
                <motion.h1
                    className="font-space font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 py-2 sm:py-4 tracking-tight leading-tight"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Hey Humanz
                </motion.h1>

                {/* Tab Navigation - Mobile Optimized */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 bg-black/20 backdrop-blur-md rounded-full p-1.5 sm:p-2 max-w-md sm:max-w-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <button
                        onClick={() => setActiveTab("services")}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 font-geist font-medium text-xs sm:text-sm lg:text-base ${activeTab === "services"
                            ? "bg-white text-black"
                            : "text-white hover:bg-white/10"
                            }`}
                    >
                        <Play size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden xs:inline sm:inline">Services</span>
                        <span className="xs:hidden sm:hidden">S</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("displays")}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 font-geist font-medium text-xs sm:text-sm lg:text-base ${activeTab === "displays"
                            ? "bg-white text-black"
                            : "text-white hover:bg-white/10"
                            }`}
                    >
                        <Monitor size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden xs:inline sm:inline">Displays</span>
                        <span className="xs:hidden sm:hidden">D</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("marketplace")}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 font-geist font-medium text-xs sm:text-sm lg:text-base ${activeTab === "marketplace"
                            ? "bg-white text-black"
                            : "text-white hover:bg-white/10"
                            }`}
                    >
                        <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden xs:inline sm:inline">All-in-One</span>
                        <span className="xs:hidden sm:hidden">A</span>
                    </button>
                </motion.div>

                {/* Dynamic Content - Mobile First */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center w-full max-w-4xl"
                >
                    {/* Section Title - Responsive Typography */}
                    <motion.h2
                        className="font-outfit font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-3 sm:mb-4 tracking-tight leading-tight px-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        {currentContent.title}
                    </motion.h2>

                    {/* Subtitle - Mobile Optimized */}
                    <motion.p
                        className="font-inter font-normal text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-neutral-300 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl text-center mx-auto mb-6 sm:mb-8 leading-relaxed px-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        {currentContent.subtitle}
                    </motion.p>

                    {/* Buttons - Responsive Stacking */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center px-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        {currentContent.buttons.map((button, index) => (
                            <button
                                key={index}
                                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-geist font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-105 shadow-xl w-full sm:w-auto ${button.primary
                                    ? "bg-white text-black hover:bg-gray-200"
                                    : "border border-white/30 text-white hover:bg-white/10"
                                    }`}
                            >
                                {button.text}
                            </button>
                        ))}
                    </motion.div>

                    {/* Stats - Mobile Grid Layout */}
                    <motion.div
                        className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-neutral-300 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        {currentContent.stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white font-geist tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm lg:text-base font-inter font-medium leading-tight">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Quick Access Pills - Responsive Layout */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 max-w-xs sm:max-w-md lg:max-w-lg px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-inter font-medium text-center">
                        P2.5 • P4 • P6 Displays
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-inter font-medium text-center">
                        Video Editing Services
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-inter font-medium text-center">
                        Rental Solutions
                    </span>
                </motion.div>
            </motion.div>
        </ImagesSlider>
    );
};

export default HeroSection;
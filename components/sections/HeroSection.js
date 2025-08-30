"use client";
import React, { useState } from "react";
import { ImagesSlider } from "../ui/ImageSlider";
import { motion } from "motion/react";
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
                className="z-50 flex flex-col justify-center items-center max-w-6xl mx-auto px-6"
            >
                {/* Brand Logo */}
                <motion.h1
                    className="font-bold text-4xl md:text-6xl lg:text-8xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 py-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    VideoVault
                </motion.h1>

                {/* Tab Navigation */}
                <motion.div
                    className="flex flex-wrap justify-center gap-4 mb-8 bg-black/20 backdrop-blur-md rounded-full p-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <button
                        onClick={() => setActiveTab("services")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "services"
                                ? "bg-white text-black"
                                : "text-white hover:bg-white/10"
                            }`}
                    >
                        <Play size={18} />
                        <span className="hidden sm:inline">Services</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("displays")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "displays"
                                ? "bg-white text-black"
                                : "text-white hover:bg-white/10"
                            }`}
                    >
                        <Monitor size={18} />
                        <span className="hidden sm:inline">Displays</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("marketplace")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "marketplace"
                                ? "bg-white text-black"
                                : "text-white hover:bg-white/10"
                            }`}
                    >
                        <ShoppingCart size={18} />
                        <span className="hidden sm:inline">All-in-One</span>
                    </button>
                </motion.div>

                {/* Dynamic Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <motion.h2
                        className="font-bold text-2xl md:text-4xl text-white mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        {currentContent.title}
                    </motion.h2>

                    <motion.p
                        className="font-normal text-base md:text-xl text-neutral-300 max-w-lg text-center mx-auto mb-8"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        {currentContent.subtitle}
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mb-12 justify-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        {currentContent.buttons.map((button, index) => (
                            <button
                                key={index}
                                className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl ${button.primary
                                        ? "bg-white text-black hover:bg-gray-200"
                                        : "border border-white/30 text-white hover:bg-white/10"
                                    }`}
                            >
                                {button.text}
                            </button>
                        ))}
                    </motion.div>

                    <motion.div
                        className="flex flex-wrap justify-center gap-8 text-neutral-300 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        {currentContent.stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs md:text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Quick Access Pills */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3 mt-8 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs">
                        P2.5 • P4 • P6 Displays
                    </span>
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs">
                        Video Editing Services
                    </span>
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs">
                        Rental Solutions
                    </span>
                </motion.div>
            </motion.div>
        </ImagesSlider>
    );
};

export default HeroSection;

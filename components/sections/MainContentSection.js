"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const MainContentSection = () => {
    const logoRef = useRef(null);
    const textLinesRef = useRef([]);
    const ctaRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set(logoRef.current, { scale: 0 });
            gsap.set(textLinesRef.current, {
                clipPath: 'inset(100% 0 0 0)',
                y: 50
            });
            gsap.set(ctaRef.current, {
                opacity: 0,
                y: 30
            });

            // Cards initial positions with varied transforms
            cardsRef.current.forEach((card, i) => {
                const isLeft = i % 2 === 0;
                gsap.set(card, {
                    x: isLeft ? -200 : 200,
                    y: gsap.utils.random(-100, 100),
                    rotation: gsap.utils.random(-15, 15),
                    opacity: 0.7
                });
            });

            // Logo scale animation
            gsap.to(logoRef.current, {
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".main-section",
                    start: "top 75%",
                    end: "top 25%",
                    scrub: 1,
                    toggleActions: "play reverse play reverse"
                }
            });

            // Text lines staggered reveal
            gsap.to(textLinesRef.current, {
                clipPath: 'inset(0% 0 0 0)',
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".main-section",
                    start: "top 60%",
                    toggleActions: "play reverse play reverse"
                }
            });

            // CTA button fade in
            gsap.to(ctaRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".main-section",
                    start: "top 40%",
                    toggleActions: "play reverse play reverse"
                }
            });

            // Cards animation on scroll
            cardsRef.current.forEach((card, i) => {
                gsap.to(card, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "top 15%",
                        scrub: 1,
                        toggleActions: "play reverse play reverse"
                    }
                });
            });

        });

        return () => ctx.revert();
    }, []);

    const addToTextRefs = (el) => {
        if (el && !textLinesRef.current.includes(el)) {
            textLinesRef.current.push(el);
        }
    };

    const addToCardsRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    return (
        <section className="main-section relative min-h-[150vh] px-6 py-20 bg-black text-white">
            <div className="max-w-6xl mx-auto">
                {/* Logo - Space Grotesk for brand consistency */}
                <div className="text-center mb-16">
                    <h1
                        ref={logoRef}
                        className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent font-space tracking-tight py-2"
                    >
                        Hey Humanz
                    </h1>
                </div>

                {/* Text Content - Strategic font mixing */}
                <div className="text-center mb-16 space-y-6">
                    <h2
                        ref={addToTextRefs}
                        className="text-2xl md:text-4xl font-light leading-relaxed font-outfit tracking-wide"
                    >
                        Triple Marketplace Revolution
                    </h2>
                    <p
                        ref={addToTextRefs}
                        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed"
                    >
                        Video Creation Services • LED Display Sales • Equipment Rentals
                    </p>
                    <p
                        ref={addToTextRefs}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-inter leading-relaxed"
                    >
                        One platform for content creators, display buyers, and event organizers
                    </p>
                </div>

                {/* CTA Button - Geist for UI elements */}
                <div className="text-center mb-32">
                    <button
                        ref={ctaRef}
                        className="bg-white text-black px-8 py-4 rounded-full text-lg font-geist font-semibold hover:bg-gray-200 transition-colors duration-300 hover:scale-105 transform"
                    >
                        Explore Hey Humanz
                    </button>
                </div>

                {/* Image Cards Grid */}
                <div className="space-y-20">
                    {/* Row 1 - Video Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        <div
                            ref={addToCardsRefs}
                            className="w-full max-w-md mx-auto md:ml-auto md:mr-0 relative h-72"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=360&fit=crop"
                                alt="Video Editing Setup"
                                fill
                                className="object-cover rounded-xl shadow-xl"
                                sizes="(max-width: 768px) 90vw, 40vw"
                            />
                        </div>
                        <div
                            ref={addToCardsRefs}
                            className="w-full max-w-md mx-auto md:mr-auto md:ml-0 relative h-72"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=360&fit=crop"
                                alt="Creative Workspace"
                                fill
                                className="object-cover rounded-xl shadow-xl"
                                sizes="(max-width: 768px) 90vw, 40vw"
                            />
                        </div>
                    </div>

                    {/* Row 2 - LED Displays */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        <div
                            ref={addToCardsRefs}
                            className="w-full max-w-md mx-auto md:ml-auto md:mr-0 md:order-2 relative h-72"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=360&fit=crop"
                                alt="LED Display Screens"
                                fill
                                className="object-cover rounded-xl shadow-xl"
                                sizes="(max-width: 768px) 90vw, 40vw"
                            />
                        </div>
                        <div
                            ref={addToCardsRefs}
                            className="w-full max-w-md mx-auto md:mr-auto md:ml-0 md:order-1 relative h-72"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=360&fit=crop"
                                alt="Outdoor LED Wall"
                                fill
                                className="object-cover rounded-xl shadow-xl"
                                sizes="(max-width: 768px) 90vw, 40vw"
                            />
                        </div>
                    </div>

                    {/* Row 3 - Rental Solutions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        <div
                            ref={addToCardsRefs}
                            className="w-full max-w-md mx-auto md:ml-auto md:mr-0 relative h-72"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=360&fit=crop"
                                alt="Event Display Rental"
                                fill
                                className="object-cover rounded-xl shadow-xl"
                                sizes="(max-width: 768px) 90vw, 40vw"
                            />
                        </div>
                        <div
                            ref={addToCardsRefs}
                            className="w-full max-w-md mx-auto md:mr-auto md:ml-0 relative h-72"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=360&fit=crop"
                                alt="Corporate Display Setup"
                                fill
                                className="object-cover rounded-xl shadow-xl"
                                sizes="(max-width: 768px) 90vw, 40vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MainContentSection;
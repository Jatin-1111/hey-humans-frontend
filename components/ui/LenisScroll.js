"use client";
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LenisScroll = ({ children }) => {
    useEffect(() => {
        let lenis;

        const initLenis = async () => {
            // Dynamically import Lenis to avoid SSR issues
            const { default: Lenis } = await import('@studio-freight/lenis');

            // Initialize Lenis
            lenis = new Lenis({
                duration: 1.2,        // Scroll duration (higher = smoother)
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
                direction: 'vertical', // Scroll direction
                gestureDirection: 'vertical', // Gesture direction
                smooth: true,          // Enable smooth scrolling
                mouseMultiplier: 1,    // Mouse wheel sensitivity
                smoothTouch: false,    // Disable on touch devices (better performance)
                touchMultiplier: 2,    // Touch sensitivity
                infinite: false,       // Disable infinite scroll
            });

            // Register ScrollTrigger plugin with GSAP
            if (typeof window !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);

                // Connect Lenis with GSAP ScrollTrigger
                lenis.on('scroll', ScrollTrigger.update);

                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });

                gsap.ticker.lagSmoothing(0);
            }

            // Update ScrollTrigger on resize
            const handleResize = () => {
                lenis.resize();
                ScrollTrigger.refresh();
            };

            window.addEventListener('resize', handleResize);

            // Cleanup function
            return () => {
                window.removeEventListener('resize', handleResize);
                lenis?.destroy();
                gsap.ticker.remove((time) => {
                    lenis?.raf(time * 1000);
                });
            };
        };

        initLenis();

        // Cleanup on unmount
        return () => {
            if (lenis) {
                lenis.destroy();
            }
        };
    }, []);

    return <>{children}</>;
};

export default LenisScroll;
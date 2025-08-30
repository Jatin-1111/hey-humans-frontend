"use client";
import React from 'react';
import Script from 'next/script';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import MainContentSection from '@/components/sections/MainContentSection';
import FooterSection from '@/components/sections/FooterSection';
import MarketplaceTabsSection from '@/components/sections/MarketplaceTabsSection';
import { FloatingDock } from '@/components/ui/FloatingDock';
import { Play, Monitor, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import LenisScroll from '@/components/ui/LenisScroll';

export default function HeyHumanzLanding() {
  // Quick Actions for FloatingDock
  const quickActions = [
    {
      title: "Find Editors",
      icon: <Play />,
      href: "/video-services"
    },
    {
      title: "Buy Displays",
      icon: <Monitor />,
      href: "/led-displays"
    },
    {
      title: "Rent Equipment",
      icon: <Calendar />,
      href: "/rentals"
    },
    {
      title: "Live Chat",
      icon: <MessageCircle />,
      href: "/chat"
    },
    {
      title: "Get Started",
      icon: <Sparkles />,
      href: "/signup"
    }
  ];

  return (
    <LenisScroll>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <MarketplaceTabsSection />
        <MainContentSection />
        <FooterSection />

        {/* Fixed FloatingDock */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <FloatingDock
            items={quickActions}
            desktopClassName="shadow-2xl"
            mobileClassName="shadow-xl"
          />
        </div>

        {/* Async GSAP Scripts */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
          strategy="afterInteractive"
        />
      </div>
    </LenisScroll>
  );
}
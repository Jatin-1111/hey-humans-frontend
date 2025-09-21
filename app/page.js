"use client";
import React from 'react';
import Script from 'next/script';
import HeroSection from '@/components/sections/HeroSection';
import MainContentSection from '@/components/sections/MainContentSection';
import MarketplaceTabsSection from '@/components/sections/MarketplaceTabsSection';
import EnhancedFloatingDock from '@/components/ui/EnhancedFloatingDock';
import { Play, Monitor, Calendar, MessageCircle, Sparkles, User, ShoppingCart, Plus, Eye } from 'lucide-react';
import LenisScroll from '@/components/ui/LenisScroll';
import LoadingComponent from '@/components/ui/LoadingComponent';
import { useAuth } from '@/hooks/useAuth';

export default function HeyHumanzLanding() {
  const { isAuthenticated, canFreelance, loading } = useAuth();

  // Dynamic Quick Actions for EnhancedFloatingDock based on auth state
  const getQuickActions = () => {
    if (loading) {
      return [
        {
          title: "Loading...",
          icon: Sparkles,
          href: "#"
        }
      ];
    }

    if (isAuthenticated) {
      const baseActions = [
        {
          title: "Dashboard",
          icon: User,
          href: "/dashboard"
        },
        {
          title: "Buy Displays",
          icon: Monitor,
          href: "/products"
        },
        {
          title: "Equipment Rental",
          icon: Calendar,
          href: "/rental/short-term"
        },
        {
          title: "Shopping Cart",
          icon: ShoppingCart,
          href: "/cart",
          badge: 3 // Example notification badge
        },
        {
          title: "Messages",
          icon: MessageCircle,
          href: "/messages",
          badge: 2
        }
      ];

      return baseActions;
    }

    // Guest user actions
    return [
      {
        title: "Buy Displays",
        icon: Monitor,
        href: "/products"
      },
      {
        title: "Rentals",
        icon: Calendar,
        href: "/rental/short-term"
      },
      {
        title: "Live Chat",
        icon: MessageCircle,
        href: "/contact"
      },
      {
        title: "Marketplace",
        icon: ShoppingCart,
        href: "/products"
      },
      {
        title: "Get Started",
        icon: Sparkles,
        href: "/signup"
      }
    ];
  };

  const quickActions = getQuickActions();

  if (loading) {
    return (
      <LoadingComponent
        fullScreen={true}
        message="Loading Hey Humanz..."
        showLogo={true}
        size="large"
        variant="spinner"
      />
    );
  }

  return (
    <LenisScroll>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <HeroSection />
        <MarketplaceTabsSection />
        <MainContentSection />

        {/* Enhanced FloatingDock with conditional content */}
        <EnhancedFloatingDock
          items={quickActions}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          size="default"
        />

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
"use client";
import React from 'react';
import Script from 'next/script';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import MainContentSection from '@/components/sections/MainContentSection';
import FooterSection from '@/components/sections/FooterSection';

export default function HeyHumanzLanding() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MainContentSection />
      <FooterSection />

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
  );
}
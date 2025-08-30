"use client";
import React, { useState } from "react";
import { MenuItem, Menu, ProductItem, HoveredLink } from "@/components/ui/NavbarMenu";
import { cn } from "@/lib/utils";

const Navbar = ({ className }) => {
    const [active, setActive] = useState(null);

    return (
        <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
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
            </Menu>
        </div>
    );
};

export default Navbar;
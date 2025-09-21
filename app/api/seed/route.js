// app/api/seed/route.js
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Project } from "@/models/Project";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST() {
    try {
        await connectDB();

        // Clear existing data (optional - for fresh start)
        // await User.deleteMany({});
        // await Product.deleteMany({});
        // await Project.deleteMany({});

        // Create test users
        const hashedPassword = await bcrypt.hash('password123', 12);

        const users = [
            {
                name: "John Doe",
                email: "john@example.com",
                password: hashedPassword,
                phone: "+1234567890",
                address: "123 Main St, City",
                role: "user",
                isVerified: true,
                freelancerProfile: {
                    isFreelancer: true,
                    skills: ["video-editing", "motion-graphics", "color-grading"],
                    portfolio: [
                        {
                            title: "Corporate Video Edit",
                            url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                            description: "Professional corporate video editing",
                            category: "video-editing"
                        }
                    ],
                    hourlyRate: 50,
                    bio: "Professional video editor with 5+ years experience",
                    rating: { average: 4.8, count: 25 },
                    availability: "available",
                    profileCompleted: true,
                    completedProjects: 25
                }
            },
            {
                name: "Sarah Wilson",
                email: "sarah@example.com",
                password: hashedPassword,
                phone: "+1234567891",
                address: "456 Oak Ave, Town",
                role: "user",
                isVerified: true,
                freelancerProfile: {
                    isFreelancer: true,
                    skills: ["motion-graphics", "animation", "3d-modeling"],
                    portfolio: [
                        {
                            title: "3D Animation Project",
                            url: "https://images.unsplash.com/photo-1551434678-e076c223a692",
                            description: "Complex 3D animation and motion graphics",
                            category: "motion-graphics"
                        }
                    ],
                    hourlyRate: 75,
                    bio: "Specialist in 3D animation and motion graphics",
                    rating: { average: 4.9, count: 18 },
                    availability: "available",
                    profileCompleted: true,
                    completedProjects: 18
                }
            },
            {
                name: "Mike Johnson",
                email: "mike@example.com",
                password: hashedPassword,
                phone: "+1234567892",
                address: "789 Pine St, Village",
                role: "user",
                isVerified: true,
                activityStats: {
                    projectsPosted: 5,
                    ordersPlaced: 3
                }
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);

        // Create test products
        const products = [
            {
                name: "Indoor LED Display P2.5",
                description: "High-resolution indoor LED display perfect for retail stores, conference rooms, and exhibitions. Features superior color accuracy and brightness control.",
                category: "indoor-led",
                specifications: {
                    pixelPitch: "P2.5",
                    resolution: { width: 1920, height: 1080 },
                    panelSize: { width: 320, height: 160, thickness: 25 },
                    brightness: 1200,
                    refreshRate: 60,
                    viewingAngle: { horizontal: 160, vertical: 140 },
                    powerConsumption: { max: 800, average: 400 },
                    operatingTemperature: { min: -10, max: 40 },
                    protectionRating: "IP54",
                    controlSystem: "Novastar",
                    cabinetMaterial: "Aluminum",
                    installation: "wall-mount"
                },
                pricing: {
                    salePrice: 1200,
                    rentalPrice: { daily: 50, weekly: 300, monthly: 1000 },
                    originalPrice: 1500,
                    currency: "USD",
                    priceUnit: "per panel"
                },
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13",
                        alt: "Indoor LED Display",
                        isPrimary: true
                    }
                ],
                stock: { sale: 50, rental: 20 },
                availability: "both",
                location: "New York",
                seller: createdUsers[0]._id,
                isActive: true,
                isFeatured: true,
                tags: ["indoor", "high-resolution", "retail", "conference"]
            },
            {
                name: "Outdoor LED Display P4",
                description: "Weather-resistant outdoor LED display designed for billboards, stadiums, and outdoor advertising. High brightness and durability.",
                category: "outdoor-led",
                specifications: {
                    pixelPitch: "P4",
                    resolution: { width: 1280, height: 720 },
                    panelSize: { width: 512, height: 512, thickness: 35 },
                    brightness: 5500,
                    refreshRate: 60,
                    viewingAngle: { horizontal: 140, vertical: 140 },
                    powerConsumption: { max: 1200, average: 600 },
                    operatingTemperature: { min: -40, max: 60 },
                    protectionRating: "IP65",
                    controlSystem: "Colorlight",
                    cabinetMaterial: "Steel",
                    installation: "wall-mount"
                },
                pricing: {
                    salePrice: 2500,
                    rentalPrice: { daily: 100, weekly: 600, monthly: 2000 },
                    originalPrice: 3000,
                    currency: "USD",
                    priceUnit: "per panel"
                },
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1551434678-e076c223a692",
                        alt: "Outdoor LED Display",
                        isPrimary: true
                    }
                ],
                stock: { sale: 30, rental: 15 },
                availability: "both",
                location: "Los Angeles",
                seller: createdUsers[0]._id,
                isActive: true,
                isFeatured: true,
                tags: ["outdoor", "weatherproof", "billboard", "stadium"]
            },
            {
                name: "Video Wall System P6",
                description: "Complete video wall solution for control rooms, broadcasting, and large venue displays. Seamless integration and easy setup.",
                category: "video-wall",
                specifications: {
                    pixelPitch: "P6",
                    resolution: { width: 3840, height: 2160 },
                    panelSize: { width: 576, height: 576, thickness: 40 },
                    brightness: 3000,
                    refreshRate: 60,
                    viewingAngle: { horizontal: 160, vertical: 160 },
                    powerConsumption: { max: 2000, average: 1000 },
                    operatingTemperature: { min: 0, max: 45 },
                    protectionRating: "IP54",
                    controlSystem: "Novastar",
                    cabinetMaterial: "Aluminum",
                    installation: "wall-mount"
                },
                pricing: {
                    salePrice: 5000,
                    rentalPrice: { daily: 200, weekly: 1200, monthly: 4000 },
                    originalPrice: 6000,
                    currency: "USD",
                    priceUnit: "per set"
                },
                images: [
                    {
                        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                        alt: "Video Wall System",
                        isPrimary: true
                    }
                ],
                stock: { sale: 15, rental: 8 },
                availability: "both",
                location: "Chicago",
                seller: createdUsers[1]._id,
                isActive: true,
                isFeatured: false,
                tags: ["video-wall", "control-room", "broadcasting", "4K"]
            }
        ];

        const createdProducts = await Product.insertMany(products);
        console.log(`Created ${createdProducts.length} products`);

        // Create test projects
        const projects = [
            {
                title: "Corporate Training Video Series",
                description: "Need professional editing for a series of 10 corporate training videos. Each video is 15-20 minutes long and requires color correction, audio enhancement, and graphics integration.",
                category: "video-editing",
                budget: { min: 2000, max: 3500, type: "fixed" },
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                requiredSkills: ["video-editing", "color-grading", "audio-post"],
                requirements: {
                    duration: "15-20 minutes per video",
                    format: "MP4",
                    resolution: "1080p",
                    frameRate: "30fps",
                    deliverables: ["Final videos", "Source files", "Music licenses"],
                    notes: "Professional look required for corporate environment"
                },
                client: createdUsers[2]._id,
                status: "open"
            },
            {
                title: "Product Launch Animation",
                description: "Create an engaging 60-second animation for our new product launch. Should include 3D product visualization, motion graphics, and dynamic text animations.",
                category: "motion-graphics",
                budget: { min: 1500, max: 2500, type: "fixed" },
                deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
                requiredSkills: ["motion-graphics", "3d-modeling", "animation"],
                requirements: {
                    duration: "60 seconds",
                    format: "MP4",
                    resolution: "4K",
                    frameRate: "60fps",
                    deliverables: ["Final animation", "3D models", "After Effects project"],
                    notes: "High-energy, modern style for tech product"
                },
                client: createdUsers[2]._id,
                status: "open"
            },
            {
                title: "Wedding Video Highlight Reel",
                description: "Edit a beautiful 5-minute highlight reel from wedding footage. Need someone with experience in wedding videography and storytelling.",
                category: "video-editing",
                budget: { min: 500, max: 800, type: "fixed" },
                deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                requiredSkills: ["video-editing", "color-grading"],
                requirements: {
                    duration: "5 minutes",
                    format: "MP4",
                    resolution: "4K",
                    frameRate: "24fps",
                    deliverables: ["Highlight reel", "Full ceremony edit"],
                    notes: "Romantic, emotional style preferred"
                },
                client: createdUsers[2]._id,
                status: "open"
            }
        ];

        const createdProjects = await Project.insertMany(projects);
        console.log(`Created ${createdProjects.length} projects`);

        return NextResponse.json({
            success: true,
            message: "Seed data created successfully!",
            data: {
                usersCreated: createdUsers.length,
                productsCreated: createdProducts.length,
                projectsCreated: createdProjects.length
            }
        });

    } catch (error) {
        console.error('Seed data creation failed:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to create seed data",
            error: error.message
        }, { status: 500 });
    }
}
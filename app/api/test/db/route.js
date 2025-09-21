// app/api/test/db/route.js
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Test database connection
        await connectDB();

        // Test model connections by getting counts
        const userCount = await User.countDocuments();
        const projectCount = await Project.countDocuments();
        const productCount = await Product.countDocuments();

        return NextResponse.json({
            success: true,
            message: "Database connected successfully!",
            data: {
                userCount,
                projectCount,
                productCount,
                connectionState: "Connected",
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Database test failed:', error);
        return NextResponse.json({
            success: false,
            message: "Database connection failed",
            error: error.message
        }, { status: 500 });
    }
}
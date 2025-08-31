import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}

export async function connectDB() {
    try {
        // If already connected, return
        if (mongoose.connection.readyState >= 1) {
            return mongoose.connection;
        }

        // Connect to MongoDB
        const conn = await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected:', conn.connection.host);
        return conn;

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        throw error;
    }
}
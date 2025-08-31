import { User } from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// Script to create first admin user
export async function createAdminUser() {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@heyhumanz.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin user
        const admin = new User({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isVerified: true, // Auto-verify admin
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await admin.save();
        console.log('✅ Admin user created successfully');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
}
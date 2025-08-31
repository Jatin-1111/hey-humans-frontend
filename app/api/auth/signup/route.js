// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { rateLimit } from '@/lib/rateLimit';

// Input validation schemas
const validateInput = (data) => {
    const errors = [];

    // Name validation
    if (!data.name || typeof data.name !== 'string') {
        errors.push('Name is required and must be a string');
    } else if (data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    } else if (data.name.trim().length > 100) {
        errors.push('Name cannot exceed 100 characters');
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.name.trim())) {
        errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }

    // Email validation
    if (!data.email || typeof data.email !== 'string') {
        errors.push('Email is required and must be a string');
    } else {
        const email = data.email.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        } else if (email.length > 254) {
            errors.push('Email address is too long');
        }

        // Check for disposable email domains
        const disposableEmailDomains = [
            '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
            'tempmail.org', 'yopmail.com', 'throwaway.email'
        ];
        const domain = email.split('@')[1];
        if (disposableEmailDomains.includes(domain)) {
            errors.push('Disposable email addresses are not allowed');
        }
    }

    // Password validation
    if (!data.password || typeof data.password !== 'string') {
        errors.push('Password is required and must be a string');
    } else {
        const password = data.password;

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        } else if (password.length > 128) {
            errors.push('Password cannot exceed 128 characters');
        }

        // Password strength checks
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        // Check for common weak passwords
        const weakPasswords = [
            'password', '12345678', 'qwerty123', 'admin123', 'letmein123',
            'welcome123', 'password123', '123456789', 'qwertyuiop'
        ];
        if (weakPasswords.includes(password.toLowerCase())) {
            errors.push('Password is too common. Please choose a stronger password');
        }
    }

    // Phone validation (optional but if provided must be valid)
    if (data.phone !== undefined && data.phone !== null && data.phone !== '') {
        const phone = String(data.phone).trim();

        if (phone) {
            // Remove all non-digit characters for validation
            const phoneDigits = phone.replace(/\D/g, '');

            if (phoneDigits.length < 10) {
                errors.push('Phone number must be at least 10 digits');
            } else if (phoneDigits.length > 15) {
                errors.push('Phone number cannot exceed 15 digits');
            }

            // Basic phone format validation
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phoneDigits)) {
                errors.push('Invalid phone number format');
            }
        }
    }

    // Address validation (optional)
    if (data.address !== undefined && data.address !== null && data.address !== '') {
        const address = String(data.address).trim();

        if (address && address.length > 500) {
            errors.push('Address cannot exceed 500 characters');
        }
    }

    // Role validation
    if (data.role !== undefined) {
        if (!['user', 'admin'].includes(data.role)) {
            errors.push('Invalid role. Must be either "user" or "admin"');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitizedData: {
            name: data.name ? String(data.name).trim() : '',
            email: data.email ? String(data.email).trim().toLowerCase() : '',
            password: data.password || '',
            phone: data.phone ? String(data.phone).trim() : '',
            address: data.address ? String(data.address).trim() : '',
            role: ['user', 'admin'].includes(data.role) ? data.role : 'user'
        }
    };
};

// Generate verification token
const generateVerificationToken = (email) => {
    return jwt.sign(
        {
            email,
            type: 'email_verification',
            timestamp: Date.now()
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Check for existing user
const checkExistingUser = async (email) => {
    try {
        await connectDB();
        return await User.findOne({
            email: email.toLowerCase()
        }).select('_id email isVerified createdAt');
    } catch (error) {
        console.error('Database check error:', error);
        throw new Error('Database connection failed');
    }
};

// Create user in database
const createUser = async (userData, hashedPassword, verificationToken) => {
    try {
        const user = new User({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            phone: userData.phone,
            address: userData.address,
            role: userData.role,
            isVerified: false,
            verificationToken,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedUser = await user.save();
        return savedUser;
    } catch (error) {
        console.error('User creation error:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            throw new Error('User already exists with this email');
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(e => e.message);
            throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }

        throw new Error('Failed to create user account');
    }
};

// Main signup route handler
export async function POST(req) {
    const startTime = Date.now();
    console.log('🚀 Signup request started at:', new Date().toISOString());

    try {
        // Rate limiting check
        const rateLimitResult = await rateLimit(req, {
            maxRequests: 5,
            windowMs: 15 * 60 * 1000, // 15 minutes
            message: 'Too many signup attempts. Please try again later.'
        });

        if (!rateLimitResult.success) {
            console.warn('🚨 Rate limit exceeded:', rateLimitResult.error);
            return NextResponse.json(
                {
                    error: rateLimitResult.error,
                    retryAfter: rateLimitResult.retryAfter
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(rateLimitResult.retryAfter)
                    }
                }
            );
        }

        // Parse and validate request body
        let body;
        try {
            body = await req.json();
            console.log('📥 Request received for email:', body.email?.toLowerCase());
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError.message);
            return NextResponse.json(
                { error: 'Invalid JSON format in request body' },
                { status: 400 }
            );
        }

        // Validate input data
        const validation = validateInput(body);
        if (!validation.isValid) {
            console.warn('❌ Validation failed:', validation.errors);
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.errors
                },
                { status: 400 }
            );
        }

        const { name, email, password, phone, address, role } = validation.sanitizedData;

        // Check if user already exists
        console.log('🔍 Checking for existing user...');
        const existingUser = await checkExistingUser(email);

        if (existingUser) {
            console.warn('⚠️ User already exists:', email);

            // Don't reveal if user is verified or not for security
            return NextResponse.json(
                {
                    error: 'An account with this email already exists',
                    suggestion: 'Try logging in or use the password reset option'
                },
                { status: 409 }
            );
        }

        // Hash password with high cost factor
        console.log('🔐 Hashing password...');
        const saltRounds = process.env.NODE_ENV === 'production' ? 14 : 12;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = generateVerificationToken(email);

        // Create user in database
        console.log('👤 Creating user account...');
        const newUser = await createUser(
            { name, email, phone, address, role },
            hashedPassword,
            verificationToken
        );

        // Send verification email (commented out for now)
        /*
        try {
            await sendVerificationEmail(email, verificationToken, name);
            console.log('📧 Verification email sent successfully');
        } catch (emailError) {
            console.error('📧 Email sending failed:', emailError.message);
            // Don't fail registration if email fails
        }
        */

        // Generate auth token for immediate login (optional)
        const authToken = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role,
                verified: newUser.isVerified
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Prepare response data
        const responseData = {
            success: true,
            message: 'Account created successfully! Please check your email for verification.',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                address: newUser.address,
                isVerified: newUser.isVerified,
                createdAt: newUser.createdAt
            },
            token: authToken, // Include for immediate login
            requiresVerification: !newUser.isVerified,
            verificationSent: true // Change to false if email fails
        };

        const processingTime = Date.now() - startTime;
        console.log(`✅ Signup completed successfully in ${processingTime}ms for:`, email);

        return NextResponse.json(responseData, { status: 201 });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`💥 Signup failed after ${processingTime}ms:`, {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        // Don't expose internal errors in production
        const errorMessage = process.env.NODE_ENV === 'production'
            ? 'Internal server error. Please try again later.'
            : error.message;

        return NextResponse.json(
            {
                error: errorMessage,
                timestamp: new Date().toISOString(),
                ...(process.env.NODE_ENV !== 'production' && {
                    details: error.message,
                    stack: error.stack
                })
            },
            { status: 500 }
        );
    }
}

// GET method for endpoint information
export async function GET() {
    return NextResponse.json({
        endpoint: '/api/auth/signup',
        method: 'POST',
        description: 'Create a new user account',
        requiredFields: {
            name: 'string (2-100 chars, letters only)',
            email: 'string (valid email format)',
            password: 'string (min 8 chars, must include uppercase, lowercase, number, special char)'
        },
        optionalFields: {
            phone: 'string (10-15 digits)',
            address: 'string (max 500 chars)',
            role: 'string ("user" or "admin", defaults to "user")'
        },
        responses: {
            201: 'User created successfully',
            400: 'Validation error',
            409: 'User already exists',
            429: 'Rate limit exceeded',
            500: 'Internal server error'
        },
        rateLimit: '5 requests per 15 minutes',
        passwordRequirements: [
            'At least 8 characters long',
            'At least one uppercase letter',
            'At least one lowercase letter',
            'At least one number',
            'At least one special character',
            'Not a common weak password'
        ]
    });
}
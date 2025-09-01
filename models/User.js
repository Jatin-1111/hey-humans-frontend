// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters']
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    address: {
        type: String,
        trim: true,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    // NEW: Freelancer Profile (optional for users)
    freelancerProfile: {
        isFreelancer: {
            type: Boolean,
            default: false
        },
        skills: [{
            type: String,
            trim: true
        }],
        portfolio: [{
            title: String,
            url: String,
            description: String,
            thumbnail: String
        }],
        hourlyRate: {
            type: Number,
            min: 0,
            default: 0
        },
        bio: {
            type: String,
            maxLength: [1000, 'Bio cannot exceed 1000 characters'],
            default: ''
        },
        completedProjects: {
            type: Number,
            default: 0
        },
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5
            },
            count: {
                type: Number,
                default: 0
            }
        },
        availability: {
            type: String,
            enum: ['available', 'busy', 'unavailable'],
            default: 'available'
        },
        profileCompleted: {
            type: Boolean,
            default: false
        }
    },

    // NEW: Activity tracking
    activityStats: {
        projectsPosted: {
            type: Number,
            default: 0
        },
        projectsCompleted: {
            type: Number,
            default: 0
        },
        ordersPlaced: {
            type: Number,
            default: 0
        },
        totalSpent: {
            type: Number,
            default: 0
        },
        totalEarned: {
            type: Number,
            default: 0
        }
    },

    // Existing fields
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'freelancerProfile.isFreelancer': 1 });
userSchema.index({ 'freelancerProfile.skills': 1 });
userSchema.index({ 'freelancerProfile.rating.average': -1 });
userSchema.index({ verificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ role: 1 });

// Virtual for checking if user has freelancer capabilities
userSchema.virtual('canFreelance').get(function () {
    return this.freelancerProfile?.isFreelancer === true;
});

// Virtual for checking profile completion
userSchema.virtual('profileCompletion').get(function () {
    let completion = 40; // Base completion (name, email, verified)

    if (this.phone) completion += 10;
    if (this.address) completion += 10;

    if (this.freelancerProfile?.isFreelancer) {
        if (this.freelancerProfile.bio) completion += 10;
        if (this.freelancerProfile.skills?.length > 0) completion += 15;
        if (this.freelancerProfile.hourlyRate > 0) completion += 10;
        if (this.freelancerProfile.portfolio?.length > 0) completion += 15;
    } else {
        completion += 40; // Non-freelancers get full completion
    }

    return Math.min(completion, 100);
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Auto-complete profile if freelancer has all required fields
    if (this.freelancerProfile?.isFreelancer) {
        const hasRequiredFields = this.freelancerProfile.bio &&
            this.freelancerProfile.skills?.length > 0 &&
            this.freelancerProfile.hourlyRate > 0;
        this.freelancerProfile.profileCompleted = hasRequiredFields;
    }

    next();
});

// Method to enable freelancer mode
userSchema.methods.enableFreelancerMode = function () {
    this.freelancerProfile.isFreelancer = true;
    return this.save();
};

// Method to disable freelancer mode
userSchema.methods.disableFreelancerMode = function () {
    this.freelancerProfile.isFreelancer = false;
    return this.save();
};

// Method to add skill
userSchema.methods.addSkill = function (skill) {
    if (!this.freelancerProfile.skills.includes(skill)) {
        this.freelancerProfile.skills.push(skill);
    }
    return this.save();
};

// Method to update rating
userSchema.methods.updateRating = function (newRating) {
    const current = this.freelancerProfile.rating;
    const totalRating = (current.average * current.count) + newRating;
    current.count += 1;
    current.average = totalRating / current.count;
    return this.save();
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
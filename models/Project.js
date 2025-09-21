// models/Project.js - Project schema for freelancing
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxLength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        maxLength: [5000, 'Description cannot exceed 5000 characters']
    },
    category: {
        type: String,
        required: true,
        enum: ['video-editing', 'motion-graphics', 'color-grading', 'audio-post', 'animation', 'other']
    },

    // Budget information
    budget: {
        min: {
            type: Number,
            required: true,
            min: [0, 'Budget cannot be negative']
        },
        max: {
            type: Number,
            required: true,
            min: [0, 'Budget cannot be negative']
        },
        type: {
            type: String,
            enum: ['fixed', 'hourly', 'negotiable'],
            default: 'fixed'
        }
    },

    // Project details
    deadline: {
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
                return date > new Date();
            },
            message: 'Deadline must be in the future'
        }
    },

    requiredSkills: [{
        type: String,
        trim: true
    }],

    requirements: {
        duration: String, // e.g., "5 minutes", "30 seconds"
        format: String,   // e.g., "MP4", "MOV"
        resolution: String, // e.g., "1080p", "4K"
        frameRate: String,  // e.g., "30fps", "60fps"
        deliverables: [String], // e.g., ["Final video", "Source files", "Music license"]
        notes: String
    },

    attachments: [{
        name: String,
        url: String,
        type: String, // 'image', 'video', 'document'
        size: Number
    }],

    // References
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    selectedEditor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    // Bids on this project
    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }],

    // Project status
    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed', 'cancelled', 'disputed'],
        default: 'open'
    },

    // Milestones for project tracking
    milestones: [{
        title: String,
        description: String,
        amount: Number,
        dueDate: Date,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'approved'],
            default: 'pending'
        },
        completedAt: Date
    }],

    // Final delivery
    deliverables: [{
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
        approved: { type: Boolean, default: false }
    }],

    // Financial tracking
    finalAmount: {
        type: Number,
        default: 0
    },

    paidAmount: {
        type: Number,
        default: 0
    },

    // Communication
    lastActivity: {
        type: Date,
        default: Date.now
    },

    // Reviews (after completion)
    clientReview: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: Date
    },

    editorReview: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: Date
    },

    // Timestamps
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

// Indexes for better query performance
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ selectedEditor: 1, status: 1 });
projectSchema.index({ 'budget.min': 1, 'budget.max': 1 });
projectSchema.index({ requiredSkills: 1 });
projectSchema.index({ deadline: 1 });

// Virtual for calculating days until deadline
projectSchema.virtual('daysUntilDeadline').get(function () {
    const now = new Date();
    const deadline = new Date(this.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for bid count
projectSchema.virtual('bidCount').get(function () {
    return this.bids ? this.bids.length : 0;
});

// Pre-save middleware
projectSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    this.lastActivity = new Date();

    // Ensure budget max is at least equal to min
    if (this.budget.max < this.budget.min) {
        this.budget.max = this.budget.min;
    }

    next();
});

// Methods
projectSchema.methods.addBid = function (bidId) {
    if (!this.bids.includes(bidId)) {
        this.bids.push(bidId);
    }
    return this.save();
};

projectSchema.methods.selectEditor = function (editorId) {
    this.selectedEditor = editorId;
    this.status = 'in_progress';
    return this.save();
};

projectSchema.methods.markCompleted = function () {
    this.status = 'completed';
    return this.save();
};

projectSchema.methods.addDeliverable = function (deliverable) {
    this.deliverables.push(deliverable);
    return this.save();
};

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

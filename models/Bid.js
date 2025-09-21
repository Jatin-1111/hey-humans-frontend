// models/Bid.js - Bid schema for freelancing
import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    // References
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Bid details
    bidAmount: {
        type: Number,
        required: [true, 'Bid amount is required'],
        min: [0, 'Bid amount cannot be negative']
    },

    deliveryTime: {
        type: Number, // Days
        required: [true, 'Delivery time is required'],
        min: [1, 'Delivery time must be at least 1 day']
    },

    proposal: {
        type: String,
        required: [true, 'Proposal is required'],
        maxLength: [3000, 'Proposal cannot exceed 3000 characters']
    },

    // Optional milestones breakdown
    milestones: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        deliveryDays: {
            type: Number,
            required: true,
            min: 1
        }
    }],

    // Portfolio samples relevant to this bid
    portfolioSamples: [{
        title: String,
        url: String,
        description: String
    }],

    // Bid status
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending'
    },

    // Communication
    clientMessage: {
        message: String,
        createdAt: Date
    },

    freelancerMessage: {
        message: String,
        createdAt: Date
    },

    // Decision tracking
    acceptedAt: Date,
    rejectedAt: Date,
    withdrawnAt: Date,

    rejectionReason: String,
    withdrawalReason: String,

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

// Indexes
bidSchema.index({ project: 1, freelancer: 1 }, { unique: true }); // One bid per freelancer per project
bidSchema.index({ project: 1, status: 1 });
bidSchema.index({ freelancer: 1, status: 1 });
bidSchema.index({ createdAt: -1 });
bidSchema.index({ bidAmount: 1 });

// Virtual for total milestone amount validation
bidSchema.virtual('totalMilestoneAmount').get(function () {
    return this.milestones.reduce((total, milestone) => total + milestone.amount, 0);
});

// Pre-save validation
bidSchema.pre('save', function (next) {
    this.updatedAt = new Date();

    // If milestones exist, validate total amount matches bid amount
    if (this.milestones && this.milestones.length > 0) {
        const totalMilestoneAmount = this.milestones.reduce((total, milestone) => total + milestone.amount, 0);
        if (Math.abs(totalMilestoneAmount - this.bidAmount) > 0.01) {
            return next(new Error('Total milestone amount must equal bid amount'));
        }
    }

    next();
});

// Methods
bidSchema.methods.accept = function () {
    this.status = 'accepted';
    this.acceptedAt = new Date();
    return this.save();
};

bidSchema.methods.reject = function (reason) {
    this.status = 'rejected';
    this.rejectedAt = new Date();
    if (reason) this.rejectionReason = reason;
    return this.save();
};

bidSchema.methods.withdraw = function (reason) {
    this.status = 'withdrawn';
    this.withdrawnAt = new Date();
    if (reason) this.withdrawalReason = reason;
    return this.save();
};

bidSchema.methods.addClientMessage = function (message) {
    this.clientMessage = {
        message,
        createdAt: new Date()
    };
    return this.save();
};

bidSchema.methods.addFreelancerMessage = function (message) {
    this.freelancerMessage = {
        message,
        createdAt: new Date()
    };
    return this.save();
};

export const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema);

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxLength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxLength: [2000, 'Message cannot exceed 2000 characters']
    },
    type: {
        type: String,
        enum: ['general', 'support', 'sales', 'partnership', 'feedback'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'resolved'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    phone: {
        type: String,
        trim: true,
        maxLength: [20, 'Phone number cannot exceed 20 characters']
    },
    company: {
        type: String,
        trim: true,
        maxLength: [100, 'Company name cannot exceed 100 characters']
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    respondedAt: {
        type: Date
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [{
        content: {
            type: String,
            required: true,
            maxLength: [1000, 'Note cannot exceed 1000 characters']
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        trim: true,
        maxLength: [50, 'Tag cannot exceed 50 characters']
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ type: 1, createdAt: -1 });
contactSchema.index({ priority: 1, status: 1 });

// Virtual for response time
contactSchema.virtual('responseTime').get(function () {
    if (this.respondedAt && this.createdAt) {
        return Math.floor((this.respondedAt - this.createdAt) / (1000 * 60 * 60)); // in hours
    }
    return null;
});

// Static method to get statistics
contactSchema.statics.getStats = function () {
    return this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
};

// Instance method to mark as resolved
contactSchema.methods.markResolved = function (userId) {
    this.status = 'resolved';
    this.respondedAt = new Date();
    this.respondedBy = userId;
    return this.save();
};

// Pre-save middleware
contactSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'resolved' && !this.respondedAt) {
        this.respondedAt = new Date();
    }
    next();
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;
export { Contact };
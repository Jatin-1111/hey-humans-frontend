// models/Order.js - Order schema for purchases and rentals
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    type: {
        type: String,
        enum: ['purchase', 'rental'],
        required: true
    },

    // Order items
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: String, // Snapshot of product name
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        specifications: {
            pixelPitch: String,
            resolution: String,
            customRequirements: String
        }
    }],

    // Pricing breakdown
    pricing: {
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },
        tax: {
            type: Number,
            default: 0,
            min: 0
        },
        shipping: {
            type: Number,
            default: 0,
            min: 0
        },
        discount: {
            type: Number,
            default: 0,
            min: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        }
    },

    // Addresses
    shippingAddress: {
        name: String,
        company: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String
    },

    billingAddress: {
        name: String,
        company: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String
    },

    // Order status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'],
        default: 'pending'
    },

    // Payment information
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending'
    },

    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery']
    },

    paymentDetails: {
        transactionId: String,
        paymentGateway: String,
        paidAt: Date,
        refundedAt: Date,
        refundAmount: Number,
        refundReason: String
    },

    // For rental orders
    rentalPeriod: {
        startDate: Date,
        endDate: Date,
        duration: Number, // Duration in the specified unit
        unit: {
            type: String,
            enum: ['day', 'week', 'month']
        }
    },

    // Delivery & pickup (for rentals)
    delivery: {
        method: {
            type: String,
            enum: ['standard', 'express', 'pickup', 'white_glove']
        },
        scheduledDate: Date,
        deliveredDate: Date,
        trackingNumber: String,
        carrier: String,
        notes: String
    },

    pickup: { // For rental returns
        scheduledDate: Date,
        pickedUpDate: Date,
        condition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'damaged']
        },
        damageNotes: String,
        additionalCharges: Number
    },

    // Installation service (optional)
    installation: {
        required: { type: Boolean, default: false },
        scheduledDate: Date,
        completedDate: Date,
        technician: String,
        notes: String,
        additionalCost: { type: Number, default: 0 }
    },

    // Communication
    notes: String, // Customer notes
    internalNotes: String, // Admin notes

    // Tracking
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],

    // Customer service
    supportTickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupportTicket'
    }],

    // Reviews & feedback
    customerReview: {
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

// Indexes
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ customer: 1, status: 1 });
orderSchema.index({ type: 1, status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'rentalPeriod.startDate': 1, 'rentalPeriod.endDate': 1 });

// Virtual for order age
orderSchema.virtual('orderAge').get(function () {
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffTime = now.getTime() - created.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days
});

// Virtual for rental days remaining
orderSchema.virtual('rentalDaysRemaining').get(function () {
    if (this.type !== 'rental' || !this.rentalPeriod?.endDate) return null;

    const now = new Date();
    const endDate = new Date(this.rentalPeriod.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware
orderSchema.pre('save', function (next) {
    this.updatedAt = new Date();

    // Calculate rental end date if not provided
    if (this.type === 'rental' && this.rentalPeriod && !this.rentalPeriod.endDate) {
        const startDate = new Date(this.rentalPeriod.startDate || this.createdAt);
        const { duration, unit } = this.rentalPeriod;

        let daysToAdd = duration;
        if (unit === 'week') daysToAdd *= 7;
        if (unit === 'month') daysToAdd *= 30; // Approximate

        this.rentalPeriod.endDate = new Date(startDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    }

    next();
});

// Methods
orderSchema.methods.updateStatus = function (newStatus, note, updatedBy) {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        note,
        updatedBy
    });
    return this.save();
};

orderSchema.methods.markPaid = function (paymentDetails) {
    this.paymentStatus = 'paid';
    this.paymentDetails = {
        ...this.paymentDetails,
        ...paymentDetails,
        paidAt: new Date()
    };
    return this.save();
};

orderSchema.methods.processRefund = function (amount, reason) {
    this.paymentStatus = amount >= this.pricing.total ? 'refunded' : 'partially_refunded';
    this.paymentDetails.refundedAt = new Date();
    this.paymentDetails.refundAmount = (this.paymentDetails.refundAmount || 0) + amount;
    this.paymentDetails.refundReason = reason;
    return this.save();
};

orderSchema.methods.addReview = function (rating, comment) {
    this.customerReview = {
        rating,
        comment,
        createdAt: new Date()
    };
    return this.save();
};

orderSchema.methods.scheduleDelivery = function (date, method) {
    this.delivery.scheduledDate = date;
    this.delivery.method = method;
    return this.save();
};

orderSchema.methods.confirmDelivery = function (trackingNumber, carrier) {
    this.delivery.deliveredDate = new Date();
    this.delivery.trackingNumber = trackingNumber;
    this.delivery.carrier = carrier;
    this.status = 'delivered';
    return this.save();
};

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

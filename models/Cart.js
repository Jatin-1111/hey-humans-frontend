// models/Cart.js - Shopping cart schema
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        type: {
            type: String,
            enum: ['purchase', 'rental'],
            required: true
        },
        rentalPeriod: {
            duration: Number,
            unit: {
                type: String,
                enum: ['day', 'week', 'month']
            },
            startDate: Date,
            endDate: Date
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    totals: {
        subtotal: {
            type: Number,
            default: 0
        },
        tax: {
            type: Number,
            default: 0
        },
        shipping: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },

    // Applied coupons
    coupons: [{
        code: String,
        discount: Number,
        appliedAt: { type: Date, default: Date.now }
    }],

    // Cart expiry for abandoned cart recovery
    expiresAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        }
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
cartSchema.index({ user: 1 }, { unique: true });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
cartSchema.index({ 'items.product': 1 });

// Virtual for total items count
cartSchema.virtual('itemCount').get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for unique products count
cartSchema.virtual('productCount').get(function () {
    return this.items.length;
});

// Pre-save middleware
cartSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Methods
cartSchema.methods.calculateTotals = async function () {
    await this.populate('items.product', 'pricing');

    let subtotal = 0;

    for (const item of this.items) {
        if (!item.product) continue;

        let unitPrice;

        if (item.type === 'purchase') {
            unitPrice = item.product.pricing.salePrice;
        } else if (item.type === 'rental' && item.rentalPeriod) {
            const { duration, unit } = item.rentalPeriod;

            if (unit === 'day') {
                unitPrice = item.product.pricing.rentalPrice.daily * duration;
            } else if (unit === 'week') {
                unitPrice = item.product.pricing.rentalPrice.weekly * duration;
            } else if (unit === 'month') {
                unitPrice = item.product.pricing.rentalPrice.monthly * duration;
            }
        }

        if (unitPrice) {
            subtotal += unitPrice * item.quantity;
        }
    }

    // Apply discounts from coupons
    let discount = 0;
    if (this.coupons && this.coupons.length > 0) {
        discount = this.coupons.reduce((total, coupon) => total + coupon.discount, 0);
    }

    // Calculate tax (10% - configurable)
    const taxRate = 0.1;
    const tax = Math.max(0, (subtotal - discount) * taxRate);

    // Calculate shipping (free for rentals, $50 for purchases - configurable)
    const hasRentalOnly = this.items.every(item => item.type === 'rental');
    const shipping = hasRentalOnly ? 0 : 50;

    // Update totals
    this.totals = {
        subtotal,
        tax: Math.round(tax * 100) / 100,
        shipping,
        discount,
        total: Math.round((subtotal + tax + shipping - discount) * 100) / 100
    };

    return this.totals;
};

cartSchema.methods.addItem = function (productId, quantity, type, rentalPeriod) {
    const existingItemIndex = this.items.findIndex(
        item => item.product.toString() === productId &&
            item.type === type &&
            JSON.stringify(item.rentalPeriod) === JSON.stringify(rentalPeriod)
    );

    if (existingItemIndex > -1) {
        this.items[existingItemIndex].quantity += quantity;
    } else {
        const newItem = {
            product: productId,
            quantity,
            type,
            addedAt: new Date()
        };

        if (type === 'rental') {
            newItem.rentalPeriod = rentalPeriod;
        }

        this.items.push(newItem);
    }

    return this.save();
};

cartSchema.methods.removeItem = function (itemId) {
    this.items = this.items.filter(item => item._id.toString() !== itemId);
    return this.save();
};

cartSchema.methods.updateItemQuantity = function (itemId, quantity) {
    const itemIndex = this.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex > -1) {
        if (quantity <= 0) {
            this.items.splice(itemIndex, 1);
        } else {
            this.items[itemIndex].quantity = quantity;
        }
    }

    return this.save();
};

cartSchema.methods.clearCart = function () {
    this.items = [];
    this.coupons = [];
    this.totals = { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 };
    return this.save();
};

cartSchema.methods.applyCoupon = function (code, discount) {
    // Remove existing coupon with same code
    this.coupons = this.coupons.filter(coupon => coupon.code !== code);

    // Add new coupon
    this.coupons.push({
        code,
        discount,
        appliedAt: new Date()
    });

    return this.save();
};

cartSchema.methods.removeCoupon = function (code) {
    this.coupons = this.coupons.filter(coupon => coupon.code !== code);
    return this.save();
};

// Static methods
cartSchema.statics.findByUser = function (userId) {
    return this.findOne({ user: userId }).populate('items.product');
};

cartSchema.statics.createForUser = function (userId) {
    return this.create({
        user: userId,
        items: [],
        totals: { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 }
    });
};

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

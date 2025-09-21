// models/Product.js - LED Display product schema
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [200, 'Product name cannot exceed 200 characters']
    },

    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxLength: [3000, 'Description cannot exceed 3000 characters']
    },

    category: {
        type: String,
        required: true,
        enum: ['indoor-led', 'outdoor-led', 'video-wall', 'flexible-led', 'transparent-led', 'accessories']
    },

    // LED Display Specifications
    specifications: {
        pixelPitch: {
            type: String,
            required: true // e.g., "P2.5", "P4", "P6"
        },

        resolution: {
            width: Number,
            height: Number
        },

        panelSize: {
            width: Number, // in mm
            height: Number, // in mm
            thickness: Number // in mm
        },

        brightness: {
            type: Number, // in nits/cd/m²
            min: 0
        },

        refreshRate: {
            type: Number, // in Hz
            default: 60
        },

        viewingAngle: {
            horizontal: Number,
            vertical: Number
        },

        powerConsumption: {
            max: Number, // in watts
            average: Number // in watts
        },

        operatingTemperature: {
            min: Number, // in Celsius
            max: Number
        },

        protectionRating: String, // e.g., "IP65", "IP54"

        controlSystem: String, // e.g., "Novastar", "Colorlight"

        cabinetMaterial: String, // e.g., "Aluminum", "Steel"

        installation: {
            type: String,
            enum: ['wall-mount', 'floor-stand', 'hanging', 'embedded', 'portable']
        }
    },

    // Pricing structure
    pricing: {
        salePrice: {
            type: Number,
            required: true,
            min: [0, 'Sale price cannot be negative']
        },

        rentalPrice: {
            daily: Number,
            weekly: Number,
            monthly: Number
        },

        originalPrice: Number, // For showing discounts

        currency: {
            type: String,
            default: 'USD'
        },

        priceUnit: {
            type: String,
            default: 'per panel' // 'per panel', 'per sqm', 'per set'
        }
    },

    // Product media
    images: [{
        url: String,
        alt: String,
        isPrimary: { type: Boolean, default: false }
    }],

    videos: [{
        url: String,
        title: String,
        thumbnail: String
    }],

    // Inventory & availability
    stock: {
        sale: {
            type: Number,
            default: 0,
            min: 0
        },
        rental: {
            type: Number,
            default: 0,
            min: 0
        }
    },

    availability: {
        type: String,
        enum: ['sale', 'rental', 'both', 'unavailable'],
        default: 'both'
    },

    location: {
        type: String,
        required: true // City/Region where product is available
    },

    // Sales & rental tracking
    salesCount: {
        type: Number,
        default: 0
    },

    rentalCount: {
        type: Number,
        default: 0
    },

    // Reviews & ratings
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: String,
        type: {
            type: String,
            enum: ['purchase', 'rental']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

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

    // Product management
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isFeatured: {
        type: Boolean,
        default: false
    },

    tags: [String], // For search optimization

    // SEO
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
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
productSchema.index({ category: 1, availability: 1 });
productSchema.index({ 'specifications.pixelPitch': 1 });
productSchema.index({ 'pricing.salePrice': 1 });
productSchema.index({ 'pricing.rentalPrice.daily': 1 });
productSchema.index({ location: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1, isFeatured: -1 });
productSchema.index({ tags: 1 });

// Text search index
productSchema.index({
    name: 'text',
    description: 'text',
    'specifications.pixelPitch': 'text',
    location: 'text',
    tags: 'text'
});

// Virtual for calculating discount percentage
productSchema.virtual('discountPercentage').get(function () {
    if (this.pricing.originalPrice && this.pricing.originalPrice > this.pricing.salePrice) {
        return Math.round(((this.pricing.originalPrice - this.pricing.salePrice) / this.pricing.originalPrice) * 100);
    }
    return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
    const totalStock = this.stock.sale + this.stock.rental;
    if (totalStock === 0) return 'out-of-stock';
    if (totalStock <= 5) return 'low-stock';
    return 'in-stock';
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function () {
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Pre-save middleware
productSchema.pre('save', function (next) {
    this.updatedAt = new Date();

    // Calculate average rating
    if (this.reviews && this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
        this.rating.count = this.reviews.length;
    }

    // Ensure at least one image is primary
    if (this.images && this.images.length > 0) {
        const hasPrimary = this.images.some(img => img.isPrimary);
        if (!hasPrimary) {
            this.images[0].isPrimary = true;
        }
    }

    next();
});

// Methods
productSchema.methods.addReview = function (userId, rating, comment, type = 'purchase') {
    this.reviews.push({
        user: userId,
        rating,
        comment,
        type,
        createdAt: new Date()
    });
    return this.save();
};

productSchema.methods.updateStock = function (type, quantity, operation = 'subtract') {
    if (operation === 'subtract') {
        this.stock[type] = Math.max(0, this.stock[type] - quantity);
    } else {
        this.stock[type] += quantity;
    }
    return this.save();
};

productSchema.methods.incrementSales = function () {
    this.salesCount += 1;
    return this.save();
};

productSchema.methods.incrementRentals = function () {
    this.rentalCount += 1;
    return this.save();
};

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

import Joi from 'joi';

// User validation schemas
export const userValidation = {
    signup: Joi.object({
        name: Joi.string().min(2).max(100).pattern(/^[a-zA-Z\s'-]+$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
        phone: Joi.string().pattern(/^\+?[\d\s-()]{10,15}$/).optional(),
        address: Joi.string().max(500).optional(),
        interestedInFreelancing: Joi.boolean().optional()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    profile: Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        phone: Joi.string().pattern(/^\+?[\d\s-()]{10,15}$/).optional(),
        address: Joi.string().max(500).optional(),
        bio: Joi.string().max(1000).optional(),
        skills: Joi.array().items(Joi.string()).optional(),
        hourlyRate: Joi.number().min(0).max(10000).optional(),
        availability: Joi.string().valid('available', 'busy', 'unavailable').optional()
    }),

    resetPassword: Joi.object({
        token: Joi.string().required(),
        newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
    })
};

// Project validation schemas
export const projectValidation = {
    create: Joi.object({
        title: Joi.string().min(5).max(200).required(),
        description: Joi.string().min(50).max(5000).required(),
        category: Joi.string().valid(
            'video-editing', 'motion-graphics', 'color-grading', 'audio-post',
            '3d-animation', 'visual-effects', 'documentary', 'commercial',
            'music-video', 'social-media', 'youtube', 'promotional'
        ).required(),
        budget: Joi.object({
            type: Joi.string().valid('fixed', 'hourly', 'range').required(),
            amount: Joi.number().min(0).when('type', {
                is: 'fixed',
                then: Joi.required()
            }),
            min: Joi.number().min(0).when('type', {
                is: 'range',
                then: Joi.required()
            }),
            max: Joi.number().min(Joi.ref('min')).when('type', {
                is: 'range',
                then: Joi.required()
            })
        }).required(),
        timeline: Joi.string().valid('urgent', '1-3-days', '1-week', '2-weeks', '1-month', 'flexible').required(),
        skillsRequired: Joi.array().items(Joi.string()).min(1).required(),
        deliverables: Joi.array().items(Joi.string()).min(1).required(),
        estimatedHours: Joi.number().min(1).max(1000).optional(),
        experienceLevel: Joi.string().valid('beginner', 'intermediate', 'expert').required()
    }),

    update: Joi.object({
        title: Joi.string().min(5).max(200).optional(),
        description: Joi.string().min(50).max(5000).optional(),
        status: Joi.string().valid('open', 'in-progress', 'completed', 'cancelled').optional(),
        budget: Joi.object({
            type: Joi.string().valid('fixed', 'hourly', 'range'),
            amount: Joi.number().min(0),
            min: Joi.number().min(0),
            max: Joi.number().min(0)
        }).optional()
    })
};

// Product validation schemas
export const productValidation = {
    create: Joi.object({
        name: Joi.string().min(5).max(200).required(),
        description: Joi.string().min(20).max(2000).required(),
        category: Joi.string().valid('indoor', 'outdoor', 'rental', 'video-wall', 'transparent', 'flexible').required(),
        subcategory: Joi.string().optional(),
        price: Joi.number().min(0).required(),
        rentalPrice: Joi.object({
            daily: Joi.number().min(0).optional(),
            weekly: Joi.number().min(0).optional(),
            monthly: Joi.number().min(0).optional()
        }).optional(),
        specifications: Joi.object({
            pixelPitch: Joi.string().required(),
            resolution: Joi.string().required(),
            brightness: Joi.string().required(),
            size: Joi.string().required(),
            weight: Joi.string().optional(),
            powerConsumption: Joi.string().optional(),
            refreshRate: Joi.string().optional(),
            viewingAngle: Joi.string().optional()
        }).required(),
        stock: Joi.number().min(0).required(),
        images: Joi.array().items(Joi.string().uri()).min(1).required(),
        features: Joi.array().items(Joi.string()).optional(),
        warranty: Joi.string().optional(),
        installation: Joi.boolean().optional(),
        support: Joi.boolean().optional()
    })
};

// Bid validation schemas
export const bidValidation = {
    create: Joi.object({
        projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        amount: Joi.number().min(1).required(),
        timeline: Joi.number().min(1).max(365).required(),
        message: Joi.string().min(50).max(2000).required(),
        milestones: Joi.array().items(
            Joi.object({
                title: Joi.string().max(200).required(),
                amount: Joi.number().min(0).required(),
                deliverables: Joi.array().items(Joi.string()).required()
            })
        ).optional()
    })
};

// Order validation schemas
export const orderValidation = {
    create: Joi.object({
        items: Joi.array().items(
            Joi.object({
                productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
                quantity: Joi.number().min(1).required(),
                type: Joi.string().valid('purchase', 'rental').required(),
                rentalDuration: Joi.number().when('type', {
                    is: 'rental',
                    then: Joi.number().min(1).required()
                }),
                rentalPeriod: Joi.string().valid('daily', 'weekly', 'monthly').when('type', {
                    is: 'rental',
                    then: Joi.required()
                })
            })
        ).min(1).required(),
        shippingAddress: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipCode: Joi.string().required(),
            country: Joi.string().required(),
            phone: Joi.string().required()
        }).required(),
        paymentMethod: Joi.string().valid('card', 'paypal', 'bank-transfer').required(),
        notes: Joi.string().max(500).optional()
    })
};

// Message validation schemas
export const messageValidation = {
    send: Joi.object({
        recipientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        content: Joi.string().min(1).max(2000).required(),
        projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
        attachments: Joi.array().items(Joi.string().uri()).max(5).optional()
    })
};

// Contact validation schemas
export const contactValidation = {
    general: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        subject: Joi.string().min(5).max(200).required(),
        message: Joi.string().min(10).max(2000).required(),
        department: Joi.string().valid('sales', 'support', 'general').optional()
    }),

    sales: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^\+?[\d\s-()]{10,15}$/).optional(),
        company: Joi.string().max(200).optional(),
        inquiryType: Joi.string().required(),
        budget: Joi.string().optional(),
        timeline: Joi.string().optional(),
        description: Joi.string().min(50).max(5000).required()
    })
};

// Helper function to validate data
export function validateData(schema, data) {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        throw new Error(JSON.stringify({ validation: true, errors }));
    }

    return value;
}

// Helper function to create standardized API responses
export function createResponse(data = null, message = '', success = true, status = 200) {
    return {
        success,
        message,
        data,
        timestamp: new Date().toISOString(),
        status
    };
}

// Helper function to handle validation errors
export function handleValidationError(error, res) {
    try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.validation) {
            return res.status(400).json(createResponse(
                null,
                'Validation failed',
                false,
                400
            ));
        }
    } catch (e) {
        // Not a validation error
    }

    return res.status(500).json(createResponse(
        null,
        'Internal server error',
        false,
        500
    ));
}

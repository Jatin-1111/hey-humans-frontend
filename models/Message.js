// models/Message.js - Chat/messaging schema
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
        required: true,
        maxLength: [2000, 'Message cannot exceed 2000 characters']
    },

    type: {
        type: String,
        enum: ['text', 'image', 'file', 'project_update', 'system'],
        default: 'text'
    },

    // For file/image attachments
    attachments: [{
        name: String,
        url: String,
        type: String, // 'image', 'video', 'document'
        size: Number
    }],

    // Message status
    isRead: {
        type: Boolean,
        default: false
    },

    readAt: Date,

    // For system messages or project-related messages
    metadata: {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        actionType: String, // 'bid_placed', 'project_completed', 'order_shipped', etc.
    },

    // Message threading (for replies)
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },

    // Soft delete
    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: Date,

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
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ 'metadata.projectId': 1 });
messageSchema.index({ 'metadata.orderId': 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ replyTo: 1 });

// Virtual for conversation participants
messageSchema.virtual('conversationId').get(function () {
    const participants = [this.sender.toString(), this.recipient.toString()].sort();
    return participants.join('_');
});

// Pre-save middleware
messageSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Methods
messageSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

messageSchema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

// Statics
messageSchema.statics.getConversation = function (user1Id, user2Id, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    return this.find({
        $or: [
            { sender: user1Id, recipient: user2Id },
            { sender: user2Id, recipient: user1Id }
        ],
        isDeleted: false
    })
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

messageSchema.statics.markConversationAsRead = function (senderId, recipientId) {
    return this.updateMany(
        {
            sender: senderId,
            recipient: recipientId,
            isRead: false
        },
        {
            isRead: true,
            readAt: new Date()
        }
    );
};

messageSchema.statics.getUnreadCount = function (userId) {
    return this.countDocuments({
        recipient: userId,
        isRead: false,
        isDeleted: false
    });
};

messageSchema.statics.getUserConversations = function (userId) {
    return this.aggregate([
        {
            $match: {
                $or: [{ sender: mongoose.Types.ObjectId(userId) }, { recipient: mongoose.Types.ObjectId(userId) }],
                isDeleted: false
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
                        '$recipient',
                        '$sender'
                    ]
                },
                lastMessage: { $first: '$$ROOT' },
                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$recipient', mongoose.Types.ObjectId(userId)] },
                                    { $eq: ['$isRead', false] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'otherUser'
            }
        },
        {
            $unwind: '$otherUser'
        },
        {
            $project: {
                otherUser: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    freelancerProfile: 1
                },
                lastMessage: 1,
                unreadCount: 1
            }
        },
        {
            $sort: { 'lastMessage.createdAt': -1 }
        }
    ]);
};

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

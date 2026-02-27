const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    feedbackType: {
        type: String,
        enum: ['Feedback', 'Grievance', 'Suggestion', 'Complaint', 'Other'],
        default: 'Feedback'
    },
    status: {
        type: String,
        enum: ['New', 'Read', 'In Progress', 'Resolved'],
        default: 'New'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    adminReply: {
        type: String,
        default: ''
    },
    repliedBy: {
        type: String,
        default: ''
    },
    repliedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);

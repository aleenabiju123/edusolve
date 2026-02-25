const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    complaintDate: {
        type: Date,
        required: true
    },
    complaintTime: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Academic', 'Infrastructure', 'Exam', 'Other'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        default: null
    },
    feedback: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Registered', 'Pending', 'Resolved'],
        default: 'Registered'
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date,
        default: null
    },
    adminNotes: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Solved'],
        default: 'Pending'
    },
    subAdminNotes: {
        type: String,
        default: ''
    },
    resolvedImage: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Complaint', complaintSchema);

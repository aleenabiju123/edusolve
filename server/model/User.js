const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phoneNumber: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        unique: true
    },
    userType: {
        type: String,
        enum: ['Student', 'Admin'],
        default: 'Student'
    },
    adminDepartment: {
        type: String,
        enum: ['General', 'Academic', 'Infrastructure', 'Exam'],
        default: 'General'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resetPasswordOtp: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);

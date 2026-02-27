const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./model/User');
const fs = require('fs');
const path = require('path');
const { startComplaintStatusCron } = require('./utils/cronJobs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
mongoose.connect(process.env.mongodb_url, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    connectTimeoutMS: 10000,
})
    .then(async () => {
        console.log('Connected to MongoDB');
        // Auto-seed admins
        const admins = [
            { name: 'Main Admin', email: 'admin@system.com', password: 'password123', admissionNumber: '00000000', department: 'Administration', phoneNumber: '0000000000', userType: 'Admin', adminDepartment: 'General' },
            { name: 'Exam Admin', email: 'exam@system.com', password: 'password123', admissionNumber: '00000001', department: 'Examination', phoneNumber: '0000000001', userType: 'Admin', adminDepartment: 'Exam' },
            { name: 'Infrastructure Admin', email: 'infra@system.com', password: 'password123', admissionNumber: '00000002', department: 'Infrastructure', phoneNumber: '0000000002', userType: 'Admin', adminDepartment: 'Infrastructure' },
            { name: 'Academic Admin', email: 'academic@system.com', password: 'password123', admissionNumber: '00000003', department: 'Academics', phoneNumber: '0000000003', userType: 'Admin', adminDepartment: 'Academic' }
        ];

        for (const adminData of admins) {
            try {
                // Check by BOTH email and admissionNumber to avoid unique constraint violations
                const existingUser = await User.findOne({
                    $or: [
                        { email: adminData.email },
                        { admissionNumber: adminData.admissionNumber }
                    ]
                });

                if (!existingUser) {
                    const hashedPassword = await bcrypt.hash(adminData.password, 10);
                    const newAdmin = new User({
                        ...adminData,
                        password: hashedPassword,
                        studentId: `ADM${Math.floor(Math.random() * 900) + 100}`
                    });
                    await newAdmin.save();
                } else {
                    // Force update to ensure role and department are correct
                    existingUser.adminDepartment = adminData.adminDepartment;
                    existingUser.userType = 'Admin';
                    existingUser.name = adminData.name;
                    existingUser.email = adminData.email; // Ensure email matches
                    existingUser.admissionNumber = adminData.admissionNumber; // Ensure admissionNumber matches
                    await existingUser.save();
                }
            } catch (seedError) {
                console.error(`Error seeding admin ${adminData.email}:`, seedError.message);
            }
        }
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Routes
const userRoutes = require('./Route/Userroute');
const complaintRoutes = require('./Route/Complaintroute');
const feedbackRoutes = require('./Route/Feedbackroute');
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Start automatic complaint status update cron job
    startComplaintStatusCron();
});

module.exports = app;
var express = require('express');
var router = express.Router();
var userModel = require('../model/User');
var loginHistoryModel = require('../model/LoginHistory');
const bcrypt = require('bcrypt');

// Unified registration endpoint for both students and admins
router.post('/register', async (req, res) => {
    try {
        const { role, fullName, email, password, phoneNumber, admissionNumber, department, adminId, subject } = req.body;

        console.log('Registration request:', { role, fullName, email }); // Debug log

        // Validate common fields
        if (!role || !fullName || !email || !password || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Check if user already exists by email
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'student') {
            // Student registration
            if (!admissionNumber || !department) {
                return res.status(400).json({
                    success: false,
                    message: "Admission number and department are required for student registration"
                });
            }

            // Validate admission number format
            if (!/^\d{8,12}$/.test(admissionNumber)) {
                return res.status(400).json({
                    success: false,
                    message: "Admission Number must be 8-12 digits"
                });
            }

            // Check if admission number already exists
            const existingAdmission = await userModel.findOne({ admissionNumber: admissionNumber });
            if (existingAdmission) {
                return res.status(409).json({
                    success: false,
                    message: "Admission number already registered"
                });
            }

            // Generate unique student ID
            const generateStudentId = () => {
                const deptCode = department.substring(0, 2).toUpperCase();
                const year = new Date().getFullYear();
                const randomNum = Math.floor(Math.random() * 9000) + 1000;
                return `${deptCode}${year}${randomNum}`;
            };

            let studentId;
            let isUnique = false;
            let attempts = 0;
            do {
                studentId = generateStudentId();
                const existingStudentId = await userModel.findOne({ studentId: studentId });
                isUnique = !existingStudentId;
                attempts++;
            } while (!isUnique && attempts < 10);

            if (!isUnique) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to generate unique student ID. Please try again."
                });
            }

            // Create new student user
            const newUser = new userModel({
                name: fullName,
                email: email,
                password: hashedPassword,
                phoneNumber: phoneNumber,
                admissionNumber: admissionNumber,
                studentId: studentId,
                department: department,
                userType: 'Student'
            });

            await newUser.save();

            console.log('Student registered successfully:', newUser._id);

            return res.status(201).json({
                success: true,
                message: "Student registered successfully",
                user: {
                    id: newUser._id,
                    studentId: newUser.studentId,
                    admissionNumber: newUser.admissionNumber,
                    name: newUser.name,
                    email: newUser.email,
                    department: newUser.department,
                    phoneNumber: newUser.phoneNumber
                }
            });

        } else if (role === 'admin') {
            // Admin registration
            if (!department || !subject) {
                return res.status(400).json({
                    success: false,
                    message: "Department and subject are required for admin registration"
                });
            }

            // Generate admin ID if not provided
            const adminIdFinal = adminId || `ADMIN${Date.now()}`;

            // Create new admin user
            const newAdmin = new userModel({
                name: fullName,
                email: email,
                password: hashedPassword,
                phoneNumber: phoneNumber,
                studentId: adminIdFinal, // Use studentId field to store adminId for compatibility
                admissionNumber: adminIdFinal, // Also store in admissionNumber
                department: department,
                userType: 'Admin'
            });

            await newAdmin.save();

            console.log('Admin registered successfully:', newAdmin._id);

            return res.status(201).json({
                success: true,
                message: "Admin registered successfully",
                user: {
                    id: newAdmin._id,
                    adminId: adminIdFinal,
                    name: newAdmin.name,
                    email: newAdmin.email,
                    department: newAdmin.department,
                    phoneNumber: newAdmin.phoneNumber
                }
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 'student' or 'admin'"
            });
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
});

// api to sign in/register new user (Legacy endpoint for backward compatibility)
router.post('/signin', async (req, res) => {
    try {
        const { admissionNumber, fullName, email, department, password, phoneNumber } = req.body;

        // Validate input
        if (!admissionNumber || !fullName || !email || !department || !password || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate admission number format
        if (!/^\d{8,12}$/.test(admissionNumber)) {
            return res.status(400).json({
                success: false,
                message: "Admission Number must be 8-12 digits"
            });
        }

        // Check if user already exists by email or admission number
        const existingUser = await userModel.findOne({
            $or: [
                { email: email },
                { admissionNumber: admissionNumber }
            ]
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email or admission number already exists"
            });
        }

        // Generate unique student ID
        const generateStudentId = () => {
            const deptCode = department.substring(0, 2).toUpperCase();
            const year = new Date().getFullYear();
            const randomNum = Math.floor(Math.random() * 9000) + 1000;
            return `${deptCode}${year}${randomNum}`;
        };

        let studentId;
        let isUnique = false;
        let attempts = 0;
        do {
            studentId = generateStudentId();
            const existingStudentId = await userModel.findOne({ studentId: studentId });
            isUnique = !existingStudentId;
            attempts++;
        } while (!isUnique && attempts < 10);

        if (!isUnique) {
            return res.status(500).json({
                success: false,
                message: "Unable to generate unique student ID. Please try again."
            });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            admissionNumber: admissionNumber,
            name: fullName,
            email: email,
            department: department,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            studentId: studentId
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                studentId: newUser.studentId,
                admissionNumber: newUser.admissionNumber,
                name: newUser.name,
                email: newUser.email,
                department: newUser.department,
                phoneNumber: newUser.phoneNumber
            }
        });
    } catch (error) {
        console.error('Registration/SignIn Error:', error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
})

// api to login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (require('mongoose').connection.readyState !== 1) {
            console.error('Database connection not ready. State:', require('mongoose').connection.readyState);
            return res.status(503).json({
                success: false,
                message: "Server is still connecting to the database. If this persists, please ensure your IP is whitelisted in MongoDB Atlas."
            });
        }

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Admission Number and password are required"
            });
        }

        // Find user by email, admission number, or student ID
        const user = await userModel.findOne({
            $or: [
                { email: email },
                { admissionNumber: email },
                { studentId: email }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            // Record login history
            try {
                const history = new loginHistoryModel({
                    userId: user._id,
                    userName: user.name,
                    email: user.email,
                    userType: user.userType || 'Student',
                    adminDepartment: user.adminDepartment,
                    ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent']
                });
                await history.save();
            } catch (historyError) {
                console.error('Error recording login history:', historyError);
            }

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    studentId: user.studentId,
                    admissionNumber: user.admissionNumber,
                    name: user.name,
                    email: user.email,
                    department: user.department,
                    phoneNumber: user.phoneNumber,
                    userType: user.userType || 'Student',
                    adminDepartment: user.adminDepartment || 'General'
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
})
// Forgot Password - Generate OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email or Admission Number is required"
            });
        }

        // Find user by email or admission number
        const user = await userModel.findOne({
            $or: [
                { email: email },
                { admissionNumber: email }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this Email or Admission Number"
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Save OTP to user
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = otpExpires;
        await user.save();

        // Simulate sending SMS/Email by logging to console
        console.log('==========================================');
        console.log(`PASSWORD RESET OTP for ${user.email}: ${otp}`);
        console.log('==========================================');

        res.status(200).json({
            success: true,
            message: "OTP generated successfully. Check server console/logs for the code (Simulation Mode)."
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
});

// Reset Password - Verify OTP and Set New Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP, and New Password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Find user by email/admission number and valid OTP
        const user = await userModel.findOne({
            $or: [
                { email: email },
                { admissionNumber: email }
            ],
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear OTP fields
        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now login with your new password."
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
});

// Change Password (authenticated — user provides current password)
router.put('/change-password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, current password, and new password are all required.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters.'
            });
        }

        // Find user
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect.'
            });
        }

        // Hash and save new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        console.log(`Password changed successfully for: ${user.email}`);

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully.'
        });

    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// api to fetch login history (Admin only)
router.get('/login-history', async (req, res) => {
    try {
        const { adminId } = req.query;

        if (adminId && require('mongoose').Types.ObjectId.isValid(adminId)) {
            const admin = await userModel.findById(adminId);
            if (!admin || admin.adminDepartment !== 'General') {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Only General Admin can view login history."
                });
            }
        }
        // note: non‑ObjectId adminId values are ignored, since we only need to verify
        // general admin rights when a valid Mongo ID is provided. requests without
        // adminId or with a custom identifier (e.g. ADM001) will still succeed.

        const history = await loginHistoryModel.find().sort({ loginTime: -1 }).limit(500);
        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.error('Fetch Login History Error:', error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
});

module.exports = router
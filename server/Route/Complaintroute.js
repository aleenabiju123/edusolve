var express = require('express');
var router = express.Router();
var complaintModel = require('../model/Complaint');
var userModel = require('../model/User');
var multer = require('multer');
var path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Create a new complaint
router.post('/register', upload.single('attachment'), async (req, res) => {
    try {
        const { studentId, studentName, email, complaintDate, complaintTime, category, description, feedback } = req.body;
        const attachment = req.file ? req.file.path : null; // Get file path

        console.log('Received complaint data:', req.body); // Debug log
        if (req.file) console.log('Received file:', req.file);

        // Validate input
        if (!studentId || !studentName || !email || !complaintDate || !complaintTime || !category || !description) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
                received: { studentId, studentName, email, complaintDate, complaintTime, category, description }
            });
        }

        // Create new complaint
        const newComplaint = new complaintModel({
            studentId,
            studentName,
            email,
            complaintDate: new Date(complaintDate),
            complaintTime,
            category,
            description,
            attachment: attachment, // Save file path
            feedback: feedback || '',
            status: 'Registered',
            registeredAt: new Date(),
            priority: 'Medium'
        });

        const savedComplaint = await newComplaint.save();

        console.log('Complaint saved successfully:', savedComplaint._id); // Debug log

        res.status(201).json({
            success: true,
            message: "Complaint registered successfully",
            complaint: savedComplaint
        });
    } catch (error) {
        console.error('Error registering complaint:', error); // Better error logging
        res.status(500).json({
            success: false,
            message: "Error registering complaint: " + error.message,
            error: error.message
        });
    }
});

// Get all complaints
router.get('/all', async (req, res) => {
    try {
        const complaints = await complaintModel.find().populate('studentId', 'name email').sort({ registeredAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints: complaints
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching complaints",
            error: error.message
        });
    }
});

// Get complaints by student ID
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        const complaints = await complaintModel.find({ studentId }).sort({ registeredAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints: complaints
        });
    } catch (error) {
        console.error('Error fetching student complaints:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching complaints",
            error: error.message
        });
    }
});

// Get complaints by department (for sub-admins)
router.get('/department/:department', async (req, res) => {
    try {
        const { department } = req.params;
        const categoryMap = {
            'Academic': 'Academic',
            'Infrastructure': 'Infrastructure',
            'Exam': 'Exam'
        };

        const category = categoryMap[department];
        if (!category && department !== 'General') {
            return res.status(400).json({
                success: false,
                message: "Invalid department"
            });
        }

        let filter = {};
        if (department !== 'General') {
            filter.category = category;
        }

        const complaints = await complaintModel.find(filter).sort({ registeredAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints: complaints
        });
    } catch (error) {
        console.error('Error fetching department complaints:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching complaints",
            error: error.message
        });
    }
});

// Update complaint status
router.put('/update-status/:complaintId', upload.single('resolvedImage'), async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { status, adminNotes, priority, verificationStatus, subAdminNotes } = req.body;
        const resolvedImage = req.file ? req.file.path : null;

        const updateData = {};
        if (status) updateData.status = status;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (priority) updateData.priority = priority;
        if (verificationStatus) updateData.verificationStatus = verificationStatus;
        if (subAdminNotes !== undefined) updateData.subAdminNotes = subAdminNotes;
        if (resolvedImage) updateData.resolvedImage = resolvedImage;

        if (status === 'Resolved') {
            updateData.resolvedAt = new Date();
        }

        const updatedComplaint = await complaintModel.findByIdAndUpdate(
            complaintId,
            updateData,
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Complaint updated successfully",
            complaint: updatedComplaint
        });
    } catch (error) {
        console.error('Error updating complaint:', error);
        res.status(500).json({
            success: false,
            message: "Error updating complaint",
            error: error.message
        });
    }
});

// Get complaint by ID
router.get('/:complaintId', async (req, res) => {
    try {
        const { complaintId } = req.params;

        const complaint = await complaintModel.findById(complaintId).populate('studentId', 'name email department');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            complaint: complaint
        });
    } catch (error) {
        console.error('Error fetching complaint:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching complaint",
            error: error.message
        });
    }
});

// Get complaints with filters
router.get('/filter/status', async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        const complaints = await complaintModel.find(filter).sort({ registeredAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints: complaints
        });
    } catch (error) {
        console.error('Error filtering complaints:', error);
        res.status(500).json({
            success: false,
            message: "Error filtering complaints",
            error: error.message
        });
    }
});

module.exports = router;

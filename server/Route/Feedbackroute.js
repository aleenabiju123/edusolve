const express = require('express');
const router = express.Router();
const Feedback = require('../model/Feedback');

// Create new feedback
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message, feedbackType } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newFeedback = new Feedback({
            name,
            email,
            subject,
            message,
            feedbackType: feedbackType || 'Feedback'
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
});

// Get all feedback for admins
router.get('/all', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Error fetching feedbacks', error: error.message });
    }
});

// Get feedback by status
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const feedbacks = await Feedback.find({ status }).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Error fetching feedbacks', error: error.message });
    }
});

// Get single feedback
router.get('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
});

// Update feedback status and reply
router.put('/:id', async (req, res) => {
    try {
        const { status, priority, adminReply, repliedBy } = req.body;
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (status) feedback.status = status;
        if (priority) feedback.priority = priority;
        if (adminReply) {
            feedback.adminReply = adminReply;
            feedback.repliedBy = repliedBy || 'Admin';
            feedback.repliedAt = new Date();
            feedback.status = 'Resolved';
        }
        feedback.updatedAt = new Date();

        await feedback.save();
        res.json({ message: 'Feedback updated successfully', feedback });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ message: 'Error updating feedback', error: error.message });
    }
});

// Delete feedback
router.delete('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ message: 'Error deleting feedback', error: error.message });
    }
});

// Get feedback statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const total = await Feedback.countDocuments();
        const newCount = await Feedback.countDocuments({ status: 'New' });
        const resolved = await Feedback.countDocuments({ status: 'Resolved' });

        res.json({
            total,
            new: newCount,
            resolved,
            pending: total - resolved
        });
    } catch (error) {
        console.error('Error fetching feedback stats:', error);
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
});

module.exports = router;

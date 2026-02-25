const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Complaint = require('./model/Complaint');
const path = require('path');

dotenv.config();

async function testCronLogic() {
    try {
        await mongoose.connect(process.env.mongodb_url);
        console.log('Connected to MongoDB');

        // Create a dummy complaint that is 25 hours old
        const twentyFiveHoursAgo = new Date(Date.now() - 25 * 60 * 60 * 1000);

        const testComplaint = new Complaint({
            studentId: 'TEST_ID',
            studentName: 'Test Student',
            email: 'test@example.com',
            complaintDate: twentyFiveHoursAgo,
            complaintTime: '12:00',
            category: 'Other',
            description: 'Test Complaint for Cron',
            status: 'Registered',
            registeredAt: twentyFiveHoursAgo
        });

        await testComplaint.save();
        console.log('Created test complaint with ID:', testComplaint._id);

        // Run the update logic manually (copied from cronJobs.js)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await Complaint.updateMany(
            {
                status: 'Registered',
                registeredAt: { $lt: twentyFourHoursAgo }
            },
            {
                $set: { status: 'Pending' }
            }
        );

        console.log(`Updated ${result.modifiedCount} complaints.`);

        // Verify the test complaint was updated
        const updatedComplaint = await Complaint.findById(testComplaint._id);
        if (updatedComplaint.status === 'Pending') {
            console.log('VERIFICATION SUCCESS: Complaint status updated to Pending!');
        } else {
            console.error('VERIFICATION FAILED: Complaint status is still:', updatedComplaint.status);
        }

        // Cleanup
        await Complaint.findByIdAndDelete(testComplaint._id);
        console.log('Cleaned up test complaint.');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Test error:', error);
        process.exit(1);
    }
}

testCronLogic();

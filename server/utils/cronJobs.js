const Complaint = require('../model/Complaint');

const startComplaintStatusCron = () => {
    // Run every hour to check for old complaints
    // 1 hour = 60 * 60 * 1000 milliseconds
    const checkInterval = 60 * 60 * 1000;

    const runUpdate = async () => {
        // Only run if database is connected
        if (require('mongoose').connection.readyState !== 1) {
            return;
        }
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Find complaints that are 'Registered' and older than 24 hours
            const result = await Complaint.updateMany(
                {
                    status: 'Registered',
                    registeredAt: { $lt: twentyFourHoursAgo }
                },
                {
                    $set: { status: 'Pending' }
                }
            );

        } catch (error) {
            console.error('Error during automatic complaint status update:', error);
        }
    };

    // Run once immediately on start
    runUpdate();

    // Then schedule it to run every hour
    setInterval(runUpdate, checkInterval);

};

module.exports = { startComplaintStatusCron };

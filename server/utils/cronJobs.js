const Complaint = require('../model/Complaint');

const startComplaintStatusCron = () => {
    // Run every hour to check for old complaints
    // 1 hour = 60 * 60 * 1000 milliseconds
    const checkInterval = 60 * 60 * 1000;

    const runUpdate = async () => {
        // Only run if database is connected
        if (require('mongoose').connection.readyState !== 1) {
            console.log('Skipping automatic update: Database not connected.');
            return;
        }
        console.log('Running automatic complaint status update check...');
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

            if (result.modifiedCount > 0) {
                console.log(`Successfully updated ${result.modifiedCount} complaints to 'Pending' status.`);
            } else {
                console.log('No complaints found that require status update.');
            }
        } catch (error) {
            console.error('Error during automatic complaint status update:', error);
        }
    };

    // Run once immediately on start
    runUpdate();

    // Then schedule it to run every hour
    setInterval(runUpdate, checkInterval);

    console.log('Complaint status update job initialized (runs every hour)');
};

module.exports = { startComplaintStatusCron };

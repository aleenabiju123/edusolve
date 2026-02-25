const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing connection to:', process.env.mongodb_url.split('@')[1]);

mongoose.connect(process.env.mongodb_url, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('SUCCESS: Connected to database');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Could not connect to database');
        console.error(err.message);
        process.exit(1);
    });

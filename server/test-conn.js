const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.mongodb_url;
console.log('Testing connection to:', url.split('@')[1]); // Log only the host for security

const timeout = setTimeout(() => {
    console.error('FAIL: Connection timed out after 10 seconds');
    process.exit(1);
}, 10000);

mongoose.connect(url, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        clearTimeout(timeout);
        console.log('PASS: Connected to MongoDB successfully!');
        process.exit(0);
    })
    .catch(err => {
        clearTimeout(timeout);
        console.error('FAIL: MongoDB error:', err.message);
        process.exit(1);
    });

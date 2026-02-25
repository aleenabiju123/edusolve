const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./model/User');
dotenv.config();

console.log('Starting diagnostics...');
console.log('DB URL:', process.env.mongodb_url ? 'Found' : 'MISSING');

mongoose.connect(process.env.mongodb_url, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
        console.log('PASS: Connected to MongoDB');
        const count = await User.countDocuments();
        console.log('PASS: User count in DB:', count);
        process.exit(0);
    })
    .catch(err => {
        console.error('FAIL: Error during diagnostics:', err);
        process.exit(1);
    });

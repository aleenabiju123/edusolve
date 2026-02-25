const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./model/User');
dotenv.config();

mongoose.connect(process.env.mongodb_url)
    .then(async () => {
        const admins = await User.find({ userType: 'Admin' });
        console.log('--- Current Admins in DB ---');
        admins.forEach(a => {
            console.log(`Email: ${a.email}, Dept: ${a.adminDepartment}, ID: ${a.studentId}`);
        });
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

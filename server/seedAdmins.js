const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./model/User');

dotenv.config();

const admins = [
    {
        name: 'Main Admin',
        email: 'admin@system.com',
        password: 'password123',
        admissionNumber: '00000000',
        department: 'Administration',
        phoneNumber: '0000000000',
        userType: 'Admin',
        adminDepartment: 'General'
    },
    {
        name: 'Exam Admin',
        email: 'exam@system.com',
        password: 'password123',
        admissionNumber: '00000001',
        department: 'Examination',
        phoneNumber: '0000000001',
        userType: 'Admin',
        adminDepartment: 'Exam'
    },
    {
        name: 'Infrastructure Admin',
        email: 'infra@system.com',
        password: 'password123',
        admissionNumber: '00000002',
        department: 'Infrastructure',
        phoneNumber: '0000000002',
        userType: 'Admin',
        adminDepartment: 'Infrastructure'
    },
    {
        name: 'Academic Admin',
        email: 'academic@system.com',
        password: 'password123',
        admissionNumber: '00000003',
        department: 'Academics',
        phoneNumber: '0000000003',
        userType: 'Admin',
        adminDepartment: 'Academic'
    }
];

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.mongodb_url);
        console.log('Connected to MongoDB for seeding...');

        for (const adminData of admins) {
            const existingUser = await User.findOne({ email: adminData.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(adminData.password, 10);
                const newAdmin = new User({
                    ...adminData,
                    password: hashedPassword,
                    studentId: `ADM${Math.floor(Math.random() * 1000)}`
                });
                await newAdmin.save();
                console.log(`Created admin: ${adminData.name} (${adminData.adminDepartment})`);
            } else {
                console.log(`Admin ${adminData.name} already exists. Updating department...`);
                existingUser.adminDepartment = adminData.adminDepartment;
                existingUser.userType = 'Admin';
                await existingUser.save();
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admins:', error);
        process.exit(1);
    }
};

seedAdmins();

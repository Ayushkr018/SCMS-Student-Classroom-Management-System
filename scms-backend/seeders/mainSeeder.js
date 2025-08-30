/**
 * Main Seeder Script
 * Connects to the database and runs all seeder files.
 */

require('dotenv').config({ path: '../.env' }); // Adjust path to .env file
const { connectDB } = require('../config/db');
const mongoose = require('mongoose');

// Import seeders
const seedUsers = require('../seeders/userSeeder');
const seedCourses = require('../seeders/courseSeeder');

const runSeeders = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();
        console.log('Database connected. Starting seeder...');
        console.log('---------------------------------');

        // Run seeders in order
        await seedUsers();
        await seedCourses();
        
        console.log('---------------------------------');
        console.log('🎉 All seeders completed successfully!');
        
    } catch (error) {
        console.error('An error occurred during the seeding process:', error);
    } finally {
        console.log('Closing database connection...');
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
};

runSeeders();

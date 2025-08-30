/**
 * Settings Seeder
 * Creates the default application settings document.
 */

const { Settings } = require('../models');

const seedSettings = async () => {
    try {
        console.log('Seeding application settings...');

        // Clear existing settings
        await Settings.deleteMany({});

        // Create a single, global settings document
        await Settings.create({
            siteName: 'Smart Campus Management System',
            siteUrl: 'http://localhost:3000',
            maintenanceMode: {
                enabled: false,
                message: 'The site is currently down for maintenance. Please check back later.'
            },
            registration: {
                allowRegistration: true,
                defaultRole: 'student',
                requireEmailVerification: true
            },
            email: {
                emailFrom: 'noreply@scms.com',
                emailProvider: 'smtp' // or 'sendgrid', 'mailgun'
            },
            features: {
                proctoringEnabled: true,
                plagiarismCheckEnabled: true,
                notificationsEnabled: true,
                chatEnabled: true
            }
        });

        console.log('✅ Application settings seeded successfully!');

    } catch (error) {
        console.error('Error seeding settings:', error);
        process.exit(1);
    }
};

module.exports = seedSettings;

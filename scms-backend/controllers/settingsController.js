/**
 * Settings Controller
 * Handles application-wide settings and configuration
 */

const {
    Settings
} = require('../models');
const {
    catchAsync
} = require('../middleware/errorHandler');
const {
    sendSuccessResponse,
    sendUpdatedResponse,
    sendErrorResponse
} = require('../utils/response');
const {
    USER_ROLES
} = require('../utils/constants');

/**
 * Get application settings
 */
const getSettings = catchAsync(async (req, res) => {
    // There should only be one settings document in the collection
    let settings = await Settings.findOne();

    // If no settings document exists, create one with default values
    if (!settings) {
        settings = await Settings.create({
            // Default settings can be defined here
            siteName: 'Smart Campus Management System',
            maintenanceMode: {
                enabled: false,
                message: 'The system is currently down for maintenance. Please check back later.'
            },
            features: {
                plagiarismCheck: true,
                proctoring: true
            }
        });
    }

    sendSuccessResponse(res, 200, 'Settings retrieved successfully', settings);
});

/**
 * Update application settings (Admin only)
 */
const updateSettings = catchAsync(async (req, res) => {
    // This endpoint is restricted to Admins via the routes
    const updates = req.body;

    // Find the single settings document and update it.
    // 'upsert: true' will create the document if it doesn't exist.
    const settings = await Settings.findOneAndUpdate({}, updates, {
        new: true,
        upsert: true,
        runValidators: true
    });

    sendUpdatedResponse(res, settings, 'Settings updated successfully');
});

module.exports = {
    getSettings,
    updateSettings
};

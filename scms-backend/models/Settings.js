/**
 * Settings Model
 * Manages global, system-wide settings for the SCMS application.
 */

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Use a fixed key to easily retrieve the single global settings document
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'global'
  },

  // School Information
  schoolName: {
    type: String,
    trim: true,
    default: 'Smart Campus Management System'
  },
  schoolLogoUrl: {
    type: String,
    trim: true,
    default: '/default-logo.png'
  },
  schoolAddress: {
    type: String,
    trim: true
  },

  // Academic Settings
  currentAcademicYear: {
    type: String,
    match: [/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY (e.g., 2024-2025)'],
    default: '2024-2025'
  },

  defaultGradingScale: [{
    grade: { type: String, required: true },
    minPercentage: { type: Number, required: true, min: 0, max: 100 }
  }],

  // Feature Toggles / Flags
  features: {
    plagiarismCheckEnabled: { type: Boolean, default: false },
    onlineProctoringEnabled: { type: Boolean, default: false },
    smsNotificationsEnabled: { type: Boolean, default: false },
    parentalPortalEnabled: { type: Boolean, default: true }
  },

  // System Maintenance
  maintenanceMode: {
    enabled: { type: Boolean, default: false },
    message: {
      type: String,
      default: 'The system is currently down for scheduled maintenance. We will be back shortly.'
    }
  },

  // Contact & Support Information
  supportEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  supportPhone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Tracks when settings were last updated
});

// --- STATIC METHODS ---
/**
 * A helper method to easily find the single global settings document.
 * Creates it if it doesn't exist.
 */
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne({ key: 'global' });
  if (!settings) {
    // If no settings doc exists, create the first one with defaults
    console.log('No global settings found. Creating default settings document...');
    settings = await this.create({ key: 'global' });
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

/**
 * Models Index
 * This file serves as a central hub for exporting all Mongoose models.
 * It simplifies importing models into other parts of the application.
 *
 * Instead of:
 * const User = require('./models/User');
 * const Course = require('./models/Course');
 *
 * You can do:
 * const { User, Course } = require('./models');
 */

module.exports = {
  User: require('./User'),
  Student: require('./Student'),
  Teacher: require('./Teacher'),
  Course: require('./Course'),
  Assignment: require('./Assignment'),
  Submission: require('./Submission'),
  Test: require('./Test'),
  Question: require('./Question'),
  Grade: require('./Grade'),
  Notification: require('./Notification'),
  Session: require('./Session'),
  Settings: require('./Settings'),
  Audit: require('./Audit')
};

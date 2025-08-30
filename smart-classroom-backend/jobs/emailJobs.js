/**
 * Email Job Processors
 */

const mailService = require('../services/mailService');
const logger = require('../utils/logger');

const emailJobs = {
  /**
   * Process single email
   */
  async processEmail(job) {
    try {
      const { to, subject, templateName, data } = job.data;
      
      const result = await mailService.sendTemplatedEmail(
        to,
        subject,
        templateName,
        data
      );

      return {
        success: true,
        messageId: result.messageId,
        recipient: to
      };
    } catch (error) {
      logger.error('Email job processing failed:', error);
      throw error;
    }
  },

  /**
   * Process bulk emails
   */
  async processBulkEmail(job) {
    try {
      const { recipients, subject, templateName, commonData } = job.data;
      
      const results = await mailService.sendBulkEmails(
        recipients,
        subject,
        templateName,
        commonData
      );

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      return {
        success: true,
        totalEmails: results.length,
        successCount,
        failureCount,
        results
      };
    } catch (error) {
      logger.error('Bulk email job processing failed:', error);
      throw error;
    }
  }
};

module.exports = emailJobs;

/**
 * Third-party Integration Service
 */

const axios = require('axios');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errorUtils');

class IntegrationService {
  constructor() {
    this.apis = {
      lms: process.env.LMS_API_BASE_URL,
      videoConference: process.env.VIDEO_CONFERENCE_API_URL,
      paymentGateway: process.env.PAYMENT_GATEWAY_API_URL,
      sso: process.env.SSO_API_URL
    };
  }

  /**
   * Sync with external LMS
   */
  async syncWithLMS(courseData) {
    try {
      const response = await axios.post(`${this.apis.lms}/sync-course`, courseData, {
        headers: {
          'Authorization': `Bearer ${process.env.LMS_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        externalId: response.data.courseId,
        syncedAt: new Date()
      };
    } catch (error) {
      logger.error('LMS sync failed:', error);
      throw new AppError('Failed to sync with external LMS', 500);
    }
  }

  /**
   * Create video conference room
   */
  async createVideoConferenceRoom(meetingData) {
    try {
      const response = await axios.post(`${this.apis.videoConference}/rooms`, {
        title: meetingData.title,
        startTime: meetingData.startTime,
        duration: meetingData.duration,
        participants: meetingData.participants
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.VIDEO_CONFERENCE_API_KEY}`
        }
      });

      return {
        roomId: response.data.roomId,
        joinUrl: response.data.joinUrl,
        moderatorUrl: response.data.moderatorUrl
      };
    } catch (error) {
      logger.error('Video conference room creation failed:', error);
      throw new AppError('Failed to create video conference room', 500);
    }
  }
  
  /**
   * SSO authentication
   */
  async authenticateSSO(token) {
    try {
      const response = await axios.post(`${this.apis.sso}/verify`, {
        token: token
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.SSO_API_KEY}`
        }
      });

      return {
        valid: response.data.valid,
        user: response.data.user,
        roles: response.data.roles
      };
    } catch (error) {
      logger.error('SSO authentication failed:', error);
      throw new AppError('SSO authentication failed', 401);
    }
  }

  /**
   * Send webhook notification
   */
  async sendWebhook(url, data, secret = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'SCMS-Webhook/1.0'
      };

      if (secret) {
        const crypto = require('crypto');
        const signature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(data))
          .digest('hex');
        headers['X-SCMS-Signature'] = `sha256=${signature}`;
      }

      const response = await axios.post(url, data, {
        headers,
        timeout: 5000
      });

      return {
        success: true,
        status: response.status,
        response: response.data
      };
    } catch (error) {
      logger.error('Webhook delivery failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new IntegrationService();


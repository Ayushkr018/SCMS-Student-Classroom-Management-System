/**
 * Mail Service
 * Handles sending transactional emails using Nodemailer
 */

const nodemailer = require('nodemailer');
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  NODE_ENV
} = require('../config/env');
const { AppError } = require('../middleware/errorHandler');

class MailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  /**
   * Creates and configures the Nodemailer transporter.
   * Uses Mailtrap for development and a real SMTP server for production.
   */
  createTransporter() {
    if (NODE_ENV === 'production') {
      // Production transporter (e.g., SendGrid, Mailgun, AWS SES)
      return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
    } else {
      // Development transporter (using Mailtrap or similar)
      return nodemailer.createTransport({
        host: 'smtp.mailtrap.io', // Example for Mailtrap
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER, // Add these to your .env file
          pass: process.env.MAILTRAP_PASS,
        },
      });
    }
  }

  /**
   * Sends an email.
   * @param {Object} options - Email options.
   * @param {string} options.to - Recipient's email address.
   * @param {string} options.subject - Email subject.
   * @param {string} options.text - Plain text body.
   * @param {string} options.html - HTML body.
   * @returns {Promise<Object>} The result of the sendMail operation.
   */
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `SCMS Platform <${EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}. Message ID: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`Error sending email to ${options.to}:`, error);
      throw new AppError('There was an error sending the email. Please try again later.', 500);
    }
  }

  /**
   * Sends an account verification email.
   * @param {Object} user - The user object.
   * @param {string} token - The verification token.
   */
  async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const subject = 'Welcome to SCMS! Verify Your Email';
    const html = this._generateTemplate({
        title: 'Welcome!',
        greeting: `Hi ${user.firstName},`,
        message: 'Thank you for registering. Please click the button below to verify your email address and activate your account.',
        buttonText: 'Verify Email Address',
        buttonUrl: verificationUrl,
        footerMessage: `If you did not create an account, please ignore this email.`
    });

    await this.sendEmail({
      to: user.email,
      subject,
      html,
      text: `Verify your email by visiting this URL: ${verificationUrl}`,
    });
  }

  /**
   * Sends a password reset email.
   * @param {Object} user - The user object.
   * @param {string} token - The password reset token.
   */
  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const subject = 'SCMS Password Reset Request';
    const html = this._generateTemplate({
        title: 'Password Reset',
        greeting: `Hi ${user.firstName},`,
        message: 'You requested a password reset. Click the button below to set a new password. This link will expire in 1 hour.',
        buttonText: 'Reset Your Password',
        buttonUrl: resetUrl,
        footerMessage: `If you didn't request a password reset, you can safely ignore this email.`
    });

    await this.sendEmail({
      to: user.email,
      subject,
      html,
      text: `Reset your password by visiting this URL: ${resetUrl}`,
    });
  }

  /**
   * (Private) Generates a standardized HTML email template.
   */
  _generateTemplate(content) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>${content.title}</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
              .header { background: #4a90e2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { padding: 20px; }
              .button { display: inline-block; padding: 12px 24px; background: #4a90e2; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${content.title}</h1>
              </div>
              <div class="content">
                  <p>${content.greeting}</p>
                  <p>${content.message}</p>
                  <a href="${content.buttonUrl}" class="button">${content.buttonText}</a>
              </div>
              <div class="footer">
                  <p>${content.footerMessage}</p>
                  <p>&copy; ${new Date().getFullYear()} SCMS Platform. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
}

module.exports = new MailService();

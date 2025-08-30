/**
 * Background Worker
 * This process listens to the job queues and executes tasks.
 * Run this in a separate process from the main API server: `node worker.js`
 */

require('dotenv').config();
const { connectDB } = require('./config/db');
const queueService = require('./services/queueService');
const mailService = require('./services/mailService');
const notificationService = require('./services/notificationService');
const { AppError } = require('./middleware/errorHandler');
const mongoose = require('mongoose');

// --- Job Processors ---

/**
 * Processes jobs from the 'email' queue.
 * @param {Object} job - The job object from BullMQ.
 */
const emailProcessor = async (job) => {
    try {
        console.log(`Processing email job ${job.id}:`, job.data);
        const { type, user, token, data } = job.data;

        switch (type) {
            case 'send-verification':
                await mailService.sendVerificationEmail(user, token);
                break;
            case 'send-password-reset':
                await mailService.sendPasswordResetEmail(user, token);
                break;
            case 'send-custom':
                await mailService.sendEmail(data);
                break;
            default:
                throw new Error(`Unknown email job type: ${type}`);
        }
        return { success: true };
    } catch (error) {
        console.error(`Error processing email job ${job.id}:`, error);
        throw error; // Let BullMQ handle the retry logic
    }
};

/**
 * Processes jobs from the 'notification' queue.
 * @param {Object} job - The job object from BullMQ.
 */
const notificationProcessor = async (job) => {
    try {
        console.log(`Processing notification job ${job.id}:`, job.data);
        const { notificationData } = job.data;
        await notificationService.sendNotification(notificationData);
        return { success: true };
    } catch (error) {
        console.error(`Error processing notification job ${job.id}:`, error);
        throw error;
    }
};

/**
 * Processes jobs from the 'report_generation' queue.
 * @param {Object} job - The job object from BullMQ.
 */
const reportProcessor = async (job) => {
    // Placeholder for report generation logic
    console.log(`Generating report for job ${job.id}:`, job.data);
    // Simulate a long-running task
    await new Promise(resolve => setTimeout(resolve, 10000)); 
    console.log(`Report for job ${job.id} has been generated.`);
    return { success: true, reportUrl: `/reports/report-${job.id}.pdf` };
};


// --- Worker Initialization ---

const initializeWorker = async () => {
    console.log('Starting background worker...');

    // Connect to the database
    await connectDB();

    // Register workers for each queue
    queueService.registerWorker('email', emailProcessor);
    queueService.registerWorker('notification', notificationProcessor);
    queueService.registerWorker('report_generation', reportProcessor);
    // Register other workers here (e.g., plagiarism_check)

    console.log('✅ Worker is running and waiting for jobs.');
};


// --- Graceful Shutdown ---

const shutdown = async () => {
    console.log('Shutting down worker gracefully...');
    await queueService.closeAll();
    await mongoose.connection.close();
    console.log('Worker has been shut down.');
    process.exit(0);
};

process.on('SIGTERM', shutdown); // For production environments (like Docker, Kubernetes)
process.on('SIGINT', shutdown);  // For local development (Ctrl+C)


// Start the worker
initializeWorker().catch(err => {
    console.error('Failed to initialize worker:', err);
    process.exit(1);
});

/**
 * Queue Service
 * Manages background job processing using BullMQ and Redis
 */

const { Queue, Worker, QueueScheduler } = require('bullmq');
const { REDIS_HOST, REDIS_PORT } = require('../config/env');
const { AppError } = require('../middleware/errorHandler');

const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

class QueueService {
  constructor() {
    this.queues = new Map();
    this.workers = new Map();
    this.schedulers = new Map();
    this.initializeQueues(['email', 'notification', 'report_generation', 'plagiarism_check']);
  }

  /**
   * Initializes a set of queues when the service starts.
   */
  initializeQueues(queueNames) {
    queueNames.forEach(name => this.getQueue(name));
  }

  /**
   * Gets a queue instance, creating it if it doesn't exist.
   */
  getQueue(queueName) {
    if (!this.queues.has(queueName)) {
      const newQueue = new Queue(queueName, { connection });
      this.queues.set(queueName, newQueue);
      
      // Each queue needs a scheduler for delayed jobs
      if (!this.schedulers.has(queueName)) {
        this.schedulers.set(queueName, new QueueScheduler(queueName, { connection }));
      }
    }
    return this.queues.get(queueName);
  }

  /**
   * Adds a job to a specific queue.
   * @param {string} queueName - The name of the queue.
   * @param {Object} data - The data payload for the job.
   * @param {Object} options - BullMQ job options (e.g., delay, attempts).
   * @returns {Promise<Object>} The created job object.
   */
  async addJob(queueName, data, options = {}) {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.add(queueName, data, {
        attempts: 3, // Default to 3 retry attempts
        backoff: {
          type: 'exponential',
          delay: 5000, // 5 seconds
        },
        ...options,
      });
      console.log(`Added job ${job.id} to queue ${queueName}`);
      return job;
    } catch (error) {
      console.error(`Error adding job to queue ${queueName}:`, error);
      throw new AppError('Failed to add job to the queue', 500);
    }
  }

  /**
   * Registers a worker to process jobs from a queue.
   * @param {string} queueName - The name of the queue to process.
   * @param {Function} processor - The async function that will process each job.
   */
  registerWorker(queueName, processor) {
    if (this.workers.has(queueName)) {
      console.warn(`Worker for queue ${queueName} is already registered.`);
      return;
    }

    const worker = new Worker(queueName, processor, { connection });

    worker.on('completed', job => {
      console.log(`Job ${job.id} in queue ${queueName} completed successfully.`);
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job.id} in queue ${queueName} failed with error: ${err.message}`);
    });

    this.workers.set(queueName, worker);
    console.log(`Worker registered for queue: ${queueName}`);
  }

  /**
   * Gets statistics for a single queue or all queues.
   * @param {string} [queueName] - Optional. The name of the queue.
   * @returns {Promise<Object>} An object with queue statistics.
   */
  async getQueueStats(queueName) {
    if (queueName) {
      const queue = this.getQueue(queueName);
      const counts = await queue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed');
      return { [queueName]: counts };
    }

    const allStats = {};
    for (const name of this.queues.keys()) {
      const queue = this.getQueue(name);
      const counts = await queue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed');
      allStats[name] = counts;
    }
    return allStats;
  }
  
  /**
   * Gracefully closes all queues, workers, and schedulers.
   */
  async closeAll() {
    console.log('Closing all queues, workers, and schedulers...');
    const closePromises = [];

    this.workers.forEach(worker => closePromises.push(worker.close()));
    this.queues.forEach(queue => closePromises.push(queue.close()));
    this.schedulers.forEach(scheduler => closePromises.push(scheduler.close()));

    await Promise.all(closePromises);
    console.log('All queue components closed.');
  }
}

module.exports = new QueueService();

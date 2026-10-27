import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

// Connect to Redis for the job queue
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

// Define Queue
export const orderQueue = new Queue('order-processing', { connection });

// Dispatch an inventory lock job (TTL 15 mins)
export const dispatchInventoryLock = async (variantId: string, userId: string) => {
  await orderQueue.add('lock-inventory', { variantId, userId }, {
    removeOnComplete: true,
    removeOnFail: false,
  });
};

// Background Worker to process queue tasks
// Note: In a production monorepo, workers often run in a separate server process.
const worker = new Worker('order-processing', async (job: Job) => {
  if (job.name === 'lock-inventory') {
    const { variantId, userId } = job.data;
    console.log(`[Queue] Locking inventory for variant: ${variantId}, user: ${userId}`);
    // Interact with Redis or DB to lock stock temporarily
  } else if (job.name === 'send-receipt') {
    const { email, orderNumber } = job.data;
    console.log(`[Queue] Dispatching email receipt for order: ${orderNumber} to ${email}`);
  }
}, { connection });

worker.on('completed', job => {
  console.log(`[Queue] Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`[Queue] Job ${job?.id} has failed with ${err.message}`);
});

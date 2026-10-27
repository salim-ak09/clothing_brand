# Placeholder entry point for Scheduler service

import { Queue } from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const jobQueue = new Queue('bot-jobs', {
  redis: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) },
});

console.log('Scheduler service started, listening for jobs...');

// In a real implementation you would expose HTTP endpoints to accept campaign definitions
// and push jobs onto the queue, handling ramp‑up logic.

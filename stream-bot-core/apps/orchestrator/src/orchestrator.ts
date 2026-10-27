// apps/orchestrator/src/orchestrator.ts
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import fetch from 'node-fetch';

// Redis connection (use same host/port as defined in docker-compose)
const connection = new IORedis({ host: 'localhost', port: 6379 });

// Queue for campaign execution
export const campaignQueue = new Queue('campaignQueue', { connection });

// Worker that processes "runCampaign" jobs
export const campaignWorker = new Worker(
  'campaignQueue',
  async (job: Job) => {
    const { campaignId } = job.data;
    console.log(`🛠️  Orchestrator processing campaign ${campaignId}`);
    // Stub: call Bot Runner service (expects POST /run with campaignId)
    try {
      const res = await fetch('http://localhost:8003/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });
      if (!res.ok) {
        console.error('Bot Runner responded with error', await res.text());
      } else {
        console.log('Bot Runner started successfully for campaign', campaignId);
      }
    } catch (e) {
      console.error('Failed to contact Bot Runner', e);
    }
    return { status: 'queued' };
  },
  { connection },
);

campaignWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

campaignWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

export default { campaignQueue, campaignWorker };

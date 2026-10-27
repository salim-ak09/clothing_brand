// apps/orchestrator/src/index.ts
import express from 'express';
import { campaignQueue } from './orchestrator';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'orchestrator' });
});

// Enqueue a campaign run
app.post('/campaigns/:id/run', async (req, res) => {
  const campaignId = req.params.id;
  if (!campaignId) return res.status(400).json({ error: 'campaignId required' });
  try {
    await campaignQueue.add('runCampaign', { campaignId });
    res.status(202).json({ message: 'Campaign enqueued', campaignId });
  } catch (e) {
    console.error('Failed to enqueue campaign', e);
    res.status(500).json({ error: 'Failed to enqueue' });
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Orchestrator listening on port ${PORT}`);
});

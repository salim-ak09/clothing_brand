// apps/api-gateway/src/routes/campaigns.ts
import { Router, Request, Response } from 'express';

// Simple in‑memory store – replace with DB/Prisma later
interface Campaign {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

const campaigns: Campaign[] = [];

const router = Router();

// Create a new campaign
router.post('/', (req: Request, res: Response) => {
  const { name, description, active } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const id = `${Date.now()}`; // naive ID
  const newCampaign: Campaign = { id, name, description, active: !!active };
  campaigns.push(newCampaign);
  res.status(201).json(newCampaign);
});

// List all campaigns
router.get('/', (_req: Request, res: Response) => {
  res.json(campaigns);
});

// Get a single campaign
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json(campaign);
});

// Update a campaign
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  const { name, description, active } = req.body;
  if (name !== undefined) campaign.name = name;
  if (description !== undefined) campaign.description = description;
  if (active !== undefined) campaign.active = !!active;
  res.json(campaign);
});

// Delete a campaign
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = campaigns.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Campaign not found' });
  campaigns.splice(index, 1);
  res.status(204).send();
});

export default router;

import { Router } from 'express';
import { ScenarioEngine } from '../simulation/scenarioEngine';
import { AGENT_REGISTRY } from '../agents/agentMesh';

export function createAuditRouter(engine: ScenarioEngine): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(engine.getAuditLog());
  });

  router.delete('/', async (_req, res) => {
    try {
      await engine.clearAuditLog();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Audit log deletion failed' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await engine.deleteAuditEntry(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Audit entry not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Audit entry deletion failed' });
    }
  });

  return router;
}

export function createAgentsRouter(): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(AGENT_REGISTRY);
  });

  return router;
}

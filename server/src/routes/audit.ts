import { Router } from 'express';
import { ScenarioEngine } from '../simulation/scenarioEngine';
import { AGENT_REGISTRY } from '../agents/agentMesh';

export function createAuditRouter(engine: ScenarioEngine): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(engine.getAuditLog());
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

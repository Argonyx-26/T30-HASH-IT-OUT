import { Router } from 'express';
import { ScenarioEngine } from '../simulation/scenarioEngine';

export function createIncidentsRouter(engine: ScenarioEngine): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(engine.getIncidents());
  });

  router.get('/:id', (req, res) => {
    const incident = engine.getIncidentById(req.params.id);
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }
    res.json(incident);
  });

  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await engine.deleteIncident(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Incident not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Incident deletion failed' });
    }
  });

  router.post('/:id/acknowledge', (req, res) => {
    const { operatorName } = req.body;
    const incident = engine.acknowledgeIncident(req.params.id, operatorName);
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }
    res.json(incident);
  });

  router.post('/:id/resolve', (req, res) => {
    const { operatorName, note } = req.body;
    const incident = engine.resolveIncident(req.params.id, operatorName, note);
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }
    res.json(incident);
  });

  router.post('/:id/notes', (req, res) => {
    const { note, operatorName } = req.body;
    if (!note) {
      res.status(400).json({ error: 'Note text required' });
      return;
    }
    const incident = engine.addOperatorNote(req.params.id, note, operatorName);
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }
    res.json(incident);
  });

  router.post('/:id/steps/:stepId/toggle', (req, res) => {
    const incident = engine.toggleRecommendationStep(req.params.id, req.params.stepId);
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }
    res.json(incident);
  });

  return router;
}

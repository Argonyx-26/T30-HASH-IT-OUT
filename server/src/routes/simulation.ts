import { Router } from 'express';
import { ScenarioEngine } from '../simulation/scenarioEngine';

export function createSimulationRouter(engine: ScenarioEngine): Router {
  const router = Router();

  router.get('/scenarios', (_req, res) => {
    res.json(engine.getScenarios());
  });

  router.get('/state', (_req, res) => {
    res.json(engine.getState());
  });

  router.post('/start', (req, res) => {
    const { scenarioId, isJudgeDemo } = req.body;
    const state = engine.startScenario(scenarioId, !!isJudgeDemo, true);
    res.json(state);
  });

  router.post('/pause', (_req, res) => {
    const state = engine.pause();
    res.json(state);
  });

  router.post('/resume', (_req, res) => {
    const state = engine.resume();
    res.json(state);
  });

  router.post('/reset', (_req, res) => {
    const state = engine.reset();
    res.json(state);
  });

  router.post('/speed', (req, res) => {
    const { speed } = req.body;
    const state = engine.setSpeed(Number(speed));
    res.json(state);
  });

  router.post('/judge-demo', (_req, res) => {
    const state = engine.launchJudgeDemo();
    res.json(state);
  });

  return router;
}

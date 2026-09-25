import { Router } from 'express';
import { AnalyticsService } from '../analytics/analyticsService';

export function createAnalyticsRouter(analyticsService: AnalyticsService): Router {
  const router = Router();

  router.get('/metrics', (_req, res) => {
    res.json(analyticsService.getMetrics());
  });

  router.get('/zones', (_req, res) => {
    res.json(analyticsService.getCampusZones());
  });

  return router;
}

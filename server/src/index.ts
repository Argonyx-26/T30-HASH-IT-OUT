import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ScenarioEngine } from './simulation/scenarioEngine';
import { AnalyticsService } from './analytics/analyticsService';
import { SocketServer } from './websocket/socketServer';
import { createSimulationRouter } from './routes/simulation';
import { createIncidentsRouter } from './routes/incidents';
import { createAnalyticsRouter } from './routes/analytics';
import { createAuditRouter, createAgentsRouter } from './routes/audit';
import { SupabaseRestClient } from './data/supabaseRestClient';
import { SimulationPersistence } from './data/simulationPersistence';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Initialize core systems
const supabase = new SupabaseRestClient();
const persistence = new SimulationPersistence(supabase);
const scenarioEngine = new ScenarioEngine(persistence);
const analyticsService = new AnalyticsService(scenarioEngine);
const socketServer = new SocketServer(server, scenarioEngine);

// API Routes
app.use('/api/simulation', createSimulationRouter(scenarioEngine));
app.use('/api/incidents', createIncidentsRouter(scenarioEngine));
app.use('/api/analytics', createAnalyticsRouter(analyticsService));
app.use('/api/audit', createAuditRouter(scenarioEngine));
app.use('/api/agents', createAgentsRouter());
app.get('/api/events', (_req, res) => {
  res.json(scenarioEngine.getActiveEvents());
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'SENTINEL',
    simulationMode: true,
    version: '1.0.0-hackathon',
    supabaseConfigured: supabase.isConfigured,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
  try {
    await scenarioEngine.loadPersistedData();
    console.log(`[SENTINEL CORE] Loaded ${scenarioEngine.getIncidents().length} incidents from Supabase`);
  } catch (error) {
    console.warn('[SENTINEL CORE] Supabase load failed:', error instanceof Error ? error.message : error);
  }
  console.log(`[SENTINEL CORE] Server running on port ${PORT}`);
  console.log(`[SENTINEL CORE] Mode: DIGITAL TWIN / SIMULATION MODE`);
  console.log(`[SENTINEL CORE] Supabase: ${supabase.isConfigured ? 'configured' : 'not configured'}`);
});

export { app, server, scenarioEngine };

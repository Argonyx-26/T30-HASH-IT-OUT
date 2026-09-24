import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  SimulationState,
  SafetyEvent,
  Incident,
  AuditEntry,
  SimulationScenario,
  CampusZone,
  AnalyticsMetrics,
  AgentDefinition,
  SafetyEventSubmission
} from '../types';

interface SimulationContextType {
  state: SimulationState;
  events: SafetyEvent[];
  incidents: Incident[];
  selectedIncident: Incident | null;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  auditLog: AuditEntry[];
  scenarios: SimulationScenario[];
  zones: CampusZone[];
  metrics: AnalyticsMetrics | null;
  agents: AgentDefinition[];
  connected: boolean;
  // Controls
  startScenario: (scenarioId: string, isJudgeDemo?: boolean) => void;
  addEvent: (event: SafetyEventSubmission) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  setSpeed: (speed: number) => void;
  launchJudgeDemo: () => void;
  acknowledgeIncident: (incidentId: string) => void;
  resolveIncident: (incidentId: string, note?: string) => void;
  addOperatorNote: (incidentId: string, note: string) => void;
  toggleRecommendationStep: (incidentId: string, stepId: string) => void;
  deleteIncident: (incidentId: string) => Promise<void>;
  refreshMetrics: () => void;
}

const BACKEND_URL = 'http://localhost:4000';

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const [state, setState] = useState<SimulationState>({
    scenarioId: '',
    scenarioName: 'No situation loaded',
    isRunning: false,
    isPaused: false,
    speed: 1,
    elapsedSeconds: 0,
    totalDuration: 0,
    currentSimulatedClock: '00:00',
    sourcesOnline: 0,
    totalSources: 0,
    isJudgeDemo: false
  });

  const [events, setEvents] = useState<SafetyEvent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [zones, setZones] = useState<CampusZone[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [agents, setAgents] = useState<AgentDefinition[]>([]);


  // Compute selected incident
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || (incidents.length > 0 ? incidents[0] : null);

  // Update selected incident id when new incidents arrive if none selected
  useEffect(() => {
    if (!selectedIncidentId && incidents.length > 0) {
      setSelectedIncidentId(incidents[0].id);
    }
  }, [incidents, selectedIncidentId]);

  // Fetch initial REST data
  const fetchData = useCallback(async () => {
    try {
      const [scenariosRes, incidentsRes, eventsRes, stateRes, auditRes, metricsRes, zonesRes, agentsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/simulation/scenarios`).catch(() => null),
        fetch(`${BACKEND_URL}/api/incidents`).catch(() => null),
        fetch(`${BACKEND_URL}/api/events`).catch(() => null),
        fetch(`${BACKEND_URL}/api/simulation/state`).catch(() => null),
        fetch(`${BACKEND_URL}/api/audit`).catch(() => null),
        fetch(`${BACKEND_URL}/api/analytics/metrics`).catch(() => null),
        fetch(`${BACKEND_URL}/api/analytics/zones`).catch(() => null),
        fetch(`${BACKEND_URL}/api/agents`).catch(() => null),
      ]);

      if (scenariosRes?.ok) setScenarios(await scenariosRes.json());
      if (incidentsRes?.ok) {
        const incs = await incidentsRes.json();
        setIncidents(incs);
        if (incs.length > 0 && !selectedIncidentId) setSelectedIncidentId(incs[0].id);
      }
      if (eventsRes?.ok) setEvents(await eventsRes.json());
      if (stateRes?.ok) setState(await stateRes.json());
      if (auditRes?.ok) setAuditLog(await auditRes.json());
      if (metricsRes?.ok) setMetrics(await metricsRes.json());
      if (zonesRes?.ok) setZones(await zonesRes.json());
      if (agentsRes?.ok) setAgents(await agentsRes.json());
    } catch (e) {
      console.warn('Initial data load warning:', e);
    }
  }, [selectedIncidentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time WebSocket connection
  useEffect(() => {
    const s = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    s.on('connect', () => {
      setConnected(true);
      console.log('[Sentinel Client] Connected to Core WebSocket');
    });

    s.on('disconnect', () => {
      setConnected(false);
      console.log('[Sentinel Client] Disconnected from Core WebSocket');
    });

    s.on('simulation.state', (newState: SimulationState) => {
      setState(newState);
    });

    s.on('simulation.clock', (newState: SimulationState) => {
      setState(newState);
    });

    s.on('event.created', (event: SafetyEvent) => {
      setEvents(prev => [event, ...prev.filter(e => e.id !== event.id)]);
      // Refresh zones and metrics
      fetch(`${BACKEND_URL}/api/analytics/zones`).then(r => r.json()).then(setZones).catch(() => { });
      fetch(`${BACKEND_URL}/api/analytics/metrics`).then(r => r.json()).then(setMetrics).catch(() => { });
    });

    s.on('incident.created', (incident: Incident) => {
      setIncidents(prev => [incident, ...prev.filter(i => i.id !== incident.id)]);
      setSelectedIncidentId(incident.id);
    });

    s.on('incident.updated', (incident: Incident) => {
      setIncidents(prev => {
        const exists = prev.some(i => i.id === incident.id);
        if (exists) {
          return prev.map(i => i.id === incident.id ? incident : i);
        }
        return [incident, ...prev];
      });
    });

    s.on('incidents.list', (list: Incident[]) => {
      setIncidents(list);
      if (list.length > 0) setSelectedIncidentId(list[0].id);
      else setSelectedIncidentId(null);
    });

    s.on('events.list', (list: SafetyEvent[]) => {
      setEvents(list);
    });

    s.on('audit.created', (audit: AuditEntry) => {
      setAuditLog(prev => [audit, ...prev]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const startScenario = (scenarioId: string, isJudgeDemo = false) => {
    if (socket) {
      socket.emit('simulation.start', { scenarioId, isJudgeDemo });
    } else {
      fetch(`${BACKEND_URL}/api/simulation/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId, isJudgeDemo })
      }).then(r => r.json()).then(setState);
    }
  };

  const addEvent = (event: SafetyEventSubmission) => {
    if (socket) {
      socket.emit('simulation.event.add', event);
      return;
    }

    fetch(`${BACKEND_URL}/api/simulation/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).then(async response => {
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    }).then((createdEvent: SafetyEvent) => {
      setEvents(prev => [createdEvent, ...prev.filter(item => item.id !== createdEvent.id)]);
    }).catch(error => console.warn('[Sentinel Client] Event submission failed:', error));
  };

  const pauseSimulation = () => {
    if (socket) socket.emit('simulation.pause');
    else fetch(`${BACKEND_URL}/api/simulation/pause`, { method: 'POST' });
  };

  const resumeSimulation = () => {
    if (socket) socket.emit('simulation.resume');
    else fetch(`${BACKEND_URL}/api/simulation/resume`, { method: 'POST' });
  };

  const resetSimulation = () => {
    if (socket) socket.emit('simulation.reset');
    else fetch(`${BACKEND_URL}/api/simulation/reset`, { method: 'POST' });
  };

  const setSpeed = (speed: number) => {
    if (socket) socket.emit('simulation.speed', speed);
    else fetch(`${BACKEND_URL}/api/simulation/speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed })
    });
  };

  const launchJudgeDemo = () => {
    startScenario('scenario-fire-science-annex', true);
  };

  const acknowledgeIncident = (incidentId: string) => {
    if (socket) socket.emit('operator.acknowledge', { incidentId, operatorName: 'Officer M. Vance' });
    else fetch(`${BACKEND_URL}/api/incidents/${incidentId}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operatorName: 'Officer M. Vance' })
    });
  };

  const resolveIncident = (incidentId: string, note?: string) => {
    if (socket) socket.emit('operator.resolve', { incidentId, operatorName: 'Officer M. Vance', note });
    else fetch(`${BACKEND_URL}/api/incidents/${incidentId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operatorName: 'Officer M. Vance', note })
    });
  };

  const addOperatorNote = (incidentId: string, note: string) => {
    if (socket) socket.emit('operator.note', { incidentId, note, operatorName: 'Officer M. Vance' });
    else fetch(`${BACKEND_URL}/api/incidents/${incidentId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, operatorName: 'Officer M. Vance' })
    });
  };

  const toggleRecommendationStep = (incidentId: string, stepId: string) => {
    if (socket) socket.emit('operator.toggleStep', { incidentId, stepId });
    else fetch(`${BACKEND_URL}/api/incidents/${incidentId}/steps/${stepId}/toggle`, { method: 'POST' });
  };

  const deleteIncident = async (incidentId: string) => {
    if (socket) {
      socket.emit('operator.deleteIncident', { incidentId });
      return;
    }
    const response = await fetch(`${BACKEND_URL}/api/incidents/${incidentId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await response.text());
    setIncidents(previous => previous.filter(incident => incident.id !== incidentId));
    setEvents(previous => previous.filter(event => !incidents.find(incident => incident.id === incidentId)?.eventIds.includes(event.id)));
  };

  const refreshMetrics = () => {
    fetch(`${BACKEND_URL}/api/analytics/metrics`).then(r => r.json()).then(setMetrics).catch(() => { });
  };

  return (
    <SimulationContext.Provider value={{
      state,
      events,
      incidents,
      selectedIncident,
      selectedIncidentId,
      setSelectedIncidentId,
      auditLog,
      scenarios,
      zones,
      metrics,
      agents,
      connected,
      startScenario,
      addEvent,
      pauseSimulation,
      resumeSimulation,
      resetSimulation,
      setSpeed,
      launchJudgeDemo,
      acknowledgeIncident,
      resolveIncident,
      addOperatorNote,
      toggleRecommendationStep,
      deleteIncident,
      refreshMetrics
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};

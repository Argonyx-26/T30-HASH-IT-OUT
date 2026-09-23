import { SCENARIOS } from './scenarios';
import { SafetyEvent, SimulationScenario, SimulationState, Incident, AuditEntry } from '../types';
import { CorrelationAgent } from '../agents/correlationAgent';

export class ScenarioEngine {
  private currentScenario: SimulationScenario;
  private state: SimulationState;
  private correlationAgent: CorrelationAgent;
  private emittedEventIndices: Set<number> = new Set();
  private timer: NodeJS.Timeout | null = null;
  private baseClockOffsetSeconds: number = 0; // Starts simulation at 00:00 or current simulated hour

  // In-memory simulation database
  public activeEvents: SafetyEvent[] = [];
  public incidents: Incident[] = [];
  public auditLog: AuditEntry[] = [];

  // Callbacks for WebSocket broadcasting
  public onEventCreated?: (event: SafetyEvent) => void;
  public onIncidentCreated?: (incident: Incident) => void;
  public onIncidentUpdated?: (incident: Incident) => void;
  public onSimulationTick?: (state: SimulationState) => void;
  public onAuditCreated?: (audit: AuditEntry) => void;

  constructor() {
    this.currentScenario = SCENARIOS[0];
    this.correlationAgent = new CorrelationAgent();
    this.state = {
      scenarioId: this.currentScenario.id,
      scenarioName: this.currentScenario.name,
      isRunning: false,
      isPaused: false,
      speed: 1,
      elapsedSeconds: 0,
      totalDuration: this.currentScenario.duration,
      currentSimulatedClock: '00:00',
      sourcesOnline: 24,
      totalSources: 24,
      isJudgeDemo: false
    };
  }

  public getScenarios(): SimulationScenario[] {
    return SCENARIOS;
  }

  public getState(): SimulationState {
    return { ...this.state };
  }

  public getActiveEvents(): SafetyEvent[] {
    return this.activeEvents;
  }

  public getIncidents(): Incident[] {
    return this.incidents;
  }

  public getIncidentById(id: string): Incident | undefined {
    return this.incidents.find(inc => inc.id === id);
  }

  public getAuditLog(): AuditEntry[] {
    return this.auditLog;
  }

  public startScenario(scenarioId: string, isJudgeDemo: boolean = false, autoPlay: boolean = true): SimulationState {
    this.reset();
    const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
    this.currentScenario = scenario;
    this.state = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      isRunning: autoPlay,
      isPaused: false,
      speed: isJudgeDemo ? 2 : 1,
      elapsedSeconds: 0,
      totalDuration: scenario.duration,
      currentSimulatedClock: this.formatSimulatedClock(0),
      sourcesOnline: 24,
      totalSources: 24,
      isJudgeDemo
    };

    this.recordAudit('SYSTEM', 'Simulation Started', `Loaded scenario "${scenario.name}" (Duration: ${scenario.duration}s, Mode: ${isJudgeDemo ? 'JUDGE DEMO' : 'STANDARD SIMULATION'})`);

    if (autoPlay) {
      this.startTimer();
    }

    return this.getState();
  }

  public pause(): SimulationState {
    if (this.state.isRunning && !this.state.isPaused) {
      this.state.isPaused = true;
      this.stopTimer();
      this.recordAudit('OPERATOR', 'Simulation Paused', `Operator paused simulation at ${this.state.currentSimulatedClock}`);
    }
    return this.getState();
  }

  public resume(): SimulationState {
    if (this.state.isPaused) {
      this.state.isPaused = false;
      this.startTimer();
      this.recordAudit('OPERATOR', 'Simulation Resumed', `Operator resumed simulation at ${this.state.currentSimulatedClock}`);
    }
    return this.getState();
  }

  public setSpeed(multiplier: number): SimulationState {
    if ([1, 2, 5, 10].includes(multiplier)) {
      this.state.speed = multiplier;
      this.recordAudit('OPERATOR', 'Replay Speed Changed', `Replay speed adjusted to ${multiplier}x`);
    }
    return this.getState();
  }

  public reset(): SimulationState {
    this.stopTimer();
    this.emittedEventIndices.clear();
    this.activeEvents = [];
    this.incidents = [];
    this.state = {
      scenarioId: this.currentScenario.id,
      scenarioName: this.currentScenario.name,
      isRunning: false,
      isPaused: false,
      speed: 1,
      elapsedSeconds: 0,
      totalDuration: this.currentScenario.duration,
      currentSimulatedClock: '00:00',
      sourcesOnline: 24,
      totalSources: 24,
      isJudgeDemo: false
    };
    return this.getState();
  }

  public launchJudgeDemo(): SimulationState {
    return this.startScenario('scenario-fire-science-annex', true, true);
  }

  public acknowledgeIncident(incidentId: string, operatorName: string = 'Campus Operator #04'): Incident | null {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return null;

    incident.status = 'acknowledged';
    incident.updatedAt = this.state.currentSimulatedClock;

    const note = {
      id: `note-${Date.now()}`,
      operator: operatorName,
      action: 'Acknowledge Incident',
      note: 'Incident acknowledged by authorized campus safety personnel. Response protocols initiated.',
      timestamp: this.state.currentSimulatedClock,
      relativeTime: Math.floor(this.state.elapsedSeconds)
    };

    incident.operatorNotes.push(note);

    this.recordAudit('OPERATOR', 'Incident Acknowledged', `${operatorName} acknowledged incident ${incident.id} (${incident.title})`, incident.id);
    
    if (this.onIncidentUpdated) {
      this.onIncidentUpdated(incident);
    }

    return incident;
  }

  public resolveIncident(incidentId: string, operatorName: string = 'Campus Operator #04', resolutionNote?: string): Incident | null {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return null;

    incident.status = 'resolved';
    incident.updatedAt = this.state.currentSimulatedClock;

    const note = {
      id: `note-${Date.now()}`,
      operator: operatorName,
      action: 'Resolve Incident',
      note: resolutionNote || 'Situation verified, hazards mitigated, and all areas confirmed safe. Case file closed.',
      timestamp: this.state.currentSimulatedClock,
      relativeTime: Math.floor(this.state.elapsedSeconds)
    };

    incident.operatorNotes.push(note);

    this.recordAudit('OPERATOR', 'Incident Resolved', `${operatorName} resolved incident ${incident.id}. ${note.note}`, incident.id);

    if (this.onIncidentUpdated) {
      this.onIncidentUpdated(incident);
    }

    return incident;
  }

  public addOperatorNote(incidentId: string, text: string, operatorName: string = 'Campus Operator #04'): Incident | null {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return null;

    const note = {
      id: `note-${Date.now()}`,
      operator: operatorName,
      action: 'Operator Note',
      note: text,
      timestamp: this.state.currentSimulatedClock,
      relativeTime: Math.floor(this.state.elapsedSeconds)
    };

    incident.operatorNotes.push(note);
    incident.updatedAt = this.state.currentSimulatedClock;

    this.recordAudit('OPERATOR', 'Operator Note Added', `"${text}" recorded by ${operatorName}`, incident.id);

    if (this.onIncidentUpdated) {
      this.onIncidentUpdated(incident);
    }

    return incident;
  }

  public toggleRecommendationStep(incidentId: string, stepId: string): Incident | null {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return null;

    const rec = incident.recommendations.find(r => r.id === stepId);
    if (rec) {
      rec.completed = !rec.completed;
      this.recordAudit('OPERATOR', 'Response Step Updated', `Step ${rec.step} ("${rec.action}") marked ${rec.completed ? 'COMPLETED' : 'PENDING'}`, incident.id);
      if (this.onIncidentUpdated) {
        this.onIncidentUpdated(incident);
      }
    }
    return incident;
  }

  private startTimer(): void {
    this.stopTimer();
    const tickIntervalMs = 200; // 5 ticks per real-world second
    
    this.timer = setInterval(() => {
      if (!this.state.isRunning || this.state.isPaused) return;

      const increment = (tickIntervalMs / 1000) * this.state.speed;
      this.state.elapsedSeconds += increment;
      this.state.currentSimulatedClock = this.formatSimulatedClock(this.state.elapsedSeconds);

      // Check if any scenario events should trigger
      this.checkAndEmitEvents();

      // Check if scenario duration reached
      if (this.state.elapsedSeconds >= this.state.totalDuration) {
        this.state.isRunning = false;
        this.stopTimer();
        this.recordAudit('SYSTEM', 'Scenario Complete', `Simulation scenario reached completion at ${this.state.currentSimulatedClock}`);
      }

      if (this.onSimulationTick) {
        this.onSimulationTick(this.state);
      }
    }, tickIntervalMs);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private checkAndEmitEvents(): void {
    this.currentScenario.events.forEach((eventDef, index) => {
      if (!this.emittedEventIndices.has(index) && this.state.elapsedSeconds >= eventDef.relativeTime) {
        this.emittedEventIndices.add(index);
        
        // Build dynamic event with runtime generated timestamp
        const safetyEvent: SafetyEvent = {
          id: `EVT-${1000 + Math.floor(Math.random() * 9000)}`,
          source: eventDef.source,
          sourceType: eventDef.sourceType,
          zone: eventDef.zone,
          location: eventDef.location,
          relativeTime: Math.floor(this.state.elapsedSeconds),
          timestamp: this.state.currentSimulatedClock,
          simulatedClock: this.state.currentSimulatedClock,
          eventType: eventDef.eventType,
          severity: eventDef.severity,
          confidence: eventDef.confidence,
          evidence: eventDef.evidence,
          evidenceCategory: eventDef.evidenceCategory
        };

        this.activeEvents.unshift(safetyEvent);

        this.recordAudit('CORRELATION_AGENT', 'Signal Received', `Captured ${safetyEvent.eventType} from ${safetyEvent.source} in ${safetyEvent.zone}`, undefined, safetyEvent.id);

        if (this.onEventCreated) {
          this.onEventCreated(safetyEvent);
        }

        // Process through Correlation Agent
        const prevIncidentCount = this.incidents.length;
        this.incidents = this.correlationAgent.correlateEvents([safetyEvent], this.incidents);
        const updatedIncident = this.incidents.find(i => i.zone === safetyEvent.zone);

        if (updatedIncident) {
          if (this.incidents.length > prevIncidentCount) {
            if (this.onIncidentCreated) {
              this.onIncidentCreated(updatedIncident);
            }
          } else {
            if (this.onIncidentUpdated) {
              this.onIncidentUpdated(updatedIncident);
            }
          }
        }
      }
    });
  }

  private formatSimulatedClock(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private recordAudit(actor: AuditEntry['actor'], action: string, details: string, incidentId?: string, eventId?: string): void {
    const entry: AuditEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: this.state.currentSimulatedClock,
      relativeTime: Math.floor(this.state.elapsedSeconds),
      actor,
      action,
      details,
      incidentId,
      eventId
    };
    this.auditLog.unshift(entry);
    if (this.onAuditCreated) {
      this.onAuditCreated(entry);
    }
  }
}

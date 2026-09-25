import { SCENARIOS } from './scenarios';
import { SafetyEvent, SafetyEventSubmission, SimulationScenario, SimulationState, Incident, AuditEntry } from '../types';
import { CorrelationAgent } from '../agents/correlationAgent';
import { SimulationPersistence } from '../data/simulationPersistence';
import { RecommendationService } from '../ai/recommendationService';

export class ScenarioEngine {
  private currentScenario: SimulationScenario;
  private state: SimulationState;
  private correlationAgent: CorrelationAgent;
  private readonly recommendationService = new RecommendationService();
  private emittedEventIndices: Set<number> = new Set();
  private timer: NodeJS.Timeout | null = null;
  private baseClockOffsetSeconds: number = 0; // Starts simulation at 00:00 or current simulated hour
  private simulationRunId = `run-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

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

  constructor(private readonly persistence?: SimulationPersistence) {
    this.currentScenario = SCENARIOS[0];
    this.correlationAgent = new CorrelationAgent();
    this.state = {
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
    };
  }

  public async loadPersistedData(): Promise<void> {
    if (!this.persistence?.isConfigured) return;

    const data = await this.persistence.load();
    this.incidents = data.incidents;
    this.activeEvents = data.events;
    this.auditLog = data.auditLog;
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

  public async generateAIRecommendations(incidentId: string): Promise<Incident | undefined> {
    const incident = this.getIncidentById(incidentId);
    if (!incident) return undefined;

    incident.recommendations = await this.recommendationService.generate(incident);
    incident.explanation.agentContributions.push({
      agentName: 'Response AI',
      role: 'Evidence-Based Planning',
      inference: `Generated ${incident.recommendations.length} human-authorized response recommendations from the incident evidence.`
    });
    await this.persistIncident(incident);
    this.onIncidentUpdated?.(incident);
    return incident;
  }

  public async clearAuditLog(): Promise<void> {
    await (this.persistence?.clearAuditLog() || Promise.resolve());
    this.auditLog = [];
  }

  public async deleteAuditEntry(auditId: string): Promise<boolean> {
    const auditIndex = this.auditLog.findIndex(entry => entry.id === auditId);
    if (auditIndex === -1) return false;
    await (this.persistence?.deleteAuditEntry(auditId) || Promise.resolve());
    this.auditLog.splice(auditIndex, 1);
    return true;
  }

  public async deleteIncident(incidentId: string): Promise<boolean> {
    const incidentIndex = this.incidents.findIndex(incident => incident.id === incidentId);
    if (incidentIndex === -1) return false;

    const eventIds = new Set(this.incidents[incidentIndex].eventIds);
    this.incidents.splice(incidentIndex, 1);
    this.activeEvents = this.activeEvents.filter(event => !eventIds.has(event.id));
    this.auditLog = this.auditLog.filter(audit => audit.incidentId !== incidentId);
    await (this.persistence?.deleteIncident(incidentId) || Promise.resolve());
    this.recordAudit('OPERATOR', 'Incident Deleted', `Incident ${incidentId} and its related records were deleted.`);
    return true;
  }

  public startScenario(scenarioId: string, isJudgeDemo: boolean = false, autoPlay: boolean = true): SimulationState {
    this.stopTimer();
    this.emittedEventIndices.clear();
    this.activeEvents = [];
    this.incidents = [];
    this.auditLog = [];
    this.simulationRunId = `run-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      return this.getState();
    }
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
      sourcesOnline: 0,
      totalSources: 0,
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
    this.auditLog = [];
    this.state = {
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
    };
    return this.getState();
  }

  public ingestEvent(submission: SafetyEventSubmission): SafetyEvent | null {
    if (!this.state.scenarioId) return null;

    const safetyEvent: SafetyEvent = {
      ...submission,
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      relativeTime: Math.floor(this.state.elapsedSeconds),
      timestamp: this.state.currentSimulatedClock,
      simulatedClock: this.state.currentSimulatedClock,
      metadata: { ...submission.metadata, simulationRunId: this.simulationRunId }
    };

    this.processEvent(safetyEvent);
    return safetyEvent;
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
    const nextEventIndex = this.currentScenario.events.findIndex((_, index) => !this.emittedEventIndices.has(index));
    if (nextEventIndex === -1) return;

    const nextEventDef = this.currentScenario.events[nextEventIndex];
    if (this.state.elapsedSeconds < nextEventDef.relativeTime) return;

    this.emittedEventIndices.add(nextEventIndex);

    const safetyEvent: SafetyEvent = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      source: nextEventDef.source,
      sourceType: nextEventDef.sourceType,
      zone: nextEventDef.zone,
      location: nextEventDef.location,
      relativeTime: Math.floor(this.state.elapsedSeconds),
      timestamp: this.state.currentSimulatedClock,
      simulatedClock: this.state.currentSimulatedClock,
      eventType: nextEventDef.eventType,
      severity: nextEventDef.severity,
      confidence: nextEventDef.confidence,
      evidence: nextEventDef.evidence,
      evidenceCategory: nextEventDef.evidenceCategory,
      metadata: { simulationRunId: this.simulationRunId }
    };

    this.processEvent(safetyEvent);
  }

  private processEvent(safetyEvent: SafetyEvent): void {
    this.activeEvents.unshift(safetyEvent);
    const signalAudit = this.recordAudit(
      'CORRELATION_AGENT',
      'Signal Received',
      `Captured ${safetyEvent.eventType} from ${safetyEvent.source} in ${safetyEvent.zone}`,
      undefined,
      safetyEvent.id,
      false
    );
    this.onEventCreated?.(safetyEvent);

    const prevIncidentCount = this.incidents.length;
    this.incidents = this.correlationAgent.correlateEvents([safetyEvent], this.incidents);
    const updatedIncident = this.incidents.find(i => i.eventIds.includes(safetyEvent.id));

    if (!updatedIncident) return;
    this.persistIncident(updatedIncident)
      .then(() => this.persistEvent(safetyEvent, updatedIncident.id))
      .then(() => this.persistAudit(signalAudit))
      .catch(error => {
        console.warn('[SENTINEL CORE] Supabase event transaction failed:', error.message);
      });
    if (this.incidents.length > prevIncidentCount) {
      this.onIncidentCreated?.(updatedIncident);
    } else {
      this.onIncidentUpdated?.(updatedIncident);
    }
  }

  private formatSimulatedClock(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private recordAudit(
    actor: AuditEntry['actor'],
    action: string,
    details: string,
    incidentId?: string,
    eventId?: string,
    persist = true
  ): AuditEntry {
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
    if (persist) this.persistAudit(entry).catch(error => {
      console.warn('[SENTINEL CORE] Supabase audit persistence failed:', error.message);
    });
    return entry;
  }

  private persistIncident(incident: Incident): Promise<void> {
    return this.persistence?.saveIncident(incident) || Promise.resolve();
  }

  private persistEvent(event: SafetyEvent, incidentId?: string): Promise<void> {
    return this.persistence?.saveEvent(event, incidentId) || Promise.resolve();
  }

  private persistAudit(audit: AuditEntry): Promise<void> {
    return this.persistence?.saveAudit(audit) || Promise.resolve();
  }
}

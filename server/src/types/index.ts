export type EventSourceType = 
  | 'building_system' 
  | 'sensor' 
  | 'operator_report' 
  | 'alarm_panel' 
  | 'access_control' 
  | 'vision_optical';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentSeverity = 'watch' | 'elevated' | 'critical';
export type IncidentStatus = 'watch' | 'elevated' | 'critical' | 'acknowledged' | 'resolved' | 'false_alarm';

export interface SafetyEvent {
  id: string;
  source: string;
  sourceType: EventSourceType;
  zone: string;
  location: string;
  relativeTime: number; // Seconds since scenario start
  timestamp: string;    // Dynamically formatted simulated clock time
  simulatedClock: string; // e.g. "00:12"
  eventType: 
    | 'thermal_anomaly' 
    | 'smoke_report' 
    | 'manual_alarm' 
    | 'access_violation' 
    | 'crowd_anomaly' 
    | 'equipment_overheat' 
    | 'dust_spike'
    | 'perimeter_motion';
  severity: EventSeverity;
  confidence: number;   // 0.0 to 1.0
  evidence: string;
  evidenceCategory: 'confirmed' | 'supporting' | 'unknown';
  metadata?: Record<string, any>;
}

export interface ConfidenceStep {
  relativeTime: number;
  timestamp: string;
  confidence: number;
  triggerEvent: string;
  rationale: string;
}

export interface EvidenceItem {
  id: string;
  label: string;
  source: string;
  details: string;
  confidenceContribution: number;
  relativeTime: number;
  timestamp: string;
}

export interface UnknownItem {
  id: string;
  label: string;
  details: string;
}

export interface AgentContribution {
  agentName: string;
  role: string;
  inference: string;
}

export interface IncidentExplanation {
  whyCreated: string;
  whyPrioritized: string;
  whyConfidenceChanged: string;
  whatIsUncertain: string;
  whatWouldChangeAssessment: string;
  agentContributions: AgentContribution[];
}

export interface RecommendedStep {
  id: string;
  step: number;
  action: string;
  rationale: string;
  completed: boolean;
  priority: 'immediate' | 'secondary' | 'monitoring';
}

export interface OperatorNote {
  id: string;
  operator: string;
  action: string;
  note: string;
  timestamp: string;
  relativeTime: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  relativeTime: number;
  actor: 'SYSTEM' | 'CORRELATION_AGENT' | 'RISK_AGENT' | 'EXPLAINABILITY_AGENT' | 'RESPONSE_AGENT' | 'OPERATOR' | 'VISION_AGENT' | 'SENSOR_AGENT';
  actorName?: string;
  action: string;
  details: string;
  incidentId?: string;
  eventId?: string;
}

export interface Incident {
  id: string;
  title: string;
  category: 'fire_hazard' | 'security_breach' | 'crowd_safety' | 'equipment_failure' | 'false_alarm';
  zone: string;
  location: string;
  severity: IncidentSeverity;
  confidence: number; // 0.0 to 1.0 (e.g. 0.86)
  confidenceTrajectory: ConfidenceStep[];
  status: IncidentStatus;
  createdAt: string;
  createdRelativeTime: number;
  updatedAt: string;
  summary: string;
  eventIds: string[];
  events: SafetyEvent[];
  evidenceSummary: {
    confirmed: EvidenceItem[];
    supporting: EvidenceItem[];
    unknown: UnknownItem[];
  };
  explanation: IncidentExplanation;
  recommendations: RecommendedStep[];
  operatorNotes: OperatorNote[];
  auditEntries: AuditEntry[];
}

export interface ScenarioEventDefinition {
  relativeTime: number;
  source: string;
  sourceType: EventSourceType;
  zone: string;
  location: string;
  eventType: SafetyEvent['eventType'];
  severity: EventSeverity;
  confidence: number;
  evidence: string;
  evidenceCategory: 'confirmed' | 'supporting' | 'unknown';
}

export interface SimulationScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  signalTypes: string[];
  expectedOutcome: string;
  duration: number; // in seconds
  events: ScenarioEventDefinition[];
}

export interface SimulationState {
  scenarioId: string;
  scenarioName: string;
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  elapsedSeconds: number;
  totalDuration: number;
  currentSimulatedClock: string;
  sourcesOnline: number;
  totalSources: number;
  isJudgeDemo: boolean;
}

export interface AnalyticsMetrics {
  rawAlertsCount: number;
  correlatedSituationsCount: number;
  compressionRatio: string;
  incidentDetectionLatencySeconds: number;
  operatorAcknowledgmentLatencySeconds: number;
  evidenceCompletenessPercent: number;
  sourceAgreementPercent: number;
  falseAlarmFilteredCount: number;
  confidenceEvolution: Array<{
    relativeTime: number;
    timeLabel: string;
    confidence: number;
    eventName: string;
  }>;
  sourceDistribution: Array<{
    sourceType: string;
    count: number;
    percentage: number;
  }>;
  zoneActivity: Array<{
    zone: string;
    alertCount: number;
    incidentCount: number;
    status: 'nominal' | 'watch' | 'elevated' | 'critical';
  }>;
}

export interface CampusZone {
  id: string;
  name: string;
  shortName: string;
  status: 'nominal' | 'watch' | 'elevated' | 'critical';
  activeIncidentId?: string;
  activeSources: number;
  recentEventsCount: number;
  occupancyState: 'low' | 'moderate' | 'high' | 'cleared';
  lastUpdate: string;
  coordinates: { x: number; y: number; width: number; height: number };
}

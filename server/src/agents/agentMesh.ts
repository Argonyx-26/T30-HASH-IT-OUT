export interface AgentDefinition {
  id: string;
  name: string;
  category: 'perception' | 'reasoning' | 'governance';
  purpose: string;
  input: string;
  output: string;
  status: 'active' | 'processing' | 'idle';
  eventsProcessed: number;
}

export const AGENT_REGISTRY: AgentDefinition[] = [
  {
    id: 'vision-agent',
    name: 'Vision Agent',
    category: 'perception',
    purpose: 'Analyzes visual optical flow, motion vectors, and crowd density without capturing identities or biometric markers.',
    input: 'De-identified optical motion vectors and bounding density clusters',
    output: 'Crowd movement anomalies, egress dispersion rates, directional vectors',
    status: 'active',
    eventsProcessed: 142
  },
  {
    id: 'sensor-agent',
    name: 'Sensor Agent',
    category: 'perception',
    purpose: 'Continuously evaluates environmental, thermal, and mechanical transducer telemetry against historical baselines.',
    input: 'Raw telemetry streams (thermal, humidity, vibration, gas, particulate)',
    output: 'Normalized anomaly scores, standard deviation deviations, thermal gradients',
    status: 'active',
    eventsProcessed: 489
  },
  {
    id: 'access-agent',
    name: 'Access Agent',
    category: 'perception',
    purpose: 'Monitors turnstiles, badge access controllers, and panic egress hardware for physical perimeter security.',
    input: 'Card reader telemetry, door forced open (DFO) contacts, panic bar microswitches',
    output: 'Perimeter breach events, egress flow spikes, unauthorized access flags',
    status: 'active',
    eventsProcessed: 320
  },
  {
    id: 'report-agent',
    name: 'Report Agent',
    category: 'perception',
    purpose: 'Converts unstructured natural-language dispatcher communications and occupant emergency calls into structured spatial signals.',
    input: 'Dispatch audio transcripts, student mobile report text, radio logs',
    output: 'Structured event (eventType, location, zone, severity indicators, confidence)',
    status: 'active',
    eventsProcessed: 67
  },
  {
    id: 'anomaly-agent',
    name: 'Anomaly Agent',
    category: 'perception',
    purpose: 'Evaluates single-stream telemetry to detect statistical outliers and filter transient sensor spikes.',
    input: 'Normalized perception streams',
    output: 'Qualified anomaly candidates with baseline confidence scores',
    status: 'active',
    eventsProcessed: 275
  },
  {
    id: 'correlation-agent',
    name: 'Correlation Agent',
    category: 'reasoning',
    purpose: 'Core engine that groups spatio-temporal signals across independent sensing modalities into singular situational incidents.',
    input: 'Qualified anomalies across vision, sensor, access, and reports',
    output: 'Unified situational incidents with evolving cross-modal evidence trees',
    status: 'active',
    eventsProcessed: 88
  },
  {
    id: 'risk-agent',
    name: 'Risk & Prioritization Agent',
    category: 'reasoning',
    purpose: 'Calculates incident severity separate from evidence confidence to avoid conflating impact with probability.',
    input: 'Correlated incident graph, zone occupancy state, hazard classifications',
    output: 'Calibrated severity tier (Watch, Elevated, Critical) and escalation triggers',
    status: 'active',
    eventsProcessed: 94
  },
  {
    id: 'explainability-agent',
    name: 'Explainability Agent',
    category: 'reasoning',
    purpose: 'Generates transparent rationale detailing why an incident was created, prioritized, and what remains uncertain.',
    input: 'Cross-modal correlation graph and confidence trajectory',
    output: 'Structured rationale (Why Created, Why Prioritized, Uncertainty, Evidence Drivers)',
    status: 'active',
    eventsProcessed: 94
  },
  {
    id: 'response-agent',
    name: 'Response Recommendation Agent',
    category: 'reasoning',
    purpose: 'Proposes actionable next steps adhering strictly to "AI recommends, Humans decide" protocols without autonomous escalation.',
    input: 'Incident profile, venue safety SOPs, current responder staging',
    output: 'Prioritized human-action checklist requiring authorized operator sign-off',
    status: 'active',
    eventsProcessed: 94
  },
  {
    id: 'privacy-agent',
    name: 'Privacy & Governance Agent',
    category: 'governance',
    purpose: 'Enforces Privacy-by-Design safeguards, blocks facial recognition, and maintains tamper-evident audit logs.',
    input: 'All system I/O, agent inferences, and operator actions',
    output: 'Anonymized event records, compliance audit seals, privacy guarantees',
    status: 'active',
    eventsProcessed: 1240
  }
];

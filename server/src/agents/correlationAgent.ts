import { SafetyEvent, Incident, IncidentSeverity, EvidenceItem, UnknownItem, RecommendedStep, AgentContribution, IncidentMetrics } from '../types';

export class CorrelationAgent {
  /**
   * Deterministic correlation: groups events by zone, location proximity, and time window
   */
  public correlateEvents(events: SafetyEvent[], existingIncidents: Incident[]): Incident[] {
    const incidents = [...existingIncidents];

    for (const event of events) {
      const eventCategory = this.mapEventToCategory(event.eventType);
      const correlationWindowSeconds = 120;

      // A situation is one category in one zone within a bounded time window.
      // Later signals from different source types are added to the same incident.
      let match = incidents.find(inc =>
        inc.events[0]?.metadata?.simulationRunId === event.metadata?.simulationRunId &&
        inc.zone === event.zone &&
        inc.category === eventCategory &&
        inc.status !== 'resolved' &&
        inc.status !== 'false_alarm' &&
        event.relativeTime >= inc.createdRelativeTime &&
        event.relativeTime - inc.createdRelativeTime <= correlationWindowSeconds
      );

      if (!match) {
        // Create new incident
        match = this.createIncidentFromFirstEvent(event);
        incidents.push(match);
      } else {
        // Update existing incident
        this.correlateEventIntoIncident(match, event);
      }
    }

    return incidents;
  }

  private createIncidentFromFirstEvent(event: SafetyEvent): Incident {
    const incidentId = `INC-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const category = this.mapEventToCategory(event.eventType);
    const title = this.formatTitle(category, event.zone, event.location);
    const initialSeverity: IncidentSeverity = event.severity === 'critical' ? 'critical' : event.severity === 'high' ? 'elevated' : 'watch';

    // Initial confidence starts lower for single source
    const initialConfidence = Math.min(0.62, Math.max(0.40, event.confidence * 0.7));

    const confirmed: EvidenceItem[] = [];
    const supporting: EvidenceItem[] = [];
    const unknown: UnknownItem[] = [
      { id: 'unk-1', label: 'On-scene Visual Confirmation', details: 'Authorized safety personnel on-site verification pending' },
      { id: 'unk-2', label: 'Occupant Count Confirmation', details: 'Exact floor clearance verification in progress' }
    ];

    const evidenceItem: EvidenceItem = {
      id: `ev-${event.id}`,
      label: event.source,
      source: event.source,
      details: event.evidence,
      confidenceContribution: Math.round(event.confidence * 25),
      relativeTime: event.relativeTime,
      timestamp: event.timestamp
    };

    if (event.evidenceCategory === 'confirmed') {
      confirmed.push(evidenceItem);
    } else {
      supporting.push(evidenceItem);
    }

    return {
      id: incidentId,
      title,
      category,
      zone: event.zone,
      location: event.location,
      severity: initialSeverity,
      confidence: initialConfidence,
      confidenceTrajectory: [
        {
          relativeTime: event.relativeTime,
          timestamp: event.timestamp,
          confidence: initialConfidence,
          triggerEvent: event.eventType,
          rationale: `Initial detection by ${event.source}`
        }
      ],
      status: initialSeverity === 'critical' ? 'critical' : initialSeverity === 'elevated' ? 'elevated' : 'watch',
      createdAt: event.timestamp,
      createdRelativeTime: event.relativeTime,
      updatedAt: event.timestamp,
      summary: `A single sensor reported a possible ${this.categoryLabel(category)} in ${event.zone} (${event.location}). No final conclusion is made until independent sensors corroborate it.`,
      eventIds: [event.id],
      events: [event],
      metrics: this.calculateMetrics([event]),
      evidenceSummary: { confirmed, supporting, unknown },
      explanation: {
        whyCreated: `The first signal came from ${event.source}. It indicates a possible ${this.categoryLabel(category)} in ${event.zone}, so Sentinel opened a provisional incident for monitoring.`,
        whyPrioritized: `The incident remains at ${initialSeverity.toUpperCase()} because only one sensor has reported the situation so far.`,
        whyConfidenceChanged: `Initial baseline confidence at ${(initialConfidence * 100).toFixed(0)}% from single input source.`,
        correlationLogic: `Sentinel started with one signal and kept it in watch mode. It only raises confidence when another sensor in the same area reports a matching problem within the same time window.`,
        whatIsUncertain: 'Visual verification pending; waiting for corroborating cross-system signals.',
        whatWouldChangeAssessment: 'Corroboration from independent sensor or on-site security check.',
        agentContributions: [
          { agentName: 'SensorAgent', role: 'Telemetry Ingestion', inference: `Captured ${event.eventType} with raw score ${(event.confidence * 100).toFixed(0)}%` },
          { agentName: 'CorrelationAgent', role: 'Spatio-Temporal Clustering', inference: `Opened incident workspace for ${event.zone}` }
        ]
      },
      recommendations: this.generateRecommendations(category, initialSeverity),
      operatorNotes: [],
      auditEntries: [
        {
          id: `aud-${Date.now()}-init`,
          timestamp: event.timestamp,
          relativeTime: event.relativeTime,
          actor: 'CORRELATION_AGENT',
          action: 'Incident Created',
          details: `Generated incident ${incidentId} following trigger from ${event.source}`,
          incidentId,
          eventId: event.id
        }
      ]
    };
  }

  private correlateEventIntoIncident(incident: Incident, event: SafetyEvent): void {
    if (incident.eventIds.includes(event.id)) return;

    incident.eventIds.push(event.id);
    incident.events.push(event);
    this.trimIncidentSignals(incident);
    incident.metrics = this.calculateMetrics(incident.events);
    incident.updatedAt = event.timestamp;

    // Check evidence category
    const evidenceItem: EvidenceItem = {
      id: `ev-${event.id}`,
      label: event.source,
      source: event.source,
      details: event.evidence,
      confidenceContribution: Math.round(event.confidence * 20),
      relativeTime: event.relativeTime,
      timestamp: event.timestamp
    };

    if (event.evidenceCategory === 'confirmed') {
      incident.evidenceSummary.confirmed.push(evidenceItem);
    } else {
      incident.evidenceSummary.supporting.push(evidenceItem);
    }

    // Dynamic confidence evolution: independent sources increase confidence
    const uniqueSourceTypes = new Set(incident.events.map(e => e.sourceType)).size;
    const confirmedCount = incident.evidenceSummary.confirmed.length;

    // Formula: baseline + source diversity bonus + confirmation bonus
    let newConfidence = 0.55 + (uniqueSourceTypes * 0.07) + (confirmedCount * 0.05);
    newConfidence = Math.min(0.94, Math.max(0.50, newConfidence));

    // Escalate severity if manual alarm or critical event occurs
    if (event.severity === 'critical' || event.eventType === 'manual_alarm') {
      incident.severity = 'critical';
      if (incident.status !== 'acknowledged' && incident.status !== 'resolved') {
        incident.status = 'critical';
      }
    } else if (event.severity === 'high' && incident.severity === 'watch') {
      incident.severity = 'elevated';
      if (incident.status === 'watch') incident.status = 'elevated';
    }

    // Add to confidence trajectory
    incident.confidence = newConfidence;
    incident.confidenceTrajectory.push({
      relativeTime: event.relativeTime,
      timestamp: event.timestamp,
      confidence: newConfidence,
      triggerEvent: event.eventType,
      rationale: `Cross-modal evidence added: ${event.source} (${event.eventType})`
    });

    // Update summary & explanations
    const eventNames = [...new Set(incident.events.map(item => this.eventLabel(item.eventType)))];
    incident.summary = uniqueSourceTypes < 2
      ? `The same sensor family has reported ${eventNames.join(', ')} around ${incident.location}. Sentinel is still waiting for an independent sensor type before making a stronger prediction.`
      : `Independent sensor types (${uniqueSourceTypes}) detected ${eventNames.join(', ')} around ${incident.location}. Together, these signals support a possible ${this.categoryLabel(incident.category)} rather than relying on one sensor alone.`;

    incident.explanation.whyPrioritized = uniqueSourceTypes < 2
      ? `The incident remains at ${incident.severity.toUpperCase()} because independent sensor confirmation is still pending.`
      : incident.severity === 'critical'
        ? `Severity elevated to CRITICAL after ${uniqueSourceTypes} independent sensor types and ${incident.events.length} signals converged.`
        : `Priority increased after ${uniqueSourceTypes} independent sensor types corroborated the same situation in ${incident.zone}.`;

    incident.explanation.correlationLogic = uniqueSourceTypes < 2
      ? `Sentinel matched the same problem type and area, but only one sensor family is reporting it. It is still waiting for a second independent source before calling it a confirmed event.`
      : `Sentinel looked for the same hazard in the same zone within a short time window. It then grouped the strongest signals from different sensor types and raised confidence because they agreed on the same incident.`;

    incident.explanation.whyConfidenceChanged = uniqueSourceTypes < 2
      ? `Confidence is ${(newConfidence * 100).toFixed(0)}% after another related signal, but independent sensor confirmation is still pending.`
      : `Confidence increased from ${(incident.confidenceTrajectory[incident.confidenceTrajectory.length - 2]?.confidence * 100 || 61).toFixed(0)}% to ${(newConfidence * 100).toFixed(0)}% because independent evidence converged from ${uniqueSourceTypes} sensor types.`;

    incident.explanation.agentContributions.push({
      agentName: this.getAgentForSource(event.sourceType),
      role: 'Cross-Modal Ingestion',
      inference: `Correlated ${event.eventType} into ${incident.id}; evidence diversity is now ${uniqueSourceTypes} distinct channels.`
    });

    // Audit entry
    incident.auditEntries.push({
      id: `aud-${Date.now()}-${event.id}`,
      timestamp: event.timestamp,
      relativeTime: event.relativeTime,
      actor: 'CORRELATION_AGENT',
      action: 'Confidence & Evidence Updated',
      details: `Correlated ${event.source} into ${incident.id}. Confidence increased to ${(newConfidence * 100).toFixed(0)}%.`,
      incidentId: incident.id,
      eventId: event.id
    });
  }

  private trimIncidentSignals(incident: Incident): void {
    const maxSignals = 5;
    if (incident.events.length <= maxSignals) return;

    const selected = [...incident.events]
      .sort((a, b) => {
        const confirmedPriority = Number(b.evidenceCategory === 'confirmed') - Number(a.evidenceCategory === 'confirmed');
        if (confirmedPriority !== 0) return confirmedPriority;
        return b.confidence - a.confidence;
      })
      .slice(0, maxSignals);

    const selectedIds = new Set(selected.map(event => event.id));
    incident.events = selected;
    incident.eventIds = selected.map(event => event.id);
    incident.evidenceSummary.confirmed = incident.evidenceSummary.confirmed.filter(item => selectedIds.has(item.id.replace(/^ev-/, '')));
    incident.evidenceSummary.supporting = incident.evidenceSummary.supporting.filter(item => selectedIds.has(item.id.replace(/^ev-/, '')));
  }

  private calculateMetrics(events: SafetyEvent[]): IncidentMetrics {
    const sourceTypes = [...new Set(events.map(event => event.sourceType))];
    const averageConfidence = events.length === 0 ? 0 : events.reduce((sum, event) => sum + event.confidence, 0) / events.length;
    const percentageFor = (types: SafetyEvent['eventType'][]) => {
      const matching = events.filter(event => types.includes(event.eventType));
      return events.length === 0 ? 0 : Math.round((matching.reduce((sum, event) => sum + event.confidence, 0) / events.length) * 100);
    };

    return {
      relatedSourceCount: events.length,
      sourceTypes,
      evidenceCompletenessPercent: Math.round((events.filter(event => event.evidence.trim().length > 0).length / Math.max(1, events.length)) * 100),
      sourceAgreementPercent: Math.round(averageConfidence * 100),
      smokePercentage: percentageFor(['smoke_report']),
      thermalRiskPercentage: percentageFor(['thermal_anomaly']),
      accessRiskPercentage: percentageFor(['access_violation', 'perimeter_motion']),
      crowdRiskPercentage: percentageFor(['crowd_anomaly']),
      equipmentRiskPercentage: percentageFor(['equipment_overheat'])
    };
  }

  private categoryLabel(category: Incident['category']): string {
    switch (category) {
      case 'fire_hazard': return 'fire hazard';
      case 'security_breach': return 'security breach';
      case 'crowd_safety': return 'crowd safety issue';
      case 'equipment_failure': return 'equipment failure';
      case 'false_alarm': return 'uncorroborated anomaly';
    }
  }

  private eventLabel(eventType: SafetyEvent['eventType']): string {
    return eventType.replaceAll('_', ' ');
  }

  private mapEventToCategory(eventType: SafetyEvent['eventType']): Incident['category'] {
    switch (eventType) {
      case 'thermal_anomaly':
      case 'smoke_report':
      case 'manual_alarm':
        return 'fire_hazard';
      case 'access_violation':
      case 'perimeter_motion':
        return 'security_breach';
      case 'crowd_anomaly':
        return 'crowd_safety';
      case 'equipment_overheat':
        return 'equipment_failure';
      case 'dust_spike':
        return 'false_alarm';
      default:
        return 'fire_hazard';
    }
  }

  private formatTitle(category: Incident['category'], zone: string, location: string): string {
    switch (category) {
      case 'fire_hazard':
        return `Possible Fire Incident — ${zone}`;
      case 'security_breach':
        return `Restricted Access Breach — ${zone}`;
      case 'crowd_safety':
        return `Crowd Surge Anomaly — ${zone}`;
      case 'equipment_failure':
        return `Equipment Overheat Warning — ${zone}`;
      case 'false_alarm':
        return `Uncorroborated Anomaly — ${zone}`;
    }
  }

  private getAgentForSource(sourceType: SafetyEvent['sourceType']): string {
    switch (sourceType) {
      case 'vision_optical': return 'VisionAgent';
      case 'sensor': return 'SensorAgent';
      case 'access_control': return 'AccessAgent';
      case 'operator_report': return 'ReportAgent';
      case 'alarm_panel': return 'BuildingSystemsAgent';
      default: return 'SensorAgent';
    }
  }

  private generateRecommendations(category: Incident['category'], severity: IncidentSeverity): RecommendedStep[] {
    if (category === 'fire_hazard') {
      return [
        { id: 'rec-1', step: 1, action: 'Verify visual conditions via on-site personnel or nearest optical feed', rationale: 'Confirm presence of smoke or thermal source without initiating false evacuation', completed: false, priority: 'immediate' },
        { id: 'rec-2', step: 2, action: 'Dispatch authorized campus safety responders to affected stairwell', rationale: 'Establish staging perimeter and prepare safety escort', completed: false, priority: 'immediate' },
        { id: 'rec-3', step: 3, action: 'Stage response equipment near perimeter zone access', rationale: 'Maintain ready stance for rapid ingress if verified', completed: false, priority: 'secondary' },
        { id: 'rec-4', step: 4, action: 'Restrict elevator and auxiliary corridor access if condition persists', rationale: 'Prevent smoke stack exposure in vertical shafts', completed: false, priority: 'secondary' },
        { id: 'rec-5', step: 5, action: 'Continue passive sensor telemetry monitoring in adjacent Science Annex wings', rationale: 'Detect boundary spread into connecting academic blocks', completed: false, priority: 'monitoring' }
      ];
    } else if (category === 'security_breach') {
      return [
        { id: 'rec-1', step: 1, action: 'Dispatch patrol unit to server room exterior access points', rationale: 'Verify physical door status and inspect tamper switch', completed: false, priority: 'immediate' },
        { id: 'rec-2', step: 2, action: 'Request verification from building facilities administrator', rationale: 'Check for scheduled after-hours maintenance activity', completed: false, priority: 'immediate' },
        { id: 'rec-3', step: 3, action: 'Lock down adjacent corridor access turnstiles via controller', rationale: 'Isolate potential unauthorized movement', completed: false, priority: 'secondary' }
      ];
    } else if (category === 'crowd_safety') {
      return [
        { id: 'rec-1', step: 1, action: 'Instruct plaza stewards to open auxiliary gates 3 and 4', rationale: 'Alleviate density bottleneck at central atrium', completed: false, priority: 'immediate' },
        { id: 'rec-2', step: 2, action: 'Acknowledge callbox emergency request and speak with caller', rationale: 'Establish direct voice contact with pedestrian seeking assistance', completed: false, priority: 'immediate' },
        { id: 'rec-3', step: 3, action: 'Monitor directional dispersion vectors via optical flow cams', rationale: 'Ensure crowd velocity returns to safe baseline (below 1.5 m/s)', completed: false, priority: 'monitoring' }
      ];
    } else {
      return [
        { id: 'rec-1', step: 1, action: 'Review primary telemetry readings and compare with baseline', rationale: 'Ascertain whether reading represents transient spike or equipment fault', completed: false, priority: 'immediate' },
        { id: 'rec-2', step: 2, action: 'Notify maintenance dispatch for preventive diagnostic inspection', rationale: 'Prevent operational downtime', completed: false, priority: 'secondary' }
      ];
    }
  }
}

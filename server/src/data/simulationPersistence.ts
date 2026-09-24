import { AuditEntry, Incident, SafetyEvent } from '../types';
import { SupabaseRestClient } from './supabaseRestClient';

type StoredIncident = Incident & { inserted_at?: string };

type StoredEvent = SafetyEvent & {
  source_type?: SafetyEvent['sourceType'];
  relative_time?: number;
  simulated_clock?: string;
  event_type?: SafetyEvent['eventType'];
  evidence_category?: SafetyEvent['evidenceCategory'];
  incident_id?: string | null;
};

export class SimulationPersistence {
  constructor(private readonly database: SupabaseRestClient) { }

  public get isConfigured(): boolean {
    return this.database.isConfigured;
  }

  public async load(): Promise<{ incidents: Incident[]; events: SafetyEvent[]; auditLog: AuditEntry[] }> {
    if (!this.database.isConfigured) return { incidents: [], events: [], auditLog: [] };

    const [incidents, events, auditLog] = await Promise.all([
      this.database.select<StoredIncident>('incidents', 'select=*'),
      this.database.select<StoredEvent>('safety_events', 'select=*'),
      this.database.select<AuditEntry>('audit_entries', 'select=*')
    ]);

    return {
      incidents: incidents.map(incident => ({
        ...incident,
        confidenceTrajectory: incident.confidenceTrajectory || (incident as unknown as { confidence_trajectory: Incident['confidenceTrajectory'] }).confidence_trajectory,
        createdAt: incident.createdAt || (incident as unknown as { created_at: string }).created_at,
        createdRelativeTime: incident.createdRelativeTime ?? (incident as unknown as { created_relative_time: number }).created_relative_time,
        updatedAt: incident.updatedAt || (incident as unknown as { updated_at: string }).updated_at,
        eventIds: incident.eventIds || (incident as unknown as { event_ids: string[] }).event_ids,
        events: incident.events || []
        , metrics: incident.metrics || {
          relatedSourceCount: incident.events?.length || 0,
          sourceTypes: [],
          evidenceCompletenessPercent: 0,
          sourceAgreementPercent: 0,
          smokePercentage: 0,
          thermalRiskPercentage: 0,
          accessRiskPercentage: 0,
          crowdRiskPercentage: 0,
          equipmentRiskPercentage: 0
        }
      })),
      events: events.map(event => ({
        ...event,
        sourceType: event.sourceType || event.source_type!,
        relativeTime: event.relativeTime ?? event.relative_time!,
        simulatedClock: event.simulatedClock || event.simulated_clock!,
        eventType: event.eventType || event.event_type!,
        evidenceCategory: event.evidenceCategory || event.evidence_category!
      })),
      auditLog
    };
  }

  public async saveIncident(incident: Incident): Promise<void> {
    if (!this.database.isConfigured) return;
    await this.database.upsert('incidents', {
      id: incident.id,
      title: incident.title,
      category: incident.category,
      zone: incident.zone,
      location: incident.location,
      severity: incident.severity,
      confidence: incident.confidence,
      confidence_trajectory: incident.confidenceTrajectory,
      status: incident.status,
      created_at: incident.createdAt,
      created_relative_time: incident.createdRelativeTime,
      updated_at: incident.updatedAt,
      summary: incident.summary,
      event_ids: incident.eventIds,
      events: incident.events,
      metrics: incident.metrics,
      evidence_summary: incident.evidenceSummary,
      explanation: incident.explanation,
      recommendations: incident.recommendations,
      operator_notes: incident.operatorNotes,
      audit_entries: incident.auditEntries
    });
  }

  public async saveEvent(event: SafetyEvent, incidentId?: string): Promise<void> {
    if (!this.database.isConfigured) return;
    await this.database.upsert('safety_events', {
      id: event.id,
      source: event.source,
      source_type: event.sourceType,
      zone: event.zone,
      location: event.location,
      relative_time: event.relativeTime,
      timestamp: event.timestamp,
      simulated_clock: event.simulatedClock,
      event_type: event.eventType,
      severity: event.severity,
      confidence: event.confidence,
      evidence: event.evidence,
      evidence_category: event.evidenceCategory,
      metadata: event.metadata || null,
      incident_id: incidentId || null
    });
  }

  public async saveAudit(audit: AuditEntry): Promise<void> {
    if (!this.database.isConfigured) return;
    await this.database.upsert('audit_entries', {
      id: audit.id,
      timestamp: audit.timestamp,
      relative_time: audit.relativeTime,
      actor: audit.actor,
      actor_name: audit.actorName || null,
      action: audit.action,
      details: audit.details,
      incident_id: audit.incidentId || null,
      event_id: audit.eventId || null
    });
  }

  public async deleteIncident(incidentId: string): Promise<void> {
    if (!this.database.isConfigured) return;
    const encodedId = encodeURIComponent(incidentId);
    await this.database.remove('safety_events', `incident_id=eq.${encodedId}`);
    await this.database.remove('audit_entries', `incident_id=eq.${encodedId}`);
    await this.database.remove('incidents', `id=eq.${encodedId}`);
  }
}

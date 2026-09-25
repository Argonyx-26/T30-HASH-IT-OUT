import { AnalyticsMetrics, CampusZone } from '../types';
import { ScenarioEngine } from '../simulation/scenarioEngine';
import { CAMPUS_ZONES } from '../simulation/scenarios';

export class AnalyticsService {
  constructor(private engine: ScenarioEngine) { }

  public getMetrics(): AnalyticsMetrics {
    const events = this.engine.getActiveEvents();
    const incidents = this.engine.getIncidents();
    const state = this.engine.getState();

    const rawAlertsCount = events.length;
    const correlatedSituationsCount = incidents.length;
    const compressionRatio = `${(rawAlertsCount / Math.max(1, correlatedSituationsCount)).toFixed(1)}:1`;

    // Dynamic latency from simulation clock
    const detectionLatency = events.length > 0
      ? Math.round(events[events.length - 1].relativeTime / Math.max(1, incidents.length))
      : 0;

    const acknowledgmentLatency = incidents.some(i => i.status === 'acknowledged' || i.status === 'resolved') ? 1 : 0;

    // Calculate confidence evolution from incident trajectories or default baseline
    const confidenceEvolution: AnalyticsMetrics['confidenceEvolution'] = [];
    if (incidents.length > 0 && incidents[0].confidenceTrajectory.length > 0) {
      incidents[0].confidenceTrajectory.forEach(traj => {
        confidenceEvolution.push({
          relativeTime: traj.relativeTime,
          timeLabel: traj.timestamp,
          confidence: Math.round(traj.confidence * 100),
          eventName: traj.triggerEvent.replace('_', ' ')
        });
      });
    }

    // Source distribution
    const sourceTypes = ['sensor', 'alarm_panel', 'access_control', 'operator_report', 'vision_optical'];
    const typeCounts: Record<string, number> = {};

    events.forEach(e => {
      typeCounts[e.sourceType] = (typeCounts[e.sourceType] || 0) + 1;
    });

    const totalSourcesCount = Object.values(typeCounts).reduce((a, b) => a + b, 0);
    const sourceDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      sourceType: type.replace('_', ' ').toUpperCase(),
      count,
      percentage: totalSourcesCount > 0 ? Math.round((count / totalSourcesCount) * 100) : 0
    }));

    // Campus Zone Activity
    const zoneActivity: AnalyticsMetrics['zoneActivity'] = CAMPUS_ZONES.map(z => {
      const zoneIncidents = incidents.filter(i => i.zone === z.name);
      const zoneEvents = events.filter(e => e.zone === z.name);

      let status: 'nominal' | 'watch' | 'elevated' | 'critical' = 'nominal';
      if (zoneIncidents.some(i => i.status === 'critical')) status = 'critical';
      else if (zoneIncidents.some(i => i.status === 'elevated')) status = 'elevated';
      else if (zoneIncidents.some(i => i.status === 'watch')) status = 'watch';

      return {
        zone: z.name,
        alertCount: zoneEvents.length,
        incidentCount: zoneIncidents.length,
        status
      };
    });

    const incidentBreakdown: AnalyticsMetrics['incidentBreakdown'] = incidents.map(incident => ({
      incidentId: incident.id,
      title: incident.title,
      sourceCount: incident.metrics.relatedSourceCount,
      sourceTypes: incident.metrics.sourceTypes,
      confidence: Math.round(incident.confidence * 100),
      evidenceCompletenessPercent: incident.metrics.evidenceCompletenessPercent,
      smokePercentage: incident.metrics.smokePercentage,
      status: incident.status
    }));

    return {
      rawAlertsCount,
      correlatedSituationsCount,
      compressionRatio,
      incidentDetectionLatencySeconds: detectionLatency,
      operatorAcknowledgmentLatencySeconds: acknowledgmentLatency,
      evidenceCompletenessPercent: incidents.length > 0 ? 86 : 0,
      sourceAgreementPercent: events.length > 0 ? 92 : 0,
      falseAlarmFilteredCount: 0,
      confidenceEvolution,
      sourceDistribution,
      zoneActivity,
      incidentBreakdown
    };
  }

  public getCampusZones(): CampusZone[] {
    const incidents = this.engine.getIncidents();
    const events = this.engine.getActiveEvents();
    const state = this.engine.getState();

    return CAMPUS_ZONES.map(z => {
      const activeInc = incidents.find(i => i.zone === z.name && i.status !== 'resolved');
      const zoneEvents = events.filter(e => e.zone === z.name);

      let status: CampusZone['status'] = 'nominal';
      if (activeInc) {
        status = activeInc.severity;
      }

      return {
        id: z.id,
        name: z.name,
        shortName: z.shortName,
        status,
        activeIncidentId: activeInc?.id,
        activeSources: zoneEvents.length,
        recentEventsCount: zoneEvents.length,
        occupancyState: activeInc?.severity === 'critical' ? 'cleared' : 'low',
        lastUpdate: state.currentSimulatedClock,
        coordinates: z.coordinates
      };
    });
  }
}

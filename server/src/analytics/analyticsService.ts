import { AnalyticsMetrics, CampusZone } from '../types';
import { ScenarioEngine } from '../simulation/scenarioEngine';
import { CAMPUS_ZONES } from '../simulation/scenarios';

export class AnalyticsService {
  constructor(private engine: ScenarioEngine) {}

  public getMetrics(): AnalyticsMetrics {
    const events = this.engine.getActiveEvents();
    const incidents = this.engine.getIncidents();
    const state = this.engine.getState();

    // In demo / baseline scenario, show meaningful simulated comparative numbers
    const rawAlertsCount = events.length > 0 ? events.length * 4 : 20;
    const correlatedSituationsCount = incidents.length > 0 ? incidents.length : 3;
    const compressionRatio = `${(rawAlertsCount / Math.max(1, correlatedSituationsCount)).toFixed(1)}:1`;

    // Dynamic latency from simulation clock
    const detectionLatency = events.length > 0 
      ? Math.max(2, Math.min(12, Math.round(events[events.length - 1].relativeTime / Math.max(1, incidents.length))))
      : 4.2;

    const acknowledgmentLatency = incidents.some(i => i.status === 'acknowledged' || i.status === 'resolved')
      ? 12.4
      : 18.0;

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
    } else {
      // Nominal default curve
      confidenceEvolution.push(
        { relativeTime: 0, timeLabel: '00:00', confidence: 0, eventName: 'System Nominal' },
        { relativeTime: 4, timeLabel: '00:04', confidence: 61, eventName: 'Thermal Anomaly' },
        { relativeTime: 9, timeLabel: '00:09', confidence: 74, eventName: 'Dispatch Smoke Report' },
        { relativeTime: 16, timeLabel: '00:16', confidence: 86, eventName: 'Manual Pull Station' }
      );
    }

    // Source distribution
    const sourceTypes = ['sensor', 'alarm_panel', 'access_control', 'operator_report', 'vision_optical'];
    const typeCounts: Record<string, number> = {
      sensor: 8,
      alarm_panel: 3,
      access_control: 5,
      operator_report: 2,
      vision_optical: 6
    };

    events.forEach(e => {
      typeCounts[e.sourceType] = (typeCounts[e.sourceType] || 0) + 1;
    });

    const totalSourcesCount = Object.values(typeCounts).reduce((a, b) => a + b, 0);
    const sourceDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      sourceType: type.replace('_', ' ').toUpperCase(),
      count,
      percentage: Math.round((count / totalSourcesCount) * 100)
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

    return {
      rawAlertsCount,
      correlatedSituationsCount,
      compressionRatio,
      incidentDetectionLatencySeconds: detectionLatency,
      operatorAcknowledgmentLatencySeconds: acknowledgmentLatency,
      evidenceCompletenessPercent: incidents.length > 0 ? 86 : 94,
      sourceAgreementPercent: 92,
      falseAlarmFilteredCount: 14,
      confidenceEvolution,
      sourceDistribution,
      zoneActivity
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
        activeSources: 3 + zoneEvents.length,
        recentEventsCount: zoneEvents.length,
        occupancyState: activeInc?.severity === 'critical' ? 'cleared' : 'moderate',
        lastUpdate: state.currentSimulatedClock,
        coordinates: z.coordinates
      };
    });
  }
}

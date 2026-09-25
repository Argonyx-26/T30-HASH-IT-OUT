import React from 'react';
import { Incident } from '../types';
import { CheckCircle, HelpCircle, Radio, ShieldCheck } from 'lucide-react';

interface EvidencePanelProps {
  incident: Incident | null;
  className?: string;
}

const categoryLabels: Record<Incident['category'], string> = {
  fire_hazard: 'possible fire hazard',
  security_breach: 'security breach',
  crowd_safety: 'crowd safety issue',
  equipment_failure: 'equipment failure',
  false_alarm: 'uncorroborated anomaly'
};

const eventLabels: Record<Incident['events'][number]['eventType'], string> = {
  thermal_anomaly: 'unusual heat',
  smoke_report: 'smoke report',
  manual_alarm: 'manual alarm',
  access_violation: 'unauthorized access',
  crowd_anomaly: 'unusual crowd activity',
  equipment_overheat: 'equipment overheating',
  dust_spike: 'dust spike',
  perimeter_motion: 'perimeter movement'
};

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ incident, className = '' }) => {
  if (!incident) {
    return (
      <div className={`p-4 rounded-xl bg-sentinel-card border border-sentinel-border text-center text-slate-500 font-mono text-xs ${className}`}>
        No incident explanation available.
      </div>
    );
  }

  const relevantEvents = [...incident.events]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  const getSensorLabel = (source: string): string => source.toUpperCase();

  const getShortEvidence = (event: Incident['events'][number]): string => event.evidence;

  const sensorNames = relevantEvents.map(event => getSensorLabel(event.source));
  const responseSummary = incident.recommendations.slice(0, 3).map(r => r.action);

  return (
    <div className={`w-full max-w-xl rounded-xl border border-slate-700 bg-[#071a2a] p-0 text-slate-100 shadow-2xl ${className}`}>
      <div className="border-b border-slate-700 px-4 py-3 text-center">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-slate-300">SENTINEL</div>
      </div>

      <div className="px-4 py-4">
        <div className="mb-4 text-center font-mono text-[15px] font-bold uppercase tracking-wide text-slate-100">
          {incident.title.toUpperCase()}
        </div>

        <div className="space-y-1 pb-3 text-sm font-mono text-slate-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-300">Severity</span>
            <span className="font-bold text-slate-100">{incident.severity.toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-300">Confidence</span>
            <span className="font-bold text-cyan-300">{(incident.confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-300">Location</span>
            <span className="font-bold text-slate-100">{incident.zone}</span>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-700 pt-4">
          <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
            CORRELATED SENSOR EVIDENCE
          </div>

          <div className="space-y-3">
            {relevantEvents.map(event => (
              <div key={event.id} className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[12px] font-bold uppercase text-slate-100">
                  <span className="text-emerald-400">✓</span>
                  <span>{getSensorLabel(event.source)}</span>
                </div>
                <div className="pl-5 text-sm text-slate-300">{getShortEvidence(event)}</div>
                <div className="pl-5 font-mono text-[11px] text-cyan-300">Confidence: {Math.round(event.confidence * 100)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-slate-700 pt-4">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
            CORRELATION ANALYSIS
          </div>
          <div className="text-sm leading-relaxed text-slate-200">
            {relevantEvents.length} independent sensor signals support the same event.
          </div>
          <div className="mt-2 text-sm leading-relaxed text-slate-200">
            {sensorNames.join(' + ')}
          </div>
          <div className="mt-1 text-center text-xs text-slate-400">↓</div>
          <div className="text-center font-mono text-[12px] font-bold uppercase tracking-wide text-slate-100">
            {incident.title.toUpperCase()}
          </div>
        </div>

        <div className="mt-4 border-t border-slate-700 pt-4">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-violet-300">
            RECOMMENDED RESPONSE
          </div>
          <ul className="space-y-2 text-sm text-slate-200">
            {responseSummary.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 text-cyan-300">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

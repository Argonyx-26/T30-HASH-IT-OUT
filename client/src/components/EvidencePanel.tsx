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

  const categoryLabel = categoryLabels[incident.category];
  const sourceTypeCount = new Set(incident.events.map(event => event.sourceType)).size;
  const hasIndependentConfirmation = sourceTypeCount >= 2;
  const evidenceItems = [...incident.evidenceSummary.confirmed, ...incident.evidenceSummary.supporting];
  const evidenceByEventId = new Map(evidenceItems.map(item => [item.id.replace(/^ev-/, ''), item]));

  return (
    <div className={`p-5 rounded-xl bg-sentinel-card border border-sentinel-border space-y-5 ${className}`}>
      <div className="flex items-center gap-2 pb-3 border-b border-sentinel-border">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
          How Sentinel Identified This Incident
        </h3>
      </div>

      <div className="rounded-lg border border-cyan-800/50 bg-cyan-950/20 p-3">
        <p className="text-sm leading-relaxed text-slate-200">
          Sentinel predicted a <strong className="text-cyan-300">possible {categoryLabel}</strong> in <strong className="text-slate-100">{incident.zone}</strong> using {incident.events.length} recorded sensor signal{incident.events.length === 1 ? '' : 's'}.
          {' '}
          {hasIndependentConfirmation
            ? `${sourceTypeCount} different sensor types reported related activity, so the prediction is supported by multiple sources.`
            : 'It is still provisional because only one sensor type has reported it so far.'}
        </p>
      </div>

      <section className="space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wide text-slate-300">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sensor data used</span>
        </div>
        <div className="space-y-2">
          {incident.events.map(event => (
            <div key={event.id} className="rounded-lg bg-sentinel-surface border border-sentinel-border p-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-200">
                  {event.source} detected {eventLabels[event.eventType]}
                </span>
                <span className="shrink-0 text-xs font-mono text-cyan-300">
                  {Math.round(event.confidence * 100)}% confidence
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {event.evidence}
              </p>
              <p className="mt-1 text-xs font-mono text-emerald-300">
                Added {evidenceByEventId.get(event.id)?.confidenceContribution ?? Math.round(event.confidence * 20)}% to the incident assessment
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 border-t border-sentinel-border/60 pt-4">
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wide text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>What these signals mean together</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{incident.summary}</p>
        <p className="text-sm leading-relaxed text-slate-300">
          Combined incident confidence is <strong className="text-cyan-300">{(incident.confidence * 100).toFixed(0)}%</strong>, so Sentinel is currently treating this as a <strong className="text-cyan-300">{categoryLabel}</strong>, not a confirmed final fact.
        </p>
      </section>

      <section className="space-y-2 border-t border-sentinel-border/60 pt-4">
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wide text-purple-300">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Still needed before confirmation</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{incident.explanation.whatIsUncertain}</p>
        <p className="text-xs leading-relaxed text-slate-400">
          The assessment would change with: {incident.explanation.whatWouldChangeAssessment}
        </p>
      </section>
    </div>
  );
};

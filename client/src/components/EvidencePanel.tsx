import React, { useState } from 'react';
import { Incident, EvidenceItem, UnknownItem } from '../types';
import { ShieldCheck, HelpCircle, CheckCircle, Info, X, Radio } from 'lucide-react';

interface EvidencePanelProps {
  incident: Incident | null;
  className?: string;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ incident, className = '' }) => {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  if (!incident) {
    return (
      <div className={`p-4 rounded-xl bg-sentinel-card border border-sentinel-border text-center text-slate-500 font-mono text-xs ${className}`}>
        No evidence active.
      </div>
    );
  }

  const { confirmed, supporting, unknown } = incident.evidenceSummary;

  return (
    <div className={`p-4 rounded-xl bg-sentinel-card border border-sentinel-border space-y-4 ${className}`}>

      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Correlated Evidence Dossier
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {confirmed.length + supporting.length} Signals Validated
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
        <div className="p-2 rounded bg-sentinel-surface border border-sentinel-border">
          <span className="text-slate-500 block">RELATED SOURCES</span>
          <strong className="text-slate-100 text-sm">{incident.metrics?.relatedSourceCount ?? incident.events.length}</strong>
        </div>
        <div className="p-2 rounded bg-sentinel-surface border border-sentinel-border">
          <span className="text-slate-500 block">SOURCE AGREEMENT</span>
          <strong className="text-cyan-400 text-sm">{incident.metrics?.sourceAgreementPercent ?? 0}%</strong>
        </div>
        <div className="p-2 rounded bg-sentinel-surface border border-sentinel-border">
          <span className="text-slate-500 block">SMOKE SIGNAL</span>
          <strong className="text-amber-400 text-sm">{incident.metrics?.smokePercentage ?? 0}%</strong>
        </div>
        <div className="p-2 rounded bg-sentinel-surface border border-sentinel-border">
          <span className="text-slate-500 block">EVIDENCE COMPLETE</span>
          <strong className="text-emerald-400 text-sm">{incident.metrics?.evidenceCompletenessPercent ?? 0}%</strong>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
        {(incident.metrics?.sourceTypes || []).map(sourceType => (
          <span key={sourceType} className="px-2 py-1 rounded border border-sentinel-border bg-sentinel-bg">
            {sourceType.replace('_', ' ').toUpperCase()}
          </span>
        ))}
      </div>

      {/* 1. Confirmed Evidence */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wide">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Confirmed Signals ({confirmed.length})</span>
        </div>
        {confirmed.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedEvidence(item)}
            className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/40 hover:border-emerald-500/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs font-medium text-slate-200">{item.label}</p>
                <p className="text-[10px] font-mono text-slate-400 truncate max-w-[220px]">{item.details}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              +{item.confidenceContribution}% CONF
            </span>
          </div>
        ))}
      </div>

      {/* 2. Supporting Evidence */}
      <div className="space-y-1.5 pt-2 border-t border-sentinel-border/50">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wide">
          <Radio className="w-3.5 h-3.5" />
          <span>Supporting Signals ({supporting.length})</span>
        </div>
        {supporting.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedEvidence(item)}
            className="flex items-center justify-between p-2 rounded-lg bg-sentinel-surface border border-sentinel-border hover:border-sentinel-accent/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <div>
                <p className="text-xs font-medium text-slate-200">{item.label}</p>
                <p className="text-[10px] font-mono text-slate-400 truncate max-w-[220px]">{item.details}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              +{item.confidenceContribution}%
            </span>
          </div>
        ))}
      </div>

      {/* 3. Unknown / Pending Verification */}
      <div className="space-y-1.5 pt-2 border-t border-sentinel-border/50">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wide">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Unknown / Pending Verification ({unknown.length})</span>
        </div>
        {unknown.map((item) => (
          <div
            key={item.id}
            className="p-2 rounded-lg bg-purple-950/10 border border-purple-800/30 text-xs"
          >
            <div className="flex items-center gap-1.5 text-purple-300 font-medium">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans pl-5">{item.details}</p>
          </div>
        ))}
      </div>

      {/* Modal / Popover on Evidence Click */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-sentinel-card border border-sentinel-border rounded-xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sentinel-accent" />
                <h4 className="font-mono text-xs font-bold text-slate-100 uppercase">
                  Evidence Telemetry Inspector
                </h4>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2 rounded bg-sentinel-bg">
                <span className="text-slate-400">Sensor Source:</span>
                <span className="text-slate-200 font-bold">{selectedEvidence.source}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-sentinel-bg">
                <span className="text-slate-400">Simulated Time:</span>
                <span className="text-sentinel-accent">{selectedEvidence.timestamp}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-sentinel-bg">
                <span className="text-slate-400">Confidence Contribution:</span>
                <span className="text-emerald-400 font-bold">+{selectedEvidence.confidenceContribution}%</span>
              </div>
              <div className="p-2.5 rounded bg-sentinel-bg">
                <span className="text-slate-400 block mb-1">Raw Evidence Description:</span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">{selectedEvidence.details}</p>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-1.5 rounded-lg bg-sentinel-hover hover:bg-slate-700 text-xs font-mono text-slate-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

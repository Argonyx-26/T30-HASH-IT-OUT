import React from 'react';
import { Incident } from '../types';
import { 
  HelpCircle, 
  X, 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  FileQuestion, 
  RefreshCw, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';

interface ExplainabilityDrawerProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainabilityDrawer: React.FC<ExplainabilityDrawerProps> = ({ incident, isOpen, onClose }) => {
  if (!isOpen || !incident) return null;

  const exp = incident.explanation;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-sentinel-card border-l border-sentinel-border h-full flex flex-col shadow-2xl overflow-y-auto animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-sentinel-border flex items-center justify-between sticky top-0 bg-sentinel-card/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sentinel-accent/10 border border-sentinel-accent/30 flex items-center justify-center text-sentinel-accent">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100">
                Explainability Dossier
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                {incident.id} • {incident.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-sentinel-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 flex-1">
          
          {/* Banner: Explainability Principle */}
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sentinel-accent shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono uppercase text-sentinel-accent">Algorithmic Transparency:</strong> Sentinel explains every inference step. No black-box decisions; all evidence ties directly back to physical telemetry.
            </div>
          </div>

          {/* 1. Why Created */}
          <div className="p-4 rounded-lg bg-sentinel-surface border border-sentinel-border">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Why Was This Incident Created?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {exp.whyCreated}
            </p>
            <div className="mt-2.5 text-[11px] font-mono text-slate-400 bg-sentinel-bg p-2 rounded border border-sentinel-border/40">
              Trigger: Spatio-temporal coincidence of multi-modal signals within a 60-second window in {incident.zone}.
            </div>
          </div>

          {/* 2. Why Prioritized */}
          <div className="p-4 rounded-lg bg-sentinel-surface border border-sentinel-border">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Why Is It Prioritized as {incident.severity.toUpperCase()}?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {exp.whyPrioritized}
            </p>
            <div className="mt-2.5 text-[11px] font-mono text-slate-400 bg-sentinel-bg p-2 rounded border border-sentinel-border/40">
              Rule: Life safety sensors (manual pull stations & thermal anomalies) automatically bypass triage queue to Critical tier.
            </div>
          </div>

          {/* 3. Why Confidence Changed */}
          <div className="p-4 rounded-lg bg-sentinel-surface border border-sentinel-border">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Why Did Confidence Change?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {exp.whyConfidenceChanged}
            </p>
            <div className="mt-2.5 text-[11px] font-mono text-slate-400 bg-sentinel-bg p-2 rounded border border-sentinel-border/40">
              Current Evidence Score: <span className="text-sentinel-accent font-bold">{(incident.confidence * 100).toFixed(0)}%</span> across {incident.events.length} independent data streams.
            </div>
          </div>

          {/* 4. What Is Uncertain */}
          <div className="p-4 rounded-lg bg-sentinel-surface border border-sentinel-border">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
              <FileQuestion className="w-4 h-4 text-purple-400" />
              <span>What Is Still Uncertain?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {exp.whatIsUncertain}
            </p>
            <ul className="mt-2 space-y-1">
              {incident.evidenceSummary.unknown.map(u => (
                <li key={u.id} className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  {u.label}: {u.details}
                </li>
              ))}
            </ul>
          </div>

          {/* 5. What Would Change The Assessment */}
          <div className="p-4 rounded-lg bg-sentinel-surface border border-sentinel-border">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-2">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>What Would Change This Assessment?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {exp.whatWouldChangeAssessment}
            </p>
            <div className="mt-2.5 text-[11px] font-mono text-slate-400 bg-sentinel-bg p-2 rounded border border-sentinel-border/40">
              Contradictory Condition: Physical verification reporting zero hazard immediately reclassifies case as False Alarm.
            </div>
          </div>

          {/* 6. Multi-Agent Contribution Audit */}
          {exp.agentContributions && exp.agentContributions.length > 0 && (
            <div className="p-4 rounded-lg bg-sentinel-surface border border-sentinel-border">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-3">
                <Cpu className="w-4 h-4 text-sentinel-accent" />
                <span>Agent Inference Trail</span>
              </div>
              <div className="space-y-2">
                {exp.agentContributions.map((agent, i) => (
                  <div key={i} className="text-xs p-2 rounded bg-sentinel-bg border border-sentinel-border/40">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="font-bold text-sentinel-accent">{agent.agentName}</span>
                      <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-300">{agent.role}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 font-sans">{agent.inference}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sentinel-border bg-sentinel-surface/50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sentinel-hover hover:bg-slate-700 text-slate-200 font-mono text-xs uppercase"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Incident } from '../types';
import { HelpCircle, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

interface ConfidenceMeterProps {
  incident?: Incident | null;
  className?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ incident, className = '' }) => {
  const confidence = incident?.confidence ? Math.round(incident.confidence * 100) : 0;
  const severity = incident?.severity || 'watch';
  const trajectory = incident?.confidenceTrajectory || [];

  return (
    <div className={`p-4 rounded-xl bg-sentinel-surface border border-sentinel-border ${className}`}>
      
      {/* Header: Severity vs Confidence Distinction */}
      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-sentinel-border">
        {/* Severity Metric */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 group relative">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="font-semibold uppercase tracking-wider">Severity</span>
            <div className="relative group/tooltip cursor-help">
              <HelpCircle className="w-3 h-3 text-slate-500 hover:text-slate-300" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/tooltip:block w-48 p-2 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-300 shadow-xl z-30 font-sans pointer-events-none">
                <strong>Severity:</strong> How serious the situation could be if verified.
              </div>
            </div>
          </div>
          <div className="mt-1 font-mono text-base font-bold text-red-400 uppercase tracking-wide">
            {severity.toUpperCase()}
          </div>
        </div>

        {/* Confidence Metric */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 group relative">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold uppercase tracking-wider">Evidence Confidence</span>
            <div className="relative group/tooltip cursor-help">
              <HelpCircle className="w-3 h-3 text-slate-500 hover:text-slate-300" />
              <div className="absolute bottom-full right-0 mb-1 hidden group-hover/tooltip:block w-52 p-2 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-300 shadow-xl z-30 font-sans pointer-events-none">
                <strong>Evidence Confidence:</strong> How strongly the available independent sensor evidence supports this interpretation.
              </div>
            </div>
          </div>
          <div className="mt-1 font-mono text-base font-bold text-sentinel-accent tracking-wide flex items-center gap-2">
            <span>{confidence}%</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Dynamic Animated Meter Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>Uncorroborated (0%)</span>
          <span>Moderate (50%)</span>
          <span>Strong Convergence (100%)</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-700 shadow-sm shadow-cyan-400/50"
            style={{ width: `${Math.min(100, Math.max(5, confidence))}%` }}
          />
        </div>
      </div>

      {/* Dynamic Confidence Trajectory Progression */}
      {trajectory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-sentinel-border/50">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Evidence Convergence Evolution:
          </span>
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
            {trajectory.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center bg-sentinel-bg px-2 py-1 rounded border border-sentinel-border/60 text-center min-w-[55px]">
                  <span className="text-[9px] font-mono text-slate-500">{step.timestamp}</span>
                  <span className="font-mono text-xs font-bold text-sentinel-accent">
                    {Math.round(step.confidence * 100)}%
                  </span>
                </div>
                {idx < trajectory.length - 1 && (
                  <span className="text-slate-600 font-mono text-[11px]">&rarr;</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-sans italic">
            Confidence elevated dynamically because independent sensing modalities converged within the same spatial zone.
          </p>
        </div>
      )}
    </div>
  );
};

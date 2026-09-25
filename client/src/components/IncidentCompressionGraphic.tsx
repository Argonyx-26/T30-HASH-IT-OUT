import React, { useState } from 'react';
import { ArrowDown, BellOff, Layers, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

export const IncidentCompressionGraphic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'funnel'>('funnel');

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sentinel-border">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Demo Scenario Metric
          </span>
          <h3 className="text-lg font-mono font-bold text-slate-100 mt-1">
            Incident Compression & Fatigue Reduction
          </h3>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-sentinel-surface rounded-lg border border-sentinel-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'funnel' ? 'bg-sentinel-accent text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Alert Funnel
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'comparison' ? 'bg-sentinel-accent text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Traditional vs Sentinel
          </button>
        </div>
      </div>

      {/* Funnel View */}
      {activeTab === 'funnel' && (
        <div className="mt-8 space-y-4">
          {/* Level 1: Raw Signals */}
          <div className="p-4 rounded-xl bg-sentinel-surface border border-sentinel-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-lg">
                20
              </div>
              <div>
                <h4 className="font-mono text-sm font-bold text-slate-200 uppercase">
                  Raw Disconnected Signals
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Thermal spikes, door contacts, smoke particles, dispatch calls, optical flow deviations.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
              Noise & Fragmentation
            </span>
          </div>

          <div className="flex justify-center text-sentinel-accent animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Level 2: Event Clusters */}
          <div className="p-4 rounded-xl bg-sentinel-surface border border-sentinel-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
                3
              </div>
              <div>
                <h4 className="font-mono text-sm font-bold text-slate-200 uppercase">
                  Spatio-Temporal Event Clusters
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Grouping telemetry sharing geographic and timestamp proximity across campus zones.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              85% Noise Reduced
            </span>
          </div>

          <div className="flex justify-center text-sentinel-accent animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Level 3: Actionable Situations */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-2 border-sentinel-accent/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-cyan-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sentinel-accent/20 border border-sentinel-accent/60 flex items-center justify-center text-sentinel-accent font-mono font-bold text-xl">
                1
              </div>
              <div>
                <h4 className="font-mono text-sm font-bold text-slate-100 uppercase">
                  Actionable Operational Situation
                </h4>
                <p className="text-xs text-slate-300 font-sans">
                  Correlated incident dossier with confidence trajectory, evidence chain, and verified next steps.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              20 &rarr; 1 Cohesive Case
            </span>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {activeTab === 'comparison' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="p-5 rounded-xl bg-red-950/10 border border-red-500/30 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-red-500/20">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              <h4 className="font-mono text-sm font-bold text-red-300 uppercase">
                Traditional System
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-red-400">&bull;</span>
                <span><strong>20 independent alerts</strong> flooding the console simultaneously</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">&bull;</span>
                <span>Responders forced to manually cross-reference CCTV, access logs, and radio calls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">&bull;</span>
                <span>High alarm fatigue leading to delayed response or ignored emergencies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">&bull;</span>
                <span>No explanation of why an alarm fired or what evidence supports it</span>
              </li>
            </ul>
          </div>

          {/* Sentinel */}
          <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-cyan-500/30">
              <CheckCircle2 className="w-5 h-5 text-sentinel-accent" />
              <h4 className="font-mono text-sm font-bold text-sentinel-accent uppercase">
                With Sentinel
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-sentinel-accent">&bull;</span>
                <span><strong>1 prioritized incident file</strong> linking all 20 data points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sentinel-accent">&bull;</span>
                <span>Clear evidence separation: Confirmed, Supporting, and Unknown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sentinel-accent">&bull;</span>
                <span>Dynamic confidence score showing evidence convergence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sentinel-accent">&bull;</span>
                <span>Actionable SOP checklist requiring human operator authorization</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 pt-3 border-t border-sentinel-border/50 text-center">
        <p className="text-[11px] font-mono text-slate-500">
          * Compression ratios are calculated dynamically from simulation scenarios. Not a calibrated field measurement claim.
        </p>
      </div>

    </div>
  );
};

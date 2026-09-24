import React, { useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  PieChart,
  CheckCircle2,
  Radio
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { metrics, refreshMetrics } = useSimulation();

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  const evolution = metrics?.confidenceEvolution || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sentinel-border">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sentinel-accent" />
            <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-100">
              OPERATIONAL INTELLIGENCE & EVALUATION
            </h1>
          </div>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Real-time Evaluation Metrics Derived from Active Simulation Telemetry
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full uppercase">
          LIVE INCIDENT METRICS
        </span>
      </div>

      {/* 1. Main Visual: Alert Compression (Without vs With Sentinel) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sentinel-card via-slate-900 to-sentinel-card border border-sentinel-border shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
              Core Value Metric
            </span>
            <h3 className="text-lg font-mono font-bold text-slate-100 mt-0.5">
              Signal-to-Situation Alert Compression
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800">
            {metrics?.compressionRatio || '6.7:1'} Compression Ratio
          </span>
        </div>

        {/* Big Comparative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

          {/* Traditional */}
          <div className="p-6 rounded-xl bg-red-950/15 border-2 border-red-500/30 space-y-3">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
              Without Sentinel (Traditional Console)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-red-400">
                {metrics?.rawAlertsCount ?? 0}
              </span>
              <span className="text-xs font-mono text-slate-400">Independent Alarms</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Responders inundated with unsorted alarms: multiple smoke alerts, door sensor triggers, and dispatcher calls with zero correlation context.
            </p>
          </div>

          {/* Sentinel */}
          <div className="p-6 rounded-xl bg-cyan-950/20 border-2 border-sentinel-accent/50 space-y-3 shadow-lg shadow-cyan-500/10">
            <span className="text-xs font-mono font-bold text-sentinel-accent uppercase tracking-wider block">
              With Sentinel (Situational Mesh)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-sentinel-accent">
                {metrics?.correlatedSituationsCount ?? 0}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Actionable Situations</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Collapsed into explainable cases with unified confidence trajectory, cross-modal evidence validation, and verified human action SOPs.
            </p>
          </div>

        </div>
      </div>

      {/* 2. Key Performance Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <div className="p-4 rounded-xl bg-sentinel-card border border-sentinel-border">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Detection Latency</span>
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-slate-100">
            {metrics?.incidentDetectionLatencySeconds ?? 0}s
          </div>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
            Sub-5s correlation threshold
          </span>
        </div>

        <div className="p-4 rounded-xl bg-sentinel-card border border-sentinel-border">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Operator Ack Latency</span>
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-slate-100">
            {metrics?.operatorAcknowledgmentLatencySeconds ?? 0}s
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            Rapid situational intake
          </span>
        </div>

        <div className="p-4 rounded-xl bg-sentinel-card border border-sentinel-border">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Evidence Completeness</span>
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-slate-100">
            {metrics?.evidenceCompletenessPercent ?? 0}%
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            Cross-modal source density
          </span>
        </div>

        <div className="p-4 rounded-xl bg-sentinel-card border border-sentinel-border">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>False Alarms Filtered</span>
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-slate-100">
            {metrics?.falseAlarmFilteredCount ?? 0}
          </div>
          <span className="text-[10px] font-mono text-amber-400 mt-1 block">
            Isolated sensors deprioritized
          </span>
        </div>

      </div>

      <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">Incident Source Coverage</h3>
            <p className="text-xs text-slate-400 mt-1">Every row is derived from the sources stored against that incident.</p>
          </div>
          <Radio className="w-4 h-4 text-sentinel-accent" />
        </div>
        {(metrics?.incidentBreakdown || []).length === 0 ? (
          <p className="text-xs font-mono text-slate-500 py-4">No stored incidents yet.</p>
        ) : (
          <div className="space-y-2">
            {metrics?.incidentBreakdown.map(incident => (
              <div key={incident.incidentId} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center p-3 rounded-lg bg-sentinel-surface border border-sentinel-border text-xs font-mono">
                <span className="sm:col-span-2 text-slate-200 font-bold">{incident.title}</span>
                <span className="text-cyan-400">{incident.sourceCount} sources</span>
                <span className="text-emerald-400">{incident.confidence}% confidence</span>
                <span className="text-amber-400">Smoke {incident.smokePercentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Section 34: Dynamic Confidence Analytics Chart */}
      <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-sentinel-border">
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              Evidence Confidence Evolution Over Incident Lifetime
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Dynamically derived from real-time simulation cross-modal evidence convergence.
            </p>
          </div>
          <span className="text-[11px] font-mono text-sentinel-accent">
            CALCULATED FROM ACTIVE INCIDENT LOG
          </span>
        </div>

        {/* SVG Dynamic Line Chart */}
        <div className="relative w-full aspect-[16/6] bg-sentinel-bg rounded-xl border border-sentinel-border p-4 grid-bg">
          <svg viewBox="0 0 700 240" className="w-full h-full">
            {/* Grid lines */}
            <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
              <line x1="50" y1="40" x2="680" y2="40" />
              <line x1="50" y1="90" x2="680" y2="90" />
              <line x1="50" y1="140" x2="680" y2="140" />
              <line x1="50" y1="190" x2="680" y2="190" />
            </g>

            {/* Y Axis Labels */}
            <text x="35" y="45" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">100%</text>
            <text x="35" y="95" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">75%</text>
            <text x="35" y="145" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">50%</text>
            <text x="35" y="195" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">25%</text>

            {/* Render Line & Dots from Dynamic Simulation Evolution */}
            {evolution.length > 1 && (
              <>
                {/* Area fill */}
                <path
                  d={`M 60 190 ${evolution.map((pt, i) => {
                    const x = 60 + (i * (580 / Math.max(1, evolution.length - 1)));
                    const y = 190 - (pt.confidence * 1.5);
                    return `L ${x} ${y}`;
                  }).join(' ')} L ${60 + 580} 190 Z`}
                  fill="url(#conf-area-grad)"
                  opacity="0.3"
                />

                <defs>
                  <linearGradient id="conf-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Line */}
                <path
                  d={`M ${evolution.map((pt, i) => {
                    const x = 60 + (i * (580 / Math.max(1, evolution.length - 1)));
                    const y = 190 - (pt.confidence * 1.5);
                    return `${i === 0 ? '' : 'L '}${x} ${y}`;
                  }).join(' ')}`}
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="3"
                />

                {/* Points & Labels */}
                {evolution.map((pt, i) => {
                  const x = 60 + (i * (580 / Math.max(1, evolution.length - 1)));
                  const y = 190 - (pt.confidence * 1.5);

                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#0a0d13" stroke="#00d2ff" strokeWidth="2.5" />
                      <text x={x} y={y - 12} textAnchor="middle" fill="#f1f5f9" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                        {pt.confidence}%
                      </text>
                      <text x={x} y={215} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono, monospace">
                        {pt.timeLabel}
                      </text>
                      <text x={x} y={228} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif">
                        {pt.eventName}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* 4. Source Modality Distribution & Zone Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Source Distribution */}
        <div className="p-5 rounded-2xl bg-sentinel-card border border-sentinel-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              Sensor Modality Ingestion Share
            </h3>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-3">
            {metrics?.sourceDistribution.map((src) => (
              <div key={src.sourceType} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{src.sourceType}</span>
                  <span className="text-sentinel-accent font-bold">{src.count} events ({src.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${src.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Zone Status Overview */}
        <div className="p-5 rounded-2xl bg-sentinel-card border border-sentinel-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              Campus Zone Operational Posture
            </h3>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-2">
            {metrics?.zoneActivity.map((zone) => (
              <div key={zone.zone} className="p-2.5 rounded-lg bg-sentinel-surface border border-sentinel-border flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-200 font-bold">{zone.zone}</span>
                  <span className="text-[10px] text-slate-500 block">
                    {zone.alertCount} Signals &bull; {zone.incidentCount} Incidents
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${zone.status === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                  zone.status === 'elevated' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                  {zone.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

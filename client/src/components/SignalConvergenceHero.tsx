import React, { useState, useEffect } from 'react';
import { Flame, Radio, Bell, KeyRound, Users, Sparkles, ArrowRight, Cpu } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const SignalConvergenceHero: React.FC = () => {
  const [step, setStep] = useState(0);
  const { events, state } = useSimulation();

  // Auto-advance loop through stages for visual storytelling
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const signals = [
    { eventType: 'thermal_anomaly', label: 'Thermal Anomaly', icon: Flame, color: 'text-amber-400', border: 'border-amber-500/40', source: 'TH-04 Sensor' },
    { eventType: 'smoke_report', label: 'Smoke Report', icon: Radio, color: 'text-cyan-400', border: 'border-cyan-500/40', source: 'Campus Dispatch' },
    { eventType: 'manual_alarm', label: 'Manual Alarm', icon: Bell, color: 'text-red-400', border: 'border-red-500/40', source: 'Pull Station MP-02' },
    { eventType: 'access_violation', label: 'Access Event', icon: KeyRound, color: 'text-purple-400', border: 'border-purple-500/40', source: 'Door CR-08' },
    { eventType: 'crowd_anomaly', label: 'Crowd Movement', icon: Users, color: 'text-emerald-400', border: 'border-emerald-500/40', source: 'Optical Cam C-03' },
  ];
  const hasLiveSignals = events.length > 0;
  const liveStep = hasLiveSignals ? Math.min(3, Math.max(0, events.length - 1)) : step;

  return (
    <div className="relative w-full max-w-5xl mx-auto p-6 lg:p-8 rounded-2xl bg-gradient-to-b from-sentinel-card via-sentinel-surface/80 to-sentinel-card border border-sentinel-border shadow-2xl overflow-hidden">

      {/* Background Grid & Ambient Glow */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sentinel-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Label */}
      <div className="flex items-center justify-between pb-4 border-b border-sentinel-border/60 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sentinel-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold">
            {hasLiveSignals ? 'Live Sensor Stream • Alert-to-Situation Convergence' : 'Ready for Scenario Replay • Alert-to-Situation Convergence'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
          {hasLiveSignals ? `LIVE • ${state.currentSimulatedClock}` : `STAGE ${liveStep + 1} OF 4`}
        </span>
      </div>

      {/* The 3-Stage Transformation Layout */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-11 gap-4 items-center relative z-10">

        {/* Left: Scattered Signals (4 Cols) */}
        <div className="md:col-span-4 space-y-2.5">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Scattered Physical Signals
          </div>

          {signals.map((sig, i) => {
            const Icon = sig.icon;
            const event = events.find(item => item.eventType === sig.eventType);
            const isFired = hasLiveSignals ? Boolean(event) : liveStep >= 1 || i <= liveStep + 1;

            return (
              <div
                key={sig.label}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all duration-500 ${isFired
                  ? `bg-sentinel-bg ${sig.border} shadow-md translate-x-2`
                  : 'bg-sentinel-bg/40 border-sentinel-border/30 opacity-50'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${sig.color}`} />
                  <span className="text-slate-200 font-semibold">{sig.label}</span>
                </div>
                <span className="text-[10px] text-slate-500">{event ? `${event.source} • ${(event.confidence * 100).toFixed(0)}%` : sig.source}</span>
              </div>
            );
          })}
        </div>

        {/* Center: Sentinel Correlation Engine (3 Cols) */}
        <div className="md:col-span-3 flex flex-col items-center justify-center my-4 md:my-0">
          <div className="relative group">
            {/* Glowing Rings */}
            <div className="absolute -inset-4 bg-gradient-to-r from-sentinel-accent to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 animate-pulse" />

            <div className="relative w-28 h-28 rounded-full bg-slate-900 border-2 border-sentinel-accent/60 flex flex-col items-center justify-center text-center p-2 shadow-2xl">
              <Cpu className="w-7 h-7 text-sentinel-accent animate-pulse mb-1" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-100">
                SENTINEL
              </span>
              <span className="font-mono text-[8px] text-cyan-400 uppercase">
                Correlation Engine
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-slate-400">
            <ArrowRight className="w-3.5 h-3.5 text-sentinel-accent animate-bounce" />
            <span>Spatio-Temporal Fusion</span>
          </div>
        </div>

      </div>

      {/* Bottom Step Indicator Bar */}
      <div className="mt-6 pt-4 border-t border-sentinel-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-slate-400">
          {hasLiveSignals ? `${events.length} live signals received • ${state.scenarioName}` : 'Start a scenario to replace this preview with live telemetry.'}
        </span>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => !hasLiveSignals && setStep(s)}
              className={`h-2 rounded-full transition-all ${!hasLiveSignals ? 'cursor-pointer' : 'cursor-default'} ${liveStep === s ? 'w-8 bg-sentinel-accent' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { CampusMap } from '../components/CampusMap';
import { EventTimeline } from '../components/EventTimeline';
import {
  RotateCcw,
  Radio,
  Flame,
  ShieldAlert,
  Users,
  Sparkles,
  Cpu,
  Database
} from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const {
    state,
    scenarios,
    events,
    startScenario,
    resetSimulation
  } = useSimulation();

  const progressPercent = Math.min(100, Math.round((state.elapsedSeconds / Math.max(1, state.totalDuration)) * 100));
  const remainingSeconds = Math.max(0, Math.round(state.totalDuration - state.elapsedSeconds));
  const remainingClock = `${Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:${(remainingSeconds % 60).toString().padStart(2, '0')}`;

  const getScenarioIcon = (category: string) => {
    switch (category) {
      case 'fire_hazard': return Flame;
      case 'security_breach': return ShieldAlert;
      case 'crowd_safety': return Users;
      case 'equipment_failure': return Cpu;
      default: return Sparkles;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sentinel-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-100">
              DATA COLLECTION LIBRARY
            </h1>
          </div>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Select a recorded packet to load its signal context into the live command board.
          </p>
        </div>

        <span className="text-[10px] font-mono uppercase text-slate-500">Signal archive</span>
      </div>

      {/* Replay Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Active Scenario Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sentinel-surface border border-sentinel-border flex items-center justify-center text-sentinel-accent">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Active Scenario:
              </span>
              <h3 className="font-mono text-sm font-bold text-slate-100">
                {state.scenarioName}
              </h3>
            </div>
          </div>

          {/* Scenario session controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetSimulation}
              className="p-2 rounded-lg bg-sentinel-surface hover:bg-sentinel-hover border border-sentinel-border text-slate-300 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

          {/* Clock Timings */}
          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="p-2 rounded-lg bg-sentinel-bg border border-sentinel-border/50 text-right">
              <span className="text-[10px] text-slate-500 block">ELAPSED SIM TIME</span>
              <span className="text-sentinel-accent font-bold text-sm tracking-wider">{state.currentSimulatedClock}</span>
            </div>
            <div className="p-2 rounded-lg bg-sentinel-bg border border-sentinel-border/50 text-right">
              <span className="text-[10px] text-slate-500 block">REMAINING</span>
              <span className="text-slate-300 font-bold text-sm tracking-wider">-{remainingClock}</span>
            </div>
          </div>

        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>00:00 (Start)</span>
            <span>{progressPercent}% Complete</span>
            <span>{state.totalDuration}s Total Duration</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Digital Twin (Center) + Scenario Library (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: Campus Map and Event Stream (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CampusMap />
          <EventTimeline events={events} maxEvents={8} />
        </div>

        {/* Right: Scenario Library (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              Signal Records ({scenarios.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Live archive
            </span>
          </div>

          <div className="space-y-3">
            {scenarios.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-sentinel-border bg-sentinel-card text-xs text-slate-400">
                No recorded signal packets are available.
              </div>
            ) : scenarios.map((scen, index) => {
              const Icon = getScenarioIcon(scen.category);
              const isActive = state.scenarioId === scen.id;

              return (
                <div
                  key={scen.id}
                  onClick={() => startScenario(scen.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${isActive
                    ? 'bg-sentinel-surface border-sentinel-accent shadow-md shadow-sentinel-accent/10 translate-x-1'
                    : 'bg-sentinel-card border-sentinel-border hover:bg-sentinel-hover'
                    }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-sentinel-border/50">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-sentinel-accent text-slate-950' : 'bg-slate-800 text-sentinel-accent'}`}>
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-[0.18em] text-slate-500">Record</span>
                        <h4 className="font-mono text-xs font-bold text-slate-100 group-hover:text-sentinel-accent">
                          {`R-${String(index + 1).padStart(2, '0')}`}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {scen.duration}s
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono uppercase text-slate-400">
                    <Icon className="w-3.5 h-3.5 text-sentinel-accent" />
                    <span>Signal pattern</span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                    Recorded telemetry packet for contextual review and operator analysis.
                  </p>

                  <div className="mt-3 pt-2 border-t border-sentinel-border/40 font-mono text-[11px] space-y-1">
                    <div className="text-slate-400">
                      <span className="text-slate-500">Inputs:</span> {scen.signalTypes.join(' • ')}
                    </div>
                    <div className="text-emerald-400">
                      <span className="text-slate-500">Context:</span> signal archive packet
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

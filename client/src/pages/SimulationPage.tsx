import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { CampusMap } from '../components/CampusMap';
import { EventTimeline } from '../components/EventTimeline';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Radio,
  Flame,
  ShieldAlert,
  Users,
  Sparkles,
  Cpu
} from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const {
    state,
    scenarios,
    events,
    startScenario,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    setSpeed,
    launchJudgeDemo
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
              DIGITAL TWIN SIMULATION ENGINE
            </h1>
          </div>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            &ldquo;Select a stored scenario to replay its synthetic sensor stream.&rdquo;
          </p>
        </div>

        <button
          onClick={launchJudgeDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Launch Judge Demo</span>
        </button>
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

            {state.isRunning && !state.isPaused ? (
              <button
                onClick={pauseSimulation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={() => state.isPaused ? resumeSimulation() : startScenario(state.scenarioId)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sentinel-accent hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{state.isPaused ? 'Resume' : 'Play Scenario'}</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-sentinel-surface p-1 rounded-lg border border-sentinel-border text-xs font-mono ml-2">
              {[1, 2, 5, 10].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeed(speed)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${state.speed === speed
                    ? 'bg-sentinel-accent text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

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
              Scenario Library ({scenarios.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Backend replay mode
            </span>
          </div>

          <div className="space-y-3">
            {scenarios.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-sentinel-border bg-sentinel-card text-xs text-slate-400">
                No situations are available. Load data from the backend or provide a situation before starting.
              </div>
            ) : scenarios.map((scen) => {
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
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-mono text-xs font-bold text-slate-100 group-hover:text-sentinel-accent">
                        {scen.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {scen.duration}s
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                    {scen.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-sentinel-border/40 font-mono text-[11px] space-y-1">
                    <div className="text-slate-400">
                      <span className="text-slate-500">SIGNALS:</span> {scen.signalTypes.join(' • ')}
                    </div>
                    <div className="text-emerald-400">
                      <span className="text-slate-500">OUTCOME:</span> {scen.expectedOutcome}
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

import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Zap, CheckCircle2, ChevronRight, RotateCcw, X, ShieldAlert, Cpu, UserCheck } from 'lucide-react';

export const JudgeDemoBanner: React.FC = () => {
  const { isJudgeDemoActive, judgeDemoStep, state, resetSimulation, launchJudgeDemo, acknowledgeIncident, selectedIncident, resolveIncident } = useSimulation();

  if (!isJudgeDemoActive) return null;

  const steps = [
    { num: 1, label: 'Nominal Baseline', desc: 'All monitored zones calm' },
    { num: 2, label: 'Signal Influx', desc: 'Thermal + Smoke signals detect' },
    { num: 3, label: 'Correlation', desc: 'Collapse into 1 Critical Incident' },
    { num: 4, label: 'Confidence 86%', desc: 'Pull station + Optical corroborate' },
    { num: 5, label: 'Human Authorization', desc: 'Operator decides next steps' },
    { num: 6, label: 'Resolved & Audited', desc: 'Case file sealed in audit log' },
  ];

  return (
    <div className="sticky top-16 z-40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-sentinel-accent/40 shadow-xl px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Judge Demo Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>JUDGE DEMO FLOW</span>
          </div>
          <span className="text-xs font-mono text-slate-300 hidden md:inline">
            Elapsed: <strong className="text-sentinel-accent">{state.currentSimulatedClock}</strong> ({state.speed}x speed)
          </span>
        </div>

        {/* Center: Stepper progression */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          {steps.map((s, idx) => {
            const isCurrent = judgeDemoStep === s.num;
            const isDone = judgeDemoStep > s.num;

            return (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${
                  isCurrent 
                    ? 'bg-sentinel-accent text-slate-950 font-bold shadow-sm shadow-cyan-400/30' 
                    : isDone 
                    ? 'text-emerald-400' 
                    : 'text-slate-500'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">
                      {s.num}
                    </span>
                  )}
                  <span>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Quick actions for presenter */}
        <div className="flex items-center gap-2">
          {selectedIncident && selectedIncident.status !== 'acknowledged' && selectedIncident.status !== 'resolved' && (
            <button
              onClick={() => acknowledgeIncident(selectedIncident.id)}
              className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Acknowledge</span>
            </button>
          )}

          {selectedIncident && selectedIncident.status !== 'resolved' && (
            <button
              onClick={() => resolveIncident(selectedIncident.id, 'Verified and mitigated by emergency crew.')}
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve</span>
            </button>
          )}

          <button
            onClick={launchJudgeDemo}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Restart Judge Demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetSimulation}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Exit Demo Mode"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

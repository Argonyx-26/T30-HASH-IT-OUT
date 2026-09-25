import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSimulation } from '../context/SimulationContext';
import { 
  Settings, 
  ShieldCheck, 
  Lock, 
  Sun, 
  Moon, 
  EyeOff, 
  FileCheck, 
  Cpu, 
  Radio, 
  AlertCircle 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { state } = useSimulation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-sentinel-border">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-sentinel-accent" />
          <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-100">
            SYSTEM GOVERNANCE & PRIVACY BY DESIGN
          </h1>
        </div>
        <p className="text-xs font-sans text-slate-400 mt-0.5">
          Privacy Safeguards, Hardcoded Ethical Constraints, and Simulation Engine Configuration
        </p>
      </div>

      {/* 1. Privacy By Design (Section 36) */}
      <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100 uppercase">
              Privacy by Design Constraints (Immutable Policy)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
            POLICY ENFORCED
          </span>
        </div>

        <div className="space-y-3">
          {[
            {
              title: 'Facial Recognition & Optical Identity Profiling',
              desc: 'Optical cameras are processed strictly for bounding vectors and crowd flow density. Face detection models are permanently disabled in compliance with student privacy charters.',
              status: 'DISABLED',
              locked: true,
              color: 'text-red-400 border-red-500/30 bg-red-950/20'
            },
            {
              title: 'Biometric Identification & RFID Person Tracking',
              desc: 'Card readers only report anonymous access event classes (e.g. valid badge, invalid badge, door forced). Personal identity mapping is excluded from telemetry streams.',
              status: 'DISABLED',
              locked: true,
              color: 'text-red-400 border-red-500/30 bg-red-950/20'
            },
            {
              title: 'Identity-Based Threat Scoring',
              desc: 'Sentinel evaluates physical situations (temperature, smoke, door states, crowd velocities). Individual suspicion scoring is strictly prohibited.',
              status: 'DISABLED',
              locked: true,
              color: 'text-red-400 border-red-500/30 bg-red-950/20'
            },
            {
              title: 'Autonomous Emergency Actions (High Impact)',
              desc: 'System cannot unilaterally trigger sirens, dispatch public emergency services, or initiate structural lockdowns without affirmative human sign-off.',
              status: 'DISABLED',
              locked: true,
              color: 'text-red-400 border-red-500/30 bg-red-950/20'
            },
            {
              title: 'Human-in-the-Loop Confirmation Mandate',
              desc: 'Every response recommendation requires affirmative authorization by an accredited campus safety officer before execution.',
              status: 'REQUIRED',
              locked: true,
              color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
            },
            {
              title: 'Cryptographic Audit Ledger',
              desc: 'All model inferences, telemetry normalizations, and operator actions are recorded to an append-only log with dynamic simulation timestamps.',
              status: 'ENABLED',
              locked: true,
              color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20'
            },
            {
              title: 'Simulation Data Watermark',
              desc: 'Visible labels indicate that all active telemetry derives from simulated synthetic datasets or digital twin replaying.',
              status: 'VISIBLE',
              locked: true,
              color: 'text-amber-400 border-amber-500/30 bg-amber-950/20'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-sentinel-surface border border-sentinel-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono font-bold text-slate-200">{item.title}</span>
                </div>
                <p className="text-slate-400 font-sans text-xs leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className={`px-2.5 py-1 rounded font-mono font-bold text-[10px] border ${item.color}`}>
                  {item.status}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  (Locked)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. System Status & Architecture Telemetry */}
      <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sentinel-accent" />
            <h3 className="font-mono text-sm font-bold text-slate-100 uppercase">
              Operational Subsystem Health
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            ALL SUBSYSTEMS NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-sentinel-surface border border-sentinel-border">
            <span className="text-slate-400 block mb-1">Correlation Engine:</span>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE (Deterministic)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-sentinel-surface border border-sentinel-border">
            <span className="text-slate-400 block mb-1">WebSocket Gateway:</span>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>PORT 4000 STREAMING</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-sentinel-surface border border-sentinel-border">
            <span className="text-slate-400 block mb-1">Simulation Clock:</span>
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{state.speed}x REPLAY SPEED</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Appearance Settings */}
      <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
          <h3 className="font-mono text-sm font-bold text-slate-100 uppercase">
            Appearance & Interface Theme
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Current: {theme.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-sentinel-surface border border-sentinel-border">
          <div>
            <span className="font-mono text-xs font-bold text-slate-200">
              Interface Color Mode
            </span>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Command-center dark mode is recommended for tactical low-glare visibility.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sentinel-bg border border-sentinel-border text-slate-200 font-mono text-xs font-bold hover:border-sentinel-accent cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span>Switch to Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

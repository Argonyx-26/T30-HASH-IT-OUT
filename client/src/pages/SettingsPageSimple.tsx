import React from 'react';
import { Activity, Check, Moon, Palette, Radio, Settings, ShieldCheck, Sun } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { state, connected } = useSimulation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <header className="border-b border-sentinel-border pb-5">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-sentinel-accent" />
          <h1 className="font-mono text-xl font-bold text-slate-100">SETTINGS</h1>
        </div>
        <p className="mt-1 text-sm text-slate-400">Manage the operator view and review live system state.</p>
      </header>

      <section className="rounded-xl border border-sentinel-border bg-sentinel-card p-5 shadow-lg">
        <div className="flex items-center gap-2 border-b border-sentinel-border pb-3">
          <Palette className="h-4 w-4 text-sentinel-accent" />
          <h2 className="font-mono text-sm font-bold text-slate-100">Appearance</h2>
        </div>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm font-semibold text-slate-200">Interface theme</p>
            <p className="mt-1 text-sm text-slate-400">Choose the display mode for the command center.</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-sentinel-border bg-sentinel-surface px-4 py-2 font-mono text-xs font-bold text-slate-200 transition-colors hover:border-sentinel-accent"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
        </div>
        <p className="mt-4 text-xs font-mono uppercase text-slate-500">Current mode: {theme}</p>
      </section>

      <section className="rounded-xl border border-sentinel-border bg-sentinel-card p-5 shadow-lg">
        <div className="flex items-center gap-2 border-b border-sentinel-border pb-3">
          <Activity className="h-4 w-4 text-sentinel-accent" />
          <h2 className="font-mono text-sm font-bold text-slate-100">Live System Status</h2>
        </div>
        <div className="grid gap-3 pt-4 sm:grid-cols-3">
          <StatusItem label="Core connection" value={connected ? 'Online' : 'Connecting'} active={connected} icon={<Radio className="h-4 w-4" />} />
          <StatusItem label="Simulation" value={state.scenarioName} active={Boolean(state.scenarioId)} icon={<Activity className="h-4 w-4" />} />
          <StatusItem label="Replay speed" value={`${state.speed}x`} active icon={<Check className="h-4 w-4" />} />
        </div>
      </section>

      <section className="rounded-xl border border-sentinel-border bg-sentinel-card p-5 shadow-lg">
        <div className="flex items-center gap-2 border-b border-sentinel-border pb-3">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h2 className="font-mono text-sm font-bold text-slate-100">Privacy Principles</h2>
        </div>
        <div className="grid gap-3 pt-4 text-sm text-slate-400 sm:grid-cols-2">
          <p>Telemetry describes physical conditions, not personal identity.</p>
          <p>Human approval is required before high-impact response actions.</p>
          <p>Simulation data is clearly marked as synthetic.</p>
          <p>Audit activity records system and operator decisions.</p>
        </div>
      </section>
    </div>
  );
};

const StatusItem: React.FC<{ label: string; value: string; active: boolean; icon: React.ReactNode }> = ({ label, value, active, icon }) => (
  <div className="rounded-lg border border-sentinel-border bg-sentinel-surface p-3">
    <p className="text-xs text-slate-500">{label}</p>
    <div className={`mt-2 flex items-center gap-2 font-mono text-xs font-bold ${active ? 'text-emerald-400' : 'text-amber-400'}`}>
      {icon}
      <span className="truncate">{value}</span>
    </div>
  </div>
);

import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowRight, ArrowUpRight, Bell, BrainCircuit, CheckCircle2, Clock3, Layers, Play, Radio, ShieldCheck } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { CampusMap } from './CampusMap';

export const LiveSafetyPulse: React.FC = () => {
  const {
    incidents,
    events,
    zones,
    scenarios,
    state,
    selectedIncident,
    activeAlert,
    startScenario
  } = useSimulation();

  const currentIncident = selectedIncident || incidents[0] || null;
  const activeIncidents = incidents.filter(incident => incident.status !== 'resolved');
  const latestSignals = events.slice(0, 3);
  const isConnected = state.totalSources > 0 || state.scenarioId.length > 0;
  const nextAction = currentIncident?.recommendations.find(recommendation => !recommendation.completed);

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Live Safety Pulse</span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-mono font-bold text-slate-100">The campus, in one operational view.</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-relaxed">Replay a situation, watch signals converge, and move from detection to a human-approved response.</p>
        </div>
        <Link to="/operations" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sentinel-accent hover:underline">
          Open full command center <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mb-4 rounded-xl border border-sentinel-border bg-sentinel-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-sentinel-accent">Replay flow</p>
            <p className="mt-1 text-xs text-slate-400">This is where a selected scenario travels through Sentinel.</p>
          </div>
          <span className="text-[10px] font-mono text-slate-500">SYNTHETIC DIGITAL TWIN</span>
        </div>
        <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
          <FlowStep label="Scenario" detail={scenarios.length ? `${scenarios.length} loaded` : 'Loading'} active={scenarios.length > 0} />
          <FlowArrow />
          <FlowStep label="Timer + events" detail={state.scenarioId ? `${state.currentSimulatedClock} • ${events.length} emitted` : 'Waiting to start'} active={Boolean(state.scenarioId)} />
          <FlowArrow />
          <FlowStep label="Correlation" detail={events.length ? `${events.length} signals analyzed` : 'Waiting for signals'} active={events.length > 0} />
          <FlowArrow />
          <FlowStep label="Incident" detail={incidents.length ? `${incidents.length} cases` : 'None created'} active={incidents.length > 0} />
          <FlowArrow />
          <FlowStep label="Operator" detail={currentIncident ? 'Review available' : 'Awaiting case'} active={Boolean(currentIncident)} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
          <MetricCard icon={<Radio className="h-4 w-4" />} label="Campus status" value={activeIncidents.length ? `${activeIncidents.length} active` : 'Nominal'} tone={activeIncidents.length ? 'warning' : 'success'} />
          <MetricCard icon={<Activity className="h-4 w-4" />} label="Signals received" value={`${events.length}`} tone="accent" />
          <MetricCard icon={<ShieldCheck className="h-4 w-4" />} label="Source nodes" value={`${zones.reduce((total, zone) => total + zone.activeSources, 0)} online`} tone="success" />
        </div>

        <div className="rounded-xl border border-sentinel-border bg-sentinel-card p-4 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-sentinel-border pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h3 className="font-mono text-xs font-bold uppercase text-slate-200">Incident pulse</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{activeAlert ? 'NEW ALERT' : 'MONITORING'}</span>
          </div>
          {currentIncident ? (
            <div className="pt-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold text-slate-100">{currentIncident.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{currentIncident.zone} • {currentIncident.location}</p>
                </div>
                <span className="rounded border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[10px] font-mono font-bold uppercase text-amber-300">{currentIncident.severity}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Evidence confidence</span>
                <span className="font-bold text-sentinel-accent">{(currentIncident.confidence * 100).toFixed(0)}%</span>
              </div>
              <Link to={`/incidents/${currentIncident.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-mono font-bold text-sentinel-accent hover:underline">Inspect case <ArrowUpRight className="h-3 w-3" /></Link>
            </div>
          ) : (
            <p className="pt-4 text-sm text-slate-400">No active incident. Start a scenario to begin streaming signals.</p>
          )}
        </div>

        <div className="rounded-xl border border-sentinel-border bg-sentinel-card p-4 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-sentinel-border pb-2">
            <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-sentinel-accent" /><h3 className="font-mono text-xs font-bold uppercase text-slate-200">Signal convergence</h3></div>
            <span className="text-[10px] font-mono text-slate-500">LATEST TELEMETRY</span>
          </div>
          <div className="space-y-3 pt-3">
            {latestSignals.length ? latestSignals.map(signal => (
              <div key={signal.id}>
                <div className="flex items-center justify-between gap-3 text-xs font-mono"><span className="truncate text-slate-300">{signal.eventType.replaceAll('_', ' ')} • {signal.source}</span><span className="font-bold text-cyan-300">{(signal.confidence * 100).toFixed(0)}%</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-sentinel-accent" style={{ width: `${signal.confidence * 100}%` }} /></div>
                <p className="mt-1 text-[11px] text-slate-500">{signal.timestamp} • {signal.zone}</p>
              </div>
            )) : <p className="text-sm text-slate-400">Signals will appear here when a scenario is replayed.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-sentinel-border bg-sentinel-card p-4 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-sentinel-border pb-2"><div className="flex items-center gap-2"><Bell className="h-4 w-4 text-amber-400" /><h3 className="font-mono text-xs font-bold uppercase text-slate-200">Alert center</h3></div><span className={`h-2 w-2 rounded-full ${activeAlert ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} /></div>
          <div className="pt-3">
            {activeAlert ? <><p className="font-mono text-sm font-bold text-slate-100">{activeAlert.title}</p><p className="mt-1 text-xs text-slate-400">{activeAlert.zone} • {activeAlert.severity}</p><Link to={`/incidents/${activeAlert.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-300 hover:underline">Open alert <ArrowUpRight className="h-3 w-3" /></Link></> : <p className="text-sm text-slate-400">No new alerts. Sentinel is watching for signal convergence.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-sentinel-border bg-sentinel-card p-4 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-sentinel-border pb-2"><div className="flex items-center gap-2"><Play className="h-4 w-4 text-sentinel-accent" /><h3 className="font-mono text-xs font-bold uppercase text-slate-200">Scenario replay</h3></div><span className="text-[10px] font-mono text-slate-500">{state.isRunning ? 'RUNNING' : 'READY'}</span></div>
          <div className="grid gap-2 pt-3 sm:grid-cols-3">
            {scenarios.slice(0, 3).map(scenario => <button type="button" key={scenario.id} onClick={() => startScenario(scenario.id)} className="rounded-lg border border-sentinel-border bg-sentinel-surface p-3 text-left transition-colors hover:border-sentinel-accent"><p className="font-mono text-xs font-bold text-slate-200">{scenario.name}</p><p className="mt-1 text-[11px] text-slate-500">{scenario.duration}s replay</p></button>)}
          </div>
          {!scenarios.length && <p className="pt-3 text-sm text-slate-400">Scenario library is loading from the backend.</p>}
        </div>

        <div className="rounded-xl border border-sentinel-accent/40 bg-cyan-950/20 p-4 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2"><div className="flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-sentinel-accent" /><h3 className="font-mono text-xs font-bold uppercase text-slate-200">Human decision</h3></div><span className="text-[10px] font-mono font-bold text-emerald-300">AUTHORIZATION REQUIRED</span></div>
          <p className="pt-3 text-sm font-semibold text-slate-100">{nextAction ? nextAction.action : 'No response action pending.'}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">AI organizes the evidence and recommends a next step. An authorized operator makes the decision.</p>
          {currentIncident && <Link to={`/incidents/${currentIncident.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-mono font-bold text-sentinel-accent hover:underline">Review response checklist <ArrowUpRight className="h-3 w-3" /></Link>}
        </div>
      </div>

      <CampusMap />
    </section>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; tone: 'success' | 'warning' | 'accent' }> = ({ icon, label, value, tone }) => (
  <div className="rounded-xl border border-sentinel-border bg-sentinel-card p-4">
    <div className={`flex items-center gap-2 text-xs font-mono ${tone === 'success' ? 'text-emerald-400' : tone === 'warning' ? 'text-amber-400' : 'text-sentinel-accent'}`}>{icon}<span>{label}</span></div>
    <p className="mt-3 font-mono text-lg font-bold text-slate-100">{value}</p>
  </div>
);

const FlowStep: React.FC<{ label: string; detail: string; active: boolean }> = ({ label, detail, active }) => (
  <div className={`rounded-lg border p-3 ${active ? 'border-sentinel-accent/50 bg-sentinel-accent/10' : 'border-sentinel-border bg-sentinel-surface'}`}>
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
      <span className="font-mono text-xs font-bold text-slate-200">{label}</span>
    </div>
    <p className="mt-1 truncate text-[10px] text-slate-400">{detail}</p>
  </div>
);

const FlowArrow: React.FC = () => (
  <ArrowRight className="hidden h-4 w-4 justify-self-center text-sentinel-accent md:block" />
);

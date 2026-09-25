import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Zap } from 'lucide-react';
import { SignalConvergenceHero } from '../components/SignalConvergenceHero';
import { LiveSafetyPulse } from '../components/LiveSafetyPulse';

export const LandingPage: React.FC = () => (
  <div className="space-y-16 pb-24">
    <section className="relative mx-auto max-w-7xl space-y-6 px-4 pt-12 text-center sm:px-6 lg:px-8 lg:pt-20">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300">
        <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
        Live campus safety intelligence
      </div>
      <h1 className="mx-auto max-w-4xl font-mono text-4xl font-extrabold leading-tight tracking-tight text-slate-100 sm:text-6xl lg:text-7xl">
        From scattered signals<br />
        <span className="bg-gradient-to-r from-sentinel-accent via-cyan-300 to-blue-500 bg-clip-text text-transparent">to confident response.</span>
      </h1>
      <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-slate-300 sm:text-lg">
        Replay campus safety scenarios, watch evidence converge, and give operators one clear situation to act on.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link to="/operations" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sentinel-accent to-blue-600 px-6 py-3.5 text-sm font-mono font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105">
          <Activity className="h-4 w-4" /> Open Operations <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/simulation" className="flex items-center gap-2 rounded-xl border border-sentinel-border bg-sentinel-surface px-6 py-3.5 text-sm font-mono font-bold uppercase tracking-wider text-slate-100 transition-colors hover:border-sentinel-accent hover:bg-sentinel-hover">
          <Zap className="h-4 w-4 text-sentinel-accent" /> Explore Scenarios
        </Link>
      </div>
      <div className="pt-8"><SignalConvergenceHero /></div>
    </section>

    <LiveSafetyPulse />
  </div>
);

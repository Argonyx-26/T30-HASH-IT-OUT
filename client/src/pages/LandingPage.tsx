import React from 'react';
import { Link } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { SignalConvergenceHero } from '../components/SignalConvergenceHero';
import { IncidentCompressionGraphic } from '../components/IncidentCompressionGraphic';
import { MultiAgentMesh } from '../components/MultiAgentMesh';
import { CampusMap } from '../components/CampusMap';
import { 
  Shield, 
  ArrowRight, 
  Zap, 
  Lock, 
  UserCheck, 
  EyeOff, 
  FileCheck, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Cpu, 
  Layers 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { launchJudgeDemo } = useSimulation();

  return (
    <div className="space-y-20 pb-24">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider uppercase shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Next-Generation Situational Awareness System</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
          From scattered signals <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sentinel-accent via-cyan-300 to-blue-500">
            to confident response.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          Sentinel correlates fragmented safety signals across physical sensors, access doors, optical flow cameras, and dispatcher reports into explainable, prioritized operational situations.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/operations"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sentinel-accent to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>Open Operations Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={launchJudgeDemo}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sentinel-surface hover:bg-sentinel-hover border border-sentinel-border text-slate-100 font-mono font-bold text-sm tracking-wider uppercase hover:border-sentinel-accent transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-sentinel-accent" />
            <span>Run Live Simulation (Judge Demo)</span>
          </button>
        </div>

        {/* Live Signal Convergence Interactive Demonstration Graphic */}
        <div className="pt-8">
          <SignalConvergenceHero />
        </div>
      </section>

      {/* 2. Problem Section: "Events vs Situations" */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            The Fundamental Paradigm Shift
          </span>
          <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100">
            &ldquo;Safety systems see events. Responders need situations.&rdquo;
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Campuses have invested heavily in IoT sensors, badge readers, and optical cameras. Yet during critical events, operators drown in dozens of disconnected alarms without knowing what is truly happening.
          </p>
        </div>

        <IncidentCompressionGraphic />
      </section>

      {/* 3. Multi-Agent Cooperative Architecture */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            Modular Intelligence
          </span>
          <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100">
            A 10-Agent Collaborative Mesh
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Specialized perception agents normalize raw streams, the correlation engine synthesizes spatial-temporal topologies, and governance agents preserve human authority.
          </p>
        </div>

        <MultiAgentMesh />
      </section>

      {/* 4. Responsible AI & Privacy by Design */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-sentinel-card via-slate-900 to-sentinel-card border border-sentinel-border shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
              Ethical AI Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100 mt-4">
              Built for human decision-making.
            </h2>
            <p className="text-sm text-slate-300 mt-3 font-sans leading-relaxed">
              Sentinel is not a surveillance platform. We deliberately reject facial recognition, personal profiling, and automated disciplinary scoring in favor of transparent, physical situational evidence.
            </p>

            <blockquote className="mt-6 border-l-2 border-sentinel-accent pl-4 text-lg font-mono font-bold text-sentinel-accent">
              &ldquo;AI recommends. Humans decide.&rdquo;
            </blockquote>

            {/* Checklist of Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 font-mono text-xs text-slate-200">
              <div className="flex items-center gap-2.5 p-2 rounded bg-sentinel-bg/80 border border-sentinel-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Facial Recognition</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded bg-sentinel-bg/80 border border-sentinel-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Biometric Profiling</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded bg-sentinel-bg/80 border border-sentinel-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Identity-Based Threat Scoring</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded bg-sentinel-bg/80 border border-sentinel-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Autonomous Punishment</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded bg-sentinel-bg/80 border border-sentinel-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Affirmative Human Authorization Required</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded bg-sentinel-bg/80 border border-sentinel-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Every Operator Decision Audited</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded bg-sentinel-bg/80 border border-sentinel-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transparent Evidence Attribution</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded bg-sentinel-bg/80 border border-sentinel-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulation Data Explicitly Labeled</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Campus Digital Twin Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            Interactive Digital Twin
          </span>
          <h2 className="text-2xl sm:text-4xl font-mono font-bold text-slate-100">
            Spatial Operating Picture
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            A stylized vector map of campus infrastructure showing real-time sensor beacons, building status halos, and potential perimeter impact radii.
          </p>
        </div>

        <CampusMap />
      </section>

      {/* 6. Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-sentinel-accent/40 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Experience Sentinel in Action
          </h3>
          <p className="text-sm text-slate-300 mt-2 font-sans max-w-lg mx-auto">
            Test the deterministic simulation engine, observe cross-modal correlation, and verify how Sentinel keeps humans in complete control.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/operations"
              className="px-6 py-3 rounded-xl bg-sentinel-accent hover:bg-cyan-300 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-colors"
            >
              Enter Command Center
            </Link>
            <Link
              to="/simulation"
              className="px-6 py-3 rounded-xl bg-sentinel-surface hover:bg-sentinel-hover border border-sentinel-border text-slate-200 font-mono text-sm tracking-wider uppercase transition-colors"
            >
              Explore Scenarios
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

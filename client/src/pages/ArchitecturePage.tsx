import React from 'react';
import { MultiAgentMesh } from '../components/MultiAgentMesh';
import { 
  Cpu, 
  Layers, 
  GitBranch, 
  ShieldCheck, 
  FileCode2, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Header */}
      <div className="pb-4 border-b border-sentinel-border">
        <div className="flex items-center gap-2">
          <Cpu className="w-6 h-6 text-sentinel-accent" />
          <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-100">
            SYSTEM ARCHITECTURE & MULTI-AGENT SPECIFICATION
          </h1>
        </div>
        <p className="text-xs font-sans text-slate-400 mt-0.5">
          End-to-End Orchestration Flow, Common Event Normalization, and Deterministic Correlation Mathematical Framework
        </p>
      </div>

      {/* 1. High Level Pipeline Flow */}
      <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl space-y-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
          The 7-Stage Transformation Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs font-mono">
          {[
            { step: '01', title: 'Signals Ingestion', desc: 'Raw sensor, access, and optical telemetry' },
            { step: '02', title: 'Normalization', desc: 'Unified Common Event Schema (CEF)' },
            { step: '03', title: 'Perception Agents', desc: 'Outlier & baseline threshold verification' },
            { step: '04', title: 'Correlation', desc: 'Spatio-temporal clustering engine' },
            { step: '05', title: 'Risk & Confidence', desc: 'Cross-modal probabilistic convergence' },
            { step: '06', title: 'Explainability', desc: 'Dossier of reasons, drivers & uncertainties' },
            { step: '07', title: 'Human Action', desc: 'Authorized response verification & audit' },
          ].map((s) => (
            <div key={s.step} className="p-3 rounded-xl bg-sentinel-surface border border-sentinel-border flex flex-col justify-between space-y-2">
              <span className="text-[10px] text-sentinel-accent font-bold">STAGE {s.step}</span>
              <h4 className="text-slate-100 font-bold">{s.title}</h4>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Agent Mesh */}
      <section>
        <MultiAgentMesh />
      </section>

      {/* 3. Common Event Format (CEF) Specification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Schema */}
        <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-sentinel-accent" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Common Event Format (CEF) Schema
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">JSON SCHEMA</span>
          </div>

          <pre className="p-4 rounded-xl bg-sentinel-bg border border-sentinel-border text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`{
  "id": "EVT-1029",
  "source": "Thermal Sensor TH-04",
  "sourceType": "sensor",
  "zone": "Science Annex",
  "location": "West Stairwell, Level 2",
  "relativeTime": 4,
  "timestamp": "00:04",
  "eventType": "thermal_anomaly",
  "severity": "high",
  "confidence": 0.88,
  "evidence": "Temperature registered 48°C (baseline +18°C)",
  "evidenceCategory": "confirmed"
}`}
          </pre>
        </div>

        {/* Correlation Logic */}
        <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Deterministic Correlation Framework
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">MATHEMATICAL RULE</span>
          </div>

          <div className="p-4 rounded-xl bg-sentinel-bg border border-sentinel-border font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>
              Two events $e_1, e_2$ correlate into incident $I$ if and only if:
            </p>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
              Zone(e₁) = Zone(e₂)  ∧  |Δt| ≤ T_window (60s)
            </div>
            <p>
              Dynamic Evidence Confidence is computed via cross-modal source diversity:
            </p>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
              C(I) = min(0.95, 0.55 + 0.07·|S_types| + 0.05·|E_confirmed|)
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Ensures confidence rises strictly when independent physical channels corroborate the event.
            </p>
          </div>
        </div>

      </div>

      {/* 4. Hackathon Deterministic Sandbox vs Future AI Roadmap */}
      <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl space-y-4">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100 pb-2 border-b border-sentinel-border">
          AI Architecture & Production Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          
          {/* Hackathon Implementation */}
          <div className="p-4 rounded-xl bg-sentinel-surface border border-sentinel-border space-y-2">
            <span className="font-mono font-bold text-sentinel-accent uppercase block">
              1. Hackathon Prototype (Current)
            </span>
            <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic dynamic simulation clock & scenario replay</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero external API latency or fragile dependencies</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mathematical spatio-temporal correlation rules</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic judge demo reproduction</span>
              </li>
            </ul>
          </div>

          {/* Future AI Roadmap */}
          <div className="p-4 rounded-xl bg-sentinel-surface border border-sentinel-border space-y-2">
            <span className="font-mono font-bold text-cyan-400 uppercase block">
              2. Production AI Layer (Future Expansion)
            </span>
            <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span><strong>Vision Agent:</strong> Edge optical flow & smoke density models</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span><strong>Report Agent:</strong> Local LLM structured dispatch extraction</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span><strong>Anomaly Agent:</strong> Auto-regressive baseline anomaly detectors</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span><strong>Explainability Agent:</strong> Natural language reasoning generation</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Eye, Radio, KeyRound, MessageSquare, AlertTriangle, Cpu, ShieldAlert, Lightbulb, CheckSquare, ShieldCheck, Sparkles } from 'lucide-react';

interface AgentInfo {
  id: string;
  name: string;
  category: 'perception' | 'reasoning' | 'governance';
  icon: any;
  purpose: string;
  input: string;
  output: string;
}

export const MultiAgentMesh: React.FC = () => {
  const agents: AgentInfo[] = [
    {
      id: 'vision',
      name: 'Vision Agent',
      category: 'perception',
      icon: Eye,
      purpose: 'Analyzes visual optical flow, motion vectors, and crowd density without capturing identities or biometric markers.',
      input: 'De-identified optical motion vectors and bounding density clusters',
      output: 'Crowd movement anomalies, egress dispersion rates, directional vectors'
    },
    {
      id: 'sensor',
      name: 'Sensor Agent',
      category: 'perception',
      icon: Radio,
      purpose: 'Continuously evaluates environmental, thermal, and mechanical transducer telemetry against historical baselines.',
      input: 'Raw telemetry streams (thermal, humidity, vibration, gas, particulate)',
      output: 'Normalized anomaly scores, standard deviation deviations, thermal gradients'
    },
    {
      id: 'access',
      name: 'Access Agent',
      category: 'perception',
      icon: KeyRound,
      purpose: 'Monitors turnstiles, badge access controllers, and panic egress hardware for physical perimeter security.',
      input: 'Card reader telemetry, door forced open (DFO) contacts, panic bar microswitches',
      output: 'Perimeter breach events, egress flow spikes, unauthorized access flags'
    },
    {
      id: 'report',
      name: 'Report Agent',
      category: 'perception',
      icon: MessageSquare,
      purpose: 'Converts unstructured natural-language dispatcher communications and occupant emergency calls into structured spatial signals.',
      input: 'Dispatch audio transcripts, student mobile report text, radio logs',
      output: 'Structured event (eventType, location, zone, severity indicators, confidence)'
    },
    {
      id: 'anomaly',
      name: 'Anomaly Agent',
      category: 'perception',
      icon: AlertTriangle,
      purpose: 'Evaluates single-stream telemetry to detect statistical outliers and filter transient sensor spikes.',
      input: 'Normalized perception streams',
      output: 'Qualified anomaly candidates with baseline confidence scores'
    },
    {
      id: 'risk',
      name: 'Risk Agent',
      category: 'reasoning',
      icon: ShieldAlert,
      purpose: 'Calculates incident severity separate from evidence confidence to avoid conflating impact with probability.',
      input: 'Correlated incident graph, zone occupancy state, hazard classifications',
      output: 'Calibrated severity tier (Watch, Elevated, Critical) and escalation triggers'
    },
    {
      id: 'explainability',
      name: 'Explainability Agent',
      category: 'reasoning',
      icon: Lightbulb,
      purpose: 'Generates transparent rationale detailing why an incident was created, prioritized, and what remains uncertain.',
      input: 'Cross-modal correlation graph and confidence trajectory',
      output: 'Structured rationale (Why Created, Why Prioritized, Uncertainty, Evidence Drivers)'
    },
    {
      id: 'response',
      name: 'Response Agent',
      category: 'reasoning',
      icon: CheckSquare,
      purpose: 'Proposes actionable next steps adhering strictly to "AI recommends, Humans decide" protocols without autonomous escalation.',
      input: 'Incident profile, venue safety SOPs, current responder staging',
      output: 'Prioritized human-action checklist requiring authorized operator sign-off'
    },
    {
      id: 'privacy',
      name: 'Privacy & Audit Agent',
      category: 'governance',
      icon: ShieldCheck,
      purpose: 'Enforces Privacy-by-Design safeguards, blocks facial recognition, and maintains tamper-evident audit logs.',
      input: 'All system I/O, agent inferences, and operator actions',
      output: 'Anonymized event records, compliance audit seals, privacy guarantees'
    }
  ];

  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(agents[0]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 sm:p-8 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sentinel-border">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Distributed Intelligence Mesh
          </span>
          <h3 className="text-lg font-mono font-bold text-slate-100 mt-1">
            Multi-Agent Cooperative Architecture
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-sentinel-accent" />
          <span>Select an agent to inspect I/O contracts</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Agent Grid (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Central Hub Notice */}
          <div className="p-3 rounded-lg bg-slate-900 border border-sentinel-accent/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sentinel-accent/20 flex items-center justify-center text-sentinel-accent">
                <Cpu className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold text-slate-100 uppercase">
                  CENTRAL SENTINEL CORRELATION ENGINE
                </h4>
                <p className="text-[11px] text-slate-400 font-sans">
                  Spatio-temporal clustering and probabilistic evidence convergence
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
              ORCHESTRATOR
            </span>
          </div>

          {/* Grid of Agents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isSelected = selectedAgent.id === agent.id;

              let categoryBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
              if (agent.category === 'reasoning') categoryBadge = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
              if (agent.category === 'governance') categoryBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 group ${
                    isSelected
                      ? 'bg-sentinel-surface border-sentinel-accent shadow-md shadow-sentinel-accent/10 translate-y-[-2px]'
                      : 'bg-sentinel-bg/80 border-sentinel-border hover:bg-sentinel-hover hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-sentinel-accent text-slate-950' : 'bg-slate-800 text-sentinel-accent group-hover:bg-slate-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${categoryBadge}`}>
                      {agent.category}
                    </span>
                  </div>

                  <h5 className="font-mono text-xs font-bold text-slate-200 group-hover:text-sentinel-accent">
                    {agent.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans line-clamp-2">
                    {agent.purpose}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Agent Inspector (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-sentinel-surface border border-sentinel-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
            <div className="flex items-center gap-2">
              <selectedAgent.icon className="w-5 h-5 text-sentinel-accent" />
              <h4 className="font-mono text-sm font-bold text-slate-100">
                {selectedAgent.name}
              </h4>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
              {selectedAgent.category}
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                Operational Purpose:
              </span>
              <p className="text-slate-300 leading-relaxed bg-sentinel-bg p-2.5 rounded border border-sentinel-border/50">
                {selectedAgent.purpose}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                Input Data Contract:
              </span>
              <p className="text-slate-300 font-mono text-[11px] bg-sentinel-bg p-2.5 rounded border border-sentinel-border/50">
                {selectedAgent.input}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                Output Structured Artifact:
              </span>
              <p className="text-slate-300 font-mono text-[11px] bg-sentinel-bg p-2.5 rounded border border-sentinel-border/50">
                {selectedAgent.output}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-sentinel-border flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Deterministic Sandbox: OK</span>
            <span className="text-emerald-400 font-bold">100% EXPLAINABLE</span>
          </div>
        </div>

      </div>

    </div>
  );
};

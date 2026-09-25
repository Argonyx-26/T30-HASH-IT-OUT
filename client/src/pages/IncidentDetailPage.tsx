import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { EvidencePanel } from '../components/EvidencePanel';
import { SituationGraph } from '../components/SituationGraph';
import { ResponseRecommendationPanel } from '../components/ResponseRecommendationPanel';
import { ExplainabilityDrawer } from '../components/ExplainabilityDrawer';
import { 
  ArrowLeft, 
  HelpCircle, 
  Layers, 
  FileText, 
  Activity, 
  Share2, 
  ShieldAlert, 
  CheckCircle2, 
  Eye, 
  FileQuestion 
} from 'lucide-react';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { incidents, auditLog } = useSimulation();
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'graph' | 'response' | 'audit'>('overview');
  const [explainabilityOpen, setExplainabilityOpen] = useState(false);

  const incident = incidents.find(i => i.id === id) || (incidents.length > 0 ? incidents[0] : null);

  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-mono text-slate-300">Case File Not Found</h2>
        <p className="text-sm text-slate-500 font-sans">
          The requested incident does not exist in the active digital twin simulation.
        </p>
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sentinel-surface hover:bg-sentinel-hover border border-sentinel-border text-xs font-mono text-cyan-400"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Incidents Index</span>
        </Link>
      </div>
    );
  }

  const caseAudit = auditLog.filter(a => a.incidentId === incident.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back button */}
      <div>
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Incident Dossiers</span>
        </Link>
      </div>

      {/* Professional Case File Header */}
      <div className="p-6 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sentinel-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-sentinel-accent">{incident.id}</span>
                <span className="text-slate-600 font-mono">&bull;</span>
                <span className="text-xs font-mono text-slate-400">ZONE: {incident.zone}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-100 mt-0.5">
                {incident.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setExplainabilityOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/60 text-cyan-300 font-mono text-xs font-semibold uppercase transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why This Incident?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-sentinel-border overflow-x-auto pb-1 text-xs font-mono">
        {[
          { key: 'overview', label: 'Overview', icon: Activity },
          { key: 'evidence', label: `Evidence (${incident.events.length})`, icon: Eye },
          { key: 'graph', label: 'Situation Graph', icon: Layers },
          { key: 'response', label: 'Response Checklist', icon: CheckCircle2 },
          { key: 'audit', label: `Audit Trail (${caseAudit.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-sentinel-surface text-sentinel-accent border-b-2 border-sentinel-accent font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-sentinel-hover'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* Executive Summary */}
              <div className="p-5 rounded-xl bg-sentinel-card border border-sentinel-border space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                  Operational Executive Summary
                </h3>
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {incident.summary}
                </p>
                <div className="p-3 rounded-lg bg-sentinel-surface border border-sentinel-border/50 text-xs font-mono text-slate-400 space-y-1">
                  <div><strong>Spatial Anchor:</strong> {incident.location} ({incident.zone})</div>
                  <div><strong>Hazard Category:</strong> {incident.category.toUpperCase().replace('_', ' ')}</div>
                  <div><strong>Current Status:</strong> {incident.status.toUpperCase()}</div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-4 space-y-6">
              <EvidencePanel incident={incident} />
            </div>
          </div>
        )}

        {/* TAB 2: EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="max-w-3xl">
            <EvidencePanel incident={incident} />
          </div>
        )}

        {/* TAB 3: SITUATION GRAPH */}
        {activeTab === 'graph' && (
          <SituationGraph incident={incident} />
        )}

        {/* TAB 4: RESPONSE */}
        {activeTab === 'response' && (
          <div className="max-w-3xl mx-auto">
            <ResponseRecommendationPanel incident={incident} />
          </div>
        )}

        {/* TAB 5: AUDIT */}
        {activeTab === 'audit' && (
          <div className="p-5 rounded-xl bg-sentinel-card border border-sentinel-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Case File Audit History
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">
                TAMPER-EVIDENT LEDGER
              </span>
            </div>

            <div className="space-y-2">
              {caseAudit.length > 0 ? (
                caseAudit.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-sentinel-surface border border-sentinel-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-sentinel-accent font-bold">
                          {a.actor}
                        </span>
                        <span className="text-slate-200 font-semibold">{a.action}</span>
                      </div>
                      <p className="text-slate-400 font-sans text-xs">{a.details}</p>
                    </div>
                    <span className="text-slate-500 shrink-0">[{a.timestamp}]</span>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-slate-500 py-4 text-center">
                  No specific audit events recorded for this incident yet.
                </p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Explainability Drawer */}
      <ExplainabilityDrawer
        incident={incident}
        isOpen={explainabilityOpen}
        onClose={() => setExplainabilityOpen(false)}
      />

    </div>
  );
};

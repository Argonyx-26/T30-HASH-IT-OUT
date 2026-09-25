import React, { useState } from 'react';
import { Incident } from '../types';
import { useSimulation } from '../context/SimulationContext';
import {
  CheckSquare,
  Square,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Send,
  UserCheck,
  Lock
  , BrainCircuit
} from 'lucide-react';

interface ResponseRecommendationPanelProps {
  incident: Incident | null;
  className?: string;
}

export const ResponseRecommendationPanel: React.FC<ResponseRecommendationPanelProps> = ({ incident, className = '' }) => {
  const { acknowledgeIncident, resolveIncident, toggleRecommendationStep, addOperatorNote, generateAIRecommendations } = useSimulation();
  const [operatorNoteText, setOperatorNoteText] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionReason, setResolutionReason] = useState('All monitored zones returned to nominal baseline. Hazard mitigated.');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  if (!incident) {
    return (
      <div className={`p-4 rounded-xl bg-sentinel-card border border-sentinel-border text-center text-slate-500 font-mono text-xs ${className}`}>
        No active incident selected for response orchestration.
      </div>
    );
  }

  const isAcknowledged = incident.status === 'acknowledged';
  const isResolved = incident.status === 'resolved';

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorNoteText.trim()) return;
    addOperatorNote(incident.id, operatorNoteText.trim());
    setOperatorNoteText('');
  };

  const handleResolve = () => {
    resolveIncident(incident.id, resolutionReason);
    setIsResolving(false);
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    setAiError(null);
    try {
      await generateAIRecommendations(incident.id);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'AI recommendation generation failed.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className={`p-4 rounded-xl bg-sentinel-card border border-sentinel-border space-y-4 ${className}`}>

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Response Recommendation Matrix
          </h3>
          <p className="text-[10px] font-mono text-slate-400">
            SOP Playbook: {incident.category.toUpperCase().replace('_', ' ')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={isGeneratingAI}
          className="inline-flex items-center gap-1.5 rounded border border-sentinel-accent/40 bg-sentinel-accent/10 px-2 py-1 text-[10px] font-mono font-bold text-sentinel-accent hover:bg-sentinel-accent/20 disabled:cursor-wait disabled:opacity-60"
        >
          <BrainCircuit className="h-3.5 w-3.5" />
          {isGeneratingAI ? 'GENERATING...' : 'GENERATE AI PLAN'}
        </button>
      </div>

      {/* Human In The Loop Mandate Banner */}
      <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-sentinel-accent shrink-0 mt-0.5" />
        <div>
          <span className="font-mono font-bold text-sentinel-accent uppercase block">
            AI Recommends • Human Decides
          </span>
          <span className="text-[11px] text-slate-300 font-sans mt-0.5 block">
            Automatic high-impact actions (building evacuation, emergency sirens) are strictly prohibited without affirmative authorized human authorization.
          </span>
        </div>
      </div>

      {/* Step by Step Action Checklist */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
          Recommended Next Steps:
        </span>
        {incident.recommendations.map((rec) => (
          <div
            key={rec.id}
            onClick={() => !isResolved && toggleRecommendationStep(incident.id, rec.id)}
            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${rec.completed
                ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                : 'bg-sentinel-surface border-sentinel-border hover:bg-sentinel-hover text-slate-200'
              }`}
          >
            <button className="mt-0.5 text-sentinel-accent">
              {rec.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500 hover:text-slate-300" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${rec.completed ? 'line-through text-slate-400' : ''}`}>
                  {rec.step}. {rec.action}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${rec.priority === 'immediate' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                {rec.rationale}
              </p>
            </div>
          </div>
        ))}
        {aiError && <p className="rounded-lg border border-red-500/30 bg-red-950/20 p-2 text-[11px] text-red-300">{aiError}</p>}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-sentinel-border flex flex-wrap items-center gap-2">
        {!isAcknowledged && !isResolved && (
          <button
            onClick={() => acknowledgeIncident(incident.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Acknowledge Incident</span>
          </button>
        )}

        {isAcknowledged && !isResolved && (
          <div className="flex-1 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300 font-mono text-xs">
            <UserCheck className="w-4 h-4" />
            <span>Acknowledged by Officer Vance</span>
          </div>
        )}

        <button
          onClick={() => {
            addOperatorNote(incident.id, 'Visual verification requested from Sector B Patrol unit.');
          }}
          disabled={isResolved}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-sentinel-surface hover:bg-sentinel-hover border border-sentinel-border text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
        >
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Request Verification</span>
        </button>

        {!isResolved ? (
          <button
            onClick={() => setIsResolving(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Resolve</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-emerald-400 font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>INCIDENT RESOLVED & CLOSED</span>
          </div>
        )}
      </div>

      {/* Resolution Confirmation Modal */}
      {isResolving && (
        <div className="p-3 rounded-lg bg-sentinel-surface border border-emerald-500/40 space-y-2 animate-fadeIn">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
            Confirm Incident Resolution
          </span>
          <textarea
            value={resolutionReason}
            onChange={(e) => setResolutionReason(e.target.value)}
            className="w-full p-2 bg-sentinel-bg border border-sentinel-border rounded text-xs text-slate-200 font-sans"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsResolving(false)}
              className="px-3 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold"
            >
              Confirm Resolution
            </button>
          </div>
        </div>
      )}

      {/* Operator Notes Box */}
      <div className="pt-2 border-t border-sentinel-border space-y-2">
        <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
          Authorized Operator Case Notes:
        </span>

        {/* Existing Notes Stream */}
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {incident.operatorNotes.length > 0 ? (
            incident.operatorNotes.map((note) => (
              <div key={note.id} className="p-2 rounded bg-sentinel-bg border border-sentinel-border/40 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-sentinel-accent font-semibold">{note.operator}</span>
                  <span>[{note.timestamp}]</span>
                </div>
                <p className="text-slate-300 text-[11px] mt-0.5 font-sans">{note.note}</p>
              </div>
            ))
          ) : (
            <p className="text-[11px] font-mono text-slate-500 italic">No notes logged yet.</p>
          )}
        </div>

        {/* Note input */}
        {!isResolved && (
          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={operatorNoteText}
              onChange={(e) => setOperatorNoteText(e.target.value)}
              placeholder="Record operational note (e.g. Visual verification requested)..."
              className="flex-1 px-3 py-1.5 bg-sentinel-surface border border-sentinel-border rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sentinel-accent font-sans"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-sentinel-hover hover:bg-sentinel-border border border-sentinel-border rounded-lg text-xs font-mono text-slate-200 flex items-center gap-1"
            >
              <Send className="w-3 h-3 text-sentinel-accent" />
              <span>Add</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

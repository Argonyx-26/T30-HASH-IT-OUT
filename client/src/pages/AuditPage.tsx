import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldCheck, 
  User, 
  Cpu, 
  Activity, 
  Clock, 
  ArrowUpRight, 
  Lock 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuditPage: React.FC = () => {
  const { auditLog } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [actorFilter, setActorFilter] = useState<string>('all');

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch = entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (entry.incidentId && entry.incidentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActor = actorFilter === 'all' || 
                         (actorFilter === 'operator' && entry.actor === 'OPERATOR') ||
                         (actorFilter === 'agent' && entry.actor.includes('AGENT')) ||
                         (actorFilter === 'system' && entry.actor === 'SYSTEM');
    return matchesSearch && matchesActor;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sentinel-border">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-sentinel-accent" />
            <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-100">
              EXPLAINABILITY & IMMUTABLE AUDIT TRAIL
            </h1>
          </div>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Cryptographically Ordered Record of System Inferences, Algorithmic Correlation, and Operator Decisions
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5" />
          <span>TAMPER-RESISTANT LOGGING ACTIVE</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-sentinel-card border border-sentinel-border">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-sentinel-surface px-3 py-2 rounded-lg border border-sentinel-border">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit actions, incident IDs, or details..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Actor:</span>
          {['all', 'operator', 'agent', 'system'].map((a) => (
            <button
              key={a}
              onClick={() => setActorFilter(a)}
              className={`px-3 py-1 rounded capitalize transition-colors cursor-pointer ${
                actorFilter === a
                  ? 'bg-sentinel-accent text-slate-950 font-bold'
                  : 'bg-sentinel-surface text-slate-400 hover:text-white'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table / Stream */}
      <div className="p-4 sm:p-6 rounded-2xl bg-sentinel-card border border-sentinel-border shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-sentinel-border text-xs font-mono text-slate-400">
          <span>EVENT & INFERENCE LOG ({filteredLog.length} RECORDS)</span>
          <span>RUNTIME SIMULATION TIMESTAMPS</span>
        </div>

        {filteredLog.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            No audit records match the current filter criteria.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredLog.map((entry) => {
              const isOperator = entry.actor === 'OPERATOR';
              const isAgent = entry.actor.includes('AGENT');

              let actorBadge = 'bg-slate-800 text-slate-300 border-slate-700';
              if (isOperator) actorBadge = 'bg-purple-950/60 text-purple-300 border-purple-800/60';
              if (isAgent) actorBadge = 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60';

              return (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xl bg-sentinel-surface border border-sentinel-border hover:border-slate-600 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {isOperator ? (
                        <User className="w-4 h-4 text-purple-400" />
                      ) : isAgent ? (
                        <Cpu className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Activity className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${actorBadge}`}>
                          {entry.actor}
                        </span>
                        <span className="font-bold text-slate-200">
                          {entry.action}
                        </span>
                        {entry.incidentId && (
                          <Link
                            to={`/incidents/${entry.incidentId}`}
                            className="text-sentinel-accent hover:underline flex items-center gap-0.5"
                          >
                            <span>[{entry.incidentId}]</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      <p className="text-slate-300 font-sans text-xs leading-relaxed">
                        {entry.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 shrink-0 self-end md:self-center">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span className="text-slate-300 font-bold bg-sentinel-bg px-2 py-1 rounded border border-sentinel-border/50">
                      {entry.timestamp}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      (+{entry.relativeTime}s)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

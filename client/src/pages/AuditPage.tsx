import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Search, Filter, Trash2, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuditPage: React.FC = () => {
  const { auditLog, clearAuditLog, deleteAuditEntry } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [actorFilter, setActorFilter] = useState<string>('all');

  const handleClearAudit = async () => {
    if (!window.confirm('Clear the entire audit log? This cannot be undone.')) return;
    await clearAuditLog();
  };

  const handleDeleteAudit = async (auditId: string) => {
    if (!window.confirm('Delete this audit entry? This cannot be undone.')) return;
    await deleteAuditEntry(auditId);
  };

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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Activity</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">Audit Log</h1>
          </div>

          <button
            type="button"
            onClick={handleClearAudit}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-300 transition hover:bg-red-900/50"
          >
            <Trash2 className="h-4 w-4" />
            Clear log
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search actions or incident IDs"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </label>

          <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-300">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All</option>
              <option value="operator" className="bg-slate-900">Operator</option>
              <option value="agent" className="bg-slate-900">Agent</option>
              <option value="system" className="bg-slate-900">System</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-2 sm:p-3">
        {filteredLog.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-10 text-center text-sm text-slate-400">
            No audit records match the current filters.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLog.map((entry) => {
              const actorTone = entry.actor === 'OPERATOR'
                ? 'bg-violet-950/60 text-violet-200 border-violet-800/60'
                : entry.actor.includes('AGENT')
                  ? 'bg-cyan-950/60 text-cyan-200 border-cyan-800/60'
                  : 'bg-slate-800 text-slate-200 border-slate-700';

              return (
                <div
                  key={entry.id}
                  className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 sm:grid-cols-[120px_120px_1fr_auto] sm:items-start"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                    <span>{entry.timestamp}</span>
                  </div>

                  <div>
                    <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${actorTone}`}>
                      {entry.actor}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white">{entry.action}</div>
                    <p className="mt-1 text-sm text-slate-300">{entry.details}</p>
                    {entry.incidentId && (
                      <Link
                        to={`/incidents/${entry.incidentId}`}
                        className="mt-2 inline-block text-xs text-cyan-300 hover:text-cyan-200"
                      >
                        Incident {entry.incidentId}
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteAudit(entry.id)}
                      className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-red-700 hover:text-red-300"
                      title="Delete this audit entry"
                      aria-label={`Delete audit entry ${entry.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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

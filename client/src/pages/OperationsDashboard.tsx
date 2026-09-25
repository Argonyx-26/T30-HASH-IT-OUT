import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { CampusMap } from '../components/CampusMap';
import { StatusBadge } from '../components/StatusBadge';
import {
  Layers,
  CheckCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const OperationsDashboard: React.FC = () => {
  const {
    incidents,
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    events,
    state
  } = useSimulation();

  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string | undefined>(undefined);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Top Level System Header / Sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sentinel-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-100 flex items-center gap-2">
            <span>COMMAND & CONTROL MATRIX</span>
          </h1>
          <p className="text-xs font-sans text-slate-400 mt-0.5">
            Active Multi-Agent Situational Decision Support • Authorized Personnel Only
          </p>
        </div>

        {/* Status Metrics Bar */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sentinel-card border border-sentinel-border">
            <span className="text-slate-400">ACTIVE INCIDENTS:</span>
            <span className={`font-bold ${incidents.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {incidents.filter(i => i.status !== 'resolved').length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sentinel-card border border-sentinel-border">
            <span className="text-slate-400">SIGNALS INGESTED:</span>
            <span className="font-bold text-sentinel-accent">{events.length}</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Command Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: LEVEL 1 — Incident Queue (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-sentinel-accent" />
              <span>Prioritized Queue ({incidents.length})</span>
            </div>
            <Link
              to="/incidents"
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
            >
              <span>All Cases</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {incidents.length === 0 ? (
            <div className="p-6 rounded-xl bg-sentinel-card border border-sentinel-border text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="font-mono text-xs font-semibold text-slate-300">All Zones Nominal</p>
              <p className="text-[11px] text-slate-500 font-sans">
                Sentinel is monitoring for cross-modal signal convergence.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {incidents.map((inc) => {
                const isSelected = inc.id === selectedIncident?.id;
                const isCritical = inc.severity === 'critical';

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group ${isSelected
                      ? 'bg-sentinel-surface border-sentinel-accent shadow-lg shadow-sentinel-accent/10 translate-x-1'
                      : isCritical
                        ? 'bg-red-950/20 border-red-500/40 hover:bg-sentinel-hover'
                        : 'bg-sentinel-card border-sentinel-border hover:bg-sentinel-hover'
                      }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-sentinel-border/50">
                      <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-sentinel-accent">
                        {inc.id}
                      </span>
                      <StatusBadge status={inc.status} size="sm" />
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 mt-2 font-mono line-clamp-1">
                      {inc.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">{inc.zone}</p>

                    <div className="mt-3 flex items-center justify-between text-[10px] font-mono pt-2 border-t border-sentinel-border/40">
                      <span className="text-sentinel-accent font-bold">
                        {(inc.confidence * 100).toFixed(0)}% Conf
                      </span>
                      <span className="text-slate-400">
                        {inc.events.length} Sources
                      </span>
                      <span className="text-slate-500">
                        {inc.createdAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CENTER: LEVEL 2 — Digital Twin & Spatial Picture (5 Cols) */}
        <div className="lg:col-span-9 space-y-4">
          <CampusMap
            selectedZoneName={selectedIncident?.zone || selectedZoneFilter}
            onSelectZone={(zoneName) => setSelectedZoneFilter(zoneName)}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
          />

        </div>

      </div>

    </div>
  );
};

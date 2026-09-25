import React, { useState } from 'react';
import { SafetyEvent } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Radio, 
  Bell, 
  KeyRound, 
  Users, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

interface EventTimelineProps {
  events: SafetyEvent[];
  className?: string;
  maxEvents?: number;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, className = '', maxEvents = 10 }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getEventIcon = (type: SafetyEvent['eventType']) => {
    switch (type) {
      case 'thermal_anomaly': return Flame;
      case 'smoke_report': return Radio;
      case 'manual_alarm': return Bell;
      case 'access_violation': return KeyRound;
      case 'crowd_anomaly': return Users;
      default: return AlertCircle;
    }
  };

  const displayEvents = events.slice(0, maxEvents);

  return (
    <div className={`p-4 rounded-xl bg-sentinel-card border border-sentinel-border ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-sentinel-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sentinel-accent" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Temporal Signal Stream
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Dynamic Replay Clock
        </span>
      </div>

      {displayEvents.length === 0 ? (
        <div className="text-center py-6 text-slate-500 font-mono text-xs">
          No signals currently recorded. Start a scenario to stream telemetry.
        </div>
      ) : (
        <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-sentinel-border">
          {displayEvents.map((evt) => {
            const Icon = getEventIcon(evt.eventType);
            const isExpanded = expandedId === evt.id;

            return (
              <div key={evt.id} className="relative group">
                {/* Timeline node dot */}
                <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-sentinel-surface border-2 border-sentinel-accent flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-sentinel-accent" />
                </div>

                <div 
                  onClick={() => toggleExpand(evt.id)}
                  className="p-2.5 rounded-lg bg-sentinel-surface border border-sentinel-border hover:border-sentinel-accent/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-slate-900 text-sentinel-accent">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {evt.source}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={evt.severity} size="sm" />
                      <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        {evt.timestamp}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 font-sans line-clamp-1">
                    {evt.evidence}
                  </p>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-sentinel-border/50 text-[11px] font-mono space-y-1.5 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-2 text-slate-400">
                        <div>Zone: <span className="text-slate-200">{evt.zone}</span></div>
                        <div>Location: <span className="text-slate-200">{evt.location}</span></div>
                        <div>Event ID: <span className="text-slate-200">{evt.id}</span></div>
                        <div>Relative Offset: <span className="text-cyan-400">+{evt.relativeTime}s</span></div>
                        <div>Modality: <span className="text-slate-200 uppercase">{evt.sourceType.replace('_', ' ')}</span></div>
                        <div>Category: <span className="text-emerald-400 uppercase">{evt.evidenceCategory}</span></div>
                      </div>
                      <div className="p-2 rounded bg-sentinel-bg text-slate-300 font-sans mt-1">
                        <strong>Evidence Telemetry:</strong> {evt.evidence}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

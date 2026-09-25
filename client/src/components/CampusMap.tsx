import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { CampusZone, SafetyEvent } from '../types';
import { StatusBadge } from './StatusBadge';
import { Building2, Radio, Users, Clock, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface CampusMapProps {
  onSelectZone?: (zoneName: string) => void;
  onSelectEvent?: (eventId: string) => void;
  selectedEventId?: string;
  selectedZoneName?: string;
  className?: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({ onSelectZone, onSelectEvent, selectedEventId, selectedZoneName, className = '' }) => {
  const { zones, events, incidents, state } = useSimulation();
  const [inspectedZone, setInspectedZone] = useState<CampusZone | null>(null);
  const selectedEvent = events.find(event => event.id === selectedEventId) || null;

  const handleBuildingClick = (zone: CampusZone) => {
    setInspectedZone(zone);
    if (onSelectZone) {
      onSelectZone(zone.name);
    }
  };

  const handleEventClick = (event: SafetyEvent) => {
    const zone = zones.find(item => item.name.toLowerCase().includes(event.zone.toLowerCase()) || event.zone.toLowerCase().includes(item.name.toLowerCase()));
    if (zone) setInspectedZone(zone);
    onSelectEvent?.(event.id);

    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = event.severity === 'critical' ? 880 : 620;
      oscillator.type = 'sine';
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.24);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.26);
      window.setTimeout(() => audioContext.close(), 450);
    } catch {
      // Audio can be unavailable in browsers that block Web Audio.
    }
  };

  // Find recent events for building
  const getZoneEvents = (zoneName: string) => {
    const zoneEvents = events.filter(e => e.zone.toLowerCase().includes(zoneName.toLowerCase()) || zoneName.toLowerCase().includes(e.zone.toLowerCase()));
    const uniqueSignals = new Map<string, SafetyEvent>();

    for (const event of zoneEvents) {
      const signalKey = [event.source, event.eventType, event.zone, event.location, event.evidence].join('|');
      if (!uniqueSignals.has(signalKey)) uniqueSignals.set(signalKey, event);
    }

    return [...uniqueSignals.values()].slice(0, 4);
  };

  return (
    <div className={`relative bg-sentinel-card border border-sentinel-border rounded-xl p-4 overflow-hidden ${className}`}>
      {/* Map Header with Digital Twin Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-sentinel-border/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Digital Twin • Campus Spatial Mesh
          </h3>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            [BMS COLLEGE CAMPUS • BENGALURU]
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500" /> Nominal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Elevated
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Critical
          </span>
        </div>
      </div>

      {/* Stylized SVG Map Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-sentinel-bg rounded-lg border border-sentinel-border/40 overflow-hidden grid-bg flex items-center justify-center">

        {/* Subtle Radar Sweep Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 radar-sweep" />

        <svg
          viewBox="0 0 680 440"
          className="w-full h-full select-none"
        >
          {/* Subtle Campus Walkways & Spatial Grid */}
          <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5" strokeDasharray="3 3">
            <line x1="80" y1="180" x2="600" y2="180" />
            <line x1="80" y1="330" x2="600" y2="330" />
            <line x1="230" y1="60" x2="230" y2="400" />
            <line x1="430" y1="60" x2="430" y2="400" />
          </g>

          {/* Road / Main Spine Corridor */}
          <path
            d="M 230 60 L 230 400 M 80 190 L 600 190"
            stroke="rgba(0, 210, 255, 0.15)"
            strokeWidth="3"
            fill="none"
          />

          {/* Render Buildings */}
          {zones.map((zone) => {
            const isCritical = zone.status === 'critical';
            const isElevated = zone.status === 'elevated';
            const isWatch = zone.status === 'watch';
            const isSelected = selectedZoneName === zone.name || inspectedZone?.id === zone.id;

            // Fill & stroke styling
            let fill = '#111827';
            let stroke = '#1f293d';
            let glowFilter = '';

            if (isCritical) {
              fill = 'rgba(239, 68, 68, 0.15)';
              stroke = '#ef4444';
              glowFilter = 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.5))';
            } else if (isElevated) {
              fill = 'rgba(245, 158, 11, 0.15)';
              stroke = '#f59e0b';
              glowFilter = 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))';
            } else if (isWatch) {
              fill = 'rgba(59, 130, 246, 0.15)';
              stroke = '#3b82f6';
            } else if (isSelected) {
              stroke = '#00d2ff';
              fill = 'rgba(0, 210, 255, 0.1)';
            }

            const { x, y, width, height } = zone.coordinates;

            return (
              <g
                key={zone.id}
                onClick={() => handleBuildingClick(zone)}
                className="cursor-pointer transition-all duration-300 group"
                style={{ filter: glowFilter }}
              >
                {/* Proximity / Impact Ring for critical incidents */}
                {isCritical && (
                  <rect
                    x={x - 8}
                    y={y - 8}
                    width={width + 16}
                    height={height + 16}
                    rx="10"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-spin-slow opacity-60"
                  />
                )}

                {/* Building Main Polygon */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="6"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCritical || isSelected ? '2' : '1.2'}
                  className="transition-colors group-hover:fill-slate-800/80"
                />

                {/* Building 3D Top Accent Trim */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height="6"
                  rx="3"
                  fill={isCritical ? '#ef4444' : isElevated ? '#f59e0b' : '#25334d'}
                  className="opacity-70"
                />

                {/* Building Label */}
                <text
                  x={x + width / 2}
                  y={y + height / 2 - 4}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none"
                >
                  {zone.name}
                </text>

                {/* Building Status Subtitle */}
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 14}
                  textAnchor="middle"
                  fill={isCritical ? '#fca5a5' : isElevated ? '#fcd34d' : '#94a3b8'}
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  [{zone.status.toUpperCase()}]
                </text>

                {/* Active Sensor Beacon */}
                {zone.activeSources > 0 && (
                  <g transform={`translate(${x + width - 14}, ${y + 14})`}>
                    <circle r="4" fill={isCritical ? '#ef4444' : '#00d2ff'} className={isCritical ? 'animate-ping' : ''} />
                    <circle r="2.5" fill="#ffffff" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Active Sensor Event Pins Overlay */}
          {events.slice(0, 6).map((evt, idx) => {
            const matchingZone = zones.find(z => z.name.toLowerCase().includes(evt.zone.toLowerCase()));
            if (!matchingZone) return null;

            // Jitter positions slightly within building for realism
            const pinX = matchingZone.coordinates.x + 20 + ((idx * 28) % (matchingZone.coordinates.width - 40));
            const pinY = matchingZone.coordinates.y + matchingZone.coordinates.height - 18;

            return (
              <g
                key={evt.id}
                transform={`translate(${pinX}, ${pinY})`}
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation();
                  handleEventClick(evt);
                }}
                className="cursor-pointer animate-pulse"
                role="button"
                aria-label={`Inspect ${evt.eventType} from ${evt.source}`}
              >
                <circle r="6" fill="rgba(239, 68, 68, 0.3)" />
                <circle r="3.5" fill={selectedEventId === evt.id ? '#facc15' : '#ef4444'} />
                <text
                  x="8"
                  y="3"
                  fill="#fca5a5"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                >
                  {evt.source.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Simulation Watermark */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-[10px] font-mono text-slate-400">
          DIGITAL TWIN SIMULATION ENGINE • V1.0
        </div>
      </div>

      {/* Building Inspection Modal / Popover */}
      {inspectedZone && (
        <div className="mt-3 p-3.5 rounded-lg bg-sentinel-surface border border-sentinel-border transition-all animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sentinel-accent" />
              <h4 className="text-xs font-bold font-mono text-slate-100 uppercase">
                Zone Telemetry: {inspectedZone.name}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={inspectedZone.status} size="sm" />
              <button
                onClick={() => setInspectedZone(null)}
                className="text-slate-400 hover:text-slate-100 p-0.5 rounded hover:bg-sentinel-hover"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
            <div className="p-2 rounded bg-sentinel-bg/80 border border-sentinel-border/50">
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>Active Sources</span>
              </div>
              <p className="font-mono font-bold text-slate-100 mt-1">{inspectedZone.activeSources} Sensor Nodes</p>
            </div>

            <div className="p-2 rounded bg-sentinel-bg/80 border border-sentinel-border/50">
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                <Users className="w-3 h-3 text-emerald-400" />
                <span>Occupancy State</span>
              </div>
              <p className="font-mono font-bold text-slate-100 mt-1 uppercase">{inspectedZone.occupancyState}</p>
            </div>

            <div className="p-2 rounded bg-sentinel-bg/80 border border-sentinel-border/50">
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Correlated Incidents</span>
              </div>
              <p className="font-mono font-bold text-slate-100 mt-1">
                {incidents.filter(i => i.zone === inspectedZone.name && i.status !== 'resolved' && i.status !== 'false_alarm').length} Active
              </p>
            </div>

            <div className="p-2 rounded bg-sentinel-bg/80 border border-sentinel-border/50">
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Last Telemetry Sync</span>
              </div>
              <p className="font-mono font-bold text-slate-100 mt-1">{state.currentSimulatedClock}</p>
            </div>
          </div>

          {/* Recent signals in zone */}
          <div className="mt-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              Recent Signals Converging on Zone:
            </span>
            <div className="mt-1.5 space-y-1">
              {getZoneEvents(inspectedZone.name).length > 0 ? (
                getZoneEvents(inspectedZone.name).map((e) => (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => handleEventClick(e)}
                    className={`w-full flex items-center justify-between text-left text-[11px] font-mono p-1.5 rounded bg-sentinel-bg border transition-colors ${selectedEventId === e.id ? 'border-amber-400/70 bg-amber-500/10' : 'border-sentinel-border/30 hover:border-sentinel-accent/60'}`}
                  >
                    <span className="text-slate-300 font-semibold">{e.source}: {e.evidence}</span>
                    <span className="text-cyan-400 text-[10px]">{e.timestamp}</span>
                  </button>
                ))
              ) : (
                <div className="text-[11px] font-mono text-slate-500 py-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  All sensor baselines nominal. Zero anomaly excursions.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="mt-3 rounded-lg border border-amber-400/50 bg-amber-500/10 p-3.5 animate-fadeIn" role="alert">
          <div className="flex items-center justify-between border-b border-amber-400/20 pb-2">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">Selected sensor event</p>
              <h4 className="mt-0.5 font-mono text-sm font-bold text-slate-100">{selectedEvent.eventType.replaceAll('_', ' ')}</h4>
            </div>
            <span className="font-mono text-xs font-bold text-amber-200">{(selectedEvent.confidence * 100).toFixed(0)}% confidence</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 sm:grid-cols-4">
            <span>Source: <strong>{selectedEvent.source}</strong></span>
            <span>Time: <strong>{selectedEvent.timestamp}</strong></span>
            <span>Zone: <strong>{selectedEvent.zone}</strong></span>
            <span>Severity: <strong>{selectedEvent.severity}</strong></span>
          </div>
          <p className="mt-2 text-xs text-slate-200">{selectedEvent.evidence}</p>
          {events.filter(event => event.id !== selectedEvent.id && Math.abs(event.relativeTime - selectedEvent.relativeTime) <= 5).length > 0 && (
            <div className="mt-3 border-t border-amber-400/20 pt-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-amber-200">Signals detected at the same time</p>
              <div className="mt-1.5 space-y-1">
                {events
                  .filter(event => event.id !== selectedEvent.id && Math.abs(event.relativeTime - selectedEvent.relativeTime) <= 5)
                  .map(event => (
                    <button type="button" key={event.id} onClick={() => handleEventClick(event)} className="flex w-full items-center justify-between rounded bg-sentinel-bg/70 px-2 py-1 text-left text-[11px] text-slate-300 hover:bg-sentinel-hover">
                      <span>{event.eventType.replaceAll('_', ' ')} • {event.source}</span>
                      <span className="text-cyan-300">{(event.confidence * 100).toFixed(0)}%</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

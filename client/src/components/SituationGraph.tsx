import React, { useState } from 'react';
import { Incident, SafetyEvent } from '../types';
import { Flame, Radio, Bell, KeyRound, Users, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface SituationGraphProps {
  incident?: Incident | null;
  className?: string;
}

export const SituationGraph: React.FC<SituationGraphProps> = ({ incident, className = '' }) => {
  const [hoveredNode, setHoveredNode] = useState<SafetyEvent | null>(null);

  if (!incident) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-sentinel-card border border-sentinel-border rounded-xl text-center ${className}`}>
        <Sparkles className="w-8 h-8 text-slate-500 mb-2" />
        <p className="font-mono text-sm text-slate-400">No active incident selected.</p>
        <p className="text-xs text-slate-500 mt-1">Start a simulation scenario to view real-time situational correlation graphs.</p>
      </div>
    );
  }

  // Calculate layout coordinates for nodes orbiting around center
  const centerX = 300;
  const centerY = 190;
  const radius = 135;

  const events = incident.events || [];
  const nodeCount = Math.max(1, events.length);

  const getNodeIcon = (type: SafetyEvent['eventType']) => {
    switch (type) {
      case 'thermal_anomaly': return Flame;
      case 'smoke_report': return Radio;
      case 'manual_alarm': return Bell;
      case 'access_violation': return KeyRound;
      case 'crowd_anomaly': return Users;
      default: return AlertCircle;
    }
  };

  return (
    <div className={`relative bg-sentinel-card border border-sentinel-border rounded-xl p-4 overflow-hidden ${className}`}>
      {/* Graph Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-sentinel-border/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sentinel-accent animate-ping" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
            Situation Graph • Multi-Modal Evidence Mesh
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {events.length} Correlated Nodes • Active Topology
        </span>
      </div>

      {/* SVG Canvas for Nodes & Edges */}
      <div className="relative w-full aspect-[16/10] bg-sentinel-bg/90 rounded-lg border border-sentinel-border/40 grid-bg overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 600 380" className="w-full h-full select-none">
          <defs>
            <linearGradient id="edge-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render connecting edges from center to satellite nodes */}
          {events.map((evt, idx) => {
            const angle = (idx * (2 * Math.PI / nodeCount)) - (Math.PI / 2);
            const nodeX = centerX + radius * Math.cos(angle);
            const nodeY = centerY + radius * Math.sin(angle);

            return (
              <g key={`edge-${evt.id}`}>
                {/* Edge line with animated dash */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={nodeX}
                  y2={nodeY}
                  stroke="url(#edge-glow)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                
                {/* Animated traveling particle on edge */}
                <circle r="3" fill="#00d2ff" filter="url(#glow)">
                  <animateMotion
                    path={`M ${nodeX} ${nodeY} L ${centerX} ${centerY}`}
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Center Incident Node */}
          <g transform={`translate(${centerX}, ${centerY})`} className="cursor-pointer">
            {/* Outer halo */}
            <circle 
              r="48" 
              fill="rgba(239, 68, 68, 0.15)" 
              stroke="#ef4444" 
              strokeWidth="2"
              strokeDasharray="4 2"
              className="animate-spin-slow" 
            />
            {/* Inner Core */}
            <circle 
              r="38" 
              fill="#1e1523" 
              stroke="#ef4444" 
              strokeWidth="2"
              filter="url(#glow)"
            />
            <foreignObject x="-24" y="-28" width="48" height="48" className="pointer-events-none">
              <div className="flex flex-col items-center justify-center w-full h-full text-red-400">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
            </foreignObject>
            <text 
              y="14" 
              textAnchor="middle" 
              fill="#f1f5f9" 
              fontSize="9" 
              fontFamily="JetBrains Mono, monospace" 
              fontWeight="bold"
            >
              {incident.id}
            </text>
            <text 
              y="23" 
              textAnchor="middle" 
              fill="#ef4444" 
              fontSize="7" 
              fontFamily="JetBrains Mono, monospace" 
              fontWeight="bold"
            >
              {(incident.confidence * 100).toFixed(0)}% CONF
            </text>
          </g>

          {/* Orbiting Satellite Evidence Nodes */}
          {events.map((evt, idx) => {
            const angle = (idx * (2 * Math.PI / nodeCount)) - (Math.PI / 2);
            const nodeX = centerX + radius * Math.cos(angle);
            const nodeY = centerY + radius * Math.sin(angle);
            const Icon = getNodeIcon(evt.eventType);
            const isConfirmed = evt.evidenceCategory === 'confirmed';

            return (
              <g
                key={`node-${evt.id}`}
                transform={`translate(${nodeX}, ${nodeY})`}
                onMouseEnter={() => setHoveredNode(evt)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                {/* Node circle */}
                <circle
                  r="24"
                  fill="#111622"
                  stroke={isConfirmed ? '#10b981' : '#00d2ff'}
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-110"
                />

                <foreignObject x="-12" y="-12" width="24" height="24" className="pointer-events-none">
                  <div className={`flex items-center justify-center w-full h-full ${isConfirmed ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </foreignObject>

                {/* Satellite Label */}
                <text
                  y="34"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="8.5"
                  fontFamily="Inter, sans-serif"
                  fontWeight="600"
                >
                  {evt.source.split(' ')[0]}
                </text>
                <text
                  y="44"
                  textAnchor="middle"
                  fill={isConfirmed ? '#34d399' : '#38bdf8'}
                  fontSize="7.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {evt.eventType.replace('_', ' ').toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Node Tooltip Overlay */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3 rounded-lg bg-sentinel-surface/95 border border-sentinel-border backdrop-blur shadow-xl text-xs font-mono animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-sentinel-border/60">
              <span className="font-bold text-sentinel-accent">{hoveredNode.source}</span>
              <span className="text-[10px] text-slate-400">{hoveredNode.timestamp}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5 font-sans leading-relaxed">{hoveredNode.evidence}</p>
            <div className="mt-2 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Location: {hoveredNode.location}</span>
              <span className="text-emerald-400 font-bold">Contribution: +{Math.round(hoveredNode.confidence * 20)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

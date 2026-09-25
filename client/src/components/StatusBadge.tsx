import React from 'react';
import { IncidentSeverity, IncidentStatus, EventSeverity } from '../types';
import { AlertCircle, AlertTriangle, CheckCircle2, Eye, ShieldAlert, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status?: IncidentStatus | IncidentSeverity | EventSeverity | 'nominal';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'watch', size = 'md', showIcon = true }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'nominal':
        return {
          label: 'NOMINAL',
          icon: CheckCircle2,
          classes: 'bg-slate-500/10 text-slate-300 border-slate-500/30'
        };
      case 'critical':
        return {
          label: 'CRITICAL',
          icon: ShieldAlert,
          classes: 'bg-red-500/10 text-red-400 border-red-500/30'
        };
      case 'elevated':
      case 'high':
        return {
          label: 'ELEVATED',
          icon: AlertTriangle,
          classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
      case 'watch':
      case 'medium':
        return {
          label: 'WATCH',
          icon: Eye,
          classes: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
        };
      case 'acknowledged':
        return {
          label: 'ACKNOWLEDGED',
          icon: AlertCircle,
          classes: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
        };
      case 'resolved':
      case 'low':
        return {
          label: 'RESOLVED',
          icon: CheckCircle2,
          classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        };
      case 'false_alarm':
        return {
          label: 'FALSE ALARM',
          icon: Sparkles,
          classes: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
        };
      default:
        return {
          label: String(status).toUpperCase(),
          icon: Eye,
          classes: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  return (
    <span className={`inline-flex items-center font-mono font-medium tracking-wider rounded-md border ${config.classes} ${sizeClasses}`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowUpRight, X } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const IncidentAlertToast: React.FC = () => {
  const { activeAlert, dismissAlert } = useSimulation();

  useEffect(() => {
    if (!activeAlert) return;
    const timeoutId = window.setTimeout(dismissAlert, 8000);
    return () => window.clearTimeout(timeoutId);
  }, [activeAlert, dismissAlert]);

  if (!activeAlert) return null;

  const isCritical = activeAlert.severity === 'critical';

  return (
    <div className="fixed right-4 top-20 z-[60] w-[min(24rem,calc(100vw-2rem))] animate-in slide-in-from-right-4">
      <div className={`rounded-xl border shadow-2xl backdrop-blur-md ${isCritical
        ? 'border-red-400/60 bg-red-950/95 shadow-red-950/40'
        : 'border-amber-400/50 bg-slate-950/95 shadow-slate-950/40'
        }`} role="alert" aria-live="assertive">
        <div className="flex items-start gap-3 p-4">
          <div className={`mt-0.5 rounded-lg p-2 ${isCritical ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">
                New incident detected
              </p>
              <button
                type="button"
                onClick={dismissAlert}
                className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Dismiss incident alert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 truncate font-mono text-sm font-bold text-white">{activeAlert.title}</p>
            <p className="mt-1 text-xs text-slate-300">{activeAlert.zone} • {activeAlert.severity.toUpperCase()}</p>
            <Link
              to={`/incidents/${activeAlert.id}`}
              onClick={dismissAlert}
              className={`mt-3 inline-flex items-center gap-1 font-mono text-xs font-bold ${isCritical ? 'text-red-200' : 'text-amber-200'} hover:underline`}
            >
              Open incident <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  Activity,
  Layers,
  PlayCircle,
  BarChart3,
  FileText,
  Settings,
  Sun,
  Moon,
  Radio,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { state } = useSimulation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/operations', label: 'Operations', icon: Activity },
    { to: '/incidents', label: 'Incidents', icon: Layers },
    { to: '/simulation', label: 'Simulation', icon: PlayCircle },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/audit', label: 'Audit', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-sentinel-bg/90 border-b border-sentinel-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sentinel-accent to-blue-600 flex items-center justify-center shadow-lg shadow-sentinel-accent/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-lg font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
                  SENTINEL
                  <span className="w-1.5 h-1.5 rounded-full bg-sentinel-accent animate-ping" />
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-1">
                  Situational AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all ${active
                      ? 'bg-sentinel-surface text-sentinel-accent border border-sentinel-accent/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-sentinel-hover'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Status Indicators & Quick Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Simulation Mode Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
              <Radio className="w-3 h-3 animate-pulse" />
              <span className="font-semibold tracking-wide">SIMULATION MODE</span>
            </div>

            {/* Simulated Dynamic Clock */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-sentinel-accent">
              <span className="text-slate-500 text-[10px]">SIM TIME</span>
              <span className="font-bold text-sm tracking-wider">{state.currentSimulatedClock}</span>
              <span className="text-[10px] text-slate-400 px-1 rounded bg-slate-800 font-bold">{state.speed}x</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-sentinel-hover border border-transparent hover:border-sentinel-border transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sentinel-border bg-sentinel-card p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono ${active ? 'bg-sentinel-surface text-sentinel-accent' : 'text-slate-400'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-sentinel-border flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold">● SIMULATION MODE</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs font-mono text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

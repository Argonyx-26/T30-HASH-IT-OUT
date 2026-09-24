import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SimulationProvider } from './context/SimulationContext';
import { Navbar } from './components/Navbar';

import { LandingPage } from './pages/LandingPage';
import { OperationsDashboard } from './pages/OperationsDashboard';
import { IncidentsPage } from './pages/IncidentsPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { SimulationPage } from './pages/SimulationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditPage } from './pages/AuditPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SimulationProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-sentinel-bg text-slate-100 flex flex-col font-sans transition-colors duration-300">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/operations" element={<OperationsDashboard />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/incidents/:id" element={<IncidentDetailPage />} />
                <Route path="/simulation" element={<SimulationPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/audit" element={<AuditPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t border-sentinel-border/70 bg-sentinel-card/70 py-5 text-xs font-mono text-slate-400">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">SENTINEL</span>
                  <span className="text-slate-600">/</span>
                  <span>Situational awareness platform</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span>AI recommends, humans decide</span>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </SimulationProvider>
    </ThemeProvider>
  );
};

export default App;

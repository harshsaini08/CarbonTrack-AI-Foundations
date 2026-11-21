import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DemoTourModal } from './components/DemoTourModal';

// Pages
import { ExecutiveCommandCenter } from './pages/ExecutiveCommandCenter';
import { AIFoundationsPage } from './pages/AIFoundationsPage';
import { SmartDataIngestion } from './pages/SmartDataIngestion';
import { CarbonAuditor } from './pages/CarbonAuditor';
import { SupplierIntelligence } from './pages/SupplierIntelligence';
import { FairScoreAI } from './pages/FairScoreAI';
import { CarbonTwinSimulator } from './pages/CarbonTwinSimulator';
import { ProofChainAuditTrail } from './pages/ProofChainAuditTrail';
import { SustainabilityCopilot } from './pages/SustainabilityCopilot';
import { ReportGenerator } from './pages/ReportGenerator';
import { SettingsPage } from './pages/SettingsPage';

import { Role } from './types';
import { api } from './services/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [activeRole, setActiveRole] = useState<Role>('sustainability_manager');
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRoleChange = async (newRole: Role) => {
    setActiveRole(newRole);
    try {
      await api.switchRole(newRole);
    } catch (err) {
      console.error('Failed to update role on backend', err);
    }
  };

  const handleDataReload = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen bg-charcoal-950 text-slate-100 overflow-hidden font-sans">
      {/* Professional Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          onDataReload={handleDataReload}
          onOpenDemoTour={() => setIsDemoTourOpen(true)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto bg-charcoal-950">
          <div key={refreshKey}>
            {currentTab === 'overview' && <ExecutiveCommandCenter />}
            {currentTab === 'ai-foundations' && <AIFoundationsPage />}
            {currentTab === 'ingestion' && <SmartDataIngestion />}
            {currentTab === 'auditor' && <CarbonAuditor activeRole={activeRole} />}
            {currentTab === 'suppliers' && <SupplierIntelligence />}
            {currentTab === 'fairness' && <FairScoreAI />}
            {currentTab === 'simulator' && <CarbonTwinSimulator />}
            {currentTab === 'proofchain' && <ProofChainAuditTrail />}
            {currentTab === 'copilot' && <SustainabilityCopilot />}
            {currentTab === 'reports' && <ReportGenerator />}
            {currentTab === 'settings' && (
              <SettingsPage activeRole={activeRole} onRoleChange={handleRoleChange} />
            )}
          </div>
        </main>
      </div>

      {/* Guided Project Demonstration Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateToStep={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}

export default App;

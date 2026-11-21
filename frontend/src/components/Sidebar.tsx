import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  ShieldAlert,
  Building2,
  Scale,
  Sparkles,
  Link2,
  BotMessageSquare,
  FileSpreadsheet,
  Settings,
  Leaf,
  Layers
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, activeRole }) => {
  const navItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard, badge: null },
    { id: 'ingestion', label: 'Data Ingestion', icon: UploadCloud, badge: 'Live' },
    { id: 'auditor', label: 'Carbon Auditor', icon: ShieldAlert, badge: 'AI' },
    { id: 'suppliers', label: 'Supplier Intel', icon: Building2, badge: null },
    { id: 'fairness', label: 'FairScore AI', icon: Scale, badge: 'Bias AI' },
    { id: 'simulator', label: 'Carbon Twin', icon: Sparkles, badge: 'What-If' },
    { id: 'proofchain', label: 'ProofChain Trail', icon: Link2, badge: 'SHA-256' },
    { id: 'copilot', label: 'AI Copilot', icon: BotMessageSquare, badge: 'Copilot' },
    { id: 'reports', label: 'Audit Reports', icon: FileSpreadsheet, badge: 'PDF' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const roleLabels: Record<Role, { title: string; color: string }> = {
    admin: { title: 'Administrator', color: 'bg-purple-900/60 text-purple-300 border-purple-700/50' },
    sustainability_manager: { title: 'Sustainability Mgr', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' },
    auditor: { title: 'Lead ESG Auditor', color: 'bg-amber-900/60 text-amber-300 border-amber-700/50' },
  };

  return (
    <aside className="w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-charcoal-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-forest-800 flex items-center justify-center shadow-lg shadow-emerald-900/30">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-white font-sans">CarbonTrack</span>
            <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">v2.4</span>
          </div>
          <p className="text-[11px] text-charcoal-400 font-medium">Enterprise Footprint Auditor</p>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-2.5 bg-charcoal-850/80 border-b border-charcoal-800/80 flex items-center justify-between text-xs">
        <span className="text-charcoal-400 text-[11px]">Active Persona</span>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${roleLabels[activeRole].color}`}>
          {roleLabels[activeRole].title}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
          Core Audit Suite
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-forest-800 text-emerald-300 shadow-sm border border-emerald-700/40 shadow-emerald-950/40'
                  : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-charcoal-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-200'
                      : 'bg-charcoal-800 text-charcoal-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-charcoal-800 bg-charcoal-950/60">
        <div className="flex items-center justify-between text-xs text-charcoal-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-charcoal-300">GHG Scope 1-3 Active</span>
          </div>
          <span className="text-[10px] font-mono text-charcoal-400 bg-charcoal-800 px-1.5 py-0.5 rounded">SQLite</span>
        </div>
      </div>
    </aside>
  );
};

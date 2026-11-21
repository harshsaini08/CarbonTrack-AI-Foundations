import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  UserCheck,
  ChevronDown,
  Building,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { Role } from '../types';
import { api } from '../services/api';

interface HeaderProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  onDataReload: () => void;
  onOpenDemoTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  onDataReload,
  onOpenDemoTour
}) => {
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeedDemo = async () => {
    try {
      setLoadingSeed(true);
      await api.seedDemoData();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
      onDataReload();
    } catch (err) {
      console.error('Failed to load demo data', err);
      alert('Error reloading demo dataset.');
    } finally {
      setLoadingSeed(false);
    }
  };

  const roles: { id: Role; label: string; desc: string }[] = [
    { id: 'admin', label: 'Administrator', desc: 'Full configuration, data ingestion, factor management' },
    { id: 'sustainability_manager', label: 'Sustainability Manager', desc: 'Emissions analytics, simulations, ESG reporting' },
    { id: 'auditor', label: 'Lead ESG Auditor', desc: 'Verification, finding reviews, ProofChain sign-off' },
  ];

  return (
    <header className="h-16 bg-charcoal-900/90 backdrop-blur-md border-b border-charcoal-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Academic & Institutional Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-charcoal-200">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Lovely Professional University</span>
          <span className="text-charcoal-500">/</span>
          <span className="text-xs bg-emerald-950/70 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50 font-medium">
            AI Foundations · Continuous Assessment (CA)
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Guided Project Demonstration Button */}
        <button
          onClick={onOpenDemoTour}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/50 transition-colors shadow-sm"
          title="Open Guided Project Demonstration for Faculty Evaluators"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Guided Project Demonstration</span>
        </button>

        {/* One-Click Load Demo Dataset Button */}
        <button
          onClick={handleSeedDemo}
          disabled={loadingSeed}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
            seedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-forest-700 hover:bg-forest-600 text-emerald-100 border border-emerald-500/40'
          }`}
          title="Resets database with 32+ realistic suppliers and all test scenarios"
        >
          {loadingSeed ? (
            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
          ) : seedSuccess ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5" />
          )}
          <span>{loadingSeed ? 'Seeding...' : seedSuccess ? 'Demo Loaded!' : 'Load Demo Dataset'}</span>
        </button>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-charcoal-600 text-xs font-medium text-charcoal-200 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="capitalize">{activeRole.replace('_', ' ')}</span>
            <ChevronDown className="w-3 h-3 text-charcoal-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-charcoal-900 border border-charcoal-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-charcoal-500 border-b border-charcoal-800">
                Switch Perspective
              </div>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onRoleChange(r.id);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors hover:bg-charcoal-800 ${
                    activeRole === r.id ? 'bg-forest-900/60 text-emerald-300 font-semibold' : 'text-charcoal-300'
                  }`}
                >
                  <div className="font-medium text-white">{r.label}</div>
                  <div className="text-[10px] text-charcoal-400 mt-0.5 leading-snug">{r.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

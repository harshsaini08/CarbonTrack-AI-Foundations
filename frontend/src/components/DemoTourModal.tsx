import React from 'react';
import { X, CheckCircle, ArrowRight, Sparkles, Shield, Scale, Trees, FileDown, Bot } from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStep: (tab: string) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToStep,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      tab: 'ingestion',
      title: 'Smart Data Ingestion',
      desc: 'Load the 32+ synthetic supply-chain records featuring intentional test edge-cases (high-emission suppliers, reporting discrepancies, scale distortions).',
      icon: Trees,
    },
    {
      step: 2,
      tab: 'overview',
      title: 'Executive Command Center',
      desc: 'Inspect enterprise-wide Scope 1, 2, and 3 emissions, supplier category contributions, monthly trends, and emission intensity scatters.',
      icon: Sparkles,
    },
    {
      step: 3,
      tab: 'auditor',
      title: 'AI Carbon Auditor',
      desc: 'Review mathematical anomalies: excessive fuel consumption, reporting discrepancies, and air-freight hotspots with auditor verification controls.',
      icon: Shield,
    },
    {
      step: 4,
      tab: 'fairness',
      title: 'FAIRScore AI Supplier Equity',
      desc: 'Compare traditional gross-emission ranking against normalized intensity ranking. See how small suppliers jump up to 25 positions when scale bias is eliminated.',
      icon: Scale,
    },
    {
      step: 5,
      tab: 'simulator',
      title: 'Carbon Twin What-If Simulator',
      desc: 'Simulate switching freight logistics from Road to Rail, adding solar renewables, and observe real-time carbon reduction (%) and cost savings ($).',
      icon: Sparkles,
    },
    {
      step: 6,
      tab: 'proofchain',
      title: 'ProofChain Tamper-Evident Trail',
      desc: 'Inspect cryptographically linked SHA-256 evidence blocks, verify unbroken cryptographic continuity, and inspect immutable audit logs.',
      icon: Shield,
    },
    {
      step: 7,
      tab: 'copilot',
      title: 'AI Sustainability Copilot',
      desc: 'Ask questions like "Why was Supplier S-102 flagged?" or "Which small suppliers may be unfairly evaluated?" and receive real evidence citations.',
      icon: Bot,
    },
    {
      step: 8,
      tab: 'reports',
      title: 'Executive PDF Audit Reports',
      desc: 'Generate and download official GHG-Protocol compliant enterprise footprint audits and single-supplier verification certificates.',
      icon: FileDown,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-charcoal-900 border border-charcoal-750 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-forest-900 to-charcoal-900 border-b border-charcoal-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">CarbonTrack Hackathon Evaluation Flow</h2>
              <p className="text-xs text-charcoal-300">8-Step Comprehensive Demonstration Walkthrough</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 hover:border-emerald-600/40 transition-all flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-charcoal-400 mt-0.5 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onNavigateToStep(s.tab);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-800/50 flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>Launch</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-charcoal-950 border-t border-charcoal-800 flex items-center justify-between text-xs text-charcoal-400">
          <span>All modules run on live application data and persistent SQLite database.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

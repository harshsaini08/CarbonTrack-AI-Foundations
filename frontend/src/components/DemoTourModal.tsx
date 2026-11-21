import React from 'react';
import {
  X,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Database,
  Layers,
  ShieldAlert,
  Scale,
  TrendingDown,
  Link2,
  BotMessageSquare,
  FileSpreadsheet,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

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
      tab: 'ai-foundations',
      title: '1. Understanding the CarbonTrack Project',
      aiConcept: 'Applied AI & Decision Support Architecture',
      desc: 'Review the academic foundations, problem formulation, system taxonomy, and the explicit distinction between rule-based heuristics and statistical algorithms.',
      icon: GraduationCap,
    },
    {
      step: 2,
      tab: 'ingestion',
      title: '2. Loading the Demonstration Dataset',
      aiConcept: 'Data-Driven Intelligence & Quality Scoring',
      desc: 'Inspect the 32-supplier multi-tier dataset. Observe automated column mapping, data validation, missing-value recalculation, and data quality scoring.',
      icon: Database,
    },
    {
      step: 3,
      tab: 'overview',
      title: '3. Exploring the Carbon Footprint Dashboard',
      aiConcept: 'Visual Analytics & Multi-Criteria Synthesis',
      desc: 'Analyze enterprise-wide Scope 1-3 footprint (16,776 tCO2e), monthly curves, sector distributions, and the intensity vs volume scatter benchmark.',
      icon: Sparkles,
    },
    {
      step: 4,
      tab: 'auditor',
      title: '4. Performing an Automated Carbon Audit',
      aiConcept: 'Rule-Based Expert System & Anomaly Detection',
      desc: 'Run the rule-based auditing engine to detect excessive fuel draw, air-freight hotspots, and reporting discrepancies across 20 prioritized findings.',
      icon: ShieldAlert,
    },
    {
      step: 5,
      tab: 'overview',
      title: '5. Understanding Scope 1, 2, and 3 Emissions',
      aiConcept: 'Codified GHG Protocol Knowledge Base',
      desc: 'Examine transparent mathematical activity formulas: fuel x 2.68, electricity x 0.42, transport distance x modal factor with complete factor disclosure.',
      icon: Layers,
    },
    {
      step: 6,
      tab: 'fairness',
      title: '6. Examining Supplier Sustainability & FAIRScore',
      aiConcept: 'Production Normalization & Bias Mitigation',
      desc: 'Contrast traditional gross emissions against volume-normalized intensity, proving how small vendors are protected from scale disadvantage.',
      icon: Scale,
    },
    {
      step: 7,
      tab: 'fairness',
      title: '7. Understanding Statistical Bias Detection',
      aiConcept: 'Statistical Dispersion & Disparity Flags',
      desc: 'Evaluate rank shift deltas (Oceanic Bulk +20 vs MicroMelt -25), peer-group standard deviation bands, and explainable equity rationales.',
      icon: Scale,
    },
    {
      step: 8,
      tab: 'simulator',
      title: '8. Running Carbon Reduction Simulations',
      aiConcept: 'Counterfactual What-If Modeling',
      desc: 'Simulate shifting road freight to electrified rail and adopting 60% on-site solar, observing a dynamic -30.6% footprint cut and $42,500 annual savings.',
      icon: TrendingDown,
    },
    {
      step: 9,
      tab: 'proofchain',
      title: '9. Verifying ProofChain Data Integrity',
      aiConcept: 'Cryptographic Hashing & Non-Repudiation',
      desc: 'Inspect 21 SHA-256 blocks chained from genesis. Run automated mathematical verification to prove non-repudiation and tamper detection.',
      icon: Link2,
    },
    {
      step: 10,
      tab: 'copilot',
      title: '10. Asking Questions through the AI Copilot',
      aiConcept: 'Domain NLP & Database-Grounded Retrieval',
      desc: 'Interrogate the dataset in natural language ("Who are the top 5 emitters?", "Why was S-102 flagged?") and receive database-grounded answers.',
      icon: BotMessageSquare,
    },
    {
      step: 11,
      tab: 'reports',
      title: '11. Generating an Analytical PDF Report',
      aiConcept: 'Automated Technical Communication',
      desc: 'Compile an audit-grade PDF report compliant with GHG Protocol standards, complete with Scope breakdowns, FAIRScore equity tables, and ProofChain seal.',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-charcoal-900 border border-charcoal-750 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-forest-900 via-charcoal-900 to-charcoal-900 border-b border-charcoal-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Guided Project Demonstration</h2>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  Faculty Evaluation Guide
                </span>
              </div>
              <p className="text-xs text-charcoal-300 mt-0.5">
                Lovely Professional University · Artificial Intelligence Foundations (CA) · 11-Step Evaluation Flow
              </p>
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
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-3.5 rounded-xl bg-charcoal-850/80 border border-charcoal-800 hover:border-emerald-600/50 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {s.title}
                      </h3>
                      <span className="text-[10px] font-mono bg-charcoal-800 text-emerald-400 px-2 py-0.5 rounded border border-charcoal-700">
                        {s.aiConcept}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-300 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigateToStep(s.tab);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 hover:bg-emerald-800/60 flex items-center gap-1.5 shrink-0 transition-colors shadow-sm self-center"
                >
                  <span>Navigate</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-charcoal-950 border-t border-charcoal-800 flex items-center justify-between text-xs text-charcoal-400 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Academic demonstration running on live SQLite database (32 suppliers, 20 findings, 21 ProofChain blocks).</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

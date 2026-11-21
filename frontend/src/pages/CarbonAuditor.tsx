import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { AuditFinding, Role } from '../types';
import { api } from '../services/api';

interface CarbonAuditorProps {
  activeRole: Role;
}

export const CarbonAuditor: React.FC<CarbonAuditorProps> = ({ activeRole }) => {
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Review Modal State
  const [activeFinding, setActiveFinding] = useState<AuditFinding | null>(null);
  const [reviewAction, setReviewAction] = useState('approve');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchFindings();
  }, [selectedSeverity, selectedStatus, searchQuery]);

  const fetchFindings = async () => {
    try {
      setLoading(true);
      const data = await api.getFindings(selectedSeverity, selectedStatus, searchQuery);
      setFindings(data);
    } catch (err) {
      console.error('Failed to load findings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    try {
      setRunningAudit(true);
      await api.runAudit();
      await fetchFindings();
    } catch (err) {
      alert('Error running audit');
    } finally {
      setRunningAudit(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFinding) return;

    try {
      setSubmittingReview(true);
      await api.reviewFinding(
        activeFinding.id,
        reviewAction,
        reviewComment || `Finding ${reviewAction}d by ${activeRole.replace('_', ' ')}`
      );
      setActiveFinding(null);
      setReviewComment('');
      fetchFindings();
    } catch (err) {
      alert('Error updating finding review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="pb-2 border-b border-charcoal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>AI Carbon Auditor</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              Explainable Anomaly Engine
            </span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Reconstructs reported carbon disclosures from physical activity telemetry. Highlights reporting discrepancies and carbon intensity outliers.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={runningAudit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm self-start md:self-auto"
        >
          <Sparkles className={`w-3.5 h-3.5 ${runningAudit ? 'animate-spin' : ''}`} />
          <span>{runningAudit ? 'Auditing Portfolio...' : 'Run AI Carbon Audit'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-charcoal-900 p-2 rounded-xl border border-charcoal-800">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by supplier or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-800 border border-charcoal-700 text-xs rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-charcoal-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-400 text-[11px]">Severity:</span>
          {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedSeverity === sev
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                  : 'text-charcoal-400 hover:text-white bg-charcoal-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-400 text-[11px]">Status:</span>
          {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedStatus === st
                  ? 'bg-blue-900/60 text-blue-300 border border-blue-700/60'
                  : 'text-charcoal-400 hover:text-white bg-charcoal-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Count Summary */}
      <div className="flex items-center justify-between text-xs text-charcoal-400 px-1">
        <span>Showing <strong>{findings.length}</strong> active audit findings</span>
        <span className="font-mono text-emerald-400">GHG Corporate Standard Transparent Calculation</span>
      </div>

      {/* Findings Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-charcoal-400">Loading verified audit telemetry...</div>
      ) : findings.length === 0 ? (
        <div className="p-12 text-center bg-charcoal-850/60 rounded-2xl border border-charcoal-800 text-charcoal-400 text-xs">
          No audit anomalies detected under active filters. Click "Run AI Carbon Audit" or reset filters.
        </div>
      ) : (
        <div className="space-y-4">
          {findings.map((f) => (
            <div
              key={f.id}
              className="p-5 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 hover:border-charcoal-700 transition-all space-y-4"
            >
              {/* Finding Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <StatusBadge type="severity" value={f.severity} />
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                    {f.supplier_name}
                  </span>
                  <span className="text-xs text-charcoal-400 font-medium">{f.supplier_industry}</span>
                  <span className="text-charcoal-600">•</span>
                  <span className="text-xs text-charcoal-400">{f.issue_type}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-charcoal-400 font-mono">
                    Impact: <strong className="text-white">{f.estimated_impact_tco2e.toLocaleString()} tCO2e</strong>
                  </span>
                  <StatusBadge type="status" value={f.status} />
                  <button
                    onClick={() => setActiveFinding(f)}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-emerald-300 bg-forest-800/80 hover:bg-forest-700 border border-emerald-600/40 transition-colors flex items-center gap-1"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Review / Verify</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">{f.issue_title}</h3>
                <p className="text-xs text-charcoal-300 leading-relaxed">{f.description}</p>
              </div>

              {/* Supporting Telemetry & Recommendation Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-charcoal-800/80 text-xs">
                {/* Supporting Telemetry */}
                <div className="p-3 rounded-xl bg-charcoal-900/90 border border-charcoal-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-charcoal-400 uppercase">
                    <span>Mathematical Evidence</span>
                    <span className="font-mono text-emerald-400">Confidence: {(f.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  {f.supporting_data && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      {Object.entries(f.supporting_data).map(([key, val]) => (
                        <div key={key} className="bg-charcoal-850 p-1.5 rounded">
                          <span className="text-charcoal-400 block text-[10px]">{key.replace('_', ' ')}</span>
                          <span className="text-white font-medium">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommended Corrective Action */}
                <div className="p-3 rounded-xl bg-forest-950/40 border border-emerald-900/40 space-y-2">
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase">
                    Recommended Corrective Action
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {f.recommended_action}
                  </p>
                  {f.reviewer_comment && (
                    <div className="text-[11px] text-charcoal-300 pt-1 border-t border-emerald-900/30">
                      <strong>Auditor Note ({f.reviewed_by}):</strong> {f.reviewer_comment}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal Dialog */}
      {activeFinding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-charcoal-750 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400">{activeFinding.supplier_name}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeFinding.issue_title}</h3>
              </div>
              <StatusBadge type="severity" value={activeFinding.severity} />
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-charcoal-400 font-medium mb-1.5">Auditor Decision</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'approve', label: 'Approve & Confirm' },
                    { id: 'reject', label: 'Reject / False Positive' },
                    { id: 'investigating', label: 'Flag for Investigation' }
                  ].map((act) => (
                    <button
                      type="button"
                      key={act.id}
                      onClick={() => setReviewAction(act.id)}
                      className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                        reviewAction === act.id
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-charcoal-800 border-charcoal-700 text-charcoal-300 hover:text-white'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-charcoal-400 font-medium mb-1.5">Auditor Sign-off Comments</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Enter verification notes, evidence citations, or reconciliation instructions..."
                  className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg p-2.5 text-white placeholder-charcoal-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="p-3 rounded-lg bg-charcoal-950 border border-charcoal-800 text-[11px] text-charcoal-400">
                🔒 Submitting this review cryptographically commits the action to the <strong>ProofChain SHA-256 Audit Ledger</strong>.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFinding(null)}
                  className="px-4 py-2 rounded-lg text-charcoal-300 hover:text-white hover:bg-charcoal-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5"
                >
                  {submittingReview ? 'Signing to ProofChain...' : 'Seal & Commit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

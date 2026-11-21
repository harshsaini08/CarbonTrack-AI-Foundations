import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Building,
  CheckCircle2,
  FileCheck2,
  Scale,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { Supplier } from '../types';
import { api } from '../services/api';

export const ReportGenerator: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [downloadingEnterprise, setDownloadingEnterprise] = useState(false);
  const [downloadingSupplier, setDownloadingSupplier] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await api.getSuppliers();
      setSuppliers(data);
      if (data.length > 0) setSelectedSupplierId(data[0].id);
    } catch (err) {
      console.error('Failed to load suppliers for reporting', err);
    }
  };

  const handleDownloadEnterprise = () => {
    setDownloadingEnterprise(true);
    const link = document.createElement('a');
    link.href = api.getEnterprisePdfUrl();
    link.download = 'CarbonTrack_Enterprise_Audit_Report_2026.pdf';
    link.click();
    setTimeout(() => setDownloadingEnterprise(false), 2000);
  };

  const handleDownloadSupplier = () => {
    if (!selectedSupplierId) return;
    setDownloadingSupplier(true);
    const link = document.createElement('a');
    link.href = api.getSupplierPdfUrl(selectedSupplierId);
    link.download = `CarbonTrack_Supplier_Certificate_${selectedSupplierId}.pdf`;
    link.click();
    setTimeout(() => setDownloadingSupplier(false), 2000);
  };

  const reportSections = [
    { num: '1', title: 'Executive Summary', desc: 'Consolidated carbon footprint summary across all global operational tiers' },
    { num: '2', title: 'Scope 1, 2, and 3 Disclosures', desc: 'Detailed activity metrics: direct fuel, purchased grid electricity, logistics freight' },
    { num: '3', title: 'Top Carbon Contributors', desc: 'Portfolio concentration analysis and production intensity scatter benchmarks' },
    { num: '4', title: 'FAIRScore AI Supplier Equity', desc: 'Normalized peer intensity rankings, scale bias adjustments, and rank shift delta' },
    { num: '5', title: 'Prioritized Audit Findings', desc: 'Severity-tagged anomalies with supporting telemetry and recommended actions' },
    { num: '6', title: 'ProofChain Cryptographic Seal', desc: 'SHA-256 hash-linked audit block reference and mathematical integrity confirmation' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="pb-2 border-b border-charcoal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Audit Report Generator</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              GHG Compliant PDF
            </span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Export comprehensive, audit-grade sustainability reports compliant with the GHG Protocol Corporate Standard, complete with ProofChain verification hashes.
          </p>
        </div>
      </div>

      {/* Primary Action Cards (Enterprise vs Supplier Report) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enterprise Report Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-forest-950/80 to-charcoal-900 border border-emerald-800/80 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Comprehensive Enterprise Audit Report</h2>
              <p className="text-xs text-charcoal-300 mt-1 leading-relaxed">
                Full-scope corporate sustainability audit covering all 32+ suppliers, Scope 1–3 breakdown, FAIRScore equity shifts, and prioritized corrective action plans.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 text-xs text-charcoal-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Executive Summary & Scope 1–3 Tables</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>FAIRScore Bias Mitigation & Rank Adjustments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ProofChain SHA-256 Cryptographic Audit Seal</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadEnterprise}
            disabled={downloadingEnterprise}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-950"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingEnterprise ? 'Generating PDF...' : 'Download Enterprise Audit Report (PDF)'}</span>
          </button>
        </div>

        {/* Supplier Certificate Card */}
        <div className="p-6 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Single-Supplier Verification Certificate</h2>
              <p className="text-xs text-charcoal-300 mt-1 leading-relaxed">
                Generate a certified carbon footprint disclosure and FAIRScore equity rating for an individual supplier in your network.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-charcoal-300">Select Supplier:</label>
              <select
                value={selectedSupplierId || ''}
                onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.supplier_code} - {s.name} ({s.size} • {s.industry})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleDownloadSupplier}
            disabled={downloadingSupplier || !selectedSupplierId}
            className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-700 text-emerald-200 border border-emerald-600/50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{downloadingSupplier ? 'Generating Certificate...' : 'Download Supplier Certificate (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Report Structure & Compliance Overview */}
      <div className="p-6 rounded-2xl bg-charcoal-850/70 border border-charcoal-800 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Report Sections Included in Generated Documents</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reportSections.map((sec) => (
            <div key={sec.num} className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold font-mono flex items-center justify-center">
                  {sec.num}
                </span>
                <span className="text-xs font-bold text-white">{sec.title}</span>
              </div>
              <p className="text-[11px] text-charcoal-400 leading-snug pl-7">
                {sec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

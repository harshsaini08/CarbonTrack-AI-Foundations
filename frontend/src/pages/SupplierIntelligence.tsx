import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  ExternalLink,
  X,
  Scale,
  ShieldAlert,
  Flame,
  Zap,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Supplier } from '../types';
import { api } from '../services/api';

export const SupplierIntelligence: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail Drawer State
  const [activeSupplierId, setActiveSupplierId] = useState<number | null>(null);
  const [supplierDetail, setSupplierDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, [selectedSize, selectedIndustry, searchQuery]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await api.getSuppliers(selectedSize, selectedIndustry, searchQuery);
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id: number) => {
    try {
      setActiveSupplierId(id);
      setLoadingDetail(true);
      const data = await api.getSupplierDetail(id);
      setSupplierDetail(data);
    } catch (err) {
      alert('Error fetching supplier details');
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="pb-2 border-b border-charcoal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Supplier Intelligence</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              360° Value Chain View
            </span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Comprehensive directory of Tier 1–3 suppliers. Track historical activity, unit carbon intensity, and audit statuses.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-charcoal-900 p-2.5 rounded-xl border border-charcoal-800">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, company name, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-charcoal-800 border border-charcoal-700 text-xs rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-charcoal-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-charcoal-800 border border-charcoal-700 text-xs rounded-lg px-2.5 py-1.5 text-charcoal-200 focus:outline-none focus:border-emerald-500"
          >
            {['All', 'Small', 'Medium', 'Large'].map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Scale Tiers' : `${s} Tier`}</option>
            ))}
          </select>

          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-charcoal-800 border border-charcoal-700 text-xs rounded-lg px-2.5 py-1.5 text-charcoal-200 focus:outline-none focus:border-emerald-500"
          >
            {['All', 'Industrial Machinery', 'Automotive Parts', 'Electronics', 'Packaging', 'Chemicals', 'Logistics & Transport', 'Textiles'].map((i) => (
              <option key={i} value={i}>{i === 'All' ? 'All Industries' : i}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Supplier Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-charcoal-400">Loading supplier profiles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div
              key={s.id}
              onClick={() => handleOpenDetail(s.id)}
              className="p-5 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 hover:border-emerald-600/50 hover:bg-charcoal-850 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                    {s.supplier_code}
                  </span>
                  <h3 className="text-sm font-semibold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                    {s.name}
                  </h3>
                </div>
                <StatusBadge type="size" value={s.size} />
              </div>

              <div className="text-xs text-charcoal-400 space-y-1">
                <div>Industry: <strong className="text-charcoal-200">{s.industry}</strong></div>
                <div>Location: <strong className="text-charcoal-200">{s.location}</strong></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-charcoal-800 text-xs font-mono">
                <div className="bg-charcoal-900 p-2 rounded-lg">
                  <span className="text-[10px] text-charcoal-400 uppercase block">Gross Footprint</span>
                  <span className="font-bold text-white">{s.latest_emissions ? `${s.latest_emissions.toLocaleString()} t` : 'N/A'}</span>
                </div>
                <div className="bg-charcoal-900 p-2 rounded-lg">
                  <span className="text-[10px] text-charcoal-400 uppercase block">Unit Intensity</span>
                  <span className="font-bold text-emerald-400">{s.latest_intensity ? s.latest_intensity.toFixed(4) : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Supplier Profile Detail Slide-out Drawer */}
      {activeSupplierId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-charcoal-900 border-l border-charcoal-750 h-full overflow-y-auto p-6 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-charcoal-800">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                  {supplierDetail?.supplier.supplier_code}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{supplierDetail?.supplier.name}</h2>
                <p className="text-xs text-charcoal-400">{supplierDetail?.supplier.location} • {supplierDetail?.supplier.industry}</p>
              </div>
              <button
                onClick={() => { setActiveSupplierId(null); setSupplierDetail(null); }}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail || !supplierDetail ? (
              <div className="p-8 text-center text-xs text-charcoal-400">Loading audit history...</div>
            ) : (
              <div className="space-y-6 text-xs">
                {/* PDF Certificate Download Button */}
                <a
                  href={`/api/reports/supplier-pdf/${supplierDetail.supplier.id}`}
                  download
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-700 text-emerald-200 border border-emerald-600/50 font-semibold transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Verified Supplier Audit Certificate (PDF)</span>
                </a>

                {/* FairScore Status Box */}
                {supplierDetail.fairness && (
                  <div className="p-4 rounded-xl bg-forest-950/60 border border-emerald-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                        <Scale className="w-4 h-4" />
                        <span>FAIRScore AI Status</span>
                      </div>
                      <StatusBadge type="bias" value={supplierDetail.fairness.bias_direction} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-center">
                      <div className="bg-charcoal-900/80 p-2 rounded-lg">
                        <span className="text-[10px] text-charcoal-400 block">Absolute Rank</span>
                        <span className="text-sm font-bold text-white">#{supplierDetail.fairness.absolute_rank}</span>
                      </div>
                      <div className="bg-charcoal-900/80 p-2 rounded-lg">
                        <span className="text-[10px] text-charcoal-400 block">Normalized Rank</span>
                        <span className="text-sm font-bold text-emerald-400">#{supplierDetail.fairness.normalized_rank}</span>
                      </div>
                      <div className="bg-charcoal-900/80 p-2 rounded-lg">
                        <span className="text-[10px] text-charcoal-400 block">Equity Shift</span>
                        <span className="text-sm font-bold text-blue-400">{supplierDetail.fairness.rank_delta > 0 ? `+${supplierDetail.fairness.rank_delta}` : supplierDetail.fairness.rank_delta}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                      {supplierDetail.fairness.explanation}
                    </p>
                  </div>
                )}

                {/* Operational Telemetry Records */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Recent Operational Disclosures ({supplierDetail.records.length})
                  </h3>
                  {supplierDetail.records.map((r: any) => (
                    <div key={r.id} className="p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-2">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-emerald-400 font-semibold">{r.reporting_period}</span>
                        <span className="text-white font-bold">{r.calculated_total_emissions.toLocaleString()} tCO2e</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] text-charcoal-300 font-mono">
                        <div>Scope 1: {r.calculated_scope1.toFixed(1)} t</div>
                        <div>Scope 2: {r.calculated_scope2.toFixed(1)} t</div>
                        <div>Scope 3: {r.calculated_scope3.toFixed(1)} t</div>
                      </div>
                      <div className="text-[10px] text-charcoal-400 pt-1 border-t border-charcoal-800 flex items-center justify-between">
                        <span>Production: {r.production_volume.toLocaleString()} units</span>
                        <span>Mode: {r.transportation_mode} ({r.transportation_distance} km)</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Findings */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Active Audit Anomalies ({supplierDetail.findings.length})
                  </h3>
                  {supplierDetail.findings.length === 0 ? (
                    <div className="p-3 bg-charcoal-850 rounded-xl border border-charcoal-800 text-charcoal-400 text-center">
                      ✅ No anomalies flagged for this supplier.
                    </div>
                  ) : (
                    supplierDetail.findings.map((f: any) => (
                      <div key={f.id} className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-white text-[11px]">{f.title}</div>
                          <div className="text-[10px] text-charcoal-400 mt-0.5">{f.type}</div>
                        </div>
                        <StatusBadge type="severity" value={f.severity} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Scale,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { FairnessAssessment } from '../types';
import { api } from '../services/api';

export const FairScoreAI: React.FC = () => {
  const [assessments, setAssessments] = useState<FairnessAssessment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('normalized_rank');

  useEffect(() => {
    loadFairnessData();
  }, [selectedSize, sortBy]);

  const loadFairnessData = async () => {
    try {
      setLoading(true);
      const [list, statistics] = await Promise.all([
        api.getFairnessAssessments(selectedSize, undefined, sortBy),
        api.getFairnessStats()
      ]);
      setAssessments(list);
      setStats(statistics);
    } catch (err) {
      console.error('Failed to load fairness data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      await api.recalculateFairness();
      await loadFairnessData();
    } catch (err) {
      alert('Error recalculating fairness');
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="pb-2 border-b border-charcoal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>FAIRScore AI – Supplier Fairness Intelligence</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              Bias Mitigation Engine
            </span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Eliminates structural scale bias from ESG procurement. Replaces raw gross emissions with peer-normalized carbon intensity (tCO2e/unit).
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm self-start md:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
          <span>{recalculating ? 'Recomputing Equity...' : 'Recalculate FAIRScore'}</span>
        </button>
      </div>

      {/* Statistical Disparity & Bias Audit Banner */}
      {stats && stats.statistical_disparity_detected && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-900/60 border border-amber-700/60 text-amber-300 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-amber-200">
                Statistical Disparity Detected in Traditional Flag Rates
              </h3>
              <span className="text-[10px] bg-amber-900/80 text-amber-300 px-2 py-0.5 rounded font-mono">
                Δ {stats.disparity_summary?.gap_percentage_points}% Gap
              </span>
            </div>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              {stats.disparity_summary?.disparity_finding}
            </p>
            <p className="text-[11px] text-amber-400/80">
              Small suppliers were being audited at higher rates due to simple volume thresholds rather than true unit-level inefficiency.
            </p>
          </div>
        </div>
      )}

      {/* Scale Group Statistics (Small vs Medium vs Large) */}
      {stats?.size_group_statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.size_group_statistics).map(([tier, data]: [string, any]) => (
            <div key={tier} className="p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{tier} Enterprises</span>
                <span className="text-xs font-mono text-charcoal-400">{data.count} Suppliers</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-charcoal-900 p-2 rounded-lg">
                  <span className="text-[10px] text-charcoal-400 block uppercase">Audit Flag Rate</span>
                  <span className={`font-bold ${data.flag_rate_pct > 30 ? 'text-amber-400' : 'text-white'}`}>
                    {data.flag_rate_pct}%
                  </span>
                </div>
                <div className="bg-charcoal-900 p-2 rounded-lg">
                  <span className="text-[10px] text-charcoal-400 block uppercase">Mean FAIRScore</span>
                  <span className="font-bold text-emerald-400">{data.mean_fairness_score} / 100</span>
                </div>
              </div>

              <div className="text-[11px] text-charcoal-400 pt-1 border-t border-charcoal-800 flex items-center justify-between">
                <span>Mean Intensity:</span>
                <span className="font-mono text-charcoal-200">{data.mean_intensity.toFixed(5)} t/u</span>
              </div>

              {data.warning && (
                <div className="text-[10px] text-amber-400 bg-amber-950/60 p-1.5 rounded border border-amber-900">
                  ⚠️ {data.warning}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comparison Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-charcoal-900 p-2.5 rounded-xl border border-charcoal-800">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-400 text-[11px]">Filter Tier:</span>
          {['All', 'Small', 'Medium', 'Large'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedSize === s
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                  : 'text-charcoal-400 hover:text-white bg-charcoal-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-400 text-[11px]">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-charcoal-800 border border-charcoal-700 text-xs rounded-lg px-2.5 py-1 text-charcoal-200 focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="normalized_rank">Normalized Rank (Unit Cleanliness)</option>
            <option value="absolute_rank">Traditional Gross Rank (Unadjusted)</option>
            <option value="rank_delta">Largest Rank Gain (+Δ Shift)</option>
            <option value="supplier_fairness_score">Supplier Fairness Score</option>
          </select>
        </div>
      </div>

      {/* Fairness Ranking Comparison Table */}
      <div className="p-5 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">
              Absolute vs. Peer-Normalized Ranking Comparison
            </h2>
          </div>
          <span className="text-xs text-charcoal-400">Green (+Δ) indicates equity recovery from scale bias</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-800 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Supplier Code</th>
                <th className="py-2.5 px-3">Company Name</th>
                <th className="py-2.5 px-3">Scale</th>
                <th className="py-2.5 px-3">Gross Emissions</th>
                <th className="py-2.5 px-3">Unit Intensity</th>
                <th className="py-2.5 px-3 text-center">Gross Rank</th>
                <th className="py-2.5 px-3 text-center">Normalized</th>
                <th className="py-2.5 px-3 text-center">Rank Shift</th>
                <th className="py-2.5 px-3 text-right">FairScore</th>
                <th className="py-2.5 px-3">Bias Mitigation Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800/60 font-sans">
              {assessments.map((fa) => {
                const isImproved = fa.rank_delta < 0; // In ranking, smaller number is better (#5 is better than #25)
                const isWorse = fa.rank_delta > 0;
                const shiftAbs = Math.abs(fa.rank_delta);

                return (
                  <tr key={fa.id} className="hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-emerald-400">{fa.supplier_code}</td>
                    <td className="py-3 px-3 font-medium text-white">{fa.supplier_name}</td>
                    <td className="py-3 px-3"><StatusBadge type="size" value={fa.size_category} /></td>
                    <td className="py-3 px-3 font-mono text-charcoal-300">{fa.absolute_emissions.toLocaleString()} t</td>
                    <td className="py-3 px-3 font-mono font-medium text-emerald-300">{fa.emission_intensity.toFixed(4)}</td>
                    <td className="py-3 px-3 text-center font-mono text-charcoal-400">#{fa.absolute_rank}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-white">#{fa.normalized_rank}</td>
                    
                    {/* Rank Shift Indicator */}
                    <td className="py-3 px-3 text-center font-mono">
                      {isImproved ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          <TrendingUp className="w-3 h-3" />
                          +{shiftAbs}
                        </span>
                      ) : isWorse ? (
                        <span className="inline-flex items-center gap-0.5 text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                          <TrendingDown className="w-3 h-3" />
                          -{shiftAbs}
                        </span>
                      ) : (
                        <span className="text-charcoal-500 font-mono text-xs">0</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {fa.supplier_fairness_score.toFixed(1)}
                    </td>

                    <td className="py-3 px-3 text-[11px] text-charcoal-300 max-w-xs leading-relaxed">
                      {fa.explanation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

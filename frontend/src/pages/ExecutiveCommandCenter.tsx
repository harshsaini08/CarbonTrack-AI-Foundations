import React, { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  Truck,
  Building,
  AlertTriangle,
  Scale,
  TrendingDown,
  Globe,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { KPICard } from '../components/KPICard';
import { StatusBadge } from '../components/StatusBadge';
import { DashboardMetrics } from '../types';
import { api } from '../services/api';

const SCOPE_COLORS = ['#f97316', '#3b82f6', '#10b981'];
const INDUSTRY_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#84cc16'];

export const ExecutiveCommandCenter: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');

  const industries = [
    'All',
    'Industrial Machinery',
    'Automotive Parts',
    'Electronics',
    'Packaging',
    'Chemicals',
    'Logistics & Transport',
    'Textiles'
  ];

  const sizes = ['All', 'Small', 'Medium', 'Large'];

  useEffect(() => {
    fetchMetrics();
  }, [selectedIndustry, selectedSize]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardMetrics(selectedIndustry, selectedSize);
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-charcoal-400 font-mono">Aggregating Scope 1, 2, and 3 emissions...</span>
        </div>
      </div>
    );
  }

  const pieData = metrics ? [
    { name: 'Scope 1 (Direct Fuel)', value: metrics.scope1_emissions },
    { name: 'Scope 2 (Electricity)', value: metrics.scope2_emissions },
    { name: 'Scope 3 (Supply Chain)', value: metrics.scope3_emissions },
  ] : [];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-charcoal-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Executive Command Center</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/80 font-mono">
              GHG Protocol v2.1
            </span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Real-time multi-tier carbon footprint intelligence, Scope 1-3 analytics, and supplier fairness distributions.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2.5 self-start md:self-auto bg-charcoal-900 p-1.5 rounded-xl border border-charcoal-800">
          <div className="flex items-center gap-1.5 px-2 text-xs text-charcoal-400">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-charcoal-800 border border-charcoal-700 text-xs rounded-lg px-2.5 py-1.5 text-charcoal-200 focus:outline-none focus:border-emerald-500"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
            ))}
          </select>

          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-charcoal-800 border border-charcoal-700 text-xs rounded-lg px-2.5 py-1.5 text-charcoal-200 focus:outline-none focus:border-emerald-500"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Sizes' : `${s} Tier`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary KPI Grid (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Gross Footprint"
          value={metrics ? `${metrics.total_emissions_tco2e.toLocaleString()} t` : '0'}
          subtitle="Consolidated Scope 1, 2 & 3"
          icon={Globe}
          accentColor="emerald"
          badge="tCO2e"
        />
        <KPICard
          title="Scope 1 (Direct Fuel)"
          value={metrics ? `${metrics.scope1_emissions.toLocaleString()} t` : '0'}
          subtitle={`${metrics ? ((metrics.scope1_emissions / Math.max(1, metrics.total_emissions_tco2e)) * 100).toFixed(1) : 0}% of portfolio`}
          icon={Flame}
          accentColor="amber"
          badge="Fuel"
        />
        <KPICard
          title="Scope 2 (Electricity)"
          value={metrics ? `${metrics.scope2_emissions.toLocaleString()} t` : '0'}
          subtitle={`${metrics ? ((metrics.scope2_emissions / Math.max(1, metrics.total_emissions_tco2e)) * 100).toFixed(1) : 0}% of portfolio`}
          icon={Zap}
          accentColor="blue"
          badge="Grid"
        />
        <KPICard
          title="Scope 3 (Supply Chain)"
          value={metrics ? `${metrics.scope3_emissions.toLocaleString()} t` : '0'}
          subtitle={`${metrics ? ((metrics.scope3_emissions / Math.max(1, metrics.total_emissions_tco2e)) * 100).toFixed(1) : 0}% of portfolio`}
          icon={Truck}
          accentColor="purple"
          badge="Value Chain"
        />
        <KPICard
          title="Audited Suppliers"
          value={metrics ? metrics.total_suppliers_audited : 0}
          subtitle="Multi-tier active suppliers"
          icon={Building}
          accentColor="blue"
        />
        <KPICard
          title="High-Risk Suppliers"
          value={metrics ? metrics.high_risk_suppliers_count : 0}
          subtitle="Flagged by AI Auditor"
          icon={AlertTriangle}
          accentColor="rose"
          badge="Review Req"
        />
        <KPICard
          title="Portfolio Fairness Index"
          value={metrics ? `${metrics.overall_fairness_index} / 100` : '0'}
          subtitle="FAIRScore Equity Benchmark"
          icon={Scale}
          accentColor="emerald"
          badge="FairScore"
        />
        <KPICard
          title="Abatement Opportunity"
          value={metrics ? `${metrics.potential_carbon_savings_tco2e.toLocaleString()} t` : '0'}
          subtitle="Achievable through optimization"
          icon={TrendingDown}
          accentColor="emerald"
          badge="Potential"
        />
      </div>

      {/* Row 2: Charts (Monthly Trends & Scope Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-charcoal-850/70 border border-charcoal-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Monthly Carbon Emissions Trend (Scopes 1-3)</h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500"></span><span className="text-charcoal-400">Scope 1</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span><span className="text-charcoal-400">Scope 2</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span><span className="text-charcoal-400">Scope 3</span></div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics?.monthly_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorS1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorS2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorS3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Area type="monotone" dataKey="scope1" stackId="1" stroke="#f97316" fillOpacity={1} fill="url(#colorS1)" name="Scope 1" />
                <Area type="monotone" dataKey="scope2" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorS2)" name="Scope 2" />
                <Area type="monotone" dataKey="scope3" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorS3)" name="Scope 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scope Breakdown Pie Chart */}
        <div className="p-5 rounded-2xl bg-charcoal-850/70 border border-charcoal-800 space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Emission Scope Distribution</h2>
          </div>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SCOPE_COLORS[index % SCOPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} tCO2e`, 'Emissions']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-charcoal-800 pt-3">
            {pieData.map((item, idx) => {
              const total = metrics?.total_emissions_tco2e || 1;
              const pct = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SCOPE_COLORS[idx] }}></span>
                    <span className="text-charcoal-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-white font-medium">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Industry Breakdown & Fairness by Scale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emissions by Industry Horizontal Bar Chart */}
        <div className="p-5 rounded-2xl bg-charcoal-850/70 border border-charcoal-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Emissions by Sector / Industry (tCO2e)</h2>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics?.emissions_by_category || []}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis dataKey="category" type="category" stroke="#9ca3af" fontSize={11} tickLine={false} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} tCO2e`, 'Emissions']}
                />
                <Bar dataKey="emissions" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Fairness Index by Size */}
        <div className="p-5 rounded-2xl bg-charcoal-850/70 border border-charcoal-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">FAIRScore Equity Distribution by Supplier Scale</h2>
            </div>
            <span className="text-xs text-charcoal-400 font-mono">Target: &gt;80.0</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics?.fairness_distribution || []}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="size" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} / 100`, 'Average FAIRScore']}
                />
                <Bar dataKey="avg_fairness_score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Top 10 Contributors Table */}
      <div className="p-5 rounded-2xl bg-charcoal-850/70 border border-charcoal-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Top 10 Carbon Emission Contributors</h2>
          </div>
          <span className="text-xs text-charcoal-400">Ranked by gross portfolio contribution</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-800 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Supplier Code</th>
                <th className="py-2.5 px-3">Company Name</th>
                <th className="py-2.5 px-3">Size Tier</th>
                <th className="py-2.5 px-3">Industry</th>
                <th className="py-2.5 px-3 text-right">Gross Emissions</th>
                <th className="py-2.5 px-3 text-right">Unit Intensity</th>
                <th className="py-2.5 px-3 text-right">Share of Portfolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800/60 font-sans">
              {metrics?.top_contributors.map((supplier) => (
                <tr key={supplier.supplier_id} className="hover:bg-charcoal-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-emerald-400">{supplier.supplier_code}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{supplier.supplier_name}</td>
                  <td className="py-2.5 px-3"><StatusBadge type="size" value={supplier.size} /></td>
                  <td className="py-2.5 px-3 text-charcoal-300">{supplier.industry}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">
                    {supplier.emissions_tco2e.toLocaleString()} t
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-charcoal-300">
                    {supplier.emission_intensity.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-medium">
                    {supplier.share_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

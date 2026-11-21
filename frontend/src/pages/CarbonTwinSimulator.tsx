import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Save,
  Trash2,
  TrendingDown,
  DollarSign,
  Truck,
  Sun,
  Flame,
  Layers,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { KPICard } from '../components/KPICard';
import { Supplier, SimulationResult, SavedScenario } from '../types';
import { api } from '../services/api';

export const CarbonTwinSimulator: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('portfolio');
  
  // Interactive Simulation Controls
  const [targetTransportMode, setTargetTransportMode] = useState<string>('Rail');
  const [distanceChangePct, setDistanceChangePct] = useState<number>(0);
  const [renewableEnergyRatio, setRenewableEnergyRatio] = useState<number>(40);
  const [energyEfficiencyPct, setEnergyEfficiencyPct] = useState<number>(15);
  const [fuelReductionPct, setFuelReductionPct] = useState<number>(20);
  const [productionVolumeChangePct, setProductionVolumeChangePct] = useState<number>(0);

  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDesc, setScenarioDesc] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    runLiveSimulation();
  }, [
    selectedSupplierId,
    targetTransportMode,
    distanceChangePct,
    renewableEnergyRatio,
    energyEfficiencyPct,
    fuelReductionPct,
    productionVolumeChangePct
  ]);

  const loadInitialData = async () => {
    try {
      const [supList, saved] = await Promise.all([
        api.getSuppliers(),
        api.getSavedScenarios()
      ]);
      setSuppliers(supList);
      setSavedScenarios(saved);
    } catch (err) {
      console.error('Failed to load initial simulator data', err);
    }
  };

  const runLiveSimulation = async () => {
    try {
      setSimulating(true);
      const res = await api.runSimulation({
        supplier_id: selectedSupplierId === 'portfolio' ? undefined : Number(selectedSupplierId),
        target_transport_mode: targetTransportMode,
        transport_distance_change_pct: distanceChangePct,
        renewable_energy_ratio: renewableEnergyRatio,
        energy_efficiency_pct: energyEfficiencyPct,
        fuel_reduction_pct: fuelReductionPct,
        production_volume_change_pct: productionVolumeChangePct
      });
      setSimResult(res);
    } catch (err) {
      console.error('Simulation run failed', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleSaveScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simResult || !scenarioName) return;

    try {
      await api.saveScenario(
        scenarioName,
        scenarioDesc,
        {
          supplier_id: selectedSupplierId === 'portfolio' ? undefined : Number(selectedSupplierId),
          target_transport_mode: targetTransportMode,
          renewable_energy_ratio: renewableEnergyRatio,
        },
        simResult
      );
      setSaveModalOpen(false);
      setScenarioName('');
      setScenarioDesc('');
      const updated = await api.getSavedScenarios();
      setSavedScenarios(updated);
    } catch (err) {
      alert('Error saving simulation scenario');
    }
  };

  const handleDeleteScenario = async (id: number) => {
    try {
      await api.deleteSavedScenario(id);
      setSavedScenarios(savedScenarios.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error deleting scenario');
    }
  };

  const comparisonChartData = simResult ? [
    {
      scope: 'Scope 1 (Fuel)',
      Baseline: simResult.breakdown_by_scope.baseline.scope1,
      Simulated: simResult.breakdown_by_scope.simulated.scope1,
    },
    {
      scope: 'Scope 2 (Electricity)',
      Baseline: simResult.breakdown_by_scope.baseline.scope2,
      Simulated: simResult.breakdown_by_scope.simulated.scope2,
    },
    {
      scope: 'Scope 3 (Logistics & Supply)',
      Baseline: simResult.breakdown_by_scope.baseline.scope3,
      Simulated: simResult.breakdown_by_scope.simulated.scope3,
    },
    {
      scope: 'Total Emissions',
      Baseline: simResult.baseline_emissions,
      Simulated: simResult.simulated_emissions,
    },
  ] : [];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="pb-2 border-b border-charcoal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Carbon Twin – What-If Simulator</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              Decarbonization Modeling
            </span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Simulate operational adjustments across freight logistics, clean energy transition, and process fuel efficiency.
          </p>
        </div>

        <button
          onClick={() => setSaveModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm self-start md:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Current Scenario</span>
        </button>
      </div>

      {/* Simulator Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Baseline Footprint"
          value={simResult ? `${simResult.baseline_emissions.toLocaleString()} t` : '0 t'}
          subtitle="Pre-optimization baseline"
          icon={Flame}
          accentColor="amber"
          badge="Current"
        />
        <KPICard
          title="Simulated Footprint"
          value={simResult ? `${simResult.simulated_emissions.toLocaleString()} t` : '0 t'}
          subtitle="Post-intervention forecast"
          icon={Sparkles}
          accentColor="emerald"
          badge="Optimized"
        />
        <KPICard
          title="Carbon Abatement"
          value={simResult ? `-${simResult.absolute_reduction.toLocaleString()} t` : '0 t'}
          subtitle={simResult ? `${simResult.percentage_reduction.toFixed(1)}% portfolio reduction` : ''}
          icon={TrendingDown}
          accentColor="emerald"
          badge="Abatement"
        />
        <KPICard
          title="Net Financial Impact"
          value={simResult ? (simResult.estimated_cost_impact_usd < 0 ? `-$${Math.abs(simResult.estimated_cost_impact_usd).toLocaleString()}` : `+$${simResult.estimated_cost_impact_usd.toLocaleString()}`) : '$0'}
          subtitle={simResult && simResult.estimated_cost_impact_usd < 0 ? 'Annual cost savings' : 'Operational premium'}
          icon={DollarSign}
          accentColor="blue"
          badge="Finance"
        />
      </div>

      {/* Main Interactive Controls & Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders & Intervention Controls */}
        <div className="p-5 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Simulation Parameters</span>
            </h2>
            <button
              onClick={() => {
                setTargetTransportMode('Rail');
                setRenewableEnergyRatio(40);
                setEnergyEfficiencyPct(15);
                setFuelReductionPct(20);
                setDistanceChangePct(0);
                setProductionVolumeChangePct(0);
              }}
              className="text-[11px] text-charcoal-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Target Scope / Supplier Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-charcoal-300">Simulation Scope</label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="portfolio">Entire Supply Chain Portfolio (Aggregate)</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.supplier_code} - {s.name}</option>
              ))}
            </select>
          </div>

          {/* Freight Modal Shift */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-charcoal-300 flex items-center justify-between">
              <span>Freight Transportation Mode</span>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">{targetTransportMode}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Road', 'Rail', 'Sea', 'Air'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTargetTransportMode(mode)}
                  className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    targetTransportMode === mode
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-charcoal-800 border-charcoal-700 text-charcoal-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Renewable Energy Ratio Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-charcoal-300">Renewable Energy PPA / Solar</span>
              <span className="font-mono text-emerald-400 font-bold">{renewableEnergyRatio}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={renewableEnergyRatio}
              onChange={(e) => setRenewableEnergyRatio(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-charcoal-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Energy Efficiency Improvement Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-charcoal-300">Electricity Efficiency Gain</span>
              <span className="font-mono text-blue-400 font-bold">-{energyEfficiencyPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={energyEfficiencyPct}
              onChange={(e) => setEnergyEfficiencyPct(Number(e.target.value))}
              className="w-full accent-blue-500 bg-charcoal-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Direct Fuel Reduction Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-charcoal-300">Thermal / Fuel Oil Reduction</span>
              <span className="font-mono text-amber-400 font-bold">-{fuelReductionPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={fuelReductionPct}
              onChange={(e) => setFuelReductionPct(Number(e.target.value))}
              className="w-full accent-amber-500 bg-charcoal-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Route Distance Adjustment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-charcoal-300">Transport Route Distance</span>
              <span className="font-mono text-charcoal-300 font-bold">{distanceChangePct > 0 ? `+${distanceChangePct}` : distanceChangePct}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={distanceChangePct}
              onChange={(e) => setDistanceChangePct(Number(e.target.value))}
              className="w-full accent-charcoal-500 bg-charcoal-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Comparison Chart & AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Before & After Bar Chart */}
          <div className="p-5 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Current vs. Simulated Emissions by Scope</h2>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500"></span><span className="text-charcoal-400">Baseline</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span><span className="text-charcoal-400">Simulated</span></div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="scope" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()} tCO2e`, '']}
                  />
                  <Bar dataKey="Baseline" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Optimization Recommendations */}
          <div className="p-5 rounded-2xl bg-forest-950/40 border border-emerald-900/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Carbon Twin Optimization Pathway</span>
            </div>

            <div className="space-y-2">
              {simResult?.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-emerald-100">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Scenarios List */}
      {savedScenarios.length > 0 && (
        <div className="p-5 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 space-y-4">
          <h2 className="text-sm font-semibold text-white">Saved Simulation Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedScenarios.map((sc) => (
              <div key={sc.id} className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">{sc.name}</h3>
                    <p className="text-[11px] text-charcoal-400 mt-0.5">{sc.supplier_name}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteScenario(sc.id)}
                    className="text-charcoal-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-charcoal-850 p-1.5 rounded">
                    <span className="text-[10px] text-charcoal-400 block uppercase">Reduction</span>
                    <span className="font-bold text-emerald-400">-{sc.percentage_reduction.toFixed(1)}%</span>
                  </div>
                  <div className="bg-charcoal-850 p-1.5 rounded">
                    <span className="text-[10px] text-charcoal-400 block uppercase">Savings</span>
                    <span className="font-bold text-blue-400">-${Math.abs(sc.estimated_cost_impact_usd).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Scenario Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-charcoal-750 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Save Decarbonization Scenario</h3>
            <form onSubmit={handleSaveScenario} className="space-y-3 text-xs">
              <div>
                <label className="block text-charcoal-400 font-medium mb-1">Scenario Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2027 Rail Shift + 60% Solar PPA"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg p-2 text-white placeholder-charcoal-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-charcoal-400 font-medium mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Notes on assumptions, lead times, capital payback..."
                  value={scenarioDesc}
                  onChange={(e) => setScenarioDesc(e.target.value)}
                  className="w-full bg-charcoal-800 border border-charcoal-700 rounded-lg p-2 text-white placeholder-charcoal-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-charcoal-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

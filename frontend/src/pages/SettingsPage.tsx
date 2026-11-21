import React, { useState, useEffect } from 'react';
import {
  Settings,
  Flame,
  Zap,
  Truck,
  RotateCcw,
  CheckCircle2,
  Users,
  Server,
  Save,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { EmissionFactorItem, User, Role } from '../types';
import { api } from '../services/api';

interface SettingsPageProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ activeRole, onRoleChange }) => {
  const [factors, setFactors] = useState<EmissionFactorItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [savingFactor, setSavingFactor] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      setLoading(true);
      const [efs, uList, sys] = await Promise.all([
        api.getEmissionFactors(),
        api.getUsers(),
        api.getSystemInfo()
      ]);
      setFactors(efs);
      setUsers(uList);
      setSystemInfo(sys);
    } catch (err) {
      console.error('Failed to load settings data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (f: EmissionFactorItem) => {
    setEditingId(f.id);
    setEditValue(f.value);
  };

  const handleSaveFactor = async (id: number) => {
    try {
      setSavingFactor(true);
      await api.updateEmissionFactor(id, editValue);
      setEditingId(null);
      await loadSettingsData();
    } catch (err) {
      alert('Error saving factor');
    } finally {
      setSavingFactor(false);
    }
  };

  const handleResetDefaults = async () => {
    try {
      setResetting(true);
      await api.resetEmissionFactors();
      await loadSettingsData();
    } catch (err) {
      alert('Error resetting factors');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="pb-2 border-b border-charcoal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Settings & Factor Governance</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              GHG Standards
            </span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Configure baseline emission factors, review active user personas, and inspect ProofChain audit ledger health.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          disabled={resetting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-charcoal-200 bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-700 transition-colors self-start md:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>Reset to Official Defaults</span>
        </button>
      </div>

      {/* Emission Factors Table */}
      <div className="p-6 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Configurable GHG Emission Factors</h2>
          </div>
          <span className="text-xs text-charcoal-400">Activity Formula: Emissions = (Activity × Factor) / 1000</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-800 text-charcoal-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Factor Name</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Source Standard</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800/60 font-sans">
              {factors.map((f) => (
                <tr key={f.id} className="hover:bg-charcoal-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">{f.category}</td>
                  <td className="py-2.5 px-3 text-charcoal-300">{f.name}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                    {editingId === f.id ? (
                      <input
                        type="number"
                        step="0.001"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-24 bg-charcoal-900 border border-emerald-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                      />
                    ) : (
                      f.value
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-charcoal-400 text-[11px]">{f.unit}</td>
                  <td className="py-2.5 px-3 text-charcoal-400">{f.source}</td>
                  <td className="py-2.5 px-3 text-right">
                    {editingId === f.id ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSaveFactor(f.id)}
                          disabled={savingFactor}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 rounded bg-charcoal-700 text-charcoal-300 text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(f)}
                        className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white text-[11px] font-medium flex items-center gap-1 ml-auto"
                      >
                        <Edit2 className="w-3 h-3 text-emerald-400" />
                        <span>Edit</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: User Roles & System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="p-6 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Active User Accounts & RBAC Personas</h2>
          </div>

          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{u.full_name}</div>
                  <div className="text-[11px] text-charcoal-400 font-mono mt-0.5">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-emerald-400 border border-charcoal-700 capitalize">
                    {u.role.replace('_', ' ')}
                  </span>
                  {activeRole !== u.role && (
                    <button
                      onClick={() => onRoleChange(u.role)}
                      className="text-[10px] text-charcoal-400 hover:text-white px-2 py-0.5 rounded bg-charcoal-800 border border-charcoal-700"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Architecture Info */}
        <div className="p-6 rounded-2xl bg-charcoal-850/80 border border-charcoal-800 space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">System Architecture & Integrity</h2>
          </div>

          {systemInfo && (
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800 flex items-center justify-between">
                <span className="text-charcoal-400">Platform:</span>
                <span className="text-white font-semibold">{systemInfo.platform_name}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800 flex items-center justify-between">
                <span className="text-charcoal-400">Methodology:</span>
                <span className="text-emerald-400">{systemInfo.audit_methodology}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800 flex items-center justify-between">
                <span className="text-charcoal-400">Database Engine:</span>
                <span className="text-blue-400">{systemInfo.database_engine}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800 flex items-center justify-between">
                <span className="text-charcoal-400">ProofChain Blocks:</span>
                <span className="text-white">{systemInfo.proofchain_blocks} Sealed Blocks</span>
              </div>
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800 flex items-center justify-between">
                <span className="text-charcoal-400">Integrity:</span>
                <span className="text-emerald-400 font-bold">{systemInfo.tamper_evident_integrity}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

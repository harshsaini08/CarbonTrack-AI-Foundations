import {
  DashboardMetrics,
  Supplier,
  AuditFinding,
  FairnessAssessment,
  SimulationParams,
  SimulationResult,
  SavedScenario,
  ProofChainBlock,
  ProofChainVerification,
  EmissionFactorItem,
  User,
  Role
} from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const err = await response.json();
      if (err.detail) errorMsg = err.detail;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Dashboard
  getDashboardMetrics: (industry?: string, size?: string) => {
    const params = new URLSearchParams();
    if (industry && industry !== 'All') params.append('industry', industry);
    if (size && size !== 'All') params.append('size', size);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<DashboardMetrics>(`/dashboard/metrics${qs}`);
  },

  // Ingestion
  seedDemoData: () => request<any>('/ingestion/seed-demo', { method: 'POST' }),
  
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/ingestion/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Upload failed');
    }
    return response.json();
  },

  // Auditor
  runAudit: () => request<any>('/auditor/run', { method: 'POST' }),
  getFindings: (severity?: string, status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (severity && severity !== 'All') params.append('severity', severity);
    if (status && status !== 'All') params.append('status', status);
    if (search) params.append('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<AuditFinding[]>(`/auditor/findings${qs}`);
  },
  reviewFinding: (findingId: number, action: string, comment: string, userName?: string) => {
    return request<any>(`/auditor/findings/${findingId}/review?user_name=${encodeURIComponent(userName || 'Auditor')}`, {
      method: 'POST',
      body: JSON.stringify({ action, comment }),
    });
  },

  // Suppliers
  getSuppliers: (size?: string, industry?: string, search?: string) => {
    const params = new URLSearchParams();
    if (size && size !== 'All') params.append('size', size);
    if (industry && industry !== 'All') params.append('industry', industry);
    if (search) params.append('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<Supplier[]>(`/suppliers${qs}`);
  },
  getSupplierDetail: (id: number) => request<any>(`/suppliers/${id}`),

  // Fairness
  getFairnessAssessments: (size?: string, industry?: string, sortBy?: string) => {
    const params = new URLSearchParams();
    if (size && size !== 'All') params.append('size', size);
    if (industry && industry !== 'All') params.append('industry', industry);
    if (sortBy) params.append('sort_by', sortBy);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<FairnessAssessment[]>(`/fairness/assessments${qs}`);
  },
  getFairnessStats: () => request<any>('/fairness/stats'),
  recalculateFairness: () => request<any>('/fairness/recalculate', { method: 'POST' }),

  // Simulator
  runSimulation: (params: SimulationParams) => {
    return request<SimulationResult>('/simulator/run', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  saveScenario: (name: string, description: string, params: SimulationParams, results: SimulationResult) => {
    return request<any>('/simulator/save', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        supplier_id: params.supplier_id,
        simulation_params: params,
        simulation_results: results,
      }),
    });
  },
  getSavedScenarios: () => request<SavedScenario[]>('/simulator/saved'),
  deleteSavedScenario: (id: number) => request<any>(`/simulator/saved/${id}`, { method: 'DELETE' }),

  // ProofChain
  getProofChainBlocks: () => request<ProofChainBlock[]>('/proofchain/blocks'),
  verifyProofChain: () => request<ProofChainVerification>('/proofchain/verify'),
  exportAuditLedger: () => request<any>('/proofchain/export'),

  // AI Copilot
  chatWithCopilot: (query: string, history?: any[]) => {
    return request<any>('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ query, conversation_history: history }),
    });
  },

  // Reports
  getAvailableReports: () => request<any>('/reports/available'),
  getEnterprisePdfUrl: () => `${API_BASE}/reports/enterprise-pdf`,
  getSupplierPdfUrl: (supplierId: number) => `${API_BASE}/reports/supplier-pdf/${supplierId}`,

  // Settings
  getEmissionFactors: () => request<EmissionFactorItem[]>('/settings/emission-factors'),
  updateEmissionFactor: (id: number, value: number, source?: string, description?: string) => {
    return request<EmissionFactorItem>(`/settings/emission-factors/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ value, source, description }),
    });
  },
  resetEmissionFactors: () => request<any>('/settings/emission-factors/reset', { method: 'POST' }),
  getSystemInfo: () => request<any>('/settings/system-info'),

  // Auth / Role
  switchRole: (role: Role) => request<any>(`/auth/switch-role?role=${role}`, { method: 'POST' }),
  getUsers: () => request<User[]>('/auth/users'),
};

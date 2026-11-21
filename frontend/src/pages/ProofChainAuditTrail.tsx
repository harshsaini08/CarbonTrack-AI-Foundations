import React, { useState, useEffect } from 'react';
import {
  Link2,
  ShieldCheck,
  AlertTriangle,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Clock,
  Layers,
  FileCode,
  ExternalLink,
  X
} from 'lucide-react';
import { ProofChainBlock, ProofChainVerification } from '../types';
import { api } from '../services/api';

export const ProofChainAuditTrail: React.FC = () => {
  const [blocks, setBlocks] = useState<ProofChainBlock[]>([]);
  const [verification, setVerification] = useState<ProofChainVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [inspectBlock, setInspectBlock] = useState<ProofChainBlock | null>(null);

  useEffect(() => {
    loadChainData();
  }, []);

  const loadChainData = async () => {
    try {
      setLoading(true);
      const [blockList, verResult] = await Promise.all([
        api.getProofChainBlocks(),
        api.verifyProofChain(),
      ]);
      setBlocks(blockList);
      setVerification(verResult);
    } catch (err) {
      console.error('Failed to load ProofChain ledger', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const res = await api.verifyProofChain();
      setVerification(res);
    } catch (err) {
      alert('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleExportJson = async () => {
    try {
      const data = await api.exportAuditLedger();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CarbonTrack_ProofChain_Ledger_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="pb-2 border-b border-charcoal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>ProofChain – Explainable Audit Trail</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              SHA-256 Tamper-Evident Ledger
            </span>
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Every audit finding, emission recalculation, and reviewer sign-off is cryptographically sealed into a hash-linked verifiable chain.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal-200 bg-charcoal-800 border border-charcoal-700 hover:bg-charcoal-750 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Evidence Bundle (JSON)</span>
          </button>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>{verifying ? 'Verifying Hashes...' : 'Verify Ledger Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Verification Status Card */}
      {verification && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          verification.is_valid
            ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
            : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${verification.is_valid ? 'bg-emerald-900/60 border border-emerald-700/60' : 'bg-rose-900/60 border border-rose-700/60'}`}>
              {verification.is_valid ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{verification.is_valid ? 'ProofChain Cryptographic Continuity Intact' : 'Ledger Inconsistency Detected'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-900 border border-charcoal-700 text-charcoal-300">
                  {verification.total_blocks} Blocks Verified
                </span>
              </div>
              <p className="text-xs text-charcoal-300 mt-0.5">{verification.integrity_details}</p>
            </div>
          </div>

          <div className="hidden sm:block text-right font-mono text-[11px] text-charcoal-400">
            <div>Latest Digest: <span className="text-emerald-400 font-bold">{verification.latest_hash.slice(0, 16)}...</span></div>
            <div className="text-[10px] text-charcoal-500">Methodology: SHA-256 Recursive Digest</div>
          </div>
        </div>
      )}

      {/* Chain Timeline Visualizer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-charcoal-400">
          <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Audit Blocks & Evidence Trail ({blocks.length})
          </span>
          <span className="text-[11px]">Click any block to inspect raw cryptographic payload</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-charcoal-400">Loading ledger sequence...</div>
        ) : blocks.length === 0 ? (
          <div className="p-8 text-center bg-charcoal-850 rounded-2xl border border-charcoal-800 text-charcoal-400 text-xs">
            ProofChain is initialized. Run an AI Carbon Audit or load the demo dataset to populate evidence blocks.
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map((b) => (
              <div
                key={b.id}
                onClick={() => setInspectBlock(b)}
                className="p-4 rounded-xl bg-charcoal-850/80 border border-charcoal-800 hover:border-emerald-600/50 transition-all cursor-pointer space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-charcoal-900 border border-charcoal-750 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                      #{b.sequence_index}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {b.supplier_name || 'System Event'} – {b.issue_title || b.description}
                      </span>
                      <div className="text-[10px] text-charcoal-400 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(b.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>Type: {b.evidence_type}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Hash Footprint */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-charcoal-800/80 font-mono text-[10px]">
                  <div className="bg-charcoal-900 p-2 rounded truncate">
                    <span className="text-charcoal-500 block">RECORD HASH:</span>
                    <span className="text-emerald-400 font-semibold">{b.record_hash}</span>
                  </div>
                  <div className="bg-charcoal-900 p-2 rounded truncate">
                    <span className="text-charcoal-500 block">PREVIOUS HASH:</span>
                    <span className="text-charcoal-300">{b.prev_hash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Block Inspection Dialog */}
      {inspectBlock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-charcoal-750 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-charcoal-800">
              <div>
                <span className="text-xs font-mono text-emerald-400">Block #{inspectBlock.sequence_index}</span>
                <h3 className="text-base font-bold text-white">{inspectBlock.issue_title || inspectBlock.description}</h3>
              </div>
              <button
                onClick={() => setInspectBlock(null)}
                className="p-1 rounded text-charcoal-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-charcoal-800 p-2 rounded">
                  <span className="text-charcoal-400 block text-[10px]">TIMESTAMP</span>
                  <span className="text-white">{new Date(inspectBlock.timestamp).toISOString()}</span>
                </div>
                <div className="bg-charcoal-800 p-2 rounded">
                  <span className="text-charcoal-400 block text-[10px]">FINDING ID REF</span>
                  <span className="text-emerald-400 font-bold">Finding #{inspectBlock.finding_id}</span>
                </div>
              </div>

              <div>
                <span className="text-charcoal-400 font-medium block mb-1">Cryptographic Hash Digest</span>
                <div className="bg-charcoal-950 p-2.5 rounded-lg border border-charcoal-800 font-mono text-[11px] text-emerald-400 break-all">
                  {inspectBlock.record_hash}
                </div>
              </div>

              <div>
                <span className="text-charcoal-400 font-medium block mb-1">Raw Telemetry & Audit Evidence Payload</span>
                <pre className="bg-charcoal-950 p-3 rounded-lg border border-charcoal-800 font-mono text-[11px] text-charcoal-200 overflow-x-auto max-h-56">
                  {JSON.stringify(inspectBlock.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectBlock(null)}
                className="px-4 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs font-semibold text-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

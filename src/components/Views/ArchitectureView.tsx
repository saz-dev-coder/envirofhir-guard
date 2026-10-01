/**
 * Production Architecture & API Contract Documentation View
 * Documents the asynchronous 202 Accepted ingestion architecture,
 * distributed queue processing model, security trust boundaries,
 * and REST API specifications.
 */

import React from 'react';
import {
  Cpu,
  Layers,
  Shield,
  Server,
  Network,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Radio,
  FileCode,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/v1/ingest',
      status: '202 Accepted',
      desc: 'Ingests raw sensor or citizen JSON payload. Performs basic schema check and returns async jobId.',
    },
    {
      method: 'GET',
      path: '/api/v1/jobs/{jobId}',
      status: '200 OK',
      desc: 'Queries pipeline state (queued, processing, completed, blocked, review_required).',
    },
    {
      method: 'POST',
      path: '/api/v1/verify',
      status: '200 OK',
      desc: 'Executes Web Crypto SHA-256 canonical verification of edge payload signature.',
    },
    {
      method: 'POST',
      path: '/api/v1/trust',
      status: '200 OK',
      desc: 'Calculates multi-factor explainable trust score across 7 baseline categories.',
    },
    {
      method: 'POST',
      path: '/api/v1/fhir/bundle',
      status: '200 / 403',
      desc: 'Generates FHIR Transaction Bundle with Location, Observation, Provenance, and AuditEvent.',
    },
    {
      method: 'POST',
      path: '/api/v1/sandbox/transmit',
      status: '201 Created',
      desc: 'Dispatches atomic transaction bundle to target EHR / HIE interoperability gateway.',
    },
    {
      method: 'GET',
      path: '/api/v1/audit',
      status: '200 OK',
      desc: 'Retrieves immutable FHIR AuditEvent logs for security inspections and regulatory review.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Network className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            Production Distributed Architecture & Security Blueprint
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          EnviroFHIR-Guard decouples edge ingestion from computational trust scoring via asynchronous message
          queues. This ensures rapid 202 Accepted response times for low-power edge nodes while enforcing
          rigorous zero-trust cryptographic and geospatial verification before healthcare transmission.
        </p>
      </div>

      {/* Production Asynchronous Pipeline vs Local Demo Architecture */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
          Conceptual Production Asynchronous Flow
        </span>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-cyan-400 font-bold block mb-1">1. Ingest Gateway</span>
              <p className="text-[11px] text-slate-400">
                HTTP Edge Ingestion parses raw payload structure.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-emerald-400 font-bold">202 ACCEPTED</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-cyan-400 font-bold block mb-1">2. Async Queue</span>
              <p className="text-[11px] text-slate-400">
                Distributed worker message broker (Kafka / PubSub / Redis).
              </p>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 font-bold">JOB QUEUED</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-cyan-400 font-bold block mb-1">3. Crypto Firewall</span>
              <p className="text-[11px] text-slate-400">
                Edge SHA-256 signature verification & canonicalization.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-red-400 font-bold">ZERO-TRUST CHECK</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-cyan-400 font-bold block mb-1">4. Context Engine</span>
              <p className="text-[11px] text-slate-400">
                10-packet rolling stats & 5km Haversine neighbors.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-bold">SPATIAL CORR</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-cyan-400 font-bold block mb-1">5. Weather Context</span>
              <p className="text-[11px] text-slate-400">
                Open-Meteo rainfall & meteorological verification.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-cyan-400 font-bold">EXTERNAL EV</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-cyan-400 font-bold block mb-1">6. Trust Engine</span>
              <p className="text-[11px] text-slate-400">
                Human-in-the-Loop triage & 0-100 score matrix.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-amber-400 font-bold">SCORE ASSIGNED</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-emerald-400 font-bold block mb-1">7. FHIR Compiler</span>
              <p className="text-[11px] text-slate-400">
                Atomic bundle transmission & AuditEvent logging.
              </p>
            </div>
            <div className="mt-2 text-[10px] text-emerald-400 font-bold">HIE INTEROP</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300 flex items-center justify-between">
          <div>
            <strong>Client-Side Demo Execution:</strong> For instant responsiveness without external backend dependencies,
            the hackathon prototype runs the entire verification, cryptographic calculation, sliding statistical baseline,
            and FHIR generation locally in deterministic browser-native TypeScript.
          </div>
        </div>
      </div>

      {/* REST API Contract Documentation */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-slate-200">
            EnviroFHIR-Guard REST API Specification Contract
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 font-mono text-xs">
          {apiEndpoints.map((ep) => (
            <div key={ep.path} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                  {ep.method}
                </span>
                <span className="text-slate-100 font-semibold">{ep.path}</span>
              </div>
              <div className="text-slate-400 text-[11px] flex-1 sm:px-4">
                {ep.desc}
              </div>
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                  {ep.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

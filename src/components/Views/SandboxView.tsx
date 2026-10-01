/**
 * FHIR Transaction Response Parser & Interoperability Sandbox View
 * Simulates transmission to a FHIR server endpoint (e.g. HAPI FHIR, Google Cloud Healthcare API, AWS HealthLake),
 * parses HTTP status codes (200, 201, 400, 422, 500), extracts OperationOutcome diagnostics,
 * and tracks transmission latency and request IDs.
 */

import React, { useState } from 'react';
import { FHIRTransactionBundle, SandboxResponse } from '../../types';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Server,
  RefreshCw,
  Terminal,
  Clock,
  Layers,
  FileCheck,
} from 'lucide-react';

interface SandboxViewProps {
  bundleResource: FHIRTransactionBundle | null;
  sandboxResponse: SandboxResponse | null;
  onSimulateTransmission: (statusCode: number) => void;
}

export const SandboxView: React.FC<SandboxViewProps> = ({
  bundleResource,
  sandboxResponse,
  onSimulateTransmission,
}) => {
  const [selectedStatusCode, setSelectedStatusCode] = useState(201);
  const [targetEndpoint, setTargetEndpoint] = useState(
    'https://fhir-sandbox.health-interop.org/r4/Bundle'
  );

  const statusCodes = [
    { code: 201, text: '201 Created', desc: 'Atomic transaction bundle accepted & committed' },
    { code: 200, text: '200 OK', desc: 'Transaction processed with warnings' },
    { code: 400, text: '400 Bad Request', desc: 'FHIR Schema validation failure' },
    { code: 422, text: '422 Unprocessable', desc: 'Semantic constraint or coding violation' },
    { code: 500, text: '500 Server Error', desc: 'Target repository timeout / failure' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              FHIR Transaction Gateway & Sandbox Response Parser
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Simulates atomic POST transaction dispatch to a target FHIR server. Parses HTTP response envelopes,
            decodes <code className="text-cyan-300 font-mono">OperationOutcome</code> diagnostics, and ensures errors
            are transparently surfaced rather than masked as false successes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
              sandboxResponse?.isSuccess
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : sandboxResponse
                ? 'bg-red-950/90 border-red-500/60 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {sandboxResponse ? (
              sandboxResponse.isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> HTTP {sandboxResponse.status} OK
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" /> HTTP {sandboxResponse.status} FAILED
                </>
              )
            ) : (
              'STANDBY'
            )}
          </span>
        </div>
      </div>

      {/* Target Endpoint & Transmission Simulator Control */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex-1">
            <label className="text-xs font-mono text-slate-400 block mb-1">Target FHIR R4 Endpoint URL:</label>
            <input
              type="text"
              value={targetEndpoint}
              onChange={(e) => setTargetEndpoint(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => onSimulateTransmission(selectedStatusCode)}
              disabled={!bundleResource}
              className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              TRANSMIT BUNDLE TO SANDBOX
            </button>
          </div>
        </div>

        {/* HTTP Status Code Scenario Selector */}
        <div>
          <span className="text-xs font-mono text-slate-300 block mb-2">
            Simulate Target Gateway Response:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {statusCodes.map((sc) => (
              <button
                key={sc.code}
                onClick={() => {
                  setSelectedStatusCode(sc.code);
                  onSimulateTransmission(sc.code);
                }}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  selectedStatusCode === sc.code
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-mono font-bold text-xs">{sc.text}</div>
                <div className="text-[10px] mt-0.5 line-clamp-1">{sc.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Response Envelope Inspector */}
      {sandboxResponse && (
        <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                Parsed Gateway Transaction Response
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {sandboxResponse.durationMs}ms
              </span>
              <span>TxID: {sandboxResponse.transactionId}</span>
            </div>
          </div>

          {/* Diagnostics summary */}
          <div
            className={`p-3 rounded-lg border text-xs font-mono ${
              sandboxResponse.isSuccess
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                : 'bg-red-950/30 border-red-800/50 text-red-300'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {sandboxResponse.isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  HTTP {sandboxResponse.status} {sandboxResponse.statusText} — Atomic Transaction Committed
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  HTTP {sandboxResponse.status} {sandboxResponse.statusText} — FHIR Validation / Repository Failure
                </>
              )}
            </div>
            <div className="text-slate-300 text-[11px]">
              {sandboxResponse.operationOutcome?.issue[0]?.diagnostics}
            </div>
          </div>

          {/* OperationOutcome JSON representation */}
          <div className="p-4 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-300 overflow-auto max-h-[300px]">
            <pre>{JSON.stringify(sandboxResponse, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

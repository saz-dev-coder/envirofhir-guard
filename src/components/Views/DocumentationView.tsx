/**
 * Track Alignment, Healthcare Safety Boundary, and Documentation View
 * Explicit alignment with Hackathon Tracks:
 * - Track 3: AI-Supported Assessment (Automated Human-in-the-Loop Validation Assistant)
 * - Track 6: Resilience Informatics (Contextual Environmental Early-Warning Engine)
 * Defines strict healthcare safety boundaries, source transparency, and anti-fraud disclosures.
 */

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  Activity,
  HeartPulse,
  Info,
  Layers,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <FileCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            Hackathon Track Alignment & Safety Disclosures
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          EnviroFHIR-Guard acts as an engineered environmental-health interoperability security platform.
          It does not diagnose disease or replace clinical decision-makers; it validates untrusted citizen
          science telemetry before ingestion into clinical electronic health records and public health disease surveillance.
        </p>
      </div>

      {/* Dual Track Alignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Track 3 */}
        <div className="bg-[#05070A] border border-amber-500/30 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              TRACK 3: AI-SUPPORTED ASSESSMENT
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-200 border border-amber-500/30">
              HUMAN-IN-THE-LOOP
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-100">
            Automated Human-in-the-Loop Validation Assistant
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            An automated human-in-the-loop validation assistant that evaluates environmental observations,
            contextual evidence, sensor integrity, and provenance before interoperability transmission.
          </p>

          <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <strong className="text-slate-200 block text-[11px] font-mono uppercase">
              Supporting Capabilities:
            </strong>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li>Contextual validation against dynamic 10-packet rolling baselines</li>
              <li>Multi-sensor cross-reasoning within 5km monitoring zones</li>
              <li>Live Open-Meteo rainfall and atmospheric evidence correlation</li>
              <li>Transparent, explainable 0-100 trust scoring ledger</li>
              <li>Formal Human-in-the-Loop triage workflow (Accept, Investigate, Reject)</li>
              <li>Immutable FHIR AuditEvent and Provenance trail generation</li>
            </ul>
          </div>
        </div>

        {/* Track 6 */}
        <div className="bg-[#05070A] border border-cyan-500/30 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              TRACK 6: RESILIENCE INFORMATICS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-200 border border-cyan-500/30">
              EARLY-WARNING
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-100">
            Contextual Environmental Early-Warning Engine
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            A contextual environmental early-warning architecture that detects regional anomalies,
            correlates multi-sensor signals, evaluates external environmental evidence, and surfaces potential
            events requiring investigation.
          </p>

          <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <strong className="text-slate-200 block text-[11px] font-mono uppercase">
              Supporting Capabilities:
            </strong>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li>Dynamic local baselines replacing rigid global static thresholds</li>
              <li>Sliding time-window cache calculating mean, median, and sigma Z-score</li>
              <li>Geospatial Haversine radius analysis to differentiate isolated vs regional events</li>
              <li>Catastrophic regional chemical depression alerting for public health resilience</li>
              <li>Corroborated evidence generation for municipal watershed protection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Healthcare Safety Boundary Notice */}
      <div className="bg-red-950/20 border border-red-800/40 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
          <HeartPulse className="w-5 h-5" />
          <span>Strict Healthcare Safety Boundary & Ethical Disclosures</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="space-y-1">
            <span className="font-bold text-red-300 block">What This System DOES NOT Do:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>Does NOT diagnose human clinical conditions or diseases.</li>
              <li>Does NOT replace physicians, epidemiologists, or environmental inspectors.</li>
              <li>Does NOT prescribe medical treatment or interventions.</li>
              <li>Does NOT make automated clinical decisions without human review.</li>
            </ul>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-emerald-300 block">What This System DOES Provide:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>Cryptographic edge payload integrity verification (SHA-256).</li>
              <li>Contextual environmental anomaly detection and spatial correlation.</li>
              <li>HL7 FHIR STU3/R4 standards mapping (Location, Observation, Provenance).</li>
              <li>Transparent provenance chains identifying citizen science data custody.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Source Transparency Ledger */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase">
            Data Source Transparency
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-900 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Source 1</span>
            <span className="text-cyan-300 font-bold block mt-0.5">IoT Telemetry Probes</span>
            <span className="text-[10px] text-slate-400 mt-1 block">AQUA-SENSOR-042 (Edge)</span>
          </div>

          <div className="p-3 bg-slate-900 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Source 2</span>
            <span className="text-cyan-300 font-bold block mt-0.5">Citizen Science Network</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Open Ingestion Gateway</span>
          </div>

          <div className="p-3 bg-slate-900 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Source 3</span>
            <span className="text-cyan-300 font-bold block mt-0.5">Open-Meteo Weather</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Live API / Fallback</span>
          </div>

          <div className="p-3 bg-slate-900 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Source 4</span>
            <span className="text-cyan-300 font-bold block mt-0.5">Web Crypto SHA-256</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Browser Subtle API</span>
          </div>

          <div className="p-3 bg-slate-900 rounded border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Source 5</span>
            <span className="text-cyan-300 font-bold block mt-0.5">Simulated Sandbox</span>
            <span className="text-[10px] text-slate-400 mt-1 block">FHIR R4 Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};

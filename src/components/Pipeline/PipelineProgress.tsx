/**
 * Pipeline Progress Bar Component (Tactical Cyberpunk)
 * Displays the 14 discrete stages of EnviroFHIR-Guard with active hardware illumination:
 * - Ingestion & Anomaly stages (1-7): Neon Pink & Purple untrusted markers
 * - FHIR & Interop stages (8-14): Surgical Clinical Blue & Teal verified markers
 * - Fault: Critical Neon Pink/Red lockout
 */

import React from 'react';
import { FsmState, PipelineStageId } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
  CloudSun,
  Key,
  MapPin,
  FileText,
  Send,
  Lock,
} from 'lucide-react';

interface StageMeta {
  id: PipelineStageId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  isTrustedZone: boolean;
}

export const STAGES: StageMeta[] = [
  { id: 'LOAD_EVENT', label: '1. Ingest Event', shortLabel: 'Ingest', icon: Cpu, isTrustedZone: false },
  { id: 'VERIFY_SIGNATURE', label: '2. Edge Signature', shortLabel: 'ECDSA', icon: Key, isTrustedZone: false },
  { id: 'VALIDATE_SCHEMA', label: '3. Schema Bounds', shortLabel: 'Schema', icon: Layers, isTrustedZone: false },
  { id: 'CONTEXTUAL_BASELINE', label: '4. Baseline History', shortLabel: 'Baseline', icon: Activity, isTrustedZone: false },
  { id: 'DETECT_ANOMALY', label: '5. Anomaly Engine', shortLabel: 'Anomaly', icon: AlertTriangle, isTrustedZone: false },
  { id: 'SENSOR_CORRELATION', label: '6. 5km Correlation', shortLabel: 'Spatial', icon: MapPin, isTrustedZone: false },
  { id: 'WEATHER_EVIDENCE', label: '7. Weather Context', shortLabel: 'Weather', icon: CloudSun, isTrustedZone: false },
  { id: 'CALCULATE_TRUST', label: '8. Trust Score Shield', shortLabel: 'Trust', icon: ShieldCheck, isTrustedZone: true },
  { id: 'FHIR_LOCATION', label: '9. FHIR Location', shortLabel: 'Location', icon: MapPin, isTrustedZone: true },
  { id: 'FHIR_OBSERVATION', label: '10. FHIR Observation', shortLabel: 'Observation', icon: FileText, isTrustedZone: true },
  { id: 'FHIR_PROVENANCE', label: '11. FHIR Provenance', shortLabel: 'Provenance', icon: ShieldCheck, isTrustedZone: true },
  { id: 'FHIR_AUDIT_EVENT', label: '12. FHIR AuditEvent', shortLabel: 'Audit', icon: Lock, isTrustedZone: true },
  { id: 'FHIR_BUNDLE', label: '13. Transaction Bundle', shortLabel: 'Bundle', icon: Layers, isTrustedZone: true },
  { id: 'SANDBOX_RESPONSE', label: '14. Sandbox Gateway', shortLabel: 'Sandbox', icon: Send, isTrustedZone: true },
];

interface PipelineProgressProps {
  currentStageIndex: number; // 0 to 13, or 14 for complete
  isFault: boolean;
  isRunning: boolean;
  fsmState?: FsmState;
  onSelectStage?: (stageId: PipelineStageId, index: number) => void;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({
  currentStageIndex,
  isFault,
  isRunning,
  fsmState,
  onSelectStage,
}) => {
  return (
    <div className="w-full bg-[#05070A] border border-slate-800 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            FSM Transition Pipeline
          </span>
          {fsmState && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800">
              FSM: {fsmState}
            </span>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700">
            Stage {Math.min(currentStageIndex + 1, STAGES.length)} of {STAGES.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          {isFault ? (
            <span className="flex items-center gap-1 text-pink-400 font-semibold animate-pulse">
              <XCircle className="w-3.5 h-3.5" /> Pipeline Blocked by Zero-Trust Asymmetric Lockout
            </span>
          ) : isRunning ? (
            <span className="flex items-center gap-1 text-cyan-400">
              <Clock className="w-3.5 h-3.5 animate-spin" /> Verifying Interoperability...
            </span>
          ) : currentStageIndex >= STAGES.length ? (
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> End-to-End Pipeline Complete
            </span>
          ) : (
            <span className="text-slate-400">Ready for automated demo execution</span>
          )}
        </div>
      </div>

      {/* Horizontal Step Sequence */}
      <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pt-1">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < currentStageIndex && !isFault;
          const isCurrent = idx === currentStageIndex;
          const isFaulted = isFault && idx >= 1;

          let statusClass = 'border-slate-800 bg-[#090b10] text-slate-500';
          let iconColor = 'text-slate-500';

          if (isFaulted) {
            statusClass = 'border-red-900/40 bg-red-950/20 text-pink-400/60';
            iconColor = 'text-pink-400/60';
            if (idx === 1) {
              statusClass = 'border-pink-500 bg-red-950/60 text-pink-300 ring-1 ring-pink-500/50';
              iconColor = 'text-pink-400';
            }
          } else if (isCompleted) {
            if (stage.isTrustedZone) {
              statusClass = 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300';
              iconColor = 'text-cyan-400';
            } else {
              statusClass = 'border-purple-600/40 bg-purple-950/20 text-purple-300';
              iconColor = 'text-purple-400';
            }
          } else if (isCurrent) {
            statusClass = stage.isTrustedZone
              ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 ring-1 ring-cyan-400/60 animate-pulse'
              : 'border-pink-500 bg-pink-950/50 text-pink-200 ring-1 ring-pink-500/60 animate-pulse';
            iconColor = stage.isTrustedZone ? 'text-cyan-300' : 'text-pink-300';
          }

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage?.(stage.id, idx)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer hover:border-slate-600 ${statusClass}`}
              title={stage.label}
            >
              <div className="flex items-center justify-center mb-1">
                {isFaulted && idx === 1 ? (
                  <XCircle className="w-3.5 h-3.5 text-pink-400" />
                ) : isCompleted ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${stage.isTrustedZone ? 'text-cyan-400' : 'text-purple-400'}`} />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                )}
              </div>
              <span className="text-[9px] font-mono leading-tight truncate w-full block">
                {stage.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

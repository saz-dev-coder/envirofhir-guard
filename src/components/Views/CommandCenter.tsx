/**
 * Command Center View
 * Dominant primary dashboard featuring:
 * 1. Prominent RUN ONE-CLICK DEMO Action & Scenario Selector
 * 2. 3D Aerospace Canvas & Trust Score Shield
 * 3. 14-Stage Pipeline Progress
 * 4. Live Sensor Event Telemetry
 * 5. Why This Score Evidence Ledger
 * 6. FHIR Interoperability Status
 * 7. Security Integrity Status
 * 8. Resilience Informatics Early Warning Indicator
 */

import React from 'react';
import {
  FHIRAuditEvent,
  FHIRLocation,
  FHIRObservation,
  FHIRProvenance,
  FHIRTransactionBundle,
  HumanReviewRecord,
  NeighborSensor,
  SandboxResponse,
  Scenario,
  ScenarioId,
  SensorPayload,
  SignatureVerificationResult,
  TrustScoreBreakdown,
  WeatherEvidence,
  FsmState,
  ViewTab,
} from '../../types';
import { EnviroCanvas } from '../ThreeDimensional/EnviroCanvas';
import { ShieldView } from '../TrustShield/ShieldView';
import { PipelineProgress } from '../Pipeline/PipelineProgress';
import { HumanReviewModal } from '../HumanReview/HumanReviewModal';
import { DataInspector } from '../Inspectors/DataInspector';
import {
  Play,
  FastForward,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Radio,
  Layers,
  Thermometer,
  Droplets,
  Activity,
  MapPin,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface CommandCenterProps {
  scenarios: Scenario[];
  activeScenario: Scenario;
  onSelectScenario: (id: ScenarioId) => void;
  isRunningDemo: boolean;
  pipelineStageIndex: number;
  onRunOneClickDemo: () => void;
  onSkipAnimation: () => void;
  onReset: () => void;
  payload: SensorPayload;
  neighbors: NeighborSensor[];
  sigResult: SignatureVerificationResult;
  trust: TrustScoreBreakdown;
  weather: WeatherEvidence;
  locationResource: FHIRLocation | null;
  observationResource: FHIRObservation | null;
  provenanceResource: FHIRProvenance | null;
  auditResource: FHIRAuditEvent | null;
  bundleResource: FHIRTransactionBundle | null;
  sandboxResponse: SandboxResponse | null;
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  humanReview: HumanReviewRecord | undefined;
  onApplyHumanReview: (rec: HumanReviewRecord) => void;
  onNavigateTab: (tab: ViewTab) => void;
  onOpenVoiceAssistant?: () => void;
  fsmState: FsmState;
  isAudioMuted?: boolean;
  onToggleAudioMute?: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  scenarios,
  activeScenario,
  onSelectScenario,
  isRunningDemo,
  pipelineStageIndex,
  onRunOneClickDemo,
  onSkipAnimation,
  onReset,
  payload,
  neighbors,
  sigResult,
  trust,
  weather,
  locationResource,
  observationResource,
  provenanceResource,
  auditResource,
  bundleResource,
  sandboxResponse,
  showReviewModal,
  setShowReviewModal,
  humanReview,
  onApplyHumanReview,
  onNavigateTab,
  onOpenVoiceAssistant,
  fsmState,
  isAudioMuted = false,
  onToggleAudioMute,
}) => {
  const isFault = trust.isSignatureFault || trust.status === 'INTEGRITY_FAULT';

  return (
    <div className="space-y-6">
      {/* 1. HERO DEMO ACTION STRIP */}
      <div className="bg-gradient-to-r from-[#0c0919] via-[#080714] to-[#05070A] border border-purple-900/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-bl from-pink-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs text-purple-300 font-mono">
                Trust transparently. Interoperate securely.
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                FSM: {fsmState}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Automated Zero-Trust Verification Pipeline
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Select an environmental scenario and execute the full automated pipeline: Edge Ingestion →
              Web Crypto ECDSA P-256 Asymmetric Verification → Rolling Baselines → 5km Spatial Correlation →
              Weather Verification → Explainable Trust Score → FHIR Transaction Bundle.
            </p>
          </div>

          {/* Primary Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio Cue Mute Toggle */}
            {onToggleAudioMute && (
              <button
                onClick={onToggleAudioMute}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isAudioMuted ? 'Unmute Studio Audio Cues' : 'Mute Studio Audio Cues'}
              >
                {isAudioMuted ? '🔇 Audio Muted' : '🔊 Studio Audio ON'}
              </button>
            )}

            {/* AI Voice Assistant Button */}
            {onOpenVoiceAssistant && (
              <button
                onClick={onOpenVoiceAssistant}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 text-white hover:brightness-110 shadow-lg shadow-pink-600/30 transition-all border border-pink-400/30 active:scale-95 cursor-pointer"
                title="Open Multi-Lingual AI Voice Assistant (10 Languages)"
              >
                <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping" />
                <span>AI VOICE (10 LANG)</span>
              </button>
            )}

            <button
              onClick={onRunOneClickDemo}
              disabled={isRunningDemo}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-xl transition-all cursor-pointer ${
                isRunningDemo
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white hover:brightness-110 shadow-pink-500/25 active:scale-95'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {isRunningDemo ? 'EXECUTING PIPELINE...' : 'EXECUTE ZERO-TRUST PIPELINE'}
            </button>

            {isRunningDemo && (
              <button
                onClick={onSkipAnimation}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Instantly compute all verification and FHIR stages"
              >
                <FastForward className="w-4 h-4 text-cyan-400" />
                SKIP ANIMATION
              </button>
            )}

            <button
              onClick={onReset}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scenario Selector Segmented Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Choose Test Scenario:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {scenarios.map((sc) => {
              const isSelected = activeScenario.id === sc.id;
              let badgeStyle = 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
              if (sc.id === 'SCENARIO_D') {
                badgeStyle = 'text-red-400 border-red-500/40 bg-red-950/40';
              } else if (sc.id === 'SCENARIO_B') {
                badgeStyle = 'text-amber-400 border-amber-500/40 bg-amber-950/40';
              }

              return (
                <button
                  key={sc.id}
                  onClick={() => onSelectScenario(sc.id)}
                  disabled={isRunningDemo}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-100">{sc.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${badgeStyle}`}>
                      {sc.tag}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{sc.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {sc.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. PIPELINE PROGRESS (14 Stages) */}
      <PipelineProgress
        currentStageIndex={pipelineStageIndex}
        isFault={isFault}
        isRunning={isRunningDemo}
        fsmState={fsmState}
      />

      {/* 3. 3D VISUALIZATION & TRUST SHIELD (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3D Aerospace Canvas (7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <EnviroCanvas
            score={trust.totalScore}
            status={trust.status}
            currentPayload={payload}
            neighbors={neighbors}
            isFault={isFault}
            pipelineStageIndex={pipelineStageIndex}
          />
        </div>

        {/* 3D-styled Trust Shield (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <ShieldView
            trust={trust}
            onOpenReview={() => setShowReviewModal(true)}
          />
        </div>
      </div>

      {/* 4. MODAL FOR HUMAN-IN-THE-LOOP (if triggered or opened) */}
      {showReviewModal && (
        <HumanReviewModal
          payload={payload}
          trust={trust}
          sigResult={sigResult}
          weather={weather}
          currentReview={humanReview}
          onApplyDecision={(rec) => {
            onApplyHumanReview(rec);
            setShowReviewModal(false);
          }}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {/* 5. TELEMETRY, EVIDENCE LEDGER & SECURITY STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Inbound Sensor Telemetry */}
        <div className="bg-[#05070A] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                Edge Ingestion Telemetry
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {payload.sensor_id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block">Water pH</span>
              <span
                className={`text-lg font-bold font-mono ${
                  payload.water_ph < 6.0 || payload.water_ph > 8.5
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {payload.water_ph}
              </span>
              <span className="text-[10px] text-slate-500 block">Baseline: 7.12</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-cyan-400" /> Temperature
              </span>
              <span className="text-lg font-bold font-mono text-slate-100">
                {payload.water_temperature}°C
              </span>
              <span className="text-[10px] text-slate-500 block">Water Surface</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" /> Dissolved Oxygen
              </span>
              <span
                className={`text-lg font-bold font-mono ${
                  payload.dissolved_oxygen < 4.0 ? 'text-amber-400' : 'text-slate-100'
                }`}
              >
                {payload.dissolved_oxygen} <span className="text-xs font-normal">mg/L</span>
              </span>
              <span className="text-[10px] text-slate-500 block">Norm: &gt; 6.0</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> Turbidity
              </span>
              <span
                className={`text-lg font-bold font-mono ${
                  payload.turbidity > 40 ? 'text-red-400' : 'text-slate-100'
                }`}
              >
                {payload.turbidity} <span className="text-xs font-normal">NTU</span>
              </span>
              <span className="text-[10px] text-slate-500 block">Clarity Index</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Geo Location:</span>
              <span className="text-slate-200">
                {payload.latitude.toFixed(4)}, {payload.longitude.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Freshness:</span>
              <span className="text-slate-200">{new Date(payload.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Why This Score? Explainable Ledger */}
        <div className="bg-[#05070A] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                Why This Score? Evidence Ledger
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
              {trust.totalScore} / 100
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs scrollbar-thin">
            {trust.factors.map((f, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg border ${
                  f.isPositive
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-red-950/30 border-red-900/50 text-red-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-semibold text-[11px] mb-0.5">
                  <span>{f.label}</span>
                  <span className={f.isPositive ? 'text-emerald-400' : 'text-red-400'}>
                    {f.achieved} / {f.weight}
                  </span>
                </div>
                <div className="text-[11px] leading-snug">{f.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Security & Interoperability Gate Status */}
        <div className="bg-[#05070A] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                  Zero-Trust Gate Status
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isFault ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {isFault ? 'FAULT ACTIVE' : 'PASSED'}
              </span>
            </div>

            {/* Edge Signature Status */}
            <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Edge Signature (SHA-256):</span>
                <span
                  className={`font-mono font-bold ${
                    sigResult.isVerified ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {sigResult.isVerified ? 'VERIFIED' : 'MISMATCH'}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                Key Fingerprint: {sigResult.keyFingerprint} (P-256)
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                Signature: {sigResult.expectedSignature.slice(0, 24)}...
              </div>
            </div>

            {/* FHIR Interoperability Status */}
            <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">FHIR Bundle:</span>
                <span
                  className={`font-mono font-bold ${
                    bundleResource ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {bundleResource ? 'TRANSACTION READY' : 'SERIALIZATION BLOCKED'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {bundleResource
                  ? `Contains 5 resources: Location, Observation, Provenance, Organization, AuditEvent`
                  : `Protected by Zero-Trust Rule: Corrupted or unverified signals are never bundled.`}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('FHIR_BUILDER')}
              className="w-full py-2 px-3 text-xs font-mono rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Full FHIR Resources</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. RESILIENCE INFORMATICS EARLY WARNING ADVISORY (TRACK 6) */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0e1622] to-slate-950 border border-cyan-500/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100">
                Resilience Early-Warning Indicator // Watershed Zone 04
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                TRACK 6: RESILIENCE INFORMATICS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeScenario.id === 'SCENARIO_C'
                ? 'CRITICAL ALERT: Multi-sensor synchrony confirms regional toxic chemical depression across 5km basin. Human environmental investigation strongly advised.'
                : activeScenario.id === 'SCENARIO_B'
                ? 'CAUTION: Isolated sensor anomaly observed. Nearby nodes report stable baseline (7.1-7.2 pH). Field inspection recommended to rule out sensor fouling.'
                : 'Zone 04 environmental parameters active. Normal multi-station corroboration across Sabarmati basin.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('CONTEXT_ENGINE')}
          className="px-3 py-1.5 text-xs font-mono rounded bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white whitespace-nowrap flex items-center gap-1"
        >
          View 5km Spatial Topology
        </button>
      </div>

      {/* 7. INTEGRATED DATA INSPECTOR */}
      <DataInspector
        payload={payload}
        sigResult={sigResult}
        trust={trust}
        weather={weather}
        locationResource={locationResource}
        observationResource={observationResource}
        provenanceResource={provenanceResource}
        auditResource={auditResource}
        bundleResource={bundleResource}
        sandboxResponse={sandboxResponse}
      />
    </div>
  );
};

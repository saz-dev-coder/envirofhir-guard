/**
 * EnviroFHIR-Guard
 * Automated Trust-Scored Interoperability Engine for Citizen Science & Environmental Informatics
 *
 * Tagline: From Untrusted Environmental Signals to Trusted Healthcare Interoperability.
 * Secondary: Verify first. Trust transparently. Interoperate securely.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FHIRAuditEvent,
  FHIRLocation,
  FHIRObservation,
  FHIROrganization,
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
  ViewTab,
  WeatherEvidence,
} from './types';
import { demoScenarios } from './data/demoScenarios';
import { verifyEdgeSignature } from './services/cryptoService';
import {
  computeBaselineStats,
  correlateNeighborSensors,
  seedSensorHistory,
} from './services/contextEngine';
import { queryWeatherEvidence } from './services/weatherService';
import {
  assembleFHIRTransactionBundle,
  buildFHIRAuditEvent,
  buildFHIRLocation,
  buildFHIRObservation,
  buildFHIROrganization,
  buildFHIRProvenance,
  calculateTrustScore,
} from './services/fhirEngine';

import { CommandCenter } from './components/Views/CommandCenter';
import { IntegrityView } from './components/Views/IntegrityView';
import { ContextView } from './components/Views/ContextView';
import { FhirView } from './components/Views/FhirView';
import { SandboxView } from './components/Views/SandboxView';
import { ArchitectureView } from './components/Views/ArchitectureView';
import { DocumentationView } from './components/Views/DocumentationView';
import { VoiceAssistantModal } from './components/VoiceAssistant/VoiceAssistantModal';
import { EnviroFsm } from './services/fsmEngine';
import { hybridAudio } from './services/hybridAudio';
import { FsmState } from './types';

import {
  ShieldCheck,
  Activity,
  Layers,
  Server,
  Network,
  Radio,
  Lock,
  CloudSun,
  Key,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('COMMAND_CENTER');
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('SCENARIO_A');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Immutable Finite State Machine Reference
  const fsmRef = useRef(new EnviroFsm('FHIR_EMISSION'));
  const [fsmState, setFsmState] = useState<FsmState>('FHIR_EMISSION');

  const currentScenario =
    demoScenarios.find((s) => s.id === activeScenarioId) || demoScenarios[0];

  const [payload, setPayload] = useState<SensorPayload>(currentScenario.payload);
  const [neighbors, setNeighbors] = useState<NeighborSensor[]>(currentScenario.neighborSensors);

  // Pipeline Execution State
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [pipelineStageIndex, setPipelineStageIndex] = useState(14); // 14 = completed by default on initial load
  const timerRefs = useRef<number[]>([]);

  // Verification & Processing States
  const [sigResult, setSigResult] = useState<SignatureVerificationResult>({
    expectedSignature: payload.signature,
    canonicalPayload: '',
    isVerified: true,
    algorithm: 'ECDSA-P256-SHA256 (Web Crypto Asymmetric Key Verification)',
    keyFingerprint: payload.key_fingerprint || '108B5DD53384F5A6',
    publicKeyJwk: payload.public_key_jwk || null,
    signatureFormat: 'IEEE P1363 (64-byte Hex / r||s)',
    timestamp: new Date().toISOString(),
    latencyMs: 1.8,
  });

  const [weather, setWeather] = useState<WeatherEvidence>({
    source: 'OPEN_METEO_LIVE',
    status: 'LIVE',
    temperatureC: 29.4,
    relativeHumidity: 65,
    precipitationMm: 0,
    rainfallMm: 0,
    windSpeedKmh: 12.4,
    condition: 'Dry / Clear',
    retrievedAt: new Date().toISOString(),
    latencyMs: 18,
    environmentalCorrelation:
      'Dry meteorological conditions observed. No precipitation-induced runoff detected.',
  });

  const [trust, setTrust] = useState<TrustScoreBreakdown>({
    edgeIntegrity: 25,
    schemaValidity: 15,
    historicalConsistency: 15,
    spatialConsistency: 10,
    crossSensorAgreement: 15,
    externalEvidence: 10,
    temporalConsistency: 10,
    totalScore: 100,
    isSignatureFault: false,
    status: 'VERIFIED',
    factors: [],
  });

  const [humanReview, setHumanReview] = useState<HumanReviewRecord | undefined>(undefined);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // FHIR Resources
  const [fhirLocation, setFhirLocation] = useState<FHIRLocation | null>(null);
  const [fhirObservation, setFhirObservation] = useState<FHIRObservation | null>(null);
  const [fhirProvenance, setFhirProvenance] = useState<FHIRProvenance | null>(null);
  const [fhirOrganization] = useState<FHIROrganization>(buildFHIROrganization());
  const [fhirAudit, setFhirAudit] = useState<FHIRAuditEvent | null>(null);
  const [fhirBundle, setFhirBundle] = useState<FHIRTransactionBundle | null>(null);
  const [sandboxResponse, setSandboxResponse] = useState<SandboxResponse | null>(null);

  // Seed baseline stats
  const baselineStats = computeBaselineStats(
    payload.sensor_id,
    currentScenario.historicalPackets,
    payload
  );
  const regionalCorr = correlateNeighborSensors(payload, neighbors, 5.0);

  // Clear all pending timeouts
  const clearTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  // Run full evaluation synchronously or instantaneously
  const evaluateAll = useCallback(
    async (
      currentPld: SensorPayload,
      currentNeighbors: NeighborSensor[],
      scenario: Scenario
    ) => {
      // 1. Verify Edge Signature using Web Crypto API
      const verification = await verifyEdgeSignature(currentPld);
      setSigResult(verification);

      // 2. Query Weather Context
      const weatherData = await queryWeatherEvidence(
        currentPld.latitude,
        currentPld.longitude,
        scenario.id === 'SCENARIO_C'
      );
      setWeather(weatherData);

      // 3. Baselines & Spatial
      seedSensorHistory(currentPld.sensor_id, scenario.historicalPackets);
      const bStats = computeBaselineStats(
        currentPld.sensor_id,
        scenario.historicalPackets,
        currentPld
      );
      const rCorr = correlateNeighborSensors(currentPld, currentNeighbors, 5.0);

      // 4. Calculate Explainable Trust
      const trustScore = calculateTrustScore(
        currentPld,
        verification,
        bStats,
        rCorr,
        weatherData
      );
      setTrust(trustScore);

      // 5. Generate FHIR or Block
      if (trustScore.isSignatureFault) {
        // Block FHIR
        setFhirLocation(null);
        setFhirObservation(null);
        setFhirProvenance(null);
        const faultAudit = buildFHIRAuditEvent(currentPld, verification, trustScore);
        setFhirAudit(faultAudit);
        setFhirBundle(null);
        setSandboxResponse({
          status: 403,
          statusText: 'Forbidden - Zero-Trust Integrity Rejection',
          durationMs: 8,
          timestamp: new Date().toISOString(),
          transactionId: `TX-ERR-${Date.now()}`,
          isSuccess: false,
          operationOutcome: {
            resourceType: 'OperationOutcome',
            issue: [
              {
                severity: 'error',
                code: 'security',
                diagnostics:
                  'CRITICAL INTEGRITY FAULT: Edge ECDSA P-256 signature verification failed. Bundle serialization and submission blocked.',
              },
            ],
          },
        });
      } else {
        // Generate valid resources
        const loc = buildFHIRLocation(currentPld);
        const obs = buildFHIRObservation(currentPld, trustScore);
        const prv = buildFHIRProvenance(currentPld, obs.id, verification);
        const aud = buildFHIRAuditEvent(currentPld, verification, trustScore);
        const bundle = assembleFHIRTransactionBundle(loc, obs, prv, fhirOrganization, aud);

        setFhirLocation(loc);
        setFhirObservation(obs);
        setFhirProvenance(prv);
        setFhirAudit(aud);
        setFhirBundle(bundle);

        setSandboxResponse({
          status: 201,
          statusText: 'Created',
          durationMs: 42,
          timestamp: new Date().toISOString(),
          transactionId: `TX-${Date.now().toString().slice(-6)}`,
          isSuccess: true,
          operationOutcome: {
            resourceType: 'OperationOutcome',
            issue: [
              {
                severity: 'information',
                code: 'informational',
                diagnostics:
                  'Transaction bundle processed successfully. 5 resources committed with atomic consistency.',
              },
            ],
          },
        });
      }
    },
    [fhirOrganization]
  );

  // Initial mount computation
  useEffect(() => {
    evaluateAll(payload, neighbors, currentScenario);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Scenario Selection with Safe Instant Reset
  const handleSelectScenario = (id: ScenarioId) => {
    clearTimers();
    setIsRunningDemo(false);

    setActiveScenarioId(id);
    const sc = demoScenarios.find((s) => s.id === id) || demoScenarios[0];
    setPayload(sc.payload);
    setNeighbors(sc.neighborSensors);

    // Instant unbreakable FSM Reset & Transition
    fsmRef.current.reset(`Switched to ${id}`);
    hybridAudio.playStudioCue('RESET');

    if (sc.id === 'SCENARIO_D') {
      fsmRef.current.transition('FAULT_BLOCKED', 'Scenario D tamper fault loaded');
      setFsmState('FAULT_BLOCKED');
      setPipelineStageIndex(1); // Stop at signature check
      hybridAudio.playStudioCue('FAULT');
    } else {
      fsmRef.current.transition('FHIR_EMISSION', 'Pre-validated scenario ready');
      setFsmState('FHIR_EMISSION');
      setPipelineStageIndex(14);
    }

    evaluateAll(sc.payload, sc.neighborSensors, sc);
  };

  // Automated ONE-CLICK DEMO Runner with FSM & Studio Audio Cues
  const handleRunOneClickDemo = () => {
    clearTimers();
    setIsRunningDemo(true);
    setPipelineStageIndex(0);

    // Reset FSM to initial state and begin Ingestion
    fsmRef.current.reset('One-Click Demo Started');
    fsmRef.current.transition('INGESTING', 'Edge telemetry stream inbound');
    setFsmState('INGESTING');
    hybridAudio.playStudioCue('INGEST');

    const isScenarioD = activeScenarioId === 'SCENARIO_D';

    const stageTimings = [
      { stage: 0, delay: 0 },     // 1. Ingest Event
      { stage: 1, delay: 400 },   // 2. Verify Signature (ECDSA P-256)
      { stage: 2, delay: 800 },   // 3. Schema Bounds
      { stage: 3, delay: 1200 },  // 4. Baseline History
      { stage: 4, delay: 1650 },  // 5. Anomaly Engine
      { stage: 5, delay: 2100 },  // 6. 5km Spatial Correlation
      { stage: 6, delay: 2550 },  // 7. Weather Context
      { stage: 7, delay: 3200 },  // 8. Trust Score Shield
      { stage: 8, delay: 3700 },  // 9. FHIR Location
      { stage: 9, delay: 4050 },  // 10. FHIR Observation
      { stage: 10, delay: 4400 }, // 11. FHIR Provenance
      { stage: 11, delay: 4750 }, // 12. FHIR AuditEvent
      { stage: 12, delay: 5100 }, // 13. Transaction Bundle
      { stage: 13, delay: 5500 }, // 14. Sandbox Gateway
      { stage: 14, delay: 5900 }, // Finished
    ];

    stageTimings.forEach(({ stage, delay }) => {
      // If Scenario D, halt after stage 1 (Signature check)
      if (isScenarioD && stage > 1) {
        return;
      }

      const timerId = window.setTimeout(async () => {
        setPipelineStageIndex(stage);

        if (stage === 1) {
          // Asymmetric ECDSA Verification
          fsmRef.current.transition('VERIFYING_SIGNATURE', 'Web Crypto ECDSA P-256 check');
          setFsmState('VERIFYING_SIGNATURE');

          const verification = await verifyEdgeSignature(payload);
          setSigResult(verification);

          if (!verification.isVerified) {
            // Fault detected! Enforce unbreakable FAULT_BLOCKED transition
            fsmRef.current.transition('FAULT_BLOCKED', 'ECDSA Signature Mismatch: Private key did not sign modified payload');
            setFsmState('FAULT_BLOCKED');
            hybridAudio.playStudioCue('FAULT');
            hybridAudio.playDemoNarration('SCENARIO_D');
            evaluateAll(payload, neighbors, currentScenario);
            setIsRunningDemo(false);
            return;
          } else {
            hybridAudio.playStudioCue('VERIFY');
          }
        }

        if (stage === 3) {
          fsmRef.current.transition('EVALUATING_CONTEXT', '10-packet rolling stats & 5km spatial correlation');
          setFsmState('EVALUATING_CONTEXT');
        }

        if (stage === 6) {
          const w = await queryWeatherEvidence(
            payload.latitude,
            payload.longitude,
            activeScenarioId === 'SCENARIO_C'
          );
          setWeather(w);
        }

        if (stage === 7) {
          fsmRef.current.transition('COMPUTING_TRUST', 'Explainable multi-factor scoring');
          setFsmState('COMPUTING_TRUST');
          hybridAudio.playStudioCue('TRUST');
          evaluateAll(payload, neighbors, currentScenario);
        }

        if (stage === 12) {
          fsmRef.current.transition('FHIR_EMISSION', 'Atomic transaction bundle assembled');
          setFsmState('FHIR_EMISSION');
          hybridAudio.playStudioCue('FHIR');
          hybridAudio.playDemoNarration(activeScenarioId);
        }

        if (stage === 14) {
          setIsRunningDemo(false);
        }
      }, delay);

      timerRefs.current.push(timerId);
    });

    if (isScenarioD) {
      const stopTimer = window.setTimeout(() => {
        setIsRunningDemo(false);
      }, 1200);
      timerRefs.current.push(stopTimer);
    }
  };

  // Skip Animation for Instant Demo Completion
  const handleSkipAnimation = () => {
    clearTimers();
    setIsRunningDemo(false);

    if (activeScenarioId === 'SCENARIO_D') {
      fsmRef.current.reset('Skipped animation for Scenario D');
      fsmRef.current.transition('INGESTING');
      fsmRef.current.transition('VERIFYING_SIGNATURE');
      fsmRef.current.transition('FAULT_BLOCKED', 'Asymmetric signature check failed');
      setFsmState('FAULT_BLOCKED');
      setPipelineStageIndex(1);
      hybridAudio.playStudioCue('FAULT');
      hybridAudio.playDemoNarration('SCENARIO_D');
    } else {
      fsmRef.current.reset('Skipped animation');
      fsmRef.current.transition('INGESTING');
      fsmRef.current.transition('VERIFYING_SIGNATURE');
      fsmRef.current.transition('EVALUATING_CONTEXT');
      fsmRef.current.transition('COMPUTING_TRUST');
      fsmRef.current.transition('FHIR_EMISSION');
      setFsmState('FHIR_EMISSION');
      setPipelineStageIndex(14);
      hybridAudio.playStudioCue('FHIR');
      hybridAudio.playDemoNarration(activeScenarioId);
    }

    evaluateAll(payload, neighbors, currentScenario);
  };

  // Reset to initial safe state
  const handleReset = () => {
    clearTimers();
    setIsRunningDemo(false);
    fsmRef.current.reset('User requested full reset');
    setFsmState('IDLE');
    setPipelineStageIndex(0);
    hybridAudio.playStudioCue('RESET');
    setPayload(currentScenario.payload);
    setNeighbors(currentScenario.neighborSensors);
    evaluateAll(currentScenario.payload, currentScenario.neighborSensors, currentScenario);
  };

  // Simulate In-Flight Tampering
  const handleSimulateTamper = (modified: SensorPayload) => {
    clearTimers();
    setIsRunningDemo(false);
    setPayload(modified);
    evaluateAll(modified, neighbors, currentScenario);
  };

  // Restore Original
  const handleRestoreOriginal = () => {
    handleSelectScenario(activeScenarioId);
  };

  // Simulate Sandbox Transmission with various HTTP codes
  const handleSimulateSandboxTransmission = (statusCode: number) => {
    const isSuccess = statusCode === 200 || statusCode === 201;
    let text = 'Created';
    let diag = 'Transaction bundle committed with atomic consistency.';

    if (statusCode === 200) {
      text = 'OK';
      diag = 'Transaction processed with warnings: Observation.interpretation generated as preliminary.';
    } else if (statusCode === 400) {
      text = 'Bad Request';
      diag = 'FHIR Schema validation failure: Invalid valueQuantity unit or missing code element.';
    } else if (statusCode === 422) {
      text = 'Unprocessable Entity';
      diag = 'Semantic business rule error: Location identifier does not match registered jurisdiction.';
    } else if (statusCode === 500) {
      text = 'Internal Server Error';
      diag = 'Target healthcare repository database lock timeout.';
    }

    setSandboxResponse({
      status: statusCode,
      statusText: text,
      durationMs: Math.round(15 + Math.random() * 40),
      timestamp: new Date().toISOString(),
      transactionId: `TX-${Date.now().toString().slice(-6)}`,
      isSuccess,
      operationOutcome: {
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: isSuccess ? 'information' : 'error',
            code: isSuccess ? 'informational' : 'invalid',
            diagnostics: diag,
          },
        ],
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col font-sans selection:bg-pink-500/20 selection:text-pink-300">
      {/* TOP COMMAND HEADER */}
      <header className="bg-[#05070A]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white font-mono">
                  ENVIROFHIR-GUARD
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/40 font-semibold">
                  TRUST ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                From Untrusted Environmental Signals to Trusted Healthcare Interoperability.
              </p>
            </div>
          </div>

          {/* AI Voice Assistant Trigger & System Indicators */}
          <div className="flex items-center gap-2 overflow-x-auto text-[10px] font-mono text-slate-400">
            {/* Header AI Voice Assistant Launcher */}
            <button
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white hover:brightness-110 shadow-md shadow-purple-500/20 transition-all cursor-pointer mr-1"
              title="Open AI Voice Assistant (10 Languages with Native Accents)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI VOICE (10 LANG)</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>INGESTION: READY</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  sigResult.isVerified ? 'bg-cyan-400' : 'bg-red-500 animate-pulse'
                }`}
              />
              <span>INTEGRITY: {sigResult.isVerified ? 'ACTIVE (ECDSA)' : 'FAULT'}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>CONTEXT: 5KM</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  weather.status === 'LIVE' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span>WEATHER: {weather.status}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>FHIR: STU3/R4</span>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS BAR */}
      <nav className="bg-[#05070A] border-b border-slate-800 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {[
            { id: 'COMMAND_CENTER', label: 'Command Center', icon: Activity },
            { id: 'INTEGRITY', label: 'Integrity & Crypto', icon: Key },
            { id: 'CONTEXT_ENGINE', label: 'Context & Baselines', icon: Radio },
            { id: 'FHIR_BUILDER', label: 'FHIR Interop Chamber', icon: Layers },
            { id: 'SANDBOX', label: 'Sandbox Gateway', icon: Server },
            { id: 'ARCHITECTURE', label: 'Async Architecture', icon: Network },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ViewTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 bg-[#05070A]">
        {activeTab === 'COMMAND_CENTER' && (
          <CommandCenter
            scenarios={demoScenarios}
            activeScenario={currentScenario}
            onSelectScenario={handleSelectScenario}
            isRunningDemo={isRunningDemo}
            pipelineStageIndex={pipelineStageIndex}
            onRunOneClickDemo={handleRunOneClickDemo}
            onSkipAnimation={handleSkipAnimation}
            onReset={handleReset}
            payload={payload}
            neighbors={neighbors}
            sigResult={sigResult}
            trust={trust}
            weather={weather}
            locationResource={fhirLocation}
            observationResource={fhirObservation}
            provenanceResource={fhirProvenance}
            auditResource={fhirAudit}
            bundleResource={fhirBundle}
            sandboxResponse={sandboxResponse}
            showReviewModal={showReviewModal}
            setShowReviewModal={setShowReviewModal}
            humanReview={humanReview}
            onApplyHumanReview={(rec) => setHumanReview(rec)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            fsmState={fsmState}
            isAudioMuted={isAudioMuted}
            onToggleAudioMute={() => {
              const next = !isAudioMuted;
              setIsAudioMuted(next);
              hybridAudio.setMuted(next);
            }}
          />
        )}

        {activeTab === 'INTEGRITY' && (
          <IntegrityView
            payload={payload}
            sigResult={sigResult}
            onSimulateTamper={handleSimulateTamper}
            onRestoreOriginal={handleRestoreOriginal}
          />
        )}

        {activeTab === 'CONTEXT_ENGINE' && (
          <ContextView
            payload={payload}
            history={currentScenario.historicalPackets}
            baselineStats={baselineStats}
            neighbors={neighbors}
            regionalCorr={regionalCorr}
          />
        )}

        {activeTab === 'FHIR_BUILDER' && (
          <FhirView
            locationResource={fhirLocation}
            observationResource={fhirObservation}
            provenanceResource={fhirProvenance}
            organizationResource={fhirOrganization}
            auditResource={fhirAudit}
            bundleResource={fhirBundle}
            trust={trust}
          />
        )}

        {activeTab === 'SANDBOX' && (
          <SandboxView
            bundleResource={fhirBundle}
            sandboxResponse={sandboxResponse}
            onSimulateTransmission={handleSimulateSandboxTransmission}
          />
        )}

        {activeTab === 'ARCHITECTURE' && <ArchitectureView />}

        {activeTab === 'TRACK_DOCS' && <DocumentationView />}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#05070A] border-t border-slate-800 px-4 lg:px-8 py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-300 font-bold">EnviroFHIR-Guard</span>
            <span>·</span>
            <span className="text-slate-400">Automated Trust-Scored Interoperability Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>HL7 FHIR STU3 / R4 Compatible</span>
            <span>·</span>
            <span>Web Crypto ECDSA P-256</span>
            <span>·</span>
            <span>AI Voice Assistant (10 Languages)</span>
          </div>
        </div>
      </footer>

      {/* MULTI-LINGUAL AI VOICE ASSISTANT MODAL */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />
    </div>
  );
}

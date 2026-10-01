/**
 * Technical Data Inspector Component
 * Provides comprehensive tabbed inspection of all pipeline artifacts:
 * Raw Payload, Signature Verification, Historical Context, Weather Evidence,
 * Trust Breakdown, FHIR Resources, Transaction Bundle, and Sandbox Response.
 * Includes Copy, Download, and formatting tools.
 */

import React, { useState } from 'react';
import {
  FHIRAuditEvent,
  FHIRLocation,
  FHIRObservation,
  FHIRProvenance,
  FHIRTransactionBundle,
  SandboxResponse,
  SensorPayload,
  SignatureVerificationResult,
  TrustScoreBreakdown,
  WeatherEvidence,
} from '../../types';
import { Copy, Check, Download, Code2, Maximize2, Minimize2 } from 'lucide-react';

interface DataInspectorProps {
  payload: SensorPayload;
  sigResult: SignatureVerificationResult;
  trust: TrustScoreBreakdown;
  weather: WeatherEvidence;
  locationResource: FHIRLocation | null;
  observationResource: FHIRObservation | null;
  provenanceResource: FHIRProvenance | null;
  auditResource: FHIRAuditEvent | null;
  bundleResource: FHIRTransactionBundle | null;
  sandboxResponse: SandboxResponse | null;
}

type TabKey =
  | 'RAW'
  | 'SIGNATURE'
  | 'WEATHER'
  | 'TRUST'
  | 'LOCATION'
  | 'OBSERVATION'
  | 'PROVENANCE'
  | 'AUDIT'
  | 'BUNDLE'
  | 'SANDBOX';

export const DataInspector: React.FC<DataInspectorProps> = ({
  payload,
  sigResult,
  trust,
  weather,
  locationResource,
  observationResource,
  provenanceResource,
  auditResource,
  bundleResource,
  sandboxResponse,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('BUNDLE');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getActiveData = (): { title: string; data: any; description: string } => {
    switch (activeTab) {
      case 'RAW':
        return {
          title: 'Untrusted Edge Sensor Payload (JSON)',
          data: payload,
          description: 'Inbound IoT environmental telemetry stream before trust ingestion.',
        };
      case 'SIGNATURE':
        return {
          title: 'Edge Cryptographic Verification Diagnostics',
          data: {
            algorithm: sigResult.algorithm,
            isVerified: sigResult.isVerified,
            expectedSignature: sigResult.expectedSignature,
            computedSignature: sigResult.computedSignature,
            latencyMs: sigResult.latencyMs,
            canonicalPayload: JSON.parse(sigResult.canonicalPayload || '{}'),
          },
          description: 'Deterministic Web Crypto canonical digest comparison.',
        };
      case 'WEATHER':
        return {
          title: 'External Meteorological Evidence',
          data: weather,
          description: 'Open-Meteo live API query with deterministic fallback provider.',
        };
      case 'TRUST':
        return {
          title: 'Explainable Trust Engine Scoring Ledger',
          data: {
            totalScore: `${trust.totalScore} / 100`,
            status: trust.status,
            isSignatureFault: trust.isSignatureFault,
            categoryBreakdown: {
              edgeIntegrity: `${trust.edgeIntegrity} / 25`,
              schemaValidity: `${trust.schemaValidity} / 15`,
              historicalConsistency: `${trust.historicalConsistency} / 15`,
              spatialConsistency: `${trust.spatialConsistency} / 10`,
              crossSensorAgreement: `${trust.crossSensorAgreement} / 15`,
              externalEvidence: `${trust.externalEvidence} / 10`,
              temporalConsistency: `${trust.temporalConsistency} / 10`,
            },
            explanationFactors: trust.factors,
          },
          description: 'Multi-factor weighted trust ledger with absolute zero-trust override.',
        };
      case 'LOCATION':
        return {
          title: 'HL7 FHIR Location Resource',
          data: locationResource || { status: 'BLOCKED_BY_ZERO_TRUST' },
          description: 'Standardized spatial representation of aquatic monitoring zone.',
        };
      case 'OBSERVATION':
        return {
          title: 'HL7 FHIR Observation Resource',
          data: observationResource || { status: 'BLOCKED_BY_ZERO_TRUST' },
          description: 'LOINC 2713-6 water quality observation with environmental profile.',
        };
      case 'PROVENANCE':
        return {
          title: 'HL7 FHIR Provenance Resource',
          data: provenanceResource || { status: 'BLOCKED_BY_ZERO_TRUST' },
          description: 'Chain-of-custody, edge signer reference, and cryptographic policy.',
        };
      case 'AUDIT':
        return {
          title: 'HL7 FHIR AuditEvent Resource',
          data: auditResource || { status: 'BLOCKED_BY_ZERO_TRUST' },
          description: 'Immutable record of security verification, outcome code, and entity metadata.',
        };
      case 'BUNDLE':
        return {
          title: 'HL7 FHIR Transaction Bundle (POST)',
          data: bundleResource || { status: 'BLOCKED_BY_ZERO_TRUST' },
          description: 'Atomic FHIR transaction package ready for EHR / HIE interoperability.',
        };
      case 'SANDBOX':
        return {
          title: 'Simulated FHIR Gateway Sandbox Response',
          data: sandboxResponse || { status: 'TRANSMISSION_PENDING' },
          description: 'Server transaction parser results with HTTP status and OperationOutcome.',
        };
      default:
        return { title: 'Inspector', data: {}, description: '' };
    }
  };

  const { title, data, description } = getActiveData();
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enviro-fhir-${activeTab.toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { key: TabKey; label: string; badge?: string }[] = [
    { key: 'BUNDLE', label: 'FHIR Bundle', badge: bundleResource ? 'READY' : 'BLOCKED' },
    { key: 'OBSERVATION', label: 'Observation' },
    { key: 'LOCATION', label: 'Location' },
    { key: 'PROVENANCE', label: 'Provenance' },
    { key: 'AUDIT', label: 'AuditEvent' },
    { key: 'SIGNATURE', label: 'Edge Signature' },
    { key: 'TRUST', label: 'Trust Breakdown' },
    { key: 'WEATHER', label: 'Weather Context' },
    { key: 'RAW', label: 'Raw Inbound' },
    { key: 'SANDBOX', label: 'Sandbox Gateway' },
  ];

  return (
    <div
      className={`bg-[#05070A] border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
        isExpanded ? 'fixed inset-4 z-50 flex flex-col' : 'w-full'
      }`}
    >
      {/* Header with Tabs */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 pt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Interoperability Artifact Inspector
          </span>
        </div>

        <div className="flex items-center gap-2 pb-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3 h-3" /> Export
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 border border-slate-700"
            title={isExpanded ? 'Collapse' : 'Expand full screen'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-3 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                  tab.badge === 'READY'
                    ? 'bg-emerald-950 text-emerald-300'
                    : 'bg-red-950 text-red-300'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Description Subheader */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-slate-200">{title}</span>
          <span className="text-slate-400 ml-2 text-[11px]">— {description}</span>
        </div>
      </div>

      {/* JSON Code Viewer */}
      <div className={`p-4 overflow-auto bg-[#070b10] font-mono text-xs ${isExpanded ? 'flex-1' : 'max-h-[380px]'}`}>
        <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};

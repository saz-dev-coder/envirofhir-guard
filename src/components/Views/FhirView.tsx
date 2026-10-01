/**
 * FHIR Interoperability Chamber View
 * Detailed inspection of HL7 FHIR STU3/R4 resources:
 * Location, Observation, Provenance, Organization, AuditEvent, and Transaction Bundle.
 * Highlights standards compliance (LOINC, HL7 Core, urn:uuid internal consistency).
 */

import React, { useState } from 'react';
import {
  FHIRAuditEvent,
  FHIRLocation,
  FHIRObservation,
  FHIROrganization,
  FHIRProvenance,
  FHIRTransactionBundle,
  TrustScoreBreakdown,
} from '../../types';
import {
  Layers,
  MapPin,
  FileText,
  ShieldCheck,
  Lock,
  Building,
  CheckCircle2,
  XCircle,
  Copy,
  Download,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface FhirViewProps {
  locationResource: FHIRLocation | null;
  observationResource: FHIRObservation | null;
  provenanceResource: FHIRProvenance | null;
  organizationResource: FHIROrganization;
  auditResource: FHIRAuditEvent | null;
  bundleResource: FHIRTransactionBundle | null;
  trust: TrustScoreBreakdown;
}

export const FhirView: React.FC<FhirViewProps> = ({
  locationResource,
  observationResource,
  provenanceResource,
  organizationResource,
  auditResource,
  bundleResource,
  trust,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'BUNDLE' | 'OBSERVATION' | 'LOCATION' | 'PROVENANCE' | 'AUDIT' | 'ORGANIZATION'
  >('BUNDLE');
  const [copied, setCopied] = useState(false);

  const isBlocked = trust.isSignatureFault || !bundleResource;

  const getResourceJson = () => {
    switch (activeSubTab) {
      case 'BUNDLE':
        return bundleResource;
      case 'OBSERVATION':
        return observationResource;
      case 'LOCATION':
        return locationResource;
      case 'PROVENANCE':
        return provenanceResource;
      case 'ORGANIZATION':
        return organizationResource;
      case 'AUDIT':
        return auditResource;
    }
  };

  const currentData = getResourceJson();
  const jsonString = currentData ? JSON.stringify(currentData, null, 2) : '/* BLOCKED BY ZERO-TRUST ENGINE */';

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
    a.download = `fhir-${activeSubTab.toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              HL7 FHIR Semantic Serialization Chamber
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Transforms validated citizen telemetry into structured HL7 FHIR resources.
            All references use internal <code className="text-cyan-300 font-mono">urn:uuid:...</code> resolution
            for atomic transaction bundle execution into electronic health records and public health registries.
          </p>
        </div>

        <div>
          <span
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
              isBlocked
                ? 'bg-red-950/90 border-red-500/60 text-red-300'
                : trust.status === 'HUMAN_REVIEW'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
            }`}
          >
            {isBlocked ? (
              <>
                <XCircle className="w-4 h-4 text-red-400" /> SERIALIZATION BLOCKED
              </>
            ) : trust.status === 'HUMAN_REVIEW' ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" /> PRELIMINARY (PENDING REVIEW)
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> FHIR TRANSACTION READY
              </>
            )}
          </span>
        </div>
      </div>

      {/* Security Boundary Visualization Card */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0e1622] to-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl">
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-3">
          Architecture Security Boundary
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          {/* Untrusted Zone */}
          <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 space-y-1.5">
            <span className="text-red-400 font-bold block uppercase text-[11px]">
              1. Untrusted Zone
            </span>
            <p className="text-slate-400 text-[11px]">
              Raw IoT water quality probes, volunteer citizen apps, low-cost sensor nodes. Messy, uncalibrated,
              susceptible to tamper.
            </p>
          </div>

          {/* Trust Firewall */}
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/60 space-y-1.5">
            <span className="text-cyan-300 font-bold block uppercase text-[11px] flex items-center justify-between">
              <span>2. EnviroFHIR Trust Firewall</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </span>
            <p className="text-slate-300 text-[11px]">
              Edge Web Crypto SHA-256, 10-packet rolling stats, 5km Haversine neighbor checks, Open-Meteo weather correlation, Human-in-the-Loop review.
            </p>
          </div>

          {/* Trusted Interop Zone */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
            <span className="text-emerald-400 font-bold block uppercase text-[11px]">
              3. Trusted Interop Zone
            </span>
            <p className="text-slate-400 text-[11px]">
              HL7 FHIR Transaction Bundle (POST), LOINC 2713-6 Observation, Location, Provenance signature, AuditEvent records.
            </p>
          </div>
        </div>
      </div>

      {/* Resource Tabs & Interactive JSON Viewer */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 pt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'BUNDLE', label: 'Transaction Bundle', icon: Layers },
              { id: 'OBSERVATION', label: 'Observation (LOINC)', icon: FileText },
              { id: 'LOCATION', label: 'Location (GIS)', icon: MapPin },
              { id: 'PROVENANCE', label: 'Provenance (Chain)', icon: ShieldCheck },
              { id: 'ORGANIZATION', label: 'Organization', icon: Building },
              { id: 'AUDIT', label: 'AuditEvent', icon: Lock },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveSubTab(t.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                    activeSubTab === t.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleCopy}
              disabled={isBlocked}
              className="flex items-center gap-1 px-3 py-1 text-xs font-mono rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50"
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isBlocked}
              className="flex items-center gap-1 px-3 py-1 text-xs font-mono rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* JSON Code Inspector */}
        <div className="p-5 bg-[#070b10] font-mono text-xs overflow-auto max-h-[500px]">
          {isBlocked ? (
            <div className="py-12 text-center space-y-3">
              <Lock className="w-8 h-8 text-red-400 mx-auto" />
              <div className="text-sm font-bold text-red-400">
                SERIALIZATION BLOCKED: ZERO-TRUST VIOLATION
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                The cryptographic edge signature failed verification or the payload was rejected.
                To protect healthcare interoperability systems, no FHIR resources will be serialized.
              </p>
            </div>
          ) : (
            <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
              {jsonString}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

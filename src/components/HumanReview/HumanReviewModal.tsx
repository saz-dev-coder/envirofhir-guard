/**
 * Automated Human-in-the-Loop Validation Assistant
 * Presents contextual evidence, discrepancies, weather correlation, and cryptographic state
 * to an authorized human environmental/public-health reviewer.
 * Actions: Accept With Review, Request Investigation, Reject
 */

import React, { useState } from 'react';
import {
  HumanReviewDecision,
  HumanReviewRecord,
  SensorPayload,
  SignatureVerificationResult,
  TrustScoreBreakdown,
  WeatherEvidence,
} from '../../types';
import {
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserCheck,
  FileText,
  Clock,
  MapPin,
  CloudSun,
} from 'lucide-react';

interface HumanReviewModalProps {
  payload: SensorPayload;
  trust: TrustScoreBreakdown;
  sigResult: SignatureVerificationResult;
  weather: WeatherEvidence;
  currentReview?: HumanReviewRecord;
  onApplyDecision: (record: HumanReviewRecord) => void;
  onClose?: () => void;
}

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({
  payload,
  trust,
  sigResult,
  weather,
  currentReview,
  onApplyDecision,
  onClose,
}) => {
  const [reviewerId, setReviewerId] = useState('OPERATOR-ENV-774');
  const [notes, setNotes] = useState(
    currentReview?.notes ||
      'Localized sensor anomaly observed. Cross-checked with downstream municipal water intake telemetry.'
  );
  const [selectedDecision, setSelectedDecision] = useState<HumanReviewDecision>(
    currentReview?.decision || 'accepted_with_review'
  );

  const handleSubmit = (decision: HumanReviewDecision) => {
    setSelectedDecision(decision);
    onApplyDecision({
      decision,
      reviewerId,
      timestamp: new Date().toISOString(),
      notes,
    });
  };

  return (
    <div className="bg-[#0b1017] border border-amber-500/30 rounded-xl p-5 shadow-2xl space-y-4">
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Automated Human-in-the-Loop Validation Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                TRACK 3: AI-SUPPORTED ASSESSMENT
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates contextual evidence, historical variance, and sensor integrity before clinical interoperability transmission.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-mono px-2 py-1 rounded bg-slate-800"
          >
            ✕
          </button>
        )}
      </div>

      {/* Flagging Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Why Flagged?</span>
          <span className="text-xs text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {trust.status === 'INTEGRITY_FAULT'
              ? 'Edge Signature Mismatch'
              : 'Localized Sensor Deviation (> 2.0 pH Delta)'}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Trust Score</span>
          <span className="text-xs text-cyan-400 font-mono font-bold block mt-0.5">
            {trust.totalScore} / 100 ({trust.status})
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Interoperability Gate</span>
          <span className="text-xs text-slate-300 font-mono block mt-0.5">
            {trust.isSignatureFault ? '⛔ BLOCKED' : '⏳ PENDING HUMAN DECISION'}
          </span>
        </div>
      </div>

      {/* Detailed Multi-Source Evidence Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Sensor & Historical Context */}
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold">
            <Clock className="w-3.5 h-3.5" /> Sensor Telemetry & Baseline
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Sensor ID:</span>
              <span className="font-mono text-slate-200">{payload.sensor_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target pH Reading:</span>
              <span className="font-mono font-bold text-amber-300">{payload.water_ph}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dissolved Oxygen / Temp:</span>
              <span className="font-mono">{payload.dissolved_oxygen} mg/L / {payload.water_temperature}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Edge Signature Check:</span>
              <span
                className={`font-mono font-semibold ${
                  sigResult.isVerified ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {sigResult.isVerified ? 'VERIFIED (SHA-256)' : 'FAILED (MISMATCH)'}
              </span>
            </div>
          </div>
        </div>

        {/* Spatial & Weather Context */}
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold">
            <MapPin className="w-3.5 h-3.5" /> Spatial & Weather Evidence
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Zone / Coordinates:</span>
              <span className="font-mono">{payload.latitude.toFixed(4)}, {payload.longitude.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Weather Provider:</span>
              <span className="font-mono flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-cyan-400" /> {weather.source} ({weather.status})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Atmospheric Context:</span>
              <span className="font-mono">{weather.condition} ({weather.temperatureC}°C)</span>
            </div>
            <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
              {weather.environmentalCorrelation}
            </div>
          </div>
        </div>
      </div>

      {/* Reviewer Note Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          Reviewer Audit Note (Embedded in FHIR Provenance & AuditEvent):
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
          placeholder="Enter clinical/environmental justification for audit ledger..."
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Reviewer ID:</span>
          <input
            type="text"
            value={reviewerId}
            onChange={(e) => setReviewerId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-200"
          />
        </div>
      </div>

      {/* Human Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
        <div className="text-[11px] text-slate-400 italic">
          Human validation makes the definitive legal and interoperability decision.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit('rejected')}
            disabled={trust.isSignatureFault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 hover:bg-red-900/80 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject Payload
          </button>
          <button
            onClick={() => handleSubmit('investigation_requested')}
            disabled={trust.isSignatureFault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300 hover:bg-amber-900/80 transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Request Field Investigation
          </button>
          <button
            onClick={() => handleSubmit('accepted_with_review')}
            disabled={trust.isSignatureFault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-950/60 border border-emerald-700 text-emerald-300 hover:bg-emerald-900/80 transition-colors shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Accept With Human Validation
          </button>
        </div>
      </div>
    </div>
  );
};

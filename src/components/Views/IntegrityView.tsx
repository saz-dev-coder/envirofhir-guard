/**
 * Integrity & Cryptography View
 * Upgraded to Web Crypto API Asymmetric Signatures (ECDSA with P-256 and SHA-256).
 * Inspects Edge Public/Private Key pairs, Key Fingerprints, IEEE P1363 signatures,
 * canonical JSON serialization, and interactive in-flight tampering proofs.
 */

import React, { useState } from 'react';
import { SensorPayload, SignatureVerificationResult } from '../../types';
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  Lock,
  RefreshCw,
  Sliders,
  CheckCircle2,
  XCircle,
  FileCode,
  Zap,
  Cpu,
} from 'lucide-react';

interface IntegrityViewProps {
  payload: SensorPayload;
  sigResult: SignatureVerificationResult;
  onSimulateTamper: (modifiedPayload: SensorPayload) => void;
  onRestoreOriginal: () => void;
}

export const IntegrityView: React.FC<IntegrityViewProps> = ({
  payload,
  sigResult,
  onSimulateTamper,
  onRestoreOriginal,
}) => {
  const [tamperPh, setTamperPh] = useState(payload.water_ph);
  const [tamperSig, setTamperSig] = useState(payload.signature);

  const handleCorruptSignature = () => {
    const corrupted =
      'deadbeef00000000112233445566778899aabbccddeeff001122334455667788deadbeef00000000112233445566778899aabbccddeeff001122334455667788';
    setTamperSig(corrupted);
    const updated: SensorPayload = {
      ...payload,
      water_ph: tamperPh,
      signature: corrupted,
    };
    onSimulateTamper(updated);
  };

  const handleTamperValue = (newPh: number) => {
    setTamperPh(newPh);
    const updated: SensorPayload = {
      ...payload,
      water_ph: newPh,
      signature: tamperSig,
    };
    onSimulateTamper(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Web Crypto API Asymmetric Cryptography Engine (ECDSA P-256)
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Label:{' '}
            <strong className="text-slate-200">
              ASYMMETRIC HARDWARE-COMPUTED EDGE SIGNATURE (ECDSA with P-256 & SHA-256)
            </strong>
            . Verifies that the payload was authentically signed by the sensor private key using the native browser
            Web Crypto Subtle API. In Scenario D, data tampering invalidates the signature, mathematically proving
            the private key never signed the altered payload.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
              sigResult.isVerified
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-red-950/90 border-pink-500/60 text-pink-300 animate-pulse'
            }`}
          >
            {sigResult.isVerified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> ECDSA SIGNATURE VERIFIED
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-pink-400" /> ASYMMETRIC VERIFY FAILED // ZERO-TRUST
              </>
            )}
          </span>
        </div>
      </div>

      {/* Sensor Public Key & Asymmetric Verification Proof */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Sensor Public Key (JWK) */}
        <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> Sensor Public Key (ECDSA P-256 JWK)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
              FP: {sigResult.keyFingerprint}
            </span>
          </div>
          <div className="p-3 rounded bg-[#030407] border border-slate-800 text-[11px] font-mono text-cyan-300 space-y-1 select-all">
            <div>Curve: {sigResult.publicKeyJwk?.crv || 'P-256'} (NIST SP 800-186)</div>
            <div className="truncate">X-Coord: {sigResult.publicKeyJwk?.x}</div>
            <div className="truncate">Y-Coord: {sigResult.publicKeyJwk?.y}</div>
            <div>Key Ops: ['verify']</div>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1">
            <div>
              Issuer: <span className="font-mono text-slate-300">{payload.sensor_id} (Hardware Secure Enclave)</span>
            </div>
            <div>
              Algorithm: <span className="font-mono text-emerald-400">ECDSA with SHA-256</span>
            </div>
          </div>
        </div>

        {/* Right: Transmitted IEEE P1363 Signature */}
        <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-pink-400" /> Edge Signature (64-byte Hex r || s)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
              crypto.subtle.verify ({sigResult.latencyMs}ms)
            </span>
          </div>
          <div
            className={`p-3 rounded border text-xs font-mono break-all select-all ${
              sigResult.isVerified
                ? 'bg-[#030407] border-cyan-900/60 text-cyan-300'
                : 'bg-red-950/40 border-pink-800 text-pink-300'
            }`}
          >
            {sigResult.expectedSignature}
          </div>
          <div className="text-[11px] text-slate-400 space-y-1">
            <div>
              Verification State:{' '}
              <span className={`font-mono font-bold ${sigResult.isVerified ? 'text-emerald-400' : 'text-pink-400'}`}>
                {sigResult.isVerified ? 'Cryptographically Authentic' : 'Mathematical Verification Failure (Tampered)'}
              </span>
            </div>
            <div>
              Format: <span className="font-mono text-slate-300">{sigResult.signatureFormat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canonical Payload Inspection */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Deterministic Canonical UTF-8 Buffer
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {sigResult.canonicalPayload?.length || 0} bytes
          </span>
        </div>
        <pre className="p-3 bg-[#030407] rounded border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap select-all">
          {sigResult.canonicalPayload}
        </pre>
        <p className="text-[11px] text-slate-500">
          The canonicalizer recursively orders JSON keys in alphabetical order and strips whitespace.
          This raw buffer is passed directly to <code className="text-cyan-400 font-mono">crypto.subtle.verify()</code>.
        </p>
      </div>

      {/* Interactive Tampering Simulator */}
      <div className="bg-gradient-to-r from-[#0e071c] via-[#090514] to-[#05070A] border border-pink-500/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Live In-Flight Cryptographic Tampering Simulator</h3>
              <p className="text-xs text-purple-300/80">
                Modify telemetry values or signature bytes to test asymmetric ECDSA rejection and immediate zero-trust lockout.
              </p>
            </div>
          </div>
          <button
            onClick={onRestoreOriginal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Restore Original Payload
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tamper pH value */}
          <div className="space-y-2 bg-[#05070A]/80 p-3 rounded-lg border border-purple-900/40">
            <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>Simulate Telemetry Modification:</span>
              <span className="font-bold text-pink-300">{tamperPh} pH</span>
            </label>
            <input
              type="range"
              min="2.0"
              max="12.0"
              step="0.1"
              value={tamperPh}
              onChange={(e) => handleTamperValue(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Acidic (2.0)</span>
              <span>Baseline (7.1)</span>
              <span>Alkaline (12.0)</span>
            </div>
          </div>

          {/* Corrupt Signature Button */}
          <div className="space-y-2 bg-[#05070A]/80 p-3 rounded-lg border border-purple-900/40 flex flex-col justify-between">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Simulate Asymmetric Key / Bit-Flip Mismatch:
              </label>
              <p className="text-[11px] text-slate-400">
                Corrupt the 64-byte signature to prove that <code className="text-pink-400 font-mono">crypto.subtle.verify()</code> detects
                unauthorized tampering mathematically.
              </p>
            </div>
            <button
              onClick={handleCorruptSignature}
              className="py-2 px-3 text-xs font-mono rounded bg-red-950/80 border border-pink-700/80 text-pink-300 hover:bg-red-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Force ECDSA Verification Fault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

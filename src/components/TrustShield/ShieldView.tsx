/**
 * Hardware-Accelerated CSS 3D Trust Score Shield Component
 * Built with `transform-style: preserve-3d` and layered Z-extrusion.
 *
 * Tactical Cyberpunk Color Storytelling:
 * - Untrusted / Ingestion / Fault: Neon Pink (#ec4899 / #f43f5e) & Electric Purple (#a855f7)
 * - Review Required: Amber & Magenta warning
 * - Trusted Interoperability Zone: Cool surgical clinical blue (#38bdf8 / #0284c7) & teal (#06b6d4 / #10b981)
 */

import React, { useState } from 'react';
import { ShieldStatus, TrustScoreBreakdown } from '../../types';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface ShieldViewProps {
  trust: TrustScoreBreakdown;
  onOpenReview?: () => void;
}

export const ShieldView: React.FC<ShieldViewProps> = ({ trust, onOpenReview }) => {
  const isFault = trust.isSignatureFault || trust.status === 'INTEGRITY_FAULT';
  const isReview = trust.status === 'HUMAN_REVIEW';
  const isTrusted = trust.status === 'VERIFIED' && !isFault;

  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to +10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMouseTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // Tactical Cyberpunk Narrative Color Coding
  let narrativeBorderColor = 'border-teal-500/40';
  let narrativeBgGrad = 'from-[#061824] via-[#040e18] to-[#02070e]';
  let statusBadgeColor = 'bg-cyan-950/80 border-cyan-400/50 text-cyan-300';
  let statusText = 'TRUSTED INTEROPERABILITY ZONE';
  let statusIcon = <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
  let arcGradStops = { start: '#06b6d4', mid: '#0ea5e9', end: '#10b981' };

  if (isFault) {
    narrativeBorderColor = 'border-pink-500/60 shadow-pink-900/60';
    narrativeBgGrad = 'from-[#240614] via-[#16040e] to-[#0c0207]';
    statusBadgeColor = 'bg-red-950/90 border-pink-500/60 text-pink-300';
    statusText = 'SECURITY FAULT // SERIALIZATION BLOCKED';
    statusIcon = <Lock className="w-4 h-4 text-pink-400" />;
    arcGradStops = { start: '#f43f5e', mid: '#ec4899', end: '#a855f7' };
  } else if (isReview) {
    narrativeBorderColor = 'border-amber-500/50 shadow-purple-950/60';
    narrativeBgGrad = 'from-[#1c1106] via-[#120a1c] to-[#070511]';
    statusBadgeColor = 'bg-amber-950/90 border-amber-500/60 text-amber-300';
    statusText = 'HUMAN REVIEW REQUIRED';
    statusIcon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
    arcGradStops = { start: '#f59e0b', mid: '#d946ef', end: '#8b5cf6' };
  } else if (!isTrusted) {
    // Untrusted Ingestion / Processing
    narrativeBorderColor = 'border-purple-600/50';
    narrativeBgGrad = 'from-[#1a082b] via-[#10051e] to-[#070512]';
    statusBadgeColor = 'bg-purple-950/80 border-purple-500/50 text-purple-300';
    statusText = 'UNTRUSTED SIGNAL INGESTION';
    statusIcon = <ShieldCheck className="w-4 h-4 text-purple-400" />;
    arcGradStops = { start: '#ec4899', mid: '#a855f7', end: '#06b6d4' };
  }

  // Segment metrics
  const segments = [
    { label: 'Integrity', val: trust.edgeIntegrity, max: 25, color: isTrusted ? '#06b6d4' : '#ec4899' },
    { label: 'Schema', val: trust.schemaValidity, max: 15, color: isTrusted ? '#38bdf8' : '#a855f7' },
    { label: 'History', val: trust.historicalConsistency, max: 15, color: isTrusted ? '#0ea5e9' : '#d946ef' },
    { label: 'Spatial', val: trust.spatialConsistency, max: 10, color: isTrusted ? '#10b981' : '#f43f5e' },
    { label: 'Cross-Sensor', val: trust.crossSensorAgreement, max: 15, color: isTrusted ? '#14b8a6' : '#ec4899' },
    { label: 'Weather', val: trust.externalEvidence, max: 10, color: isTrusted ? '#38bdf8' : '#a855f7' },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
      }}
      className="relative w-full rounded-2xl transition-transform duration-300 ease-out"
    >
      {/* 3D Hardware-Accelerated Container */}
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className={`relative bg-gradient-to-b ${narrativeBgGrad} border ${narrativeBorderColor} rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col items-center justify-between min-h-[460px]`}
      >
        {/* Layer -1: Ambient Back Glow (translateZ -30px) */}
        <div
          style={{ transform: 'translateZ(-30px)' }}
          className={`absolute -inset-10 opacity-30 blur-3xl pointer-events-none transition-all duration-700 ${
            isFault
              ? 'bg-gradient-to-tr from-pink-600 via-rose-600 to-purple-800'
              : isReview
              ? 'bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-700'
              : 'bg-gradient-to-tr from-cyan-500 via-teal-600 to-blue-700'
          }`}
        />

        {/* Layer 1: Top Status Banner (translateZ 30px) */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="w-full flex items-center justify-between z-10 mb-2"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
              {isTrusted ? 'SURGICAL CLINICAL FIREWALL' : 'UNTRUSTED THREAT BOUNDARY'}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold shadow-md ${statusBadgeColor}`}
          >
            {statusIcon}
            <span>{statusText}</span>
          </div>
        </div>

        {/* Layer 2: Main 3D Holographic Core & Dual Gimbal Rings (translateZ 60px) */}
        <div
          style={{ transform: 'translateZ(60px)' }}
          className="relative w-64 h-64 flex items-center justify-center my-3"
        >
          <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="cyberShieldArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={arcGradStops.start} />
                <stop offset="50%" stopColor={arcGradStops.mid} />
                <stop offset="100%" stopColor={arcGradStops.end} />
              </linearGradient>
            </defs>

            {/* Outer Track Ring */}
            <circle
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="rgba(30, 41, 59, 0.45)"
              strokeWidth="8"
            />

            {/* Active Trust Score Arc */}
            {!isFault && trust.totalScore > 0 && (
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="url(#cyberShieldArc)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 82}
                strokeDashoffset={2 * Math.PI * 82 * (1 - trust.totalScore / 100)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            )}

            {/* Secondary Rotatable Gimbal Ring */}
            <circle
              cx="100"
              cy="100"
              r="68"
              fill="none"
              stroke={isTrusted ? 'rgba(6, 182, 212, 0.3)' : 'rgba(236, 72, 153, 0.3)'}
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </svg>

          {/* Central 3D Core Layer (translateZ 85px) */}
          <div
            style={{ transform: 'translateZ(85px)' }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center"
          >
            <div className="text-[10px] font-mono tracking-wider uppercase text-slate-400 mb-0.5">
              {isFault ? 'ZERO-TRUST FAULT' : isTrusted ? 'SURGICAL TRUST' : 'TRUST SCORE'}
            </div>
            <div
              className={`text-5xl font-extrabold tracking-tight font-sans drop-shadow-md ${
                isFault
                  ? 'text-pink-400'
                  : isReview
                  ? 'text-amber-400'
                  : isTrusted
                  ? 'text-cyan-300'
                  : 'text-white'
              }`}
            >
              {isFault ? '0' : trust.totalScore}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {isFault ? 'LOCKOUT ACTIVE' : 'OUT OF 100'}
            </div>
          </div>
        </div>

        {/* Layer 3: Segmented Breakdown (translateZ 40px) */}
        <div
          style={{ transform: 'translateZ(40px)' }}
          className="w-full grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-800/80"
        >
          {segments.map((seg) => {
            const ratio = Math.min(100, Math.round((seg.val / seg.max) * 100));
            return (
              <div
                key={seg.label}
                className="p-2 rounded-lg bg-black/40 border border-slate-800/80 text-center backdrop-blur-sm"
              >
                <div className="text-[9px] font-mono text-slate-400 truncate">{seg.label}</div>
                <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                  {isFault ? '0' : `${seg.val}/${seg.max}`}
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: isFault ? '0%' : `${ratio}%`,
                      backgroundColor: isFault ? '#f43f5e' : seg.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 4: Action Button for Human Review (translateZ 50px) */}
        {isReview && onOpenReview && (
          <div style={{ transform: 'translateZ(50px)' }} className="w-full mt-3">
            <button
              onClick={onOpenReview}
              className="w-full py-2 px-3 text-xs font-mono font-semibold rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" /> Open Human-in-the-Loop Validation Assistant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

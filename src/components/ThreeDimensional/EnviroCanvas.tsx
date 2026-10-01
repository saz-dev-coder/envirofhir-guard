/**
 * EnviroFHIR-Guard Lightweight 2D HTML5 Telemetry Canvas
 * Dedicated strictly to 60FPS telemetry particle traces, 5km spatial correlation grid,
 * and the Tactical Cyberpunk storytelling color transition:
 * - Untrusted Zone (Left): Neon Pink (#ec4899 / #f43f5e) & Electric Purple (#a855f7)
 * - Firewall & Verification Chamber: Dynamic filter gate
 * - Trusted Interoperability Zone (Right): Cool surgical clinical blues (#38bdf8) & teals (#06b6d4 / #10b981)
 * - Background: Pitch-black graphite (#05070A)
 */

import React, { useEffect, useRef, useState } from 'react';
import { NeighborSensor, SensorPayload, ShieldStatus } from '../../types';

interface EnviroCanvasProps {
  score: number;
  status: ShieldStatus;
  currentPayload: SensorPayload;
  neighbors: NeighborSensor[];
  isFault: boolean;
  pipelineStageIndex: number;
}

interface Particle {
  progress: number;
  speed: number;
  offsetY: number;
  size: number;
}

export const EnviroCanvas: React.FC<EnviroCanvasProps> = ({
  score,
  status,
  currentPayload,
  neighbors,
  isFault,
  pipelineStageIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const waveRadiusRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let time = 0;

    // Initialize 30 lightweight telemetry particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.007,
          offsetY: (Math.random() - 0.5) * 36,
          size: 1.5 + Math.random() * 2,
        });
      }
    }

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Strict Pitch-Black Graphite Background (#05070A)
      ctx.fillStyle = '#05070A';
      ctx.fillRect(0, 0, width, height);

      // 2. Tactical Cyberpunk Zone Dividers (Perspective Ground Grid)
      ctx.save();
      const horizonY = height * 0.35;
      const floorY = height * 0.85;

      // Draw subtle perspective ground grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 6; i++) {
        const y = horizonY + (floorY - horizonY) * Math.pow(i / 6, 1.8);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical perspective vanishing rays
      const vX = width * 0.5;
      for (let i = -7; i <= 7; i++) {
        ctx.beginPath();
        ctx.moveTo(vX, horizonY);
        ctx.lineTo(vX + (i * width) / 5, height);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Narrative Boundaries: Untrusted Zone (Left) vs Trusted Zone (Right)
      ctx.save();
      // Left vertical glow (Untrusted - Neon Pink/Purple)
      const leftGrad = ctx.createLinearGradient(0, 0, width * 0.45, 0);
      leftGrad.addColorStop(0, 'rgba(236, 72, 153, 0.08)');
      leftGrad.addColorStop(1, 'rgba(168, 85, 247, 0.01)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, width * 0.45, height);

      // Right vertical glow (Trusted Interop - Clinical Blue/Teal)
      const rightGrad = ctx.createLinearGradient(width * 0.55, 0, width, 0);
      rightGrad.addColorStop(0, 'rgba(6, 182, 212, 0.01)');
      rightGrad.addColorStop(1, isFault ? 'rgba(244, 63, 94, 0.08)' : 'rgba(6, 182, 212, 0.09)');
      ctx.fillStyle = rightGrad;
      ctx.fillRect(width * 0.55, 0, width * 0.45, height);

      // Center Firewall Barrier Line
      ctx.beginPath();
      ctx.moveTo(width * 0.5, 30);
      ctx.lineTo(width * 0.5, height - 30);
      ctx.strokeStyle = isFault
        ? 'rgba(244, 63, 94, 0.6)'
        : 'rgba(168, 85, 247, 0.4)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Barrier Label
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = isFault ? '#f43f5e' : '#a855f7';
      ctx.textAlign = 'center';
      ctx.fillText(isFault ? '⛔ ZERO-TRUST LOCKOUT' : '🛡️ ENVIROFHIR TRUST FIREWALL', width * 0.5, 22);
      ctx.restore();

      // 4. Untrusted Sensor Node Cluster (Left Side)
      const sensorX = width * 0.2;
      const sensorY = height * 0.52;

      // 5km Geospatial Boundary Ring
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(sensorX, sensorY, 95, 48, 0, 0, Math.PI * 2);
      ctx.strokeStyle = isFault
        ? 'rgba(244, 63, 94, 0.4)'
        : 'rgba(236, 72, 153, 0.3)';
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Regional Wave if corroborated
      if (!reducedMotion && (status === 'VERIFIED' || score > 70)) {
        waveRadiusRef.current = (waveRadiusRef.current + 0.6) % 95;
        ctx.beginPath();
        ctx.ellipse(
          sensorX,
          sensorY,
          waveRadiusRef.current,
          waveRadiusRef.current * 0.5,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(236, 72, 153, ${Math.max(0, 1 - waveRadiusRef.current / 95) * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Neighbor Sensors
      neighbors.forEach((nb, idx) => {
        const nx = idx === 0 ? sensorX + 55 : sensorX - 60;
        const ny = idx === 0 ? sensorY - 26 : sensorY + 24;
        ctx.beginPath();
        ctx.moveTo(sensorX, sensorY);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0c1e';
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(`${nb.name.split(' ')[0]} (${nb.water_ph}pH)`, nx - 20, ny + 14);
      });

      // Primary Node A (Untrusted Sensor)
      const pulse = reducedMotion ? 0 : Math.sin(time * 3) * 2;
      ctx.beginPath();
      ctx.arc(sensorX, sensorY, 7 + pulse * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = isFault ? '#f43f5e' : '#ec4899'; // Neon Pink
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sensorX, sensorY, 13 + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = isFault ? 'rgba(244, 63, 94, 0.7)' : 'rgba(236, 72, 153, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(currentPayload.sensor_id, sensorX - 35, sensorY - 18);
      ctx.fillStyle = '#ec4899';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillText(`UNTRUSTED SIGNAL (${currentPayload.water_ph} pH)`, sensorX - 44, sensorY + 26);
      ctx.restore();

      // 5. Trusted FHIR Interoperability Chamber (Right Side)
      const chamberX = width * 0.82;
      const chamberY = height * 0.52;
      const chamberW = 130;
      const chamberH = 150;

      ctx.save();
      ctx.beginPath();
      ctx.rect(chamberX - chamberW / 2, chamberY - chamberH / 2, chamberW, chamberH);
      ctx.fillStyle = isFault ? 'rgba(20, 5, 12, 0.85)' : 'rgba(4, 18, 28, 0.85)';
      ctx.fill();
      ctx.strokeStyle = isFault ? 'rgba(244, 63, 94, 0.5)' : 'rgba(6, 182, 212, 0.6)'; // Surgical Teal
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isFault ? '#f43f5e' : '#38bdf8';
      ctx.fillText(isFault ? '⛔ SERIALIZATION BLOCKED' : 'CLINICAL INTEROP ZONE', chamberX, chamberY - chamberH / 2 + 18);

      if (isFault) {
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillText('🔒 QUARANTINED', chamberX, chamberY - 4);
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('SIGNATURE REJECTED', chamberX, chamberY + 16);
      } else {
        const resList = ['Location (GIS)', 'Observation (LOINC)', 'Provenance (ECDSA)', 'Bundle (POST)'];
        resList.forEach((r, idx) => {
          const ry = chamberY - 26 + idx * 24;
          const isReady = pipelineStageIndex >= 9 + idx;
          ctx.beginPath();
          ctx.rect(chamberX - 54, ry, 108, 18);
          ctx.fillStyle = isReady ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.3)';
          ctx.fill();
          ctx.strokeStyle = isReady ? '#06b6d4' : 'rgba(71, 85, 105, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = isReady ? '#38bdf8' : '#64748b';
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(r, chamberX - 48, ry + 12);
        });
      }
      ctx.restore();

      // 6. Draw Telemetry Particle Traces with Narrative Transition
      particlesRef.current.forEach((p) => {
        if (!reducedMotion) {
          p.progress += p.speed;
          if (p.progress > 1) {
            p.progress = 0;
            p.offsetY = (Math.random() - 0.5) * 36;
          }
        }

        const t = p.progress;
        let px = 0;
        let py = 0;
        let pColor = '#ec4899'; // Default untrusted Neon Pink

        if (isFault) {
          // If fault: flow toward firewall, get deflected downwards into hazard trap
          if (t < 0.5) {
            const segT = t / 0.5;
            px = sensorX + (width * 0.5 - sensorX) * segT;
            py = sensorY + p.offsetY;
            pColor = segT < 0.5 ? '#ec4899' : '#a855f7';
          } else {
            const segT = (t - 0.5) / 0.5;
            px = width * 0.5 + segT * 40 - 20;
            py = sensorY + segT * 100 + p.offsetY;
            pColor = '#f43f5e'; // Hot neon red/pink fault
          }
        } else {
          // Normal flow: Sensor (Pink/Purple) -> Firewall (Purple) -> FHIR Chamber (Teal/Blue)
          px = sensorX + (chamberX - sensorX) * t;
          py = sensorY + p.offsetY;

          if (t < 0.35) {
            pColor = '#ec4899'; // Untrusted Pink
          } else if (t < 0.55) {
            pColor = '#a855f7'; // Firewall Purple
          } else {
            pColor = '#06b6d4'; // Surgical Clinical Teal/Blue
          }
        }

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = pColor;
        ctx.fill();

        // Particle speed trace
        ctx.beginPath();
        ctx.moveTo(px - 5, py);
        ctx.lineTo(px, py);
        ctx.strokeStyle = pColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [score, status, currentPayload, neighbors, isFault, pipelineStageIndex, reducedMotion]);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-slate-800 bg-[#05070A] shadow-2xl">
      <canvas
        ref={canvasRef}
        width={960}
        height={400}
        className="w-full h-full block"
      />
      {/* Tactical Cyberpunk Legend Overlay */}
      <div className="absolute top-3 left-4 flex items-center gap-3 text-[10px] font-mono">
        <span className="flex items-center gap-1.5 text-pink-400">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          UNTRUSTED STREAM
        </span>
        <span className="text-slate-600">→</span>
        <span className="flex items-center gap-1.5 text-purple-400">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          ZERO-TRUST FIREWALL
        </span>
        <span className="text-slate-600">→</span>
        <span className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          CLINICAL FHIR INTEROP
        </span>
      </div>

      <div className="absolute bottom-3 right-4 flex items-center gap-2">
        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          className="px-2.5 py-1 text-[10px] font-mono rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          {reducedMotion ? 'Enable Particle Animation' : 'Reduced Motion'}
        </button>
      </div>
    </div>
  );
};

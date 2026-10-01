/**
 * Contextual Baseline and Geospatial Topology View
 * Displays rolling 10-packet statistical baseline cache, Haversine 5km spatial correlation matrix,
 * and comparison between isolated sensor deviations and regional environmental events.
 */

import React from 'react';
import {
  ContextualBaselineStats,
  NeighborSensor,
  RegionalCorrelationResult,
  SensorPacketHistory,
  SensorPayload,
} from '../../types';
import {
  Activity,
  MapPin,
  TrendingDown,
  TrendingUp,
  Minus,
  Layers,
  Compass,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface ContextViewProps {
  payload: SensorPayload;
  history: SensorPacketHistory[];
  baselineStats: ContextualBaselineStats;
  neighbors: NeighborSensor[];
  regionalCorr: RegionalCorrelationResult;
}

export const ContextView: React.FC<ContextViewProps> = ({
  payload,
  history,
  baselineStats,
  neighbors,
  regionalCorr,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            Dynamic Contextual Baselines & 5km Geospatial Correlation
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Static threshold rules fail because environmental baselines vary by river basin and season.
          EnviroFHIR-Guard evaluates incoming telemetry against a sliding window of historical packets and
          correlates with neighboring nodes within a 5 km Haversine radius.
        </p>
      </div>

      {/* 1. Rolling 10-Packet Statistical Baseline */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-slate-200">
              Sliding Time-Window State Cache ({baselineStats.packetCount} Packets) // {payload.sensor_id}
            </span>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            Trend:{' '}
            <span className="uppercase font-bold">
              {baselineStats.trend}
            </span>
          </span>
        </div>

        {/* Statistical Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">Rolling Mean</span>
            <span className="text-lg font-mono font-bold text-slate-100">
              {baselineStats.meanPh} <span className="text-xs font-normal text-slate-400">pH</span>
            </span>
            <span className="text-[10px] text-slate-500 block">10-Packet Window</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">Rolling Median</span>
            <span className="text-lg font-mono font-bold text-slate-100">
              {baselineStats.medianPh} <span className="text-xs font-normal text-slate-400">pH</span>
            </span>
            <span className="text-[10px] text-slate-500 block">Midpoint Value</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">Std Deviation</span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              ±{baselineStats.stdDevPh}
            </span>
            <span className="text-[10px] text-slate-500 block">Variance Index</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">Baseline Min / Max</span>
            <span className="text-lg font-mono font-bold text-slate-200">
              {baselineStats.minPh} - {baselineStats.maxPh}
            </span>
            <span className="text-[10px] text-slate-500 block">Historical Range</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">Z-Score Deviation</span>
            <span
              className={`text-lg font-mono font-bold ${
                Math.abs(baselineStats.zScorePh) > 3.0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {baselineStats.zScorePh} σ
            </span>
            <span className="text-[10px] text-slate-500 block">Sigma Distance</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block">Current Reading</span>
            <span
              className={`text-lg font-mono font-bold ${
                payload.water_ph < 6.0 ? 'text-amber-400' : 'text-slate-100'
              }`}
            >
              {payload.water_ph} <span className="text-xs font-normal text-slate-400">pH</span>
            </span>
            <span className="text-[10px] text-slate-500 block">Inbound Packet</span>
          </div>
        </div>

        {/* 10-Packet Historical Timeline Table */}
        <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-950/60">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-2.5">Packet ID</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">pH</th>
                <th className="p-2.5">Temperature</th>
                <th className="p-2.5">Dissolved Oxygen</th>
                <th className="p-2.5">Turbidity</th>
                <th className="p-2.5">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.map((pkt, idx) => {
                const diff = Math.round((pkt.water_ph - baselineStats.meanPh) * 100) / 100;
                return (
                  <tr key={pkt.packet_id} className="hover:bg-slate-900/40">
                    <td className="p-2.5 font-bold text-slate-200">{pkt.packet_id}</td>
                    <td className="p-2.5 text-slate-400">{new Date(pkt.timestamp).toLocaleTimeString()}</td>
                    <td className="p-2.5 text-cyan-300 font-bold">{pkt.water_ph}</td>
                    <td className="p-2.5">{pkt.water_temperature}°C</td>
                    <td className="p-2.5">{pkt.dissolved_oxygen} mg/L</td>
                    <td className="p-2.5">{pkt.turbidity} NTU</td>
                    <td className="p-2.5">
                      <span className={diff >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        {diff >= 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Geospatial Haversine Correlation (5 km Radius) */}
      <div className="bg-[#05070A] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-slate-200">
              Geospatial Multi-Sensor Network (5 km Monitoring Radius)
            </span>
          </div>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
              regionalCorr.correlationLevel === 'REGIONAL_EVENT'
                ? 'bg-red-950/80 border-red-500/50 text-red-300'
                : regionalCorr.correlationLevel === 'ISOLATED_DEVIATION'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
            }`}
          >
            {regionalCorr.correlationLevel}
          </span>
        </div>

        {/* Narrative Summary */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
          <strong>Geospatial Engine Assessment:</strong> {regionalCorr.summaryText}
        </div>

        {/* Neighbor Nodes Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {neighbors.map((nb) => {
            const delta = Math.round((payload.water_ph - nb.water_ph) * 100) / 100;
            const isCorroborated = Math.abs(delta) < 0.4;
            return (
              <div
                key={nb.id}
                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {nb.name} ({nb.id})
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">{nb.distanceKm} km away</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">pH Reading</span>
                    <span className="text-slate-200 font-bold text-sm">{nb.water_ph}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">DO</span>
                    <span className="text-slate-200 font-bold text-sm">{nb.dissolved_oxygen}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">Turbidity</span>
                    <span className="text-slate-200 font-bold text-sm">{nb.turbidity}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400">Deviation from Sensor A:</span>
                  <span
                    className={`font-mono font-bold ${
                      isCorroborated ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {delta > 0 ? `+${delta}` : delta} pH units ({isCorroborated ? 'Agreement' : 'Divergence'})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

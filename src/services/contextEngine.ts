/**
 * Contextual Baseline and Geospatial Correlation Engine
 * Maintains sliding time-window state cache (10 packets), calculates rolling statistics,
 * executes Haversine distance geospatial filtering (5km radius), and distinguishes
 * isolated anomalies from regional multi-sensor events.
 */

import {
  ContextualBaselineStats,
  NeighborSensor,
  RegionalCorrelationResult,
  SensorPacketHistory,
  SensorPayload,
} from '../types';

/**
 * Calculates Haversine distance between two coordinates in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

/**
 * In-memory sliding window cache of recent packets per sensor
 */
const sensorHistoryCache = new Map<string, SensorPacketHistory[]>();

export function storeSensorPacket(sensorId: string, packet: SensorPacketHistory): void {
  const existing = sensorHistoryCache.get(sensorId) || [];
  const updated = [packet, ...existing].slice(0, 10); // Maintain latest 10 packets
  sensorHistoryCache.set(sensorId, updated);
}

export function seedSensorHistory(sensorId: string, packets: SensorPacketHistory[]): void {
  sensorHistoryCache.set(sensorId, packets.slice(0, 10));
}

/**
 * Computes statistical rolling baseline from historical packets
 */
export function computeBaselineStats(
  sensorId: string,
  history: SensorPacketHistory[],
  currentPayload: SensorPayload
): ContextualBaselineStats {
  const allPackets = [...history];
  const phValues = allPackets.map((p) => p.water_ph);

  if (phValues.length === 0) {
    phValues.push(currentPayload.water_ph);
  }

  // Mean
  const meanPh = phValues.reduce((a, b) => a + b, 0) / phValues.length;

  // Median
  const sortedPh = [...phValues].sort((a, b) => a - b);
  const mid = Math.floor(sortedPh.length / 2);
  const medianPh =
    sortedPh.length % 2 !== 0
      ? sortedPh[mid]
      : (sortedPh[mid - 1] + sortedPh[mid]) / 2;

  // Standard Deviation
  const variance =
    phValues.reduce((sum, val) => sum + Math.pow(val - meanPh, 2), 0) /
    (phValues.length || 1);
  const stdDevPh = Math.sqrt(variance);

  // Min / Max
  const minPh = Math.min(...phValues);
  const maxPh = Math.max(...phValues);

  // Means for other metrics
  const meanTemp =
    allPackets.reduce((sum, p) => sum + p.water_temperature, 0) / (allPackets.length || 1);
  const meanDO =
    allPackets.reduce((sum, p) => sum + p.dissolved_oxygen, 0) / (allPackets.length || 1);
  const meanTurbidity =
    allPackets.reduce((sum, p) => sum + p.turbidity, 0) / (allPackets.length || 1);

  // Z-Score relative to rolling baseline
  const zScorePh =
    stdDevPh > 0.005
      ? Math.round(((currentPayload.water_ph - meanPh) / stdDevPh) * 100) / 100
      : Math.round(((currentPayload.water_ph - meanPh) / 0.05) * 100) / 100;

  // Trend detection
  let trend: ContextualBaselineStats['trend'] = 'stable';
  if (phValues.length >= 3) {
    const recent = phValues.slice(0, 3);
    if (recent[0] < recent[1] && recent[1] < recent[2]) {
      trend = 'dropping';
    } else if (recent[0] > recent[1] && recent[1] > recent[2]) {
      trend = 'spiking';
    } else if (Math.abs(recent[0] - recent[1]) > 1.0) {
      trend = 'oscillating';
    }
  }

  return {
    sensorId,
    packetCount: phValues.length,
    meanPh: Math.round(meanPh * 100) / 100,
    medianPh: Math.round(medianPh * 100) / 100,
    stdDevPh: Math.round(stdDevPh * 100) / 100,
    minPh: Math.round(minPh * 100) / 100,
    maxPh: Math.round(maxPh * 100) / 100,
    meanTemp: Math.round(meanTemp * 10) / 10,
    meanDO: Math.round(meanDO * 10) / 10,
    meanTurbidity: Math.round(meanTurbidity * 10) / 10,
    zScorePh,
    trend,
  };
}

/**
 * Evaluates geospatial neighbors within 5km radius and determines correlation level
 */
export function correlateNeighborSensors(
  currentPayload: SensorPayload,
  neighbors: NeighborSensor[],
  radiusKm = 5.0
): RegionalCorrelationResult {
  // Filter neighbors within radius
  const nearby = neighbors.filter((n) => {
    const dist = calculateHaversineDistance(
      currentPayload.latitude,
      currentPayload.longitude,
      n.latitude,
      n.longitude
    );
    return dist <= radiusKm;
  });

  if (nearby.length === 0) {
    return {
      radiusKm,
      neighborCount: 0,
      localMedianPh: currentPayload.water_ph,
      sensorDeviation: 0,
      correlationLevel: 'ISOLATED_DEVIATION',
      summaryText: 'No neighboring sensors active within 5km radius. Independent baseline applied.',
    };
  }

  const neighborPhs = nearby.map((n) => n.water_ph);
  const sorted = [...neighborPhs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const localMedianPh =
    sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const deviation = Math.round((currentPayload.water_ph - localMedianPh) * 100) / 100;

  // Determine agreement vs isolated deviation
  // If current sensor is pH 4.8 and neighbors are 4.9 and 4.7 -> delta < 0.4 -> agreement
  // If current is 4.8 and neighbors are 7.2 and 7.1 -> delta ~ -2.3 -> isolated deviation
  const allLow = currentPayload.water_ph < 6.0 && neighborPhs.every((p) => p < 6.0);
  const allHigh = currentPayload.water_ph > 8.5 && neighborPhs.every((p) => p > 8.5);

  let correlationLevel: RegionalCorrelationResult['correlationLevel'] = 'ISOLATED_DEVIATION';
  let summaryText = '';

  if (Math.abs(deviation) <= 0.4) {
    if (allLow || allHigh) {
      correlationLevel = 'REGIONAL_EVENT';
      summaryText = `Regional correlated anomaly: Current sensor (pH ${currentPayload.water_ph}) matches nearby sensors (median pH ${localMedianPh}). Multi-station water quality depression detected across ${nearby.length} regional nodes.`;
    } else {
      correlationLevel = 'HIGH_AGREEMENT';
      summaryText = `Strong cross-sensor agreement: Current sensor (pH ${currentPayload.water_ph}) aligns within ${Math.abs(deviation)} pH units of ${nearby.length} nearby nodes.`;
    }
  } else {
    correlationLevel = 'ISOLATED_DEVIATION';
    summaryText = `Localized sensor deviation: Current sensor (pH ${currentPayload.water_ph}) deviates by ${deviation} pH units from local median (${localMedianPh}) across ${nearby.length} nearby nodes. Human review recommended.`;
  }

  return {
    radiusKm,
    neighborCount: nearby.length,
    localMedianPh: Math.round(localMedianPh * 100) / 100,
    sensorDeviation: deviation,
    correlationLevel,
    summaryText,
  };
}

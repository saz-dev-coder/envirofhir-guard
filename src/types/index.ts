/**
 * EnviroFHIR-Guard Core Type Definitions
 * Standards-oriented HL7 FHIR and Environmental Informatics Types
 */

export interface SensorPayload {
  sensor_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  water_ph: number;
  water_temperature: number; // Celsius
  dissolved_oxygen: number;  // mg/L
  turbidity: number;         // NTU
  battery_level?: number;    // %
  firmware_version?: string;
  signature: string;         // ECDSA P-256 IEEE P1363 hex signature
  public_key_jwk?: JsonWebKey; // Sensor's ECDSA P-256 public key (JWK)
  key_fingerprint?: string;   // SHA-256 fingerprint of the public key
}

export type FsmState =
  | 'IDLE'
  | 'INGESTING'
  | 'VERIFYING_SIGNATURE'
  | 'EVALUATING_CONTEXT'
  | 'COMPUTING_TRUST'
  | 'FHIR_EMISSION'
  | 'FAULT_BLOCKED';

export interface FsmTransitionEvent {
  from: FsmState;
  to: FsmState;
  timestamp: string;
  reason?: string;
}

export interface SensorPacketHistory {
  packet_id: string;
  timestamp: string;
  water_ph: number;
  water_temperature: number;
  dissolved_oxygen: number;
  turbidity: number;
}

export interface NeighborSensor {
  id: string;
  name: string;
  distanceKm: number;
  bearingDeg: number;
  latitude: number;
  longitude: number;
  water_ph: number;
  water_temperature: number;
  dissolved_oxygen: number;
  turbidity: number;
  timestamp: string;
  status: 'active' | 'calibrated' | 'unverified';
}

export type ScenarioId = 'SCENARIO_A' | 'SCENARIO_B' | 'SCENARIO_C' | 'SCENARIO_D';

export interface Scenario {
  id: ScenarioId;
  name: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  payload: SensorPayload;
  neighborSensors: NeighborSensor[];
  historicalPackets: SensorPacketHistory[];
  expectedOutcome: string;
  expectedTrustCategory: 'VERIFIED' | 'HUMAN_REVIEW' | 'INTEGRITY_FAULT';
}

export type PipelineStageId =
  | 'LOAD_EVENT'
  | 'VERIFY_SIGNATURE'
  | 'VALIDATE_SCHEMA'
  | 'CONTEXTUAL_BASELINE'
  | 'DETECT_ANOMALY'
  | 'SENSOR_CORRELATION'
  | 'WEATHER_EVIDENCE'
  | 'CALCULATE_TRUST'
  | 'FHIR_LOCATION'
  | 'FHIR_OBSERVATION'
  | 'FHIR_PROVENANCE'
  | 'FHIR_AUDIT_EVENT'
  | 'FHIR_BUNDLE'
  | 'SANDBOX_RESPONSE';

export interface PipelineStageInfo {
  id: PipelineStageId;
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  durationMs: number;
}

export interface SignatureVerificationResult {
  expectedSignature: string;
  computedSignature?: string;
  canonicalPayload: string;
  isVerified: boolean;
  algorithm: 'ECDSA-P256-SHA256 (Web Crypto Asymmetric Key Verification)';
  keyFingerprint: string;
  publicKeyJwk: JsonWebKey | null;
  signatureFormat: 'IEEE P1363 (64-byte Hex / r||s)';
  timestamp: string;
  latencyMs: number;
}

export interface ContextualBaselineStats {
  sensorId: string;
  packetCount: number;
  meanPh: number;
  medianPh: number;
  stdDevPh: number;
  minPh: number;
  maxPh: number;
  meanTemp: number;
  meanDO: number;
  meanTurbidity: number;
  zScorePh: number;
  trend: 'stable' | 'spiking' | 'dropping' | 'oscillating';
}

export interface RegionalCorrelationResult {
  radiusKm: number;
  neighborCount: number;
  localMedianPh: number;
  sensorDeviation: number;
  correlationLevel: 'HIGH_AGREEMENT' | 'ISOLATED_DEVIATION' | 'REGIONAL_EVENT';
  summaryText: string;
}

export interface WeatherEvidence {
  source: 'OPEN_METEO_LIVE' | 'DEMO_WEATHER_PROVIDER';
  status: 'LIVE' | 'DEGRADED';
  temperatureC: number;
  relativeHumidity: number;
  precipitationMm: number;
  rainfallMm: number;
  windSpeedKmh: number;
  condition: string;
  retrievedAt: string;
  latencyMs: number;
  environmentalCorrelation: string;
}

export interface TrustFactor {
  label: string;
  category: 'SECURITY' | 'SCHEMA' | 'HISTORY' | 'SPATIAL' | 'CROSS_SENSOR' | 'WEATHER' | 'TEMPORAL';
  weight: number;
  achieved: number;
  text: string;
  isPositive: boolean;
}

export interface TrustScoreBreakdown {
  edgeIntegrity: number;        // max 25
  schemaValidity: number;       // max 15
  historicalConsistency: number;// max 15
  spatialConsistency: number;   // max 10
  crossSensorAgreement: number; // max 15
  externalEvidence: number;     // max 10
  temporalConsistency: number;  // max 10
  totalScore: number;           // 0 - 100
  isSignatureFault: boolean;
  status: ShieldStatus;
  factors: TrustFactor[];
}

export type ShieldStatus =
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'HUMAN_REVIEW'
  | 'INTEGRITY_FAULT'
  | 'FHIR_BLOCKED';

export type HumanReviewDecision = 'pending' | 'accepted_with_review' | 'investigation_requested' | 'rejected';

export interface HumanReviewRecord {
  decision: HumanReviewDecision;
  reviewerId: string;
  timestamp: string;
  notes: string;
}

// HL7 FHIR Standard Typed Definitions
export interface FHIRLocation {
  resourceType: 'Location';
  id: string;
  status: 'active' | 'suspended' | 'inactive';
  name: string;
  description: string;
  mode: 'instance';
  type: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  position: {
    longitude: number;
    latitude: number;
    altitude?: number;
  };
  managingOrganization: {
    reference: string;
    display: string;
  };
}

export interface FHIROrganization {
  resourceType: 'Organization';
  id: string;
  name: string;
  active: boolean;
  type: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id: string;
  status: 'preliminary' | 'final' | 'amended' | 'registered';
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  effectiveDateTime: string;
  issued: string;
  valueQuantity: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  interpretation?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  }>;
  component?: Array<{
    code: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    valueQuantity: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
  }>;
  location?: {
    reference: string;
    display: string;
  };
  performer?: Array<{
    reference: string;
    display: string;
  }>;
  note?: Array<{
    text: string;
    time?: string;
  }>;
}

export interface FHIRProvenance {
  resourceType: 'Provenance';
  id: string;
  target: Array<{
    reference: string;
  }>;
  recorded: string;
  policy: string[];
  location?: {
    reference: string;
  };
  reason?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  activity: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  agent: Array<{
    type: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    who: {
      reference: string;
      display: string;
    };
  }>;
  entity: Array<{
    role: 'source' | 'derivation';
    what: {
      identifier: {
        system: string;
        value: string;
      };
      display: string;
    };
  }>;
  signature?: Array<{
    type: Array<{
      system: string;
      code: string;
    }>;
    when: string;
    who: {
      reference: string;
      display: string;
    };
    sigFormat: string;
    data: string;
  }>;
}

export interface FHIRAuditEvent {
  resourceType: 'AuditEvent';
  id: string;
  type: {
    system: string;
    code: string;
    display: string;
  };
  action: 'C' | 'R' | 'U' | 'D' | 'E';
  recorded: string;
  outcome: '0' | '4' | '8' | '12'; // 0=Success, 4=Minor failure, 8=Serious failure, 12=Major failure
  outcomeDesc: string;
  agent: Array<{
    requestor: boolean;
    who: {
      display: string;
    };
  }>;
  source: {
    site: string;
    observer: {
      display: string;
    };
  };
  entity: Array<{
    what: {
      reference?: string;
      identifier?: {
        system: string;
        value: string;
      };
      display: string;
    };
    detail: Array<{
      type: string;
      valueString: string;
    }>;
  }>;
}

export interface FHIRTransactionBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'transaction';
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: FHIRLocation | FHIRObservation | FHIRProvenance | FHIRAuditEvent | FHIROrganization;
    request: {
      method: 'POST';
      url: string;
    };
  }>;
}

export interface SandboxResponse {
  status: number;
  statusText: string;
  durationMs: number;
  timestamp: string;
  transactionId: string;
  isSuccess: boolean;
  operationOutcome?: {
    resourceType: 'OperationOutcome';
    issue: Array<{
      severity: 'information' | 'warning' | 'error';
      code: string;
      diagnostics: string;
      location?: string[];
    }>;
  };
}

export type ViewTab =
  | 'COMMAND_CENTER'
  | 'INTEGRITY'
  | 'CONTEXT_ENGINE'
  | 'FHIR_BUILDER'
  | 'SANDBOX'
  | 'ARCHITECTURE'
  | 'TRACK_DOCS';

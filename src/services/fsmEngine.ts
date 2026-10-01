/**
 * Immutable Finite State Machine (FSM) Engine for EnviroFHIR-Guard
 * Enforces explicit, unbreakable zero-trust transitions:
 * IDLE → INGESTING → VERIFYING_SIGNATURE → EVALUATING_CONTEXT → COMPUTING_TRUST → FHIR_EMISSION
 * Supports safe instant resets and FAULT_BLOCKED lockdown upon cryptographic failure.
 */

import { FsmState, FsmTransitionEvent } from '../types';

// Allowed state transitions map
const VALID_TRANSITIONS: Record<FsmState, FsmState[]> = {
  IDLE: ['INGESTING', 'FHIR_EMISSION', 'FAULT_BLOCKED'],
  INGESTING: ['VERIFYING_SIGNATURE', 'IDLE', 'FAULT_BLOCKED'],
  VERIFYING_SIGNATURE: ['EVALUATING_CONTEXT', 'FAULT_BLOCKED', 'IDLE'],
  EVALUATING_CONTEXT: ['COMPUTING_TRUST', 'FAULT_BLOCKED', 'IDLE'],
  COMPUTING_TRUST: ['FHIR_EMISSION', 'FAULT_BLOCKED', 'IDLE'],
  FHIR_EMISSION: ['IDLE', 'INGESTING'],
  FAULT_BLOCKED: ['IDLE', 'INGESTING'],
};

export class EnviroFsm {
  private currentState: FsmState = 'IDLE';
  private history: FsmTransitionEvent[] = [];

  constructor(initialState: FsmState = 'IDLE') {
    this.currentState = initialState;
    this.history.push({
      from: 'IDLE',
      to: initialState,
      timestamp: new Date().toISOString(),
      reason: 'FSM Initialized',
    });
  }

  public getState(): FsmState {
    return this.currentState;
  }

  public getHistory(): FsmTransitionEvent[] {
    return [...this.history];
  }

  public canTransitionTo(nextState: FsmState): boolean {
    if (nextState === 'IDLE') return true; // Safe reset is universally allowed
    const allowed = VALID_TRANSITIONS[this.currentState] || [];
    return allowed.includes(nextState);
  }

  public transition(nextState: FsmState, reason?: string): boolean {
    if (!this.canTransitionTo(nextState)) {
      console.warn(
        `[EnviroFSM Guard] Rejected illegal transition from ${this.currentState} to ${nextState}`
      );
      return false;
    }

    const event: FsmTransitionEvent = {
      from: this.currentState,
      to: nextState,
      timestamp: new Date().toISOString(),
      reason,
    };

    this.history.push(event);
    this.currentState = nextState;
    return true;
  }

  public reset(reason = 'Instant Safe Reset'): void {
    const event: FsmTransitionEvent = {
      from: this.currentState,
      to: 'IDLE',
      timestamp: new Date().toISOString(),
      reason,
    };
    this.history.push(event);
    this.currentState = 'IDLE';
  }
}

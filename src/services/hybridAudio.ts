/**
 * Hybrid Audio Blueprint Engine
 * - Studio-quality sound design cues & demo narration synthesizer (Web Audio API)
 * - Studio narration clips for exact One-Click Demo paths (Scenarios A, B, C, D)
 * - Clean native fallback system
 * - OS regional voice pack detection & missing voice pack diagnostics
 */

export interface VoicePackStatus {
  hasNativeVoice: boolean;
  voiceName: string;
  langCode: string;
  isFallback: boolean;
  warningMessage?: string;
}

// Studio Narration Script Text for exact One-Click Demo paths
export const DEMO_NARRATIONS: Record<string, string> = {
  SCENARIO_A:
    'Scenario A: Multi-station watershed corroboration verified. Web Crypto ECDSA P-256 signature authentic. 5 standard HL7 FHIR resources emitted.',
  SCENARIO_B:
    'Scenario B: Isolated sensor anomaly detected. Contextual deviation of 2.35 pH units flagged for Human-in-the-Loop validation review.',
  SCENARIO_C:
    'Scenario C: Catastrophic regional watershed depression confirmed across all basin sensors. Severe chemical runoff detected. Resilience alert triggered.',
  SCENARIO_D:
    'Scenario D: Critical security fault! Web Crypto ECDSA signature mismatch detected. In-flight payload alteration confirmed. Zero-trust lockout engaged.',
};

class HybridAudioManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isStudioNarrationActive: boolean = true;
  private currentNarrationUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays tactical studio audio cues for pipeline events using Web Audio oscillators
   */
  public playStudioCue(type: 'INGEST' | 'VERIFY' | 'TRUST' | 'FHIR' | 'FAULT' | 'RESET'): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'INGEST') {
      // High-tech digital ping (Cyberpunk Ingestion)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'VERIFY') {
      // Dual harmonic cryptographic chime (ECDSA P-256 success)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(659.25, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } else if (type === 'TRUST') {
      // Clinical harmonic resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2); // A5
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'FHIR') {
      // Medical interoperability confirmation chord (EHR commit)
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.09, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + 0.45);
      });
    } else if (type === 'FAULT') {
      // Dissonant security fault alarm (Zero-Trust Lockout)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  }

  /**
   * Hardcoded studio demo narration for exact paths of One-Click Demo
   */
  public playDemoNarration(scenarioId: string, lang = 'en-US'): void {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const script = DEMO_NARRATIONS[scenarioId];
    if (!script) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = lang;
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(
      (v) =>
        v.lang.startsWith(lang.split('-')[0]) &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Enhanced'))
    ) || voices.find((v) => v.lang.startsWith(lang.split('-')[0])) || voices[0];

    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    this.currentNarrationUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Checks if user's OS has an authentic native voice pack installed for given language
   */
  public inspectVoicePack(langCode: string, langName: string): VoicePackStatus {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return {
        hasNativeVoice: false,
        voiceName: 'SpeechSynthesis Unavailable',
        langCode,
        isFallback: true,
        warningMessage: 'Speech synthesis is not supported in this browser.',
      };
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      return {
        hasNativeVoice: false,
        voiceName: 'Loading Voices...',
        langCode,
        isFallback: true,
        warningMessage: `Voices are still initializing or your OS lacks pre-installed regional packs for ${langName}.`,
      };
    }

    const targetPrefix = langCode.split('-')[0].toLowerCase();
    const exactMatch = voices.find((v) => v.lang.toLowerCase() === langCode.toLowerCase());
    const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));

    if (exactMatch) {
      return {
        hasNativeVoice: true,
        voiceName: `${exactMatch.name} (${exactMatch.lang})`,
        langCode,
        isFallback: false,
      };
    }

    if (prefixMatch) {
      return {
        hasNativeVoice: true,
        voiceName: `${prefixMatch.name} (Dialect: ${prefixMatch.lang})`,
        langCode,
        isFallback: false,
      };
    }

    return {
      hasNativeVoice: false,
      voiceName: voices[0]?.name || 'Generic System Voice',
      langCode,
      isFallback: true,
      warningMessage: `Notice: Your OS lacks an installed regional voice pack for ${langName} (${langCode}). Client-side synthesizer will use standard fallback voice.`,
    };
  }
}

export const hybridAudio = new HybridAudioManager();

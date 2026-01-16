import { eventBus } from './EventBus';
import { settingsManager } from './SettingsManager';

type AmbientType = 'crew-quarters' | 'corridor' | 'atmospheric' | 'fluid' | 'electrical' | 'fungal' | 'wound' | 'exterior' | 'emergency';

interface AmbientConfig {
  baseFreq: number;
  modFreq: number;
  volume: number;
  filterFreq: number;
}

const AMBIENT_CONFIGS: Record<AmbientType, AmbientConfig> = {
  'crew-quarters': { baseFreq: 55, modFreq: 0.1, volume: 0.08, filterFreq: 200 },
  'corridor': { baseFreq: 45, modFreq: 0.15, volume: 0.1, filterFreq: 150 },
  'atmospheric': { baseFreq: 60, modFreq: 0.2, volume: 0.12, filterFreq: 300 },
  'fluid': { baseFreq: 50, modFreq: 0.3, volume: 0.1, filterFreq: 250 },
  'electrical': { baseFreq: 60, modFreq: 0.5, volume: 0.08, filterFreq: 400 },
  'fungal': { baseFreq: 35, modFreq: 0.08, volume: 0.06, filterFreq: 120 },
  'wound': { baseFreq: 40, modFreq: 0.4, volume: 0.15, filterFreq: 180 },
  'exterior': { baseFreq: 30, modFreq: 0.05, volume: 0.05, filterFreq: 100 },
  'emergency': { baseFreq: 80, modFreq: 2, volume: 0.2, filterFreq: 500 },
};

/**
 * Manages ambient audio using Web Audio API
 * Creates synthesized sounds that match the game's atmosphere
 */
export class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private currentAmbient: AmbientType | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Map scenes to ambient types
    eventBus.on('scene:enter', (event) => {
      const payload = event.payload as { sceneId: string };
      const ambientType = this.getAmbientForScene(payload.sceneId);
      if (ambientType) {
        this.playAmbient(ambientType);
      }
    });

    eventBus.on('emergency:start', () => {
      this.playAmbient('emergency');
    });

    eventBus.on('emergency:end', () => {
      // Return to previous ambient based on current scene
      this.stopAmbient();
    });

    // UI feedback sounds
    eventBus.on('dialogue:choice', () => {
      this.playUISound('select');
    });

    eventBus.on('maintenance:interact', (event) => {
      const payload = event.payload as { action: string };
      if (payload.action === 'repair') {
        this.playUISound('repair');
      } else if (payload.action === 'complete') {
        this.playUISound('complete');
      }
    });
  }

  private getAmbientForScene(sceneId: string): AmbientType | null {
    const sceneMap: Record<string, AmbientType> = {
      'menu': 'corridor',
      'intro': 'crew-quarters',
      'crew-quarters': 'crew-quarters',
      'sector-7-corridor': 'corridor',
      'sector-7j-atmospheric': 'atmospheric',
      'fluid-systems': 'fluid',
      'electrical-hub': 'electrical',
      'fungal-depths': 'fungal',
      'fungal-network': 'fungal',
      'fungal-deeper': 'fungal',
      'the-wound': 'wound',
      'hopper-yard': 'exterior',
      'grow-deck': 'atmospheric',
      'briefing': 'crew-quarters',
      'rest-bunk': 'crew-quarters',
    };

    // Handle talk-* scenes
    if (sceneId.startsWith('talk-')) {
      return 'crew-quarters';
    }

    return sceneMap[sceneId] || null;
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      this.context = new AudioContext();

      // Master volume
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.context.destination);

      this.initialized = true;
      console.log('AudioManager initialized');
    } catch (e) {
      console.warn('Web Audio API not available:', e);
      this.enabled = false;
    }
  }

  /**
   * Resume audio context if suspended (required for some browsers)
   */
  async resume(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Play ambient sound for a location
   */
  playAmbient(type: AmbientType): void {
    if (!this.enabled || !this.context || !this.masterGain) return;
    if (this.currentAmbient === type) return;

    // Stop existing ambient
    this.stopAmbient();

    const config = AMBIENT_CONFIGS[type];
    this.currentAmbient = type;

    // Create low-pass filter for warmth
    this.ambientFilter = this.context.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.value = config.filterFreq;
    this.ambientFilter.Q.value = 1;

    // Create gain for ambient
    this.ambientGain = this.context.createGain();
    this.ambientGain.gain.value = 0;

    // Create LFO for subtle modulation
    this.lfoGain = this.context.createGain();
    this.lfoGain.gain.value = 5; // Frequency deviation

    this.lfoOsc = this.context.createOscillator();
    this.lfoOsc.type = 'sine';
    this.lfoOsc.frequency.value = config.modFreq;

    // Create main oscillator (the "hum")
    this.ambientOsc = this.context.createOscillator();
    this.ambientOsc.type = 'sine';
    this.ambientOsc.frequency.value = config.baseFreq;

    // Connect LFO to oscillator frequency
    this.lfoOsc.connect(this.lfoGain);
    this.lfoGain.connect(this.ambientOsc.frequency);

    // Connect audio chain
    this.ambientOsc.connect(this.ambientFilter);
    this.ambientFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    // Start oscillators
    this.ambientOsc.start();
    this.lfoOsc.start();

    // Fade in
    this.ambientGain.gain.setTargetAtTime(config.volume, this.context.currentTime, 0.5);
  }

  /**
   * Stop ambient sound with fade out
   */
  stopAmbient(): void {
    if (!this.context || !this.ambientGain) return;

    // Fade out
    this.ambientGain.gain.setTargetAtTime(0, this.context.currentTime, 0.3);

    // Stop and cleanup after fade
    const osc = this.ambientOsc;
    const lfo = this.lfoOsc;
    setTimeout(() => {
      try {
        osc?.stop();
        lfo?.stop();
      } catch {
        // Already stopped
      }
    }, 500);

    this.ambientOsc = null;
    this.lfoOsc = null;
    this.currentAmbient = null;
  }

  /**
   * Play UI feedback sound
   */
  playUISound(type: 'select' | 'repair' | 'complete' | 'alert'): void {
    if (!this.enabled || !this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    gain.connect(this.masterGain);
    osc.connect(gain);

    const now = this.context.currentTime;

    switch (type) {
      case 'select':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'repair':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'complete':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(550, now + 0.1);
        osc.frequency.setValueAtTime(660, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.12, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'alert':
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        for (let i = 0; i < 3; i++) {
          osc.frequency.setValueAtTime(200, now + i * 0.2);
          osc.frequency.setValueAtTime(250, now + i * 0.2 + 0.1);
        }
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.setValueAtTime(0.1, now + 0.55);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
        break;
    }
  }

  /**
   * Set master volume
   */
  setVolume(value: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, value));
    }
  }

  /**
   * Toggle audio on/off
   */
  toggle(enabled?: boolean): void {
    this.enabled = enabled ?? !this.enabled;
    if (this.masterGain) {
      this.masterGain.gain.value = this.enabled ? 0.3 : 0;
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const audioManager = new AudioManager();

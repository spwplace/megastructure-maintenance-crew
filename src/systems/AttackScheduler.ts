import type { ShiftPhase } from '@/types';
import { eventBus } from '@/core/EventBus';

interface AttackSchedulerConfig {
  checkIntervalMs: number;  // How often to check for attacks
  baseChance: number;       // Base probability per check (0-1)
  escalationRate: number;   // Additional chance per minute elapsed
  cooldownMs: number;       // Minimum time between attacks
}

const DEFAULT_CONFIG: AttackSchedulerConfig = {
  checkIntervalMs: 30000,   // Check every 30 seconds
  baseChance: 0.08,         // 8% base chance
  escalationRate: 0.02,     // +2% per minute
  cooldownMs: 60000,        // 60 second cooldown
};

/**
 * Schedules random attacks during work phase
 * Attacks become more likely the longer the player works without one
 */
export class AttackScheduler {
  private config: AttackSchedulerConfig;
  private checkInterval: number | null = null;
  private lastAttackTime: number = 0;
  private workStartTime: number = 0;
  private paused: boolean = true;
  private currentPhase: ShiftPhase = 'briefing';
  private emergencyActive: boolean = false;

  constructor(config: Partial<AttackSchedulerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for phase changes to start/stop scheduler
    eventBus.on('shift:phase', (event) => {
      const payload = event.payload as { phase: ShiftPhase };
      this.currentPhase = payload.phase;
      this.handlePhaseChange(payload.phase);
    });

    // Pause during emergencies
    eventBus.on('emergency:start', () => {
      this.emergencyActive = true;
      this.pause();
    });

    eventBus.on('emergency:end', () => {
      this.emergencyActive = false;
      // Resume if still in work phase
      if (this.currentPhase === 'work') {
        this.resume();
      }
    });
  }

  private handlePhaseChange(phase: ShiftPhase): void {
    if (phase === 'work' && !this.emergencyActive) {
      this.start();
    } else {
      this.stop();
    }
  }

  start(): void {
    if (this.checkInterval !== null) return;

    this.paused = false;
    this.workStartTime = Date.now();

    this.checkInterval = window.setInterval(() => {
      this.checkForAttack();
    }, this.config.checkIntervalMs);

    console.log('AttackScheduler: Started');
  }

  stop(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.paused = true;
    console.log('AttackScheduler: Stopped');
  }

  pause(): void {
    this.paused = true;
    console.log('AttackScheduler: Paused');
  }

  resume(): void {
    if (this.checkInterval !== null) {
      this.paused = false;
      console.log('AttackScheduler: Resumed');
    }
  }

  reset(): void {
    this.stop();
    this.lastAttackTime = 0;
    this.workStartTime = 0;
    this.emergencyActive = false;
  }

  private checkForAttack(): void {
    if (this.paused) return;

    const now = Date.now();

    // Check cooldown
    if (now - this.lastAttackTime < this.config.cooldownMs) {
      return;
    }

    // Calculate escalating chance
    const minutesElapsed = (now - this.workStartTime) / 60000;
    const escalatedChance = this.config.baseChance + (minutesElapsed * this.config.escalationRate);
    const finalChance = Math.min(escalatedChance, 0.5); // Cap at 50%

    if (Math.random() < finalChance) {
      this.triggerAttack();
    }
  }

  private triggerAttack(): void {
    this.lastAttackTime = Date.now();
    // Reset escalation timer after attack
    this.workStartTime = Date.now();

    console.log('AttackScheduler: Attack triggered!');
    eventBus.emit('attack:scheduled', { timestamp: this.lastAttackTime });
  }

  // For debugging/testing
  getStatus(): { running: boolean; paused: boolean; timeSinceLastAttack: number } {
    return {
      running: this.checkInterval !== null,
      paused: this.paused,
      timeSinceLastAttack: this.lastAttackTime ? Date.now() - this.lastAttackTime : -1,
    };
  }
}

export const attackScheduler = new AttackScheduler();

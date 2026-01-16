import type { ShiftPhase, ShiftState } from '@/types';
import { eventBus } from '@/core/EventBus';
import { stateManager } from '@/core/StateManager';
import { sceneManager } from './SceneManager';
import { dialogueSystem } from './DialogueSystem';
import { uiManager } from '@/ui/UIManager';

/**
 * Manages the shift cycle that structures gameplay
 * Shift phases: briefing -> work -> downtime -> (emergency possible anytime)
 */
export class ShiftSystem {
  private state: ShiftState = {
    number: 1,
    phase: 'briefing',
    tasksCompleted: [],
    emergencyActive: false,
  };

  private shiftIndicator: HTMLElement | null = null;

  getState(): Readonly<ShiftState> {
    return this.state;
  }

  getPhase(): ShiftPhase {
    return this.state.phase;
  }

  getShiftNumber(): number {
    return this.state.number;
  }

  /**
   * Start a new shift with briefing
   */
  startShift(shiftNumber?: number): void {
    if (shiftNumber !== undefined) {
      this.state.number = shiftNumber;
    }
    this.state.phase = 'briefing';
    this.state.tasksCompleted = [];
    this.state.emergencyActive = false;

    eventBus.emit('shift:phase', { phase: 'briefing', shift: this.state.number });
    this.updateIndicator();
  }

  /**
   * Transition to work phase after briefing
   */
  beginWork(): void {
    this.state.phase = 'work';
    eventBus.emit('shift:phase', { phase: 'work', shift: this.state.number });
    this.updateIndicator();
  }

  /**
   * Complete a work task
   */
  completeTask(taskId: string): void {
    if (!this.state.tasksCompleted.includes(taskId)) {
      this.state.tasksCompleted.push(taskId);
    }
  }

  /**
   * Transition to downtime after work is done
   */
  beginDowntime(): void {
    this.state.phase = 'downtime';
    eventBus.emit('shift:phase', { phase: 'downtime', shift: this.state.number });
    this.updateIndicator();

    // Show phase announcement
    uiManager.showPhaseAnnouncement('REST PERIOD', 'Work complete. Time to rest.');
  }

  /**
   * End current shift and start next
   */
  endShift(): void {
    // Apply entropy before advancing shift
    this.applyShiftEntropy();

    this.state.number += 1;
    stateManager.advanceShift();
    eventBus.emit('shift:advance', { shift: this.state.number });
    this.startShift();
  }

  /**
   * Apply degradation to systems between shifts
   */
  private applyShiftEntropy(): void {
    const state = stateManager.getState();
    const systems = state.systemStatuses;

    // Each system loses some health if not maintained this shift
    Object.keys(systems).forEach((systemId) => {
      if (!this.state.tasksCompleted.includes(systemId)) {
        const status = systems[systemId];
        if (status && status.health > 25) {
          // Degrade by 3-10% if not maintained
          const degradation = Math.floor(Math.random() * 7) + 3;
          status.health = Math.max(25, status.health - degradation);

          // Add new warnings based on degradation
          if (status.health < 40 && !status.warnings.some(w => w.includes('critical'))) {
            status.warnings.push('Degradation reaching critical threshold');
          }
        }
      }
    });

    // Random chance of new problems appearing
    const newProblems = [
      { system: 'atmo-7j', warning: 'New spore contamination detected' },
      { system: 'atmo-7j', warning: 'Humidity regulator failing' },
      { system: 'fluid-secondary', warning: 'Unexpected pressure spike logged' },
      { system: 'fluid-secondary', warning: 'Sediment buildup in filter' },
      { system: 'elec-blockc', warning: 'Sensor ghost readings increasing' },
      { system: 'elec-blockc', warning: 'Power draw anomaly detected' },
      { system: 'hopper-yard', warning: 'Corrosion spreading on intake' },
      { system: 'hopper-yard', warning: 'Seal integrity compromised' },
      { system: 'grow-deck-alpha', warning: 'Pest activity in Section 2' },
      { system: 'grow-deck-alpha', warning: 'Nutrient pump stuttering' },
    ];

    // 35% chance of a new problem appearing
    if (Math.random() < 0.35) {
      const problem = newProblems[Math.floor(Math.random() * newProblems.length)];
      const status = systems[problem.system];
      if (status && !status.warnings.includes(problem.warning)) {
        status.warnings.push(problem.warning);
        status.health = Math.max(25, status.health - 5);
      }
    }
  }

  /**
   * Trigger an emergency (siege attack)
   */
  triggerEmergency(): void {
    const previousPhase = this.state.phase;
    this.state.phase = 'emergency';
    this.state.emergencyActive = true;

    eventBus.emit('emergency:start', {
      previousPhase,
      shift: this.state.number,
    });
    eventBus.emit('shift:phase', { phase: 'emergency', shift: this.state.number });

    this.showEmergencyOverlay();
    this.updateIndicator();
  }

  /**
   * End emergency and return to previous activity
   */
  endEmergency(returnToPhase: ShiftPhase = 'work'): void {
    this.state.emergencyActive = false;
    this.state.phase = returnToPhase;

    eventBus.emit('emergency:end', { shift: this.state.number });
    eventBus.emit('shift:phase', { phase: returnToPhase, shift: this.state.number });

    this.hideEmergencyOverlay();
    this.updateIndicator();
  }

  /**
   * Show/update the shift indicator in the UI
   */
  showIndicator(): void {
    if (this.shiftIndicator) return;

    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;

    this.shiftIndicator = document.createElement('div');
    this.shiftIndicator.className = 'shift-indicator';
    uiLayer.appendChild(this.shiftIndicator);

    this.updateIndicator();
  }

  hideIndicator(): void {
    this.shiftIndicator?.remove();
    this.shiftIndicator = null;
  }

  private updateIndicator(): void {
    if (!this.shiftIndicator) return;

    const phaseLabels: Record<ShiftPhase, string> = {
      briefing: 'Briefing',
      work: 'On Shift',
      downtime: 'Rest Period',
      emergency: 'EMERGENCY',
    };

    const phaseColors: Record<ShiftPhase, string> = {
      briefing: 'var(--color-text-dim)',
      work: 'var(--color-grow-light)',
      downtime: 'var(--color-amber)',
      emergency: '#c44',
    };

    this.shiftIndicator.innerHTML = `
      <div class="shift-number">SHIFT ${this.state.number}</div>
      <div class="shift-phase" style="color: ${phaseColors[this.state.phase]}">
        ${phaseLabels[this.state.phase]}
      </div>
    `;
  }

  private showEmergencyOverlay(): void {
    let overlay = document.getElementById('emergency-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'emergency-overlay';
      overlay.className = 'emergency-overlay';
      document.getElementById('game')?.appendChild(overlay);
    }
    overlay.classList.add('active');

    // Screen shake effect
    document.getElementById('game')?.classList.add('screen-shake');
    setTimeout(() => {
      document.getElementById('game')?.classList.remove('screen-shake');
    }, 300);

    // Alert banner
    const banner = document.createElement('div');
    banner.className = 'alert-banner';
    banner.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom: 4px;">⚠ BREACH DETECTED ⚠</div>
      <div style="font-size: 0.8rem;">Emergency response required</div>
    `;
    banner.id = 'alert-banner';
    document.getElementById('game')?.appendChild(banner);

    // Auto-remove banner after delay
    setTimeout(() => {
      banner.classList.add('fade-out');
      setTimeout(() => banner.remove(), 300);
    }, 2000);
  }

  private hideEmergencyOverlay(): void {
    const overlay = document.getElementById('emergency-overlay');
    overlay?.classList.remove('active');

    const banner = document.getElementById('alert-banner');
    banner?.remove();
  }

  /**
   * Check if enough tasks are done to proceed to downtime
   */
  canProceedToDowntime(): boolean {
    return this.state.tasksCompleted.length >= 1;
  }

  /**
   * Get summary for end of shift
   */
  getShiftSummary(): { tasksCompleted: number; systemsRepaired: string[] } {
    return {
      tasksCompleted: this.state.tasksCompleted.length,
      systemsRepaired: [...this.state.tasksCompleted],
    };
  }
}

export const shiftSystem = new ShiftSystem();

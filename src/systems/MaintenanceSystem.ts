import type { SystemStatus, MaintenanceInteraction } from '@/types';
import { eventBus } from '@/core/EventBus';
import { stateManager } from '@/core/StateManager';
import { dialogueSystem } from './DialogueSystem';

export type MaintenanceType = 'mechanical' | 'biological' | 'electrical' | 'emergency';

export interface MaintenanceTask {
  id: string;
  name: string;
  type: MaintenanceType;
  description: string;
  status: SystemStatus;
  actions: MaintenanceAction[];
  onComplete?: () => void;
  companionId?: string; // crew member helping
}

export interface MaintenanceAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  requiresTool?: string;
  healthGain: number;
  removes?: string[]; // warning IDs to remove
  triggersDialogue?: string;
  available: () => boolean;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  forTypes: MaintenanceType[];
}

const TOOLS: Tool[] = [
  { id: 'basic-kit', name: 'Basic Toolkit', icon: '🔧', forTypes: ['mechanical', 'electrical', 'emergency'] },
  { id: 'bio-kit', name: 'Bio-Culture Kit', icon: '🌱', forTypes: ['biological'] },
  { id: 'sealant', name: 'Emergency Sealant', icon: '🧪', forTypes: ['emergency', 'mechanical'] },
  { id: 'probe', name: 'Diagnostic Probe', icon: '📡', forTypes: ['electrical', 'mechanical'] },
];

/**
 * Handles maintenance gameplay - interacting with ship systems
 */
export class MaintenanceSystem {
  private currentTask: MaintenanceTask | null = null;
  private equippedTool: Tool | null = null;
  private panelElement: HTMLElement | null = null;

  constructor() {
    this.equippedTool = TOOLS[0]; // Start with basic kit
  }

  /**
   * Start a maintenance task
   */
  startTask(task: MaintenanceTask): void {
    this.currentTask = task;
    eventBus.emit('maintenance:interact', { action: 'start', taskId: task.id });
    this.renderPanel();
  }

  /**
   * Render the maintenance interaction panel
   */
  private renderPanel(): void {
    if (!this.currentTask) return;

    // Remove existing panel
    this.panelElement?.remove();

    const uiLayer = document.getElementById('ui-layer');
    if (!uiLayer) return;

    const panel = document.createElement('div');
    panel.id = 'maintenance-panel';
    panel.innerHTML = this.generatePanelHTML();
    uiLayer.appendChild(panel);

    this.panelElement = panel;
    this.attachEventListeners();
  }

  private generatePanelHTML(): string {
    if (!this.currentTask) return '';

    const { status, actions } = this.currentTask;
    const healthClass = status.health < 30 ? 'critical' : status.health < 60 ? 'warning' : '';

    return `
      <div class="system-status">
        <div class="system-name" style="color: var(--color-amber); margin-bottom: 4px;">
          ${status.name}
        </div>
        <div class="system-health-bar">
          <div class="system-health-fill ${healthClass}" style="width: ${status.health}%"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-text-dim);">
          <span>System Health</span>
          <span>${status.health}%</span>
        </div>
        ${status.warnings.length > 0 ? `
          <div style="margin-top: 8px; font-size: 0.8rem;">
            ${status.warnings.map(w => `
              <div style="color: var(--color-warning); margin: 2px 0;">! ${w}</div>
            `).join('')}
          </div>
        ` : ''}
        ${status.critical ? '<div style="color: #c44; margin-top: 4px; font-weight: bold;">CRITICAL FAILURE IMMINENT</div>' : ''}
      </div>

      <div class="tool-bar">
        ${TOOLS.filter(t => t.forTypes.includes(this.currentTask!.type)).map(tool => `
          <div class="tool-item ${this.equippedTool?.id === tool.id ? 'selected' : ''}"
               data-tool="${tool.id}"
               title="${tool.name}">
            ${tool.icon}
          </div>
        `).join('')}
      </div>

      ${actions.filter(a => a.available()).map(action => `
        <div class="maintenance-action" data-action="${action.id}">
          <div class="maintenance-action-icon">${action.icon}</div>
          <div style="flex: 1;">
            <div class="maintenance-action-label">${action.label}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-dim);">${action.description}</div>
          </div>
          ${action.requiresTool ? `
            <div class="maintenance-action-cost" style="color: ${this.equippedTool?.id === action.requiresTool ? 'var(--color-grow-light)' : 'var(--color-warning)'}">
              ${action.requiresTool === this.equippedTool?.id ? '✓' : 'Needs tool'}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <div class="maintenance-action" data-action="finish" style="margin-top: 8px; border-color: var(--color-amber-dim);">
        <div class="maintenance-action-icon">←</div>
        <div class="maintenance-action-label">Finish & Leave</div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    if (!this.panelElement) return;

    // Tool selection
    this.panelElement.querySelectorAll('.tool-item').forEach(el => {
      el.addEventListener('click', () => {
        const toolId = el.getAttribute('data-tool');
        this.equippedTool = TOOLS.find(t => t.id === toolId) || null;
        this.renderPanel();
      });
    });

    // Action buttons
    this.panelElement.querySelectorAll('.maintenance-action').forEach(el => {
      el.addEventListener('click', () => {
        const actionId = el.getAttribute('data-action');
        if (actionId === 'finish') {
          this.finishTask();
        } else if (actionId) {
          this.executeAction(actionId);
        }
      });
    });
  }

  private executeAction(actionId: string): void {
    if (!this.currentTask) return;

    const action = this.currentTask.actions.find(a => a.id === actionId);
    if (!action) return;

    // Check tool requirement
    if (action.requiresTool && this.equippedTool?.id !== action.requiresTool) {
      // Show feedback that wrong tool is equipped
      this.showFeedback('Need the right tool for this job.');
      return;
    }

    // Apply health gain
    this.currentTask.status.health = Math.min(100, this.currentTask.status.health + action.healthGain);

    // Remove warnings if specified
    if (action.removes) {
      this.currentTask.status.warnings = this.currentTask.status.warnings.filter(
        w => !action.removes!.some(r => w.toLowerCase().includes(r.toLowerCase()))
      );
    }

    // Update critical status
    if (this.currentTask.status.health > 30) {
      this.currentTask.status.critical = false;
    }

    // Save to state
    stateManager.getState().systemStatuses[this.currentTask.id] = { ...this.currentTask.status };

    eventBus.emit('maintenance:interact', {
      action: 'repair',
      taskId: this.currentTask.id,
      actionId,
      newHealth: this.currentTask.status.health,
    });

    // Trigger dialogue if specified
    if (action.triggersDialogue) {
      this.triggerCompanionDialogue(action.triggersDialogue);
    }

    // Re-render
    this.renderPanel();

    // Show success feedback
    this.showFeedback(`+${action.healthGain}% system health`);
  }

  private showFeedback(message: string): void {
    const feedback = document.createElement('div');
    feedback.className = 'maintenance-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 12px 24px;
      background: rgba(10, 18, 20, 0.95);
      border: 1px solid var(--color-amber);
      border-radius: 4px;
      color: var(--color-amber);
      font-size: 0.9rem;
      z-index: 100;
      animation: fadeOut 1.5s ease-out forwards;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1500);
  }

  private triggerCompanionDialogue(dialogueKey: string): void {
    // This would trigger contextual dialogue from the companion
    // For now, we'll emit an event
    eventBus.emit('dialogue:trigger', { key: dialogueKey });
  }

  finishTask(): void {
    if (!this.currentTask) return;

    const finalHealth = this.currentTask.status.health;
    const taskId = this.currentTask.id;

    // Save final state
    stateManager.getState().systemStatuses[taskId] = { ...this.currentTask.status };

    // Cleanup
    this.panelElement?.remove();
    this.panelElement = null;

    this.currentTask.onComplete?.();
    this.currentTask = null;

    eventBus.emit('maintenance:interact', {
      action: 'complete',
      taskId,
      finalHealth,
    });
  }

  getCurrentTask(): MaintenanceTask | null {
    return this.currentTask;
  }

  getEquippedTool(): Tool | null {
    return this.equippedTool;
  }

  isActive(): boolean {
    return this.currentTask !== null;
  }
}

export const maintenanceSystem = new MaintenanceSystem();

// ============================================
// Pre-built maintenance tasks for the game
// ============================================

export function createAtmosphericTask(): MaintenanceTask {
  // Check if we have saved state
  const savedStatus = stateManager.getState().systemStatuses['atmo-7j'];

  return {
    id: 'atmo-7j',
    name: 'Bio-Filter Repair',
    type: 'biological',
    description: 'The atmospheric bio-filters in Sector 7-J are degraded.',
    companionId: 'solenne',
    status: savedStatus || {
      name: 'Atmospheric Bio-Filter Array',
      health: 67,
      warnings: [
        'Moss Sheet 3 degraded',
        'Humidity variance +12%',
        'CO2 processing below threshold',
      ],
      critical: false,
    },
    actions: [
      {
        id: 'inspect-moss',
        label: 'Inspect Moss Sheets',
        description: 'Check the condition of the bio-filter moss',
        icon: '🔍',
        healthGain: 5,
        triggersDialogue: 'moss-inspection',
        available: () => true,
      },
      {
        id: 'replace-moss',
        label: 'Replace Degraded Sheet',
        description: 'Swap out Moss Sheet 3 with fresh culture',
        icon: '🌿',
        requiresTool: 'bio-kit',
        healthGain: 15,
        removes: ['moss sheet'],
        triggersDialogue: 'moss-replacement',
        available: () => true,
      },
      {
        id: 'adjust-humidity',
        label: 'Calibrate Humidity',
        description: 'Adjust the moisture levels in the chamber',
        icon: '💧',
        healthGain: 10,
        removes: ['humidity'],
        available: () => true,
      },
      {
        id: 'boost-co2',
        label: 'Boost CO2 Processing',
        description: 'Increase nutrient flow to accelerate processing',
        icon: '🌬️',
        requiresTool: 'bio-kit',
        healthGain: 12,
        removes: ['co2'],
        available: () => true,
      },
    ],
    onComplete: () => {
      stateManager.setFlag('atmo-7j-maintained', true);
    },
  };
}

export function createFluidSystemTask(): MaintenanceTask {
  const savedStatus = stateManager.getState().systemStatuses['fluid-secondary'];

  return {
    id: 'fluid-secondary',
    name: 'Secondary Loop Repair',
    type: 'mechanical',
    description: 'Pressure irregularities in the secondary fluid loop.',
    companionId: 'dauro',
    status: savedStatus || {
      name: 'Secondary Fluid Loop',
      health: 52,
      warnings: [
        'Pressure variance detected',
        'Valve 7B sticking',
        'Minor leak at junction 12',
      ],
      critical: false,
    },
    actions: [
      {
        id: 'check-pressure',
        label: 'Check Pressure Readings',
        description: 'Take manual pressure readings along the loop',
        icon: '📊',
        healthGain: 5,
        available: () => true,
      },
      {
        id: 'fix-valve',
        label: 'Unstick Valve 7B',
        description: 'Free the stuck valve mechanism',
        icon: '🔧',
        requiresTool: 'basic-kit',
        healthGain: 18,
        removes: ['valve'],
        available: () => true,
      },
      {
        id: 'seal-leak',
        label: 'Seal Junction Leak',
        description: 'Apply sealant to the leaking junction',
        icon: '🧪',
        requiresTool: 'sealant',
        healthGain: 15,
        removes: ['leak'],
        available: () => true,
      },
      {
        id: 'recalibrate',
        label: 'Recalibrate Pressure',
        description: 'Balance pressure across the loop',
        icon: '⚖️',
        healthGain: 12,
        removes: ['pressure'],
        available: () => stateManager.getState().systemStatuses['fluid-secondary']?.health > 70,
      },
    ],
    onComplete: () => {
      stateManager.setFlag('fluid-secondary-maintained', true);
    },
  };
}

export function createElectricalTask(): MaintenanceTask {
  const savedStatus = stateManager.getState().systemStatuses['elec-blockc'];

  return {
    id: 'elec-blockc',
    name: 'Sensor Array Calibration',
    type: 'electrical',
    description: 'Sensor arrays in Block C need recalibration.',
    companionId: 'vell',
    status: savedStatus || {
      name: 'Block C Sensor Array',
      health: 45,
      warnings: [
        'Sensors 3-7 offline',
        'Power fluctuation detected',
        'Data corruption in buffer',
      ],
      critical: false,
    },
    actions: [
      {
        id: 'diagnose',
        label: 'Run Diagnostics',
        description: 'Check the sensor array status',
        icon: '📡',
        requiresTool: 'probe',
        healthGain: 8,
        triggersDialogue: 'sensor-diagnosis',
        available: () => true,
      },
      {
        id: 'reboot-sensors',
        label: 'Reboot Sensors 3-7',
        description: 'Power cycle the offline sensors',
        icon: '🔄',
        healthGain: 15,
        removes: ['offline'],
        available: () => true,
      },
      {
        id: 'stabilize-power',
        label: 'Stabilize Power Feed',
        description: 'Regulate the power supply',
        icon: '⚡',
        requiresTool: 'basic-kit',
        healthGain: 12,
        removes: ['fluctuation'],
        available: () => true,
      },
      {
        id: 'clear-buffer',
        label: 'Clear Data Buffer',
        description: 'Purge corrupted data from the buffer',
        icon: '🗑️',
        healthGain: 10,
        removes: ['corruption'],
        available: () => true,
      },
    ],
    onComplete: () => {
      stateManager.setFlag('elec-blockc-maintained', true);
    },
  };
}

export function createEmergencyTask(): MaintenanceTask {
  return {
    id: 'breach-emergency',
    name: 'Hull Breach Containment',
    type: 'emergency',
    description: 'A new breach has opened. Seal it before atmosphere vents.',
    companionId: 'orrin',
    status: {
      name: 'Hull Integrity - Section 14',
      health: 25,
      warnings: [
        'ACTIVE BREACH',
        'Atmosphere venting',
        'Structural stress critical',
      ],
      critical: true,
    },
    actions: [
      {
        id: 'emergency-seal',
        label: 'Apply Emergency Seal',
        description: 'Slap a temporary seal on the breach',
        icon: '🛡️',
        requiresTool: 'sealant',
        healthGain: 25,
        removes: ['breach', 'venting'],
        triggersDialogue: 'emergency-seal',
        available: () => true,
      },
      {
        id: 'brace-structure',
        label: 'Brace Structure',
        description: 'Reinforce the damaged section',
        icon: '🔩',
        requiresTool: 'basic-kit',
        healthGain: 15,
        removes: ['stress'],
        available: () => true,
      },
      {
        id: 'reroute-atmosphere',
        label: 'Reroute Atmosphere',
        description: 'Redirect air flow around the damage',
        icon: '💨',
        healthGain: 10,
        available: () => true,
      },
    ],
    onComplete: () => {
      stateManager.setFlag('breach-contained', true);
      stateManager.addRumor("The attack patterns are changing. That breach wasn't random.");
    },
  };
}

import type { SystemStatus, MaintenanceInteraction } from '@/types';
import { eventBus } from '@/core/EventBus';
import { stateManager } from '@/core/StateManager';
import { dialogueSystem } from './DialogueSystem';
import { sceneManager } from './SceneManager';

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
  returnScene?: string; // scene to return to when finished (default: sector-7-corridor)
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

      <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--color-deep-teal); font-size: 0.75rem; color: var(--color-text-dim);">
        ${this.currentTask.companionId ? `Working with: ${this.currentTask.companionId.toUpperCase()}` : 'Working alone'}
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
    stateManager.setSystemStatus(this.currentTask.id, this.currentTask.status);

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
    const companionId = this.currentTask?.companionId;
    if (!companionId) return;

    const dialogue = getCompanionDialogue(dialogueKey, companionId);
    if (dialogue) {
      // Small delay so the maintenance feedback shows first
      setTimeout(() => {
        dialogueSystem.startDialogue(dialogue);
      }, 800);
    }
  }

  finishTask(navigate: boolean = true): void {
    if (!this.currentTask) return;

    const finalHealth = this.currentTask.status.health;
    const taskId = this.currentTask.id;
    const returnScene = this.currentTask.returnScene || 'sector-7-corridor';

    // Save final state
    stateManager.setSystemStatus(taskId, this.currentTask.status);

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

    // Navigate back to corridor (or specified return scene)
    if (navigate) {
      sceneManager.goToScene(returnScene);
    }
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
  const savedStatus = stateManager.getSystemStatus('atmo-7j');

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
  const savedStatus = stateManager.getSystemStatus('fluid-secondary');

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
        available: () => (stateManager.getSystemStatus('fluid-secondary')?.health ?? 0) > 70,
      },
    ],
    onComplete: () => {
      stateManager.setFlag('fluid-secondary-maintained', true);
    },
  };
}

export function createElectricalTask(): MaintenanceTask {
  const savedStatus = stateManager.getSystemStatus('elec-blockc');

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

export function createHopperYardTask(): MaintenanceTask {
  const savedStatus = stateManager.getSystemStatus('hopper-yard');

  return {
    id: 'hopper-yard',
    name: 'Fluid Transfer Maintenance',
    type: 'mechanical',
    description: 'The fluid transfer hoppers supply systems throughout the structure.',
    companionId: 'dauro',
    status: savedStatus || {
      name: 'Fluid Transfer Hopper',
      health: 58,
      warnings: [
        'Transfer rate below optimal',
        'Debris accumulation detected',
        'Seal wear on hatch 3',
      ],
      critical: false,
    },
    actions: [
      {
        id: 'check-flow',
        label: 'Check Flow Rate',
        description: 'Measure the fluid transfer rate',
        icon: '📊',
        healthGain: 5,
        triggersDialogue: 'hopper-flow',
        available: () => true,
      },
      {
        id: 'clear-debris',
        label: 'Clear Debris',
        description: 'Remove accumulated debris from intake',
        icon: '🧹',
        requiresTool: 'basic-kit',
        healthGain: 15,
        removes: ['debris'],
        available: () => true,
      },
      {
        id: 'replace-seal',
        label: 'Replace Hatch Seal',
        description: 'Swap out the worn seal on hatch 3',
        icon: '🔧',
        requiresTool: 'sealant',
        healthGain: 18,
        removes: ['seal'],
        available: () => true,
      },
      {
        id: 'boost-transfer',
        label: 'Boost Transfer Pressure',
        description: 'Increase pressure to improve flow',
        icon: '⬆️',
        healthGain: 12,
        removes: ['transfer'],
        available: () => (stateManager.getSystemStatus('hopper-yard')?.health ?? 0) > 60,
      },
    ],
    onComplete: () => {
      stateManager.setFlag('hopper-yard-maintained', true);
    },
  };
}

export function createGrowDeckTask(): MaintenanceTask {
  const savedStatus = stateManager.getSystemStatus('grow-deck-alpha');

  return {
    id: 'grow-deck-alpha',
    name: 'Hydroponics Maintenance',
    type: 'biological',
    description: 'The grow-deck produces food and processes atmosphere for the structure.',
    companionId: 'solenne',
    status: savedStatus || {
      name: 'Grow-Deck Alpha Hydroponics',
      health: 71,
      warnings: [
        'Nutrient imbalance in Section 3',
        'Light cycle drift detected',
        'Root rot risk elevated',
      ],
      critical: false,
    },
    actions: [
      {
        id: 'check-plants',
        label: 'Inspect Plant Health',
        description: 'Check the overall health of the crops',
        icon: '🌱',
        healthGain: 5,
        triggersDialogue: 'plant-inspection',
        available: () => true,
      },
      {
        id: 'adjust-nutrients',
        label: 'Rebalance Nutrients',
        description: 'Correct the nutrient mix in Section 3',
        icon: '💧',
        requiresTool: 'bio-kit',
        healthGain: 15,
        removes: ['nutrient'],
        available: () => true,
      },
      {
        id: 'fix-lights',
        label: 'Sync Light Cycle',
        description: 'Recalibrate the grow-light timing',
        icon: '💡',
        healthGain: 12,
        removes: ['light'],
        available: () => true,
      },
      {
        id: 'treat-roots',
        label: 'Treat Root System',
        description: 'Apply anti-fungal to at-risk root systems',
        icon: '🌿',
        requiresTool: 'bio-kit',
        healthGain: 18,
        removes: ['rot'],
        triggersDialogue: 'root-treatment',
        available: () => true,
      },
    ],
    onComplete: () => {
      stateManager.setFlag('grow-deck-maintained', true);
    },
  };
}

// ============================================
// Companion Dialogue System
// ============================================

import type { DialogueScript } from '@/types';

type CompanionDialogueMap = Record<string, Record<string, DialogueScript>>;

const companionDialogues: CompanionDialogueMap = {
  // Solenne dialogues (biological systems)
  solenne: {
    'moss-inspection': {
      id: 'solenne-moss-inspection',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'solenne',
          text: "See how the edges are curling? That's stress response. They're reaching for something—more light, more moisture, something we're not providing.",
          next: 'observation',
        },
        observation: {
          speaker: 'solenne',
          text: "Three generations of moss cultures, all descended from the original samples. They've adapted to the structure. In some ways, they understand it better than we do.",
        },
      },
    },
    'moss-replacement': {
      id: 'solenne-moss-replacement',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'solenne',
          text: "Easy now. The new sheet needs time to bond. Talk to it—I know that sounds ridiculous, but the vibrations help. The old workers swore by it.",
          next: 'memory',
        },
        memory: {
          speaker: 'solenne',
          text: "My mentor used to sing to them. Old songs, from before. Said the moss remembered things we'd forgotten.",
        },
      },
    },
    'plant-inspection': {
      id: 'solenne-plant-inspection',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'solenne',
          text: "This one's a fighter. See the new growth? Even in bad conditions, it's trying. That's what I love about them—they never give up.",
          next: 'reflection',
        },
        reflection: {
          speaker: 'solenne',
          text: "Sometimes I think the plants are braver than we are. They just keep growing, no matter what.",
        },
      },
    },
    'root-treatment': {
      id: 'solenne-root-treatment',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'solenne',
          text: "Careful with the roots—they're more sensitive than they look. This system is fifty years old. The roots remember every drought, every flood, every time someone got the mix wrong.",
          next: 'concern',
        },
        concern: {
          speaker: 'solenne',
          text: "I worry about what happens when we can't save them anymore. When the damage is too deep, the cultures too stressed. What then?",
        },
      },
    },
  },

  // Dauro dialogues (fluid systems)
  dauro: {
    'hopper-flow': {
      id: 'dauro-hopper-flow',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'dauro',
          text: "Okay, I'm seeing... that can't be right. The pressure upstream is lower than downstream. That's physically impossible.",
          next: 'confusion',
        },
        confusion: {
          speaker: 'dauro',
          text: "Wait, let me recalibrate. No, same reading. How does the structure even... you know what, never mind. I'll just note it as 'nominal' like everyone else.",
        },
      },
    },
  },

  // Vell dialogues (electrical systems)
  vell: {
    'sensor-diagnosis': {
      id: 'vell-sensor-diagnosis',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'vell',
          text: "Interesting. The sensors aren't dead—they're receiving data. They just can't make sense of it anymore. Like they're... confused.",
          next: 'observation',
        },
        observation: {
          speaker: 'vell',
          text: "I've seen this before. The structure's changing faster than the old systems can track. We're not repairing anymore—we're translating. Helping the old talk to the new.",
        },
      },
    },
  },

  // Orrin dialogues (emergency)
  orrin: {
    'emergency-seal': {
      id: 'orrin-emergency-seal',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'orrin',
          text: "Good seal. Fast work. Now brace it—sealant holds pressure but not stress. Another hit and it opens right back up.",
          next: 'warning',
        },
        warning: {
          speaker: 'orrin',
          text: "Stay focused. The structure's groaning—that means it's still settling. We're not safe yet. We're just less doomed.",
        },
      },
    },
  },
};

function getCompanionDialogue(dialogueKey: string, companionId: string): DialogueScript | null {
  return companionDialogues[companionId]?.[dialogueKey] || null;
}

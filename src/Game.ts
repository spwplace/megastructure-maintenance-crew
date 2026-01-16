import { sceneManager } from '@/systems/SceneManager';
import { dialogueSystem } from '@/systems/DialogueSystem';
import { stateManager } from '@/core/StateManager';
import { uiManager } from '@/ui/UIManager';
import { eventBus } from '@/core/EventBus';
import { shiftSystem } from '@/systems/ShiftSystem';
import { maintenanceSystem } from '@/systems/MaintenanceSystem';
import { introScenes, introDialogue } from '@/data/scenes/intro';
import { locationScenes } from '@/data/scenes/locations';
import { createPlaceholderBackground, type LocationType } from '@/ui/PlaceholderArt';

/**
 * Main game controller
 */
export class Game {
  private initialized: boolean = false;
  private emergencyChance: number = 0.15; // 15% chance per maintenance completion

  async init(): Promise<void> {
    if (this.initialized) return;

    console.log('Initializing Megastructure Maintenance Crew...');

    // Show loading
    uiManager.showLoading('Initializing systems...');
    uiManager.setLoadingProgress(10);

    // Register all scenes
    sceneManager.registerScenes(introScenes);
    sceneManager.registerScenes(locationScenes);
    uiManager.setLoadingProgress(40);

    // Set up event listeners
    this.setupEventListeners();
    uiManager.setLoadingProgress(60);

    // Set up menu buttons
    this.setupMenuButtons();
    uiManager.setLoadingProgress(80);

    // Check for existing save
    const hasSave = stateManager.hasSave();
    this.updateContinueButton(hasSave);
    uiManager.setLoadingProgress(100);

    // Hide loading, show menu
    await this.delay(300);
    uiManager.hideLoading();

    // Go to menu
    await sceneManager.goToScene('menu', false);

    this.initialized = true;
    console.log('Game initialized');
  }

  private setupEventListeners(): void {
    // Log scene changes and handle placeholder backgrounds
    eventBus.on('scene:enter', (event) => {
      const payload = event.payload as { sceneId: string };
      console.log('Entered scene:', payload.sceneId);

      // Apply placeholder background based on scene
      this.applyPlaceholderBackground(payload.sceneId);
    });

    // Handle dialogue completion
    eventBus.on('dialogue:end', () => {
      stateManager.save();
    });

    // Handle maintenance completion - check for emergency
    eventBus.on('maintenance:interact', (event) => {
      const payload = event.payload as { action: string };
      if (payload.action === 'complete') {
        this.checkForEmergency();
      }
    });

    // Handle shift phase changes
    eventBus.on('shift:phase', (event) => {
      const payload = event.payload as { phase: string };
      console.log('Shift phase:', payload.phase);
    });

    // Handle emergency events
    eventBus.on('emergency:start', () => {
      console.log('EMERGENCY STARTED');
    });

    eventBus.on('emergency:end', () => {
      console.log('Emergency resolved');
    });

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (dialogueSystem.isActive()) {
          dialogueSystem.skipTypewriter();
        }
      }
      // Debug: Trigger emergency with 'E' key
      if (e.key === 'e' && e.ctrlKey) {
        this.triggerEmergency();
      }
    });
  }

  private applyPlaceholderBackground(sceneId: string): void {
    const sceneLayer = document.getElementById('scene-layer');
    if (!sceneLayer) return;

    // Map scene IDs to location types
    const sceneToLocation: Record<string, LocationType> = {
      'menu': 'menu',
      'intro': 'crew-quarters',
      'crew-quarters': 'crew-quarters',
      'sector-7-corridor': 'corridor',
      'sector-7-entrance': 'corridor',
      'sector-7j-atmospheric': 'atmospheric-processing',
      'fluid-systems': 'fluid-systems',
      'electrical-hub': 'electrical-hub',
      'fungal-depths': 'fungal-depths',
      'the-wound': 'the-wound',
      'hopper-yard': 'hopper-yard',
      'grow-deck': 'grow-deck',
      'briefing': 'crew-quarters',
      'rest-bunk': 'crew-quarters',
      'talk-keth': 'crew-quarters',
      'talk-solenne': 'crew-quarters',
      'talk-vell': 'crew-quarters',
      'talk-dauro': 'crew-quarters',
    };

    const locationType = sceneToLocation[sceneId] || 'corridor';

    // Clear existing and add placeholder
    sceneLayer.innerHTML = '';
    const placeholder = createPlaceholderBackground(locationType);
    sceneLayer.appendChild(placeholder);
  }

  private setupMenuButtons(): void {
    const startButton = document.querySelector('[data-action="start"]');
    const continueButton = document.querySelector('[data-action="continue"]');
    const settingsButton = document.querySelector('[data-action="settings"]');

    startButton?.addEventListener('click', () => this.startNewGame());
    continueButton?.addEventListener('click', () => this.continueGame());
    settingsButton?.addEventListener('click', () => this.openSettings());
  }

  private updateContinueButton(enabled: boolean): void {
    const continueButton = document.querySelector(
      '[data-action="continue"]'
    ) as HTMLButtonElement;
    if (continueButton) {
      continueButton.disabled = !enabled;
    }
  }

  async startNewGame(): Promise<void> {
    console.log('Starting new game...');

    // Reset state
    stateManager.reset();
    stateManager.clearSave();

    // Start intro scene
    await sceneManager.goToScene('intro');

    // Start the intro dialogue sequence
    dialogueSystem.startDialogue(introDialogue, () => {
      // After dialogue ends, transition to work phase
      shiftSystem.beginWork();
      sceneManager.goToScene('sector-7-corridor');
    });
  }

  async continueGame(): Promise<void> {
    console.log('Continuing game...');

    const loaded = stateManager.load();
    if (loaded) {
      const currentScene = stateManager.getCurrentScene();
      // Restore shift state
      shiftSystem.startShift(stateManager.getShift());
      await sceneManager.goToScene(currentScene);
    } else {
      await this.startNewGame();
    }
  }

  openSettings(): void {
    console.log('Settings not yet implemented');
    // TODO: Implement settings menu
  }

  private checkForEmergency(): void {
    // Only trigger during work phase
    if (shiftSystem.getPhase() !== 'work') return;

    // Random chance of emergency after completing maintenance
    if (Math.random() < this.emergencyChance) {
      this.triggerEmergency();
    }
  }

  private triggerEmergency(): void {
    shiftSystem.triggerEmergency();

    // Emergency dialogue
    const emergencyDialogue = {
      id: 'emergency-alert',
      startNode: 'start',
      nodes: {
        start: {
          text: 'The structure shudders. Alarms begin to wail. The hum of the reactors changes pitch—something has gone wrong.',
          next: 'rumble',
        },
        rumble: {
          text: 'A deep rumbling echoes through the corridors. The enemy is attacking again.',
          next: 'orrin',
        },
        orrin: {
          speaker: 'orrin',
          text: "[over comms] Breach in Section 14. Hull integrity failing. I need backup—now.",
          choices: [
            { text: 'On my way.', next: 'respond' },
            { text: "I'll finish here first.", next: 'delay' },
          ],
        },
        respond: {
          speaker: 'keth',
          text: '[over comms] Go. Both of you. Everyone else, brace and hold position.',
          next: 'end',
        },
        delay: {
          speaker: 'orrin',
          text: "There is no 'here first.' Atmosphere is venting. Move.",
          next: 'end',
        },
        end: {
          text: 'The structure groans around you. Time to move.',
        },
      },
    };

    dialogueSystem.startDialogue(emergencyDialogue, () => {
      // After dialogue, go to emergency maintenance
      sceneManager.goToScene('the-wound');
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const game = new Game();

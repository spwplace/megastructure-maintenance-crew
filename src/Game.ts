import { sceneManager } from '@/systems/SceneManager';
import { dialogueSystem } from '@/systems/DialogueSystem';
import { stateManager } from '@/core/StateManager';
import { uiManager } from '@/ui/UIManager';
import { eventBus } from '@/core/EventBus';
import { shiftSystem } from '@/systems/ShiftSystem';
import { maintenanceSystem } from '@/systems/MaintenanceSystem';
import { settingsManager } from '@/core/SettingsManager';
import { attackScheduler } from '@/systems/AttackScheduler';
import { audioManager } from '@/core/AudioManager';
import { introScenes, introDialogue } from '@/data/scenes/intro';
import { locationScenes } from '@/data/scenes/locations';
import { createPlaceholderBackground, type LocationType } from '@/ui/PlaceholderArt';
import type { TextSpeed } from '@/types';

/**
 * Main game controller
 */
export class Game {
  private initialized: boolean = false;
  private emergencyChance: number = 0.15; // 15% chance per maintenance completion
  private inGame: boolean = false; // Track if we're in an active game session
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;

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
      if (settingsManager.getAutoSave()) {
        stateManager.save();
      }
    });

    // Update continue button when save completes
    eventBus.on('save:complete', () => {
      this.updateContinueButton(true);
    });

    // Handle scheduled attacks from AttackScheduler
    eventBus.on('attack:scheduled', () => {
      this.triggerEmergency();
    });

    // Handle maintenance completion - check for emergency
    eventBus.on('maintenance:interact', (event) => {
      const payload = event.payload as { action: string; taskId?: string };
      if (payload.action === 'complete' && payload.taskId) {
        // Record the completed task in the shift system
        shiftSystem.completeTask(payload.taskId);
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

    // Handle keyboard input - prevent key repeat from spamming
    // Remove existing listener if present (prevents accumulation on reset)
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }

    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.repeat) return; // Ignore held keys

      // Space/Enter to advance dialogue
      if (e.key === ' ' || e.key === 'Enter') {
        if (dialogueSystem.isActive()) {
          dialogueSystem.skipTypewriter();
        }
      }

      // Escape to open/close settings
      if (e.key === 'Escape') {
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel && !settingsPanel.classList.contains('hidden')) {
          this.closeSettings();
        } else if (this.inGame) {
          this.openSettings();
        }
      }

      // Number keys to select dialogue choices (1-4)
      if (e.key >= '1' && e.key <= '4') {
        const choiceButtons = document.querySelectorAll('#dialogue-choices .dialogue-choice');
        const index = parseInt(e.key) - 1;
        if (choiceButtons[index]) {
          (choiceButtons[index] as HTMLButtonElement).click();
        }
      }

      // Debug: Trigger emergency with Ctrl+E
      if (e.key === 'e' && e.ctrlKey) {
        this.triggerEmergency();
      }
    };

    document.addEventListener('keydown', this.keydownHandler);
  }

  /**
   * Clean up event listeners to prevent memory leaks
   */
  private cleanupEventListeners(): void {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
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
      'fungal-network': 'fungal-depths',
      'fungal-deeper': 'fungal-depths',
      'the-wound': 'the-wound',
      'hopper-yard': 'hopper-yard',
      'grow-deck': 'grow-deck',
      'briefing': 'crew-quarters',
      'rest-bunk': 'crew-quarters',
      'talk-keth': 'crew-quarters',
      'talk-solenne': 'crew-quarters',
      'talk-vell': 'crew-quarters',
      'talk-dauro': 'crew-quarters',
      'talk-orrin': 'crew-quarters',
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

    // Bind settings panel controls
    this.bindSettingsControls();
  }

  private bindSettingsControls(): void {
    const textSpeedSelect = document.getElementById('text-speed') as HTMLSelectElement;
    const autoSaveCheckbox = document.getElementById('auto-save') as HTMLInputElement;
    const closeButton = document.querySelector('[data-action="settings-close"]');
    const returnMenuButton = document.querySelector('[data-action="return-menu"]');

    // Initialize controls with current settings
    if (textSpeedSelect) {
      textSpeedSelect.value = settingsManager.getTextSpeed();
      textSpeedSelect.addEventListener('change', () => {
        settingsManager.setTextSpeed(textSpeedSelect.value as TextSpeed);
      });
    }

    if (autoSaveCheckbox) {
      autoSaveCheckbox.checked = settingsManager.getAutoSave();
      autoSaveCheckbox.addEventListener('change', () => {
        settingsManager.setAutoSave(autoSaveCheckbox.checked);
      });
    }

    closeButton?.addEventListener('click', () => this.closeSettings());
    returnMenuButton?.addEventListener('click', () => this.returnToMenu());
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

    // Initialize audio (requires user interaction first)
    await audioManager.init();
    await audioManager.resume();

    // Reset state
    stateManager.reset();
    stateManager.clearSave();
    attackScheduler.reset();
    this.inGame = true;

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

    // Initialize audio (requires user interaction first)
    await audioManager.init();
    await audioManager.resume();

    const loaded = stateManager.load();
    if (loaded) {
      this.inGame = true;
      const currentScene = stateManager.getCurrentScene();
      // Restore shift state from saved data (preserves phase and tasksCompleted)
      shiftSystem.restoreState();
      await sceneManager.goToScene(currentScene);
    } else {
      await this.startNewGame();
    }
  }

  openSettings(): void {
    const mainMenu = document.getElementById('main-menu');
    const settingsPanel = document.getElementById('settings-panel');

    // Sync current settings to UI before showing
    const textSpeedSelect = document.getElementById('text-speed') as HTMLSelectElement;
    const autoSaveCheckbox = document.getElementById('auto-save') as HTMLInputElement;
    if (textSpeedSelect) textSpeedSelect.value = settingsManager.getTextSpeed();
    if (autoSaveCheckbox) autoSaveCheckbox.checked = settingsManager.getAutoSave();

    // Show/hide "Return to Menu" based on whether we're in-game
    const returnMenuButton = document.querySelector('[data-action="return-menu"]') as HTMLElement;
    if (returnMenuButton) {
      returnMenuButton.style.display = this.inGame ? 'block' : 'none';
    }

    mainMenu?.classList.add('hidden');
    settingsPanel?.classList.remove('hidden');
  }

  private closeSettings(): void {
    const mainMenu = document.getElementById('main-menu');
    const settingsPanel = document.getElementById('settings-panel');

    settingsPanel?.classList.add('hidden');

    // Only show main menu if we're not in-game
    if (!this.inGame) {
      mainMenu?.classList.remove('hidden');
    }
  }

  private returnToMenu(): void {
    // Stop game systems
    attackScheduler.reset();
    this.inGame = false;

    // Clean up event listeners to prevent memory leaks
    this.cleanupEventListeners();

    // Reset to menu
    const settingsPanel = document.getElementById('settings-panel');
    const mainMenu = document.getElementById('main-menu');

    settingsPanel?.classList.add('hidden');
    mainMenu?.classList.remove('hidden');

    // Go back to menu scene
    sceneManager.goToScene('menu', false);

    // Re-setup event listeners for fresh state
    this.setupEventListeners();
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
    // Clear maintenance UI if player is in maintenance when emergency triggers
    if (maintenanceSystem.isActive()) {
      maintenanceSystem.finishTask(false); // false = don't navigate away
    }

    shiftSystem.triggerEmergency();

    // Play alert sound
    audioManager.playUISound('alert');

    // Select a random emergency type
    const emergencyDialogue = this.getRandomEmergencyDialogue();

    dialogueSystem.startDialogue(emergencyDialogue, () => {
      // After dialogue, go to emergency maintenance
      sceneManager.goToScene('the-wound');
    });
  }

  private getRandomEmergencyDialogue(): import('@/types').DialogueScript {
    type DialogueScript = import('@/types').DialogueScript;
    const emergencyTypes: DialogueScript[] = [
      // Type 1: Hull breach (classic)
      {
        id: 'emergency-hull-breach',
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
            speaker: 'orrin' as const,
            text: "[over comms] Breach in Section 14. Hull integrity failing. I need backup—now.",
            choices: [
              { text: 'On my way.', next: 'respond' },
              { text: "I'll finish here first.", next: 'delay' },
            ],
          },
          respond: {
            speaker: 'keth' as const,
            text: '[over comms] Go. Both of you. Everyone else, brace and hold position.',
            next: 'end',
          },
          delay: {
            speaker: 'orrin' as const,
            text: "There is no 'here first.' Atmosphere is venting. Move.",
            next: 'end',
          },
          end: {
            text: 'The structure groans around you. Time to move.',
          },
        },
      },
      // Type 2: Impact tremor
      {
        id: 'emergency-impact',
        startNode: 'start',
        nodes: {
          start: {
            text: 'Without warning, the floor lurches beneath you. Something has struck the structure—hard.',
            next: 'lights',
          },
          lights: {
            text: 'The lights flicker. Emergency strobes activate, painting everything in amber pulses.',
            next: 'keth',
          },
          keth: {
            speaker: 'keth' as const,
            text: "[over comms] All crew, report. We've taken a direct hit.",
            next: 'orrin',
          },
          orrin: {
            speaker: 'orrin' as const,
            text: "[over comms] Already moving. Section 14 is compromised. Sending coordinates.",
            choices: [
              { text: 'Heading there now.', next: 'respond' },
              { text: "What's our status?", next: 'status' },
            ],
          },
          respond: {
            speaker: 'orrin' as const,
            text: "Good. Move fast—I can hear venting from here.",
            next: 'end',
          },
          status: {
            speaker: 'keth' as const,
            text: "Status is 'move your feet.' Questions later, patch the hull now.",
            next: 'end',
          },
          end: {
            text: 'Another tremor ripples through the structure. No time to waste.',
          },
        },
      },
      // Type 3: Cascade failure
      {
        id: 'emergency-cascade',
        startNode: 'start',
        nodes: {
          start: {
            text: 'The lights die. For a moment, there is perfect darkness—then emergency power kicks in, red and dim.',
            next: 'vell',
          },
          vell: {
            speaker: 'vell' as const,
            text: "[over comms] We've got cascading failures in the outer sections. Something triggered a chain reaction.",
            next: 'dauro',
          },
          dauro: {
            speaker: 'dauro' as const,
            text: "[over comms] Pressure's dropping in the secondary loop. This is bad.",
            next: 'orrin',
          },
          orrin: {
            speaker: 'orrin' as const,
            text: "[over comms] I need help in Section 14. Whatever hit us opened something that shouldn't be open.",
            choices: [
              { text: "I'm on it.", next: 'respond' },
              { text: "This feels different from usual.", next: 'different' },
            ],
          },
          respond: {
            speaker: 'keth' as const,
            text: "[over comms] Everyone else, stabilize what you can. We've weathered worse.",
            next: 'end',
          },
          different: {
            speaker: 'vell' as const,
            text: "It is different. The attack pattern... never mind. Seal the breach first. Questions later.",
            next: 'end',
          },
          end: {
            text: 'In the red emergency lighting, the corridors look like veins. Time to move.',
          },
        },
      },
      // Type 4: Silent strike
      {
        id: 'emergency-silent',
        startNode: 'start',
        nodes: {
          start: {
            text: 'There is no warning this time. No tremor, no alarm. Just a sudden change in air pressure that makes your ears pop.',
            next: 'realization',
          },
          realization: {
            text: 'Then the alarms catch up—shrieking into life as if startled by their own delay.',
            next: 'solenne',
          },
          solenne: {
            speaker: 'solenne' as const,
            text: "[over comms] The moss knew. It started curling before—it doesn't matter. Something's wrong in Section 14.",
            next: 'orrin',
          },
          orrin: {
            speaker: 'orrin' as const,
            text: "[over comms] They got through without us feeling it. New tactic. Breach is small but growing. Move.",
            choices: [
              { text: 'How did they get past the sensors?', next: 'sensors' },
              { text: "I'm coming.", next: 'respond' },
            ],
          },
          sensors: {
            speaker: 'vell' as const,
            text: "Don't know. Don't care right now. Seal first, analyze later.",
            next: 'end',
          },
          respond: {
            speaker: 'orrin' as const,
            text: 'Fast as you can. This one feels wrong.',
            next: 'end',
          },
          end: {
            text: 'The silence before the alarms lingers in your mind. Something has changed.',
          },
        },
      },
    ];

    // Pick a random emergency type
    const index = Math.floor(Math.random() * emergencyTypes.length);
    return emergencyTypes[index];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const game = new Game();

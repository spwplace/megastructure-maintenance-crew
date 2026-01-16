import { sceneManager } from '@/systems/SceneManager';
import { dialogueSystem } from '@/systems/DialogueSystem';
import { stateManager } from '@/core/StateManager';
import { uiManager } from '@/ui/UIManager';
import { eventBus } from '@/core/EventBus';
import { introScenes, introDialogue } from '@/data/scenes/intro';

/**
 * Main game controller
 */
export class Game {
  private initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    console.log('Initializing Megastructure Maintenance Crew...');

    // Show loading
    uiManager.showLoading('Initializing systems...');
    uiManager.setLoadingProgress(10);

    // Register scenes
    sceneManager.registerScenes(introScenes);
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

    // Go to menu or restore state
    await sceneManager.goToScene('menu', false);

    this.initialized = true;
    console.log('Game initialized');
  }

  private setupEventListeners(): void {
    // Log scene changes
    eventBus.on('scene:enter', (event) => {
      console.log('Entered scene:', event.payload);
    });

    // Handle dialogue completion
    eventBus.on('dialogue:end', () => {
      // Auto-save after dialogue
      stateManager.save();
    });

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (dialogueSystem.isActive()) {
          dialogueSystem.skipTypewriter();
        }
      }
    });
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

    // Start intro
    await sceneManager.goToScene('intro');

    // After intro scene's dialogue, we need to start the actual dialogue
    dialogueSystem.startDialogue(introDialogue, () => {
      // After dialogue ends, go to navigation
      sceneManager.goToScene('sector-7-entrance');
    });
  }

  async continueGame(): Promise<void> {
    console.log('Continuing game...');

    const loaded = stateManager.load();
    if (loaded) {
      const currentScene = stateManager.getCurrentScene();
      await sceneManager.goToScene(currentScene);
    } else {
      // Fall back to new game if load fails
      await this.startNewGame();
    }
  }

  openSettings(): void {
    console.log('Settings not yet implemented');
    // TODO: Implement settings menu
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const game = new Game();

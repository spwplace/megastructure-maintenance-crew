import type { Scene, SceneId } from '@/types';
import { uiManager } from '@/ui/UIManager';
import { stateManager } from '@/core/StateManager';
import { eventBus } from '@/core/EventBus';
import { dialogueSystem } from './DialogueSystem';

/**
 * Manages scene loading, transitions, and state
 */
export class SceneManager {
  private scenes: Map<SceneId, Scene> = new Map();
  private currentScene: Scene | null = null;
  private transitioning: boolean = false;

  registerScene(scene: Scene): void {
    this.scenes.set(scene.id, scene);
  }

  registerScenes(scenes: Scene[]): void {
    scenes.forEach((scene) => this.registerScene(scene));
  }

  getScene(id: SceneId): Scene | undefined {
    return this.scenes.get(id);
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  async goToScene(sceneId: SceneId, transition: boolean = true): Promise<void> {
    if (this.transitioning) {
      console.warn('Scene transition already in progress');
      return;
    }

    const scene = this.scenes.get(sceneId);
    if (!scene) {
      console.error(`Scene "${sceneId}" not found`);
      return;
    }

    this.transitioning = true;

    // Exit current scene
    if (this.currentScene) {
      eventBus.emit('scene:exit', { sceneId: this.currentScene.id });
      this.currentScene.onExit?.();
    }

    // Transition effect
    if (transition && this.currentScene) {
      await uiManager.fadeTransition(400);
    }

    // Enter new scene
    this.currentScene = scene;
    stateManager.setCurrentScene(sceneId);
    eventBus.emit('scene:enter', { sceneId });

    // Set up scene visuals
    this.setupSceneVisuals(scene);

    // Handle scene-specific logic
    await this.handleSceneType(scene);

    scene.onEnter?.();
    this.transitioning = false;
  }

  private setupSceneVisuals(scene: Scene): void {
    // Background
    if (scene.background) {
      uiManager.setBackground(scene.background);
    } else {
      uiManager.setBackground(null);
    }

    // Characters
    if (scene.characters && scene.characters.length > 0) {
      uiManager.setCharacters(
        scene.characters.map((c) => ({
          portrait: c.portrait,
          position: c.position,
          state: c.state,
        }))
      );
    } else {
      uiManager.clearCharacters();
    }
  }

  private async handleSceneType(scene: Scene): Promise<void> {
    // Clear previous UI state
    uiManager.hideDialogue();
    uiManager.hideTerminal();
    uiManager.clearNavigationHotspots();
    uiManager.hideMainMenu();

    switch (scene.type) {
      case 'menu':
        uiManager.showMainMenu();
        break;

      case 'dialogue':
        if (scene.dialogue) {
          // Build a simple script from the dialogue node
          const script = {
            id: `scene-${scene.id}`,
            nodes: { start: scene.dialogue },
            startNode: 'start',
          };
          await dialogueSystem.startDialogue(script);
        }
        break;

      case 'navigation':
        if (scene.navigation) {
          const hotspots = scene.navigation.hotspots
            .filter((h) => !h.condition || h.condition())
            .map((h) => ({
              x: h.x,
              y: h.y,
              label: h.label,
              callback: () => this.goToScene(h.targetScene),
            }));
          uiManager.setNavigationHotspots(hotspots);
        }
        break;

      case 'maintenance':
        if (scene.maintenance) {
          const status = scene.maintenance.status;
          const terminalContent = `
            <div class="terminal-line">System: ${status.name}</div>
            <div class="terminal-line">Health: ${status.health}%</div>
            ${status.warnings.map((w) => `<div class="terminal-line terminal-warning">! ${w}</div>`).join('')}
            ${status.critical ? '<div class="terminal-line terminal-error">CRITICAL</div>' : ''}
          `;
          uiManager.showTerminal('SYSTEM STATUS', terminalContent);
        }
        break;
    }
  }

  isTransitioning(): boolean {
    return this.transitioning;
  }
}

export const sceneManager = new SceneManager();

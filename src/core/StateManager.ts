import type { GameState, CharacterId, SaveData, ShiftPhase } from '@/types';
import { eventBus } from './EventBus';

const SAVE_KEY = 'mmc-save';
const SAVE_VERSION = 1;

function createInitialState(): GameState {
  return {
    currentScene: 'menu',
    visitedScenes: new Set(),
    relationships: {
      keth: 0,
      solenne: 0,
      dauro: 0,
      vell: 0,
      orrin: 0,
      player: 0,
    },
    flags: {},
    systemStatuses: {},
    shift: 1,
    shiftPhase: 'briefing',
    shiftTasksCompleted: [],
    rumors: [],
  };
}

/**
 * Manages game state with persistence
 */
export class StateManager {
  private state: GameState;

  constructor() {
    this.state = createInitialState();
  }

  getState(): Readonly<GameState> {
    return this.state;
  }

  getCurrentScene(): string {
    return this.state.currentScene;
  }

  setCurrentScene(sceneId: string): void {
    const previousScene = this.state.currentScene;
    this.state.currentScene = sceneId;
    this.state.visitedScenes.add(sceneId);
    eventBus.emit('state:change', { previousScene, currentScene: sceneId });
  }

  hasVisited(sceneId: string): boolean {
    return this.state.visitedScenes.has(sceneId);
  }

  // --- Relationships ---
  getRelationship(characterId: CharacterId): number {
    return this.state.relationships[characterId] ?? 0;
  }

  modifyRelationship(characterId: CharacterId, delta: number): void {
    if (characterId in this.state.relationships) {
      this.state.relationships[characterId] += delta;
      eventBus.emit('state:change', { relationship: { characterId, delta } });
    }
  }

  // --- Flags ---
  setFlag(key: string, value: boolean = true): void {
    this.state.flags[key] = value;
    eventBus.emit('state:change', { flag: { key, value } });
  }

  getFlag(key: string): boolean {
    return this.state.flags[key] ?? false;
  }

  // --- Rumors ---
  addRumor(rumor: string): void {
    if (!this.state.rumors.includes(rumor)) {
      this.state.rumors.push(rumor);
    }
  }

  getRumors(): readonly string[] {
    return this.state.rumors;
  }

  // --- System Status ---
  setSystemStatus(systemId: string, status: import('@/types').SystemStatus): void {
    this.state.systemStatuses[systemId] = { ...status };
    eventBus.emit('state:change', { systemStatus: { systemId, health: status.health } });
  }

  getSystemStatus(systemId: string): import('@/types').SystemStatus | undefined {
    return this.state.systemStatuses[systemId];
  }

  // --- Shift Management ---
  advanceShift(): void {
    this.state.shift += 1;
    eventBus.emit('state:change', { shift: this.state.shift });
  }

  getShift(): number {
    return this.state.shift;
  }

  setShiftPhase(phase: ShiftPhase): void {
    this.state.shiftPhase = phase;
    eventBus.emit('state:change', { shiftPhase: phase });
  }

  getShiftPhase(): ShiftPhase {
    return this.state.shiftPhase;
  }

  setShiftTasksCompleted(tasks: string[]): void {
    this.state.shiftTasksCompleted = [...tasks];
    eventBus.emit('state:change', { shiftTasksCompleted: tasks });
  }

  getShiftTasksCompleted(): string[] {
    return [...this.state.shiftTasksCompleted];
  }

  // --- Persistence ---
  save(): boolean {
    try {
      const saveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        state: {
          ...this.state,
          visitedScenes: new Set(this.state.visitedScenes),
        },
      };

      // Convert Set to Array for JSON serialization
      const serializable = {
        ...saveData,
        state: {
          ...saveData.state,
          visitedScenes: Array.from(saveData.state.visitedScenes),
        },
      };

      localStorage.setItem(SAVE_KEY, JSON.stringify(serializable));
      eventBus.emit('save:complete', { timestamp: saveData.timestamp });
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  load(): boolean {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (!saved) return false;

      const data = JSON.parse(saved);
      if (data.version !== SAVE_VERSION) {
        console.warn('Save version mismatch, starting fresh');
        return false;
      }

      this.state = {
        ...data.state,
        visitedScenes: new Set(data.state.visitedScenes),
        // Provide defaults for fields that may not exist in older saves
        shiftPhase: data.state.shiftPhase ?? 'briefing',
        shiftTasksCompleted: data.state.shiftTasksCompleted ?? [],
      };
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }

  hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  clearSave(): void {
    localStorage.removeItem(SAVE_KEY);
  }

  reset(): void {
    this.state = createInitialState();
  }
}

export const stateManager = new StateManager();

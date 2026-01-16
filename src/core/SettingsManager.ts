import type { TextSpeed, GameSettings } from '@/types';
import { eventBus } from './EventBus';

const SETTINGS_KEY = 'mmc-settings';

const TEXT_SPEED_MS: Record<TextSpeed, number> = {
  fast: 15,
  normal: 30,
  slow: 50,
};

function createDefaultSettings(): GameSettings {
  return {
    textSpeed: 'normal',
    autoSave: true,
  };
}

/**
 * Manages game settings with persistence
 */
export class SettingsManager {
  private settings: GameSettings;

  constructor() {
    this.settings = this.load() || createDefaultSettings();
  }

  getSettings(): Readonly<GameSettings> {
    return this.settings;
  }

  getTextSpeed(): TextSpeed {
    return this.settings.textSpeed;
  }

  getTextSpeedMs(): number {
    return TEXT_SPEED_MS[this.settings.textSpeed];
  }

  setTextSpeed(speed: TextSpeed): void {
    if (this.settings.textSpeed !== speed) {
      this.settings.textSpeed = speed;
      this.save();
      eventBus.emit('settings:change', { setting: 'textSpeed', value: speed });
    }
  }

  getAutoSave(): boolean {
    return this.settings.autoSave;
  }

  setAutoSave(enabled: boolean): void {
    if (this.settings.autoSave !== enabled) {
      this.settings.autoSave = enabled;
      this.save();
      eventBus.emit('settings:change', { setting: 'autoSave', value: enabled });
    }
  }

  private save(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  private load(): GameSettings | null {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (!saved) return null;
      return JSON.parse(saved) as GameSettings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }
}

export const settingsManager = new SettingsManager();

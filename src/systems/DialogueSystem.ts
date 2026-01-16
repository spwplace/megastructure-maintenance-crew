import type { DialogueNode, DialogueScript, DialogueChoice, CharacterId } from '@/types';
import { uiManager } from '@/ui/UIManager';
import { eventBus } from '@/core/EventBus';
import { characters } from '@/data/characters';
import { settingsManager } from '@/core/SettingsManager';
import { createPlaceholderPortrait } from '@/ui/PlaceholderArt';

/**
 * Handles dialogue playback with typewriter effect and choices
 */
export class DialogueSystem {
  private currentScript: DialogueScript | null = null;
  private currentNode: DialogueNode | null = null;
  private isTyping: boolean = false;
  private typewriterTimeout: number | null = null;
  private onComplete: (() => void) | null = null;

  // Typewriter settings
  private skipRequested: boolean = false;

  async startDialogue(script: DialogueScript, onComplete?: () => void): Promise<void> {
    this.currentScript = script;
    this.onComplete = onComplete ?? null;

    eventBus.emit('dialogue:start', { scriptId: script.id });

    const startNode = script.nodes[script.startNode];
    if (startNode) {
      await this.showNode(startNode);
    } else {
      console.error(`Start node "${script.startNode}" not found in script`);
      this.endDialogue();
    }
  }

  private async showNode(node: DialogueNode): Promise<void> {
    this.currentNode = node;
    node.onShow?.();

    const speakerName = this.getSpeakerName(node.speaker);
    const speakerColor = this.getSpeakerColor(node.speaker);

    // Show character portrait if there's a speaker
    this.showCharacterPortrait(node.speaker);

    // Show dialogue container with speaker
    uiManager.showDialogue(speakerName, '', speakerColor);

    // Typewriter effect
    await this.typeText(node.text);

    // Show choices or wait for tap to continue
    if (node.choices && node.choices.length > 0) {
      this.showChoices(node.choices);
    } else if (node.next) {
      this.waitForContinue(() => {
        const nextNode = this.currentScript?.nodes[node.next!];
        if (nextNode) {
          this.showNode(nextNode);
        } else {
          this.endDialogue();
        }
      });
    } else {
      this.waitForContinue(() => this.endDialogue());
    }
  }

  private getSpeakerName(speakerId?: CharacterId): string | null {
    if (!speakerId || speakerId === 'player') return null;
    return characters[speakerId]?.name ?? speakerId;
  }

  private getSpeakerColor(speakerId?: CharacterId): string | null {
    if (!speakerId || speakerId === 'player') return null;
    return characters[speakerId]?.color ?? null;
  }

  private showCharacterPortrait(speakerId?: CharacterId): void {
    const characterLayer = document.getElementById('character-layer');
    if (!characterLayer) return;

    // Clear existing portraits
    characterLayer.innerHTML = '';

    // Don't show portrait for narrator or player
    if (!speakerId || speakerId === 'player') return;

    // Create and show placeholder portrait
    const portrait = createPlaceholderPortrait(speakerId, true);
    portrait.classList.add('fade-in');
    characterLayer.appendChild(portrait);
  }

  private hideCharacterPortrait(): void {
    const characterLayer = document.getElementById('character-layer');
    if (characterLayer) {
      characterLayer.innerHTML = '';
    }
  }

  private async typeText(text: string): Promise<void> {
    this.isTyping = true;
    this.skipRequested = false;

    const textEl = document.getElementById('dialogue-text');
    if (!textEl) return;

    textEl.textContent = '';
    const charDelay = settingsManager.getTextSpeedMs();

    for (let i = 0; i < text.length; i++) {
      if (this.skipRequested) {
        textEl.textContent = text;
        break;
      }

      textEl.textContent += text[i];

      await new Promise<void>((resolve) => {
        this.typewriterTimeout = window.setTimeout(resolve, charDelay);
      });
    }

    this.isTyping = false;
    this.typewriterTimeout = null;
  }

  skipTypewriter(): void {
    if (this.isTyping) {
      this.skipRequested = true;
      if (this.typewriterTimeout !== null) {
        clearTimeout(this.typewriterTimeout);
      }
    }
  }

  private showChoices(choices: DialogueChoice[]): void {
    const validChoices = choices.filter(
      (choice) => !choice.condition || choice.condition()
    );

    const choiceButtons = validChoices.map((choice) => ({
      text: choice.text,
      callback: () => {
        eventBus.emit('dialogue:choice', { choice: choice.text });
        choice.onSelect?.();
        uiManager.clearDialogueChoices();

        const nextNode = this.currentScript?.nodes[choice.next];
        if (nextNode) {
          this.showNode(nextNode);
        } else {
          this.endDialogue();
        }
      },
    }));

    uiManager.setDialogueChoices(choiceButtons);
  }

  private continueHandler: (() => void) | null = null;

  private waitForContinue(callback: () => void): void {
    const dialogueContainer = document.getElementById('dialogue-container');
    if (!dialogueContainer) return;

    // Remove any existing handler first
    if (this.continueHandler) {
      dialogueContainer.removeEventListener('click', this.continueHandler);
    }

    this.continueHandler = () => {
      if (this.isTyping) {
        this.skipTypewriter();
      } else {
        dialogueContainer.removeEventListener('click', this.continueHandler!);
        this.continueHandler = null;
        callback();
      }
    };

    dialogueContainer.addEventListener('click', this.continueHandler);
  }

  private endDialogue(): void {
    // Clean up any pending click handler
    if (this.continueHandler) {
      const dialogueContainer = document.getElementById('dialogue-container');
      dialogueContainer?.removeEventListener('click', this.continueHandler);
      this.continueHandler = null;
    }

    this.currentScript = null;
    this.currentNode = null;
    uiManager.hideDialogue();
    this.hideCharacterPortrait();

    eventBus.emit('dialogue:end', {});
    this.onComplete?.();
    this.onComplete = null;
  }

  isActive(): boolean {
    return this.currentScript !== null;
  }
}

export const dialogueSystem = new DialogueSystem();

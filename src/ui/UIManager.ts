import type { DreamlogicClue, DreamlogicClueType } from '@/types';

/**
 * Icon mapping for dreamscape clue types
 */
const CLUE_ICONS: Record<DreamlogicClueType, string> = {
  sound: '♪',
  wear: '◈',
  graffiti: '✎',
  feeling: '◇',
  memory: '◉',
};

/**
 * Manages DOM interactions and UI state
 */
export class UIManager {
  private elements: Map<string, HTMLElement> = new Map();

  constructor() {
    this.cacheElements();
  }

  private cacheElements(): void {
    const ids = [
      'game',
      'scene-layer',
      'character-layer',
      'ui-layer',
      'overlay-layer',
      'dialogue-container',
      'speaker-name',
      'dialogue-text',
      'dialogue-choices',
      'terminal-container',
      'terminal-header',
      'terminal-content',
      'nav-indicators',
      'main-menu',
      'loading-screen',
    ];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        this.elements.set(id, el);
      } else {
        console.warn(`Element #${id} not found`);
      }
    });
  }

  get(id: string): HTMLElement | undefined {
    return this.elements.get(id);
  }

  // --- Visibility ---
  show(id: string): void {
    this.elements.get(id)?.classList.remove('hidden');
  }

  hide(id: string): void {
    this.elements.get(id)?.classList.add('hidden');
  }

  toggle(id: string, visible: boolean): void {
    if (visible) {
      this.show(id);
    } else {
      this.hide(id);
    }
  }

  // --- Scene Layer ---
  setBackground(imageUrl: string | null): void {
    const sceneLayer = this.elements.get('scene-layer');
    if (!sceneLayer) return;

    sceneLayer.innerHTML = '';

    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.className = 'scene-bg';
      img.alt = '';
      sceneLayer.appendChild(img);
    }
  }

  // --- Character Layer ---
  setCharacters(characters: Array<{ portrait: string; position?: string; state?: string }>): void {
    const characterLayer = this.elements.get('character-layer');
    if (!characterLayer) return;

    characterLayer.innerHTML = '';

    characters.forEach((char) => {
      const img = document.createElement('img');
      img.src = char.portrait;
      img.className = 'character-portrait';
      if (char.state) {
        img.classList.add(char.state);
      }
      img.alt = '';
      characterLayer.appendChild(img);
    });
  }

  clearCharacters(): void {
    const characterLayer = this.elements.get('character-layer');
    if (characterLayer) {
      characterLayer.innerHTML = '';
    }
  }

  // --- Dialogue ---
  showDialogue(speaker: string | null, text: string, speakerColor?: string | null): void {
    const container = this.elements.get('dialogue-container');
    const nameEl = this.elements.get('speaker-name');
    const textEl = this.elements.get('dialogue-text');

    if (!container || !nameEl || !textEl) return;

    nameEl.textContent = speaker ?? '';
    // Apply character-specific color
    if (speakerColor) {
      nameEl.style.color = speakerColor;
    } else {
      nameEl.style.color = '';
    }
    textEl.textContent = text;
    container.classList.remove('hidden');
  }

  setDialogueChoices(
    choices: Array<{ text: string; callback: () => void }>
  ): void {
    const choicesEl = this.elements.get('dialogue-choices');
    if (!choicesEl) return;

    choicesEl.innerHTML = '';

    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'dialogue-choice';
      // Add number prefix for keyboard navigation hint
      button.textContent = `${index + 1}. ${choice.text}`;
      button.setAttribute('tabindex', '0');
      button.addEventListener('click', choice.callback);
      choicesEl.appendChild(button);
    });

    // Focus first choice for keyboard navigation
    const firstChoice = choicesEl.querySelector('.dialogue-choice') as HTMLButtonElement;
    if (firstChoice) {
      setTimeout(() => firstChoice.focus(), 50);
    }
  }

  clearDialogueChoices(): void {
    const choicesEl = this.elements.get('dialogue-choices');
    if (choicesEl) {
      choicesEl.innerHTML = '';
    }
  }

  hideDialogue(): void {
    this.hide('dialogue-container');
    this.clearDialogueChoices();
  }

  // --- Terminal ---
  showTerminal(header: string, content: string): void {
    const container = this.elements.get('terminal-container');
    const headerEl = this.elements.get('terminal-header');
    const contentEl = this.elements.get('terminal-content');

    if (!container || !headerEl || !contentEl) return;

    headerEl.textContent = header;
    contentEl.innerHTML = content;
    container.classList.remove('hidden');
  }

  hideTerminal(): void {
    this.hide('terminal-container');
  }

  // --- Navigation ---
  setNavigationHotspots(
    hotspots: Array<{ x: number; y: number; callback: () => void; label?: string }>
  ): void {
    const container = this.elements.get('nav-indicators');
    if (!container) return;

    container.innerHTML = '';

    hotspots.forEach((hotspot) => {
      const marker = document.createElement('div');
      marker.className = 'hotspot-marker';
      marker.style.left = `${hotspot.x}%`;
      marker.style.top = `${hotspot.y}%`;

      const icon = document.createElement('div');
      icon.className = 'hotspot-icon';
      marker.appendChild(icon);

      if (hotspot.label) {
        const label = document.createElement('div');
        label.className = 'hotspot-label';
        label.textContent = hotspot.label;
        marker.appendChild(label);
      }

      marker.addEventListener('click', hotspot.callback);
      container.appendChild(marker);
    });
  }

  clearNavigationHotspots(): void {
    const container = this.elements.get('nav-indicators');
    if (container) {
      container.innerHTML = '';
    }
  }

  // --- Menu ---
  showMainMenu(): void {
    this.show('main-menu');
  }

  hideMainMenu(): void {
    this.hide('main-menu');
  }

  // --- Loading ---
  showLoading(text: string = 'Loading...'): void {
    const screen = this.elements.get('loading-screen');
    if (screen) {
      const textEl = screen.querySelector('.loading-text');
      if (textEl) textEl.textContent = text;
      screen.classList.remove('hidden');
    }
  }

  setLoadingProgress(percent: number): void {
    const fill = document.querySelector('.loading-fill') as HTMLElement;
    if (fill) {
      fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }
  }

  hideLoading(): void {
    this.hide('loading-screen');
  }

  // --- Transitions ---
  async fadeTransition(duration: number = 500): Promise<void> {
    const overlay = document.createElement('div');
    overlay.className = 'screen-transition';
    overlay.style.opacity = '0';
    document.getElementById('game')?.appendChild(overlay);

    // Fade in
    await this.animate(overlay, { opacity: '1' }, duration / 2);
    // Fade out
    await this.animate(overlay, { opacity: '0' }, duration / 2);

    overlay.remove();
  }

  private animate(
    element: HTMLElement,
    properties: Record<string, string>,
    duration: number
  ): Promise<void> {
    return new Promise((resolve) => {
      Object.assign(element.style, properties);
      element.style.transition = `all ${duration}ms ease-in-out`;
      setTimeout(resolve, duration);
    });
  }

  // --- Rumors Panel ---
  private rumorsPanel: HTMLElement | null = null;
  private rumorsButton: HTMLElement | null = null;

  showRumorsButton(rumors: readonly string[]): void {
    if (this.rumorsButton) return;

    const uiLayer = this.elements.get('ui-layer');
    if (!uiLayer) return;

    this.rumorsButton = document.createElement('button');
    this.rumorsButton.className = 'rumors-button';
    this.rumorsButton.innerHTML = `RUMORS <span class="count">${rumors.length}</span>`;
    this.rumorsButton.addEventListener('click', () => this.toggleRumorsPanel(rumors));
    uiLayer.appendChild(this.rumorsButton);
  }

  hideRumorsButton(): void {
    this.rumorsButton?.remove();
    this.rumorsButton = null;
    this.hideRumorsPanel();
  }

  private toggleRumorsPanel(rumors: readonly string[]): void {
    if (this.rumorsPanel) {
      this.hideRumorsPanel();
    } else {
      this.showRumorsPanel(rumors);
    }
  }

  private showRumorsPanel(rumors: readonly string[]): void {
    if (this.rumorsPanel) return;

    const uiLayer = this.elements.get('ui-layer');
    if (!uiLayer) return;

    this.rumorsPanel = document.createElement('div');
    this.rumorsPanel.id = 'rumors-panel';

    const header = document.createElement('div');
    header.className = 'rumors-header';
    header.innerHTML = `
      <span>Collected Rumors</span>
      <button class="rumors-close">&times;</button>
    `;
    this.rumorsPanel.appendChild(header);

    const list = document.createElement('div');
    list.className = 'rumors-list';

    if (rumors.length === 0) {
      list.innerHTML = '<div class="rumors-empty">No rumors collected yet. Talk to your crew.</div>';
    } else {
      rumors.forEach((rumor) => {
        const item = document.createElement('div');
        item.className = 'rumor-item';
        item.textContent = rumor;
        list.appendChild(item);
      });
    }

    this.rumorsPanel.appendChild(list);

    // Close button handler
    header.querySelector('.rumors-close')?.addEventListener('click', () => {
      this.hideRumorsPanel();
    });

    uiLayer.appendChild(this.rumorsPanel);
  }

  private hideRumorsPanel(): void {
    this.rumorsPanel?.remove();
    this.rumorsPanel = null;
  }

  // --- Downtime UI ---
  private downtimeBanner: HTMLElement | null = null;
  private crewGrid: HTMLElement | null = null;

  showDowntimeUI(
    crewMembers: Array<{ id: string; name: string; role: string; color: string }>,
    onCrewClick: (id: string) => void,
    onRestClick: () => void
  ): void {
    this.hideDowntimeUI(); // Clear any existing

    const uiLayer = this.elements.get('ui-layer');
    if (!uiLayer) return;

    // Downtime banner
    this.downtimeBanner = document.createElement('div');
    this.downtimeBanner.className = 'downtime-banner';
    this.downtimeBanner.innerHTML = `
      <h3>REST PERIOD</h3>
      <p>Talk to crew or rest to end shift</p>
    `;
    uiLayer.appendChild(this.downtimeBanner);

    // Crew grid
    this.crewGrid = document.createElement('div');
    this.crewGrid.className = 'crew-grid';

    // Add crew cards
    crewMembers.forEach((crew) => {
      const card = document.createElement('div');
      card.className = 'crew-card';
      card.style.color = crew.color;
      card.innerHTML = `
        <div class="crew-card-icon" style="border-color: ${crew.color}; color: ${crew.color};">
          ${crew.name.charAt(0)}
        </div>
        <div class="crew-card-name">${crew.name}</div>
        <div class="crew-card-role">${crew.role}</div>
      `;
      card.addEventListener('click', () => onCrewClick(crew.id));
      this.crewGrid!.appendChild(card);
    });

    // Rest card (spans full width)
    const restCard = document.createElement('div');
    restCard.className = 'crew-card rest-action';
    restCard.innerHTML = `
      <div class="crew-card-icon" style="border-color: var(--color-violet); font-size: 24px;">
        &bull;
      </div>
      <div>
        <div class="crew-card-name">REST & END SHIFT</div>
        <div class="crew-card-role">Begin next work cycle</div>
      </div>
    `;
    restCard.addEventListener('click', onRestClick);
    this.crewGrid.appendChild(restCard);

    uiLayer.appendChild(this.crewGrid);
  }

  hideDowntimeUI(): void {
    this.downtimeBanner?.remove();
    this.downtimeBanner = null;
    this.crewGrid?.remove();
    this.crewGrid = null;
  }

  // --- Phase Announcements ---
  showPhaseAnnouncement(title: string, subtitle: string): void {
    const gameEl = document.getElementById('game');
    if (!gameEl) return;

    const announcement = document.createElement('div');
    announcement.className = 'phase-announcement';
    announcement.innerHTML = `
      <h2>${title}</h2>
      <p>${subtitle}</p>
    `;
    gameEl.appendChild(announcement);

    // Auto-remove after animation
    setTimeout(() => announcement.remove(), 2000);
  }

  // --- Dreamscape Effects ---
  private dreamscapeClueElement: HTMLElement | null = null;

  /**
   * Add a transition effect class to the game container
   */
  addTransitionEffect(effectClass: string): void {
    const gameEl = document.getElementById('game');
    if (gameEl && effectClass) {
      gameEl.classList.add(effectClass);
    }
  }

  /**
   * Remove a transition effect class from the game container
   */
  removeTransitionEffect(effectClass: string): void {
    const gameEl = document.getElementById('game');
    if (gameEl && effectClass) {
      gameEl.classList.remove(effectClass);
    }
  }

  /**
   * Apply a CSS filter to the scene layer
   */
  setSceneFilter(filter: string): void {
    const sceneLayer = this.elements.get('scene-layer');
    if (sceneLayer) {
      sceneLayer.style.filter = filter;
      sceneLayer.style.transition = 'filter 800ms ease-out';
    }
  }

  /**
   * Clear the scene filter
   */
  clearSceneFilter(): void {
    const sceneLayer = this.elements.get('scene-layer');
    if (sceneLayer) {
      sceneLayer.style.filter = 'none';
    }
  }

  /**
   * Show a dreamscape environmental clue
   * Displayed above the dialogue box with fade in/hold/fade out
   */
  showDreamscapeClue(clue: DreamlogicClue): void {
    // Remove any existing clue
    this.hideDreamscapeClue();

    const uiLayer = this.elements.get('ui-layer');
    if (!uiLayer) return;

    this.dreamscapeClueElement = document.createElement('div');
    this.dreamscapeClueElement.className = `dreamscape-clue dreamscape-clue-${clue.type}`;
    this.dreamscapeClueElement.innerHTML = `
      <span class="dreamscape-clue-icon">${CLUE_ICONS[clue.type]}</span>
      <span class="dreamscape-clue-text">${clue.text}</span>
    `;
    uiLayer.appendChild(this.dreamscapeClueElement);

    // Auto-hide after animation (fade in 500ms, hold 2500ms, fade out 500ms)
    setTimeout(() => {
      if (this.dreamscapeClueElement) {
        this.dreamscapeClueElement.classList.add('fade-out');
        setTimeout(() => this.hideDreamscapeClue(), 500);
      }
    }, 3000);
  }

  /**
   * Hide the dreamscape clue
   */
  hideDreamscapeClue(): void {
    this.dreamscapeClueElement?.remove();
    this.dreamscapeClueElement = null;
  }
}

export const uiManager = new UIManager();

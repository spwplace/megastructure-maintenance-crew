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
  showDialogue(speaker: string | null, text: string): void {
    const container = this.elements.get('dialogue-container');
    const nameEl = this.elements.get('speaker-name');
    const textEl = this.elements.get('dialogue-text');

    if (!container || !nameEl || !textEl) return;

    nameEl.textContent = speaker ?? '';
    textEl.textContent = text;
    container.classList.remove('hidden');
  }

  setDialogueChoices(
    choices: Array<{ text: string; callback: () => void }>
  ): void {
    const choicesEl = this.elements.get('dialogue-choices');
    if (!choicesEl) return;

    choicesEl.innerHTML = '';

    choices.forEach((choice) => {
      const button = document.createElement('button');
      button.className = 'dialogue-choice';
      button.textContent = choice.text;
      button.addEventListener('click', choice.callback);
      choicesEl.appendChild(button);
    });
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
}

export const uiManager = new UIManager();

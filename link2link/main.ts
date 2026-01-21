import { GameState, DialogueNode, SaveData } from './types';
import { characters, characterList, link } from './characters';
import { scenes, endings } from './scenes';

// Character emoji representations
const characterEmojis: Record<string, string> = {
  link: '🧝',
  traveler: '🎒',
  merchant: '💰',
  stablehand: '🐴',
  fairy: '🧚',
  knight: '⚔️',
  chef: '🍳',
  narrator: '📖'
};

class DatingSimulator {
  private state: GameState;
  private currentDialogueNodes: DialogueNode[] = [];
  private isTyping = false;
  private typewriterTimeout: number | null = null;

  // DOM Elements
  private screens: Record<string, HTMLElement> = {};
  private dialogueBox!: HTMLElement;
  private dialogueText!: HTMLElement;
  private speakerName!: HTMLElement;
  private choicesContainer!: HTMLElement;
  private navigationMenu!: HTMLElement;
  private characterSprite!: HTMLElement;
  private backgroundLayer!: HTMLElement;
  private locationLabel!: HTMLElement;
  private affectionDisplay!: HTMLElement;
  private dayDisplay!: HTMLElement;
  private characterGrid!: HTMLElement;

  constructor() {
    this.state = this.createInitialState();
    this.initializeDOM();
    this.bindEvents();
    this.checkSaveData();
  }

  private createInitialState(): GameState {
    return {
      currentScene: 'hyrule-field',
      currentDialogue: null,
      dialogueIndex: 0,
      selectedCharacter: null,
      day: 1,
      affection: {
        link: 0  // Only tracking Link's affection now!
      },
      flags: {},
      seenDialogues: [],
      ending: null
    };
  }

  private initializeDOM() {
    // Screens
    this.screens = {
      title: document.getElementById('title-screen')!,
      game: document.getElementById('game-screen')!,
      characterSelect: document.getElementById('character-select')!,
      ending: document.getElementById('ending-screen')!,
      credits: document.getElementById('credits-screen')!
    };

    // Game elements
    this.dialogueBox = document.getElementById('dialogue-box')!;
    this.dialogueText = document.getElementById('dialogue-text')!;
    this.speakerName = document.getElementById('speaker-name')!;
    this.choicesContainer = document.getElementById('choices-container')!;
    this.navigationMenu = document.getElementById('navigation-menu')!;
    this.characterSprite = document.getElementById('character-sprite')!;
    this.backgroundLayer = document.getElementById('background-layer')!;
    this.locationLabel = document.getElementById('location-label')!;
    this.affectionDisplay = document.getElementById('affection-display')!;
    this.dayDisplay = document.getElementById('day-display')!;
    this.characterGrid = document.getElementById('character-grid')!;

    // Populate character grid (player personas)
    this.populateCharacterGrid();
  }

  private populateCharacterGrid() {
    this.characterGrid.innerHTML = '';

    characterList.forEach(char => {
      const card = document.createElement('div');
      card.className = 'character-card';
      card.style.borderColor = char.color;
      card.innerHTML = `
        <div class="character-portrait" style="background: ${char.color}20; border: 2px solid ${char.color}">
          ${characterEmojis[char.id] || '❤️'}
        </div>
        <h3>${char.name}</h3>
        <div class="title">${char.title}</div>
        <div class="description" style="font-size: 0.7rem; color: #778DA9; margin-top: 5px;">${char.description}</div>
      `;
      card.addEventListener('click', () => this.selectCharacter(char.id));
      this.characterGrid.appendChild(card);
    });
  }

  private bindEvents() {
    // Title screen buttons
    document.getElementById('new-game-btn')!.addEventListener('click', () => this.startNewGame());
    document.getElementById('continue-btn')!.addEventListener('click', () => this.continueGame());
    document.getElementById('credits-btn')!.addEventListener('click', () => this.showCredits());

    // Character select
    document.getElementById('back-to-title')!.addEventListener('click', () => this.showScreen('title'));

    // Credits
    document.getElementById('credits-back-btn')!.addEventListener('click', () => this.showScreen('title'));

    // Ending
    document.getElementById('ending-return-btn')!.addEventListener('click', () => {
      this.state = this.createInitialState();
      this.showScreen('title');
    });

    // Dialogue box click to advance
    this.dialogueBox.addEventListener('click', () => this.advanceDialogue());
  }

  private checkSaveData() {
    const continueBtn = document.getElementById('continue-btn') as HTMLButtonElement;
    const saveData = localStorage.getItem('link2link-save');
    continueBtn.disabled = !saveData;
  }

  private showScreen(screenName: string) {
    Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
    this.screens[screenName].classList.add('active');
    this.screens[screenName].classList.add('screen-transition');
  }

  private startNewGame() {
    this.state = this.createInitialState();
    this.showScreen('characterSelect');
  }

  private selectCharacter(characterId: string) {
    this.state.selectedCharacter = characterId;
    this.startGame();
  }

  private startGame() {
    this.showScreen('game');
    this.loadScene(this.state.currentScene);
    this.updateStats();
  }

  private continueGame() {
    const saveData = localStorage.getItem('link2link-save');
    if (saveData) {
      const parsed: SaveData = JSON.parse(saveData);
      this.state = parsed.state;
      this.startGame();
    }
  }

  private saveGame() {
    const saveData: SaveData = {
      state: this.state,
      timestamp: Date.now()
    };
    localStorage.setItem('link2link-save', JSON.stringify(saveData));
  }

  private showCredits() {
    this.showScreen('credits');
  }

  private loadScene(sceneId: string) {
    if (sceneId === 'end-day') {
      this.endDay();
      return;
    }

    const scene = scenes[sceneId];
    if (!scene) {
      console.error(`Scene not found: ${sceneId}`);
      return;
    }

    this.state.currentScene = sceneId;

    // Update background
    this.backgroundLayer.className = scene.background;

    // Update location label
    this.locationLabel.textContent = scene.location;

    // Clear character and UI
    this.characterSprite.innerHTML = '';
    this.hideDialogue();
    this.hideChoices();
    this.hideNavigation();

    // Check if there's a character to interact with (Link!)
    const availableChar = scene.availableCharacters[0];
    if (availableChar && scene.dialogues[availableChar]) {
      this.showCharacter(availableChar);
      this.startCharacterDialogue(availableChar, scene.dialogues[availableChar]);
    } else {
      this.showNavigation(scene.navigationOptions);
    }

    this.saveGame();
  }

  private showCharacter(characterId: string) {
    if (characterId === 'link') {
      this.characterSprite.innerHTML = '🧝';
      this.characterSprite.style.color = link.color;
    } else {
      const char = characters[characterId];
      if (char) {
        this.characterSprite.innerHTML = characterEmojis[characterId] || '❤️';
        this.characterSprite.style.color = char.color;
      }
    }
  }

  private setCharacterEmotion(emotion: string) {
    this.characterSprite.className = '';
    if (emotion) {
      this.characterSprite.classList.add(`emotion-${emotion}`);
    }
  }

  private startCharacterDialogue(characterId: string, dialogues: DialogueNode[]) {
    const affection = this.state.affection.link || 0;
    const sceneKey = this.state.currentScene;

    // Determine which dialogue to show based on day and affection
    let startNode: DialogueNode | undefined;

    // Check for high affection route first
    if (affection >= 50 && !this.state.seenDialogues.includes(`${sceneKey}-high`)) {
      startNode = dialogues.find(d => d.id === 'link-high-start');
      if (startNode) {
        this.state.seenDialogues.push(`${sceneKey}-high`);
      }
    }

    // Otherwise check for day-based dialogues
    if (!startNode) {
      const d1Key = `${sceneKey}-d1`;
      if (!this.state.seenDialogues.includes(d1Key)) {
        startNode = dialogues.find(d => d.id === 'link-d1-start');
        if (startNode) {
          this.state.seenDialogues.push(d1Key);
        }
      } else {
        startNode = dialogues.find(d => d.id === 'link-d2-start');
      }
    }

    if (startNode) {
      this.currentDialogueNodes = dialogues;
      this.state.dialogueIndex = dialogues.indexOf(startNode);
      this.showDialogueNode(startNode);
    } else {
      // No dialogue available, show navigation
      const scene = scenes[this.state.currentScene];
      this.showNavigation(scene.navigationOptions);
    }
  }

  private showDialogueNode(node: DialogueNode) {
    this.showDialogue();
    this.hideChoices();

    // Set speaker
    if (node.speaker) {
      if (node.speaker === 'link') {
        this.speakerName.textContent = 'Link';
        this.speakerName.style.color = '#4CAF50';
      } else if (node.speaker === 'narrator') {
        this.speakerName.textContent = '';
      } else {
        const char = characters[node.speaker];
        if (char) {
          this.speakerName.textContent = char.name;
          this.speakerName.style.color = char.color;
        }
      }
    } else {
      this.speakerName.textContent = '';
    }

    // Set emotion
    if (node.emotion) {
      this.setCharacterEmotion(node.emotion);
    }

    // Typewriter effect
    this.typeText(node.text, () => {
      if (node.choices && node.choices.length > 0) {
        this.showChoicesForNode(node);
      }
    });
  }

  private typeText(text: string, onComplete: () => void) {
    this.isTyping = true;
    this.dialogueText.textContent = '';
    let index = 0;

    const type = () => {
      if (index < text.length) {
        this.dialogueText.textContent += text[index];
        index++;
        this.typewriterTimeout = window.setTimeout(type, 30);
      } else {
        this.isTyping = false;
        onComplete();
      }
    };

    type();
  }

  private skipTypewriter(text: string) {
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
    }
    this.dialogueText.textContent = text;
    this.isTyping = false;
  }

  private advanceDialogue() {
    const currentNode = this.currentDialogueNodes[this.state.dialogueIndex];

    if (!currentNode) return;

    // If still typing, complete the text
    if (this.isTyping) {
      this.skipTypewriter(currentNode.text);
      if (currentNode.choices && currentNode.choices.length > 0) {
        this.showChoicesForNode(currentNode);
      }
      return;
    }

    // If there are choices, don't advance (wait for choice)
    if (currentNode.choices && currentNode.choices.length > 0) {
      return;
    }

    // Handle action
    if (currentNode.action) {
      this.handleAction(currentNode.action);
      return;
    }

    // Go to next node
    if (currentNode.next) {
      const nextNode = this.currentDialogueNodes.find(n => n.id === currentNode.next);
      if (nextNode) {
        this.state.dialogueIndex = this.currentDialogueNodes.indexOf(nextNode);
        this.showDialogueNode(nextNode);
        return;
      }
    }

    // End of dialogue, show navigation
    this.hideDialogue();
    const scene = scenes[this.state.currentScene];
    this.showNavigation(scene.navigationOptions);
  }

  private showChoicesForNode(node: DialogueNode) {
    if (!node.choices) return;

    this.choicesContainer.innerHTML = '';
    this.showChoices();

    node.choices.forEach(choice => {
      if (choice.condition && !choice.condition()) return;

      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => this.selectChoice(choice));
      this.choicesContainer.appendChild(btn);
    });
  }

  private selectChoice(choice: { text: string; next: string; affectionChange?: number; flag?: string }) {
    // Apply affection change to Link
    if (choice.affectionChange) {
      this.state.affection.link = (this.state.affection.link || 0) + choice.affectionChange;
      this.updateStats();

      // Show affection change
      this.showAffectionChange(choice.affectionChange);
    }

    // Set flag
    if (choice.flag) {
      this.state.flags[choice.flag] = true;
    }

    this.hideChoices();

    // Go to next node
    const nextNode = this.currentDialogueNodes.find(n => n.id === choice.next);
    if (nextNode) {
      this.state.dialogueIndex = this.currentDialogueNodes.indexOf(nextNode);
      this.showDialogueNode(nextNode);
    }
  }

  private showAffectionChange(change: number) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      color: ${change > 0 ? '#E63946' : '#457B9D'};
      z-index: 100;
      animation: fadeUp 1s forwards;
      pointer-events: none;
    `;
    indicator.textContent = change > 0 ? `♥ +${change}` : `♥ ${change}`;
    document.body.appendChild(indicator);

    setTimeout(() => indicator.remove(), 1000);
  }

  private handleAction(action: { type: string; value: string | number | boolean; target?: string }) {
    switch (action.type) {
      case 'location':
        this.loadScene(action.value as string);
        break;
      case 'affection':
        this.state.affection.link = (this.state.affection.link || 0) + (action.value as number);
        this.updateStats();
        break;
      case 'flag':
        if (action.target) {
          this.state.flags[action.target] = action.value as boolean;
        }
        break;
      case 'ending':
        this.triggerEnding(action.value as string);
        break;
      case 'day':
        this.endDay();
        break;
    }
  }

  private showNavigation(options: Array<{ label: string; targetScene: string; condition?: () => boolean }>) {
    this.navigationMenu.innerHTML = '';
    this.navigationMenu.classList.add('active');

    options.forEach(opt => {
      if (opt.condition && !opt.condition()) return;

      const btn = document.createElement('button');
      btn.className = 'nav-btn';

      // Add icons based on destination
      let icon = '➤';
      if (opt.label.includes('Stable')) icon = '🐴';
      else if (opt.label.includes('Hot Spring')) icon = '♨️';
      else if (opt.label.includes('Cooking')) icon = '🍳';
      else if (opt.label.includes('Training')) icon = '⚔️';
      else if (opt.label.includes('Fairy')) icon = '🧚';
      else if (opt.label.includes('Camp')) icon = '🏕️';
      else if (opt.label.includes('Rest')) icon = '🌙';
      else if (opt.label.includes('Return')) icon = '↩️';

      btn.innerHTML = `<span class="icon">${icon}</span> ${opt.label}`;
      btn.addEventListener('click', () => {
        this.hideNavigation();
        this.loadScene(opt.targetScene);
      });
      this.navigationMenu.appendChild(btn);
    });
  }

  private endDay() {
    this.state.day++;
    // Reset seen dialogues for location-specific ones (so you can visit again)
    this.state.seenDialogues = this.state.seenDialogues.filter(d => d.includes('-high'));
    this.updateStats();

    // Check for ending conditions
    if (this.state.day > 7) {
      this.checkEndings();
      return;
    }

    // Show day transition
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 1s;
    `;
    overlay.innerHTML = `
      <div style="color: #FFD700; font-family: Georgia, serif; font-size: 2rem; margin-bottom: 20px;">Day ${this.state.day}</div>
      <div style="color: #778DA9; font-size: 1rem;">Where will you find Link today?</div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.animation = 'fadeOut 1s';
      setTimeout(() => {
        overlay.remove();
        this.loadScene('hyrule-field');
      }, 1000);
    }, 2000);
  }

  private checkEndings() {
    const linkAffection = this.state.affection.link || 0;

    if (linkAffection >= 50) {
      // Get a random ending based on most visited location, or default to camp
      const visitedLocations = this.state.seenDialogues
        .filter(d => d.includes('-high'))
        .map(d => d.replace('-high', ''));

      if (visitedLocations.length > 0) {
        this.triggerEnding(visitedLocations[visitedLocations.length - 1]);
      } else {
        this.triggerEnding('camp');
      }
    } else {
      this.triggerEnding('alone');
    }
  }

  private triggerEnding(endingId: string) {
    const ending = endings[endingId];
    if (!ending) {
      this.triggerEnding('alone');
      return;
    }

    this.state.ending = endingId;
    localStorage.removeItem('link2link-save');

    // Show ending screen
    const endingTitle = document.getElementById('ending-title')!;
    const endingCharacter = document.getElementById('ending-character')!;
    const endingText = document.getElementById('ending-text')!;

    endingTitle.textContent = ending.title;
    endingText.textContent = ending.text;

    if (ending.character === 'link') {
      endingCharacter.innerHTML = '🧝';
      endingCharacter.style.background = `${link.color}30`;
      endingCharacter.style.borderColor = link.color;
    } else {
      endingCharacter.innerHTML = '💔';
      endingCharacter.style.background = 'transparent';
      endingCharacter.style.borderColor = '#FFD700';
    }

    this.showScreen('ending');
  }

  private updateStats() {
    // Show Link's affection
    const linkAffection = this.state.affection.link || 0;
    this.affectionDisplay.textContent = linkAffection.toString();
    this.dayDisplay.textContent = this.state.day.toString();
  }

  private showDialogue() {
    this.dialogueBox.classList.add('active');
  }

  private hideDialogue() {
    this.dialogueBox.classList.remove('active');
  }

  private showChoices() {
    this.choicesContainer.classList.add('active');
  }

  private hideChoices() {
    this.choicesContainer.classList.remove('active');
    this.choicesContainer.innerHTML = '';
  }

  private hideNavigation() {
    this.navigationMenu.classList.remove('active');
    this.navigationMenu.innerHTML = '';
  }
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes fadeUp {
    from { opacity: 1; transform: translate(-50%, -50%); }
    to { opacity: 0; transform: translate(-50%, -100%); }
  }
`;
document.head.appendChild(style);

// Start the game
new DatingSimulator();

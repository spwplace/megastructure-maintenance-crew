import { GameState, DialogueNode, SaveData, Character } from './types';
import { characters, characterList } from './characters';
import { scenes, endings } from './scenes';

// Character emoji representations
const characterEmojis: Record<string, string> = {
  zelda: '👸',
  midna: '🌙',
  mipha: '🐟',
  malon: '🌾',
  riju: '⚔️',
  paya: '🌸',
  link: '🗡️'
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
      currentScene: 'castle-town',
      currentDialogue: null,
      dialogueIndex: 0,
      selectedCharacter: null,
      day: 1,
      affection: {
        zelda: 0,
        midna: 0,
        mipha: 0,
        malon: 0,
        riju: 0,
        paya: 0
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

    // Populate character grid
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

    // Check if there's a character to interact with
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
    const char = characters[characterId];
    if (char) {
      this.characterSprite.innerHTML = characterEmojis[characterId] || '❤️';
      this.characterSprite.style.color = char.color;
    }
  }

  private setCharacterEmotion(emotion: string) {
    this.characterSprite.className = '';
    if (emotion) {
      this.characterSprite.classList.add(`emotion-${emotion}`);
    }
  }

  private startCharacterDialogue(characterId: string, dialogues: DialogueNode[]) {
    const affection = this.state.affection[characterId] || 0;
    const dialogueKey = `${characterId}-${this.state.currentScene}-${this.state.day}`;

    // Determine which dialogue to show based on day and affection
    let startNode: DialogueNode | undefined;

    if (affection >= 50 && !this.state.seenDialogues.includes(`${characterId}-high`)) {
      // High affection route
      startNode = dialogues.find(d => d.id === `${characterId}-high-start`);
      if (startNode) {
        this.state.seenDialogues.push(`${characterId}-high`);
      }
    }

    if (!startNode) {
      if (this.state.day === 1 || !this.state.seenDialogues.includes(`${characterId}-d1`)) {
        startNode = dialogues.find(d => d.id === `${characterId}-d1-start`);
        if (startNode) {
          this.state.seenDialogues.push(`${characterId}-d1`);
        }
      } else {
        startNode = dialogues.find(d => d.id === `${characterId}-d2-start`);
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
      const char = characters[node.speaker];
      if (char) {
        this.speakerName.textContent = char.name;
        this.speakerName.style.color = char.color;
      } else if (node.speaker === 'link') {
        this.speakerName.textContent = 'Link';
        this.speakerName.style.color = '#4CAF50';
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
    // Apply affection change
    if (choice.affectionChange && this.state.selectedCharacter) {
      const scene = scenes[this.state.currentScene];
      const charId = scene.availableCharacters[0];
      if (charId) {
        this.state.affection[charId] = (this.state.affection[charId] || 0) + choice.affectionChange;
        this.updateStats();

        // Show affection change
        this.showAffectionChange(choice.affectionChange);
      }
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
        if (action.target) {
          this.state.affection[action.target] = (this.state.affection[action.target] || 0) + (action.value as number);
          this.updateStats();
        }
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
      if (opt.label.includes('Castle')) icon = '🏰';
      else if (opt.label.includes('Ranch')) icon = '🐴';
      else if (opt.label.includes('Zora')) icon = '🌊';
      else if (opt.label.includes('Twilight')) icon = '🌙';
      else if (opt.label.includes('Gerudo')) icon = '🏜️';
      else if (opt.label.includes('Kakariko')) icon = '🏘️';
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
      <div style="color: #778DA9; font-size: 1rem;">A new day in Hyrule...</div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.animation = 'fadeOut 1s';
      setTimeout(() => {
        overlay.remove();
        this.loadScene('castle-town');
      }, 1000);
    }, 2000);
  }

  private checkEndings() {
    // Find highest affection character
    let highestChar = '';
    let highestAffection = 0;

    Object.entries(this.state.affection).forEach(([char, aff]) => {
      if (aff > highestAffection) {
        highestAffection = aff;
        highestChar = char;
      }
    });

    if (highestAffection >= 50) {
      this.triggerEnding(highestChar);
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

    if (ending.character) {
      const char = characters[ending.character];
      endingCharacter.innerHTML = characterEmojis[ending.character] || '❤️';
      endingCharacter.style.background = char ? `${char.color}30` : 'transparent';
      endingCharacter.style.borderColor = char ? char.color : '#FFD700';
    } else {
      endingCharacter.innerHTML = '🗡️';
      endingCharacter.style.background = 'transparent';
    }

    this.showScreen('ending');
  }

  private updateStats() {
    // Show affection for currently selected character route
    const scene = scenes[this.state.currentScene];
    if (scene && scene.availableCharacters[0]) {
      const charAffection = this.state.affection[scene.availableCharacters[0]] || 0;
      this.affectionDisplay.textContent = charAffection.toString();
    } else if (this.state.selectedCharacter) {
      const charAffection = this.state.affection[this.state.selectedCharacter] || 0;
      this.affectionDisplay.textContent = charAffection.toString();
    }

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

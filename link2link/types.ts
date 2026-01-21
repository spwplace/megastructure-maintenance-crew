export interface Character {
  id: string;
  name: string;
  title: string;
  color: string;
  secondaryColor: string;
  description: string;
  personality: string[];
  likes: string[];
  dislikes: string[];
  sprite: CharacterSprite;
}

export interface CharacterSprite {
  base: string;
  happy: string;
  sad: string;
  angry: string;
  blush: string;
  surprised: string;
}

export interface DialogueNode {
  id: string;
  speaker: string | null;
  text: string;
  emotion?: string;
  choices?: DialogueChoice[];
  next?: string;
  action?: DialogueAction;
  condition?: () => boolean;
}

export interface DialogueChoice {
  text: string;
  next: string;
  affectionChange?: number;
  flag?: string;
  condition?: () => boolean;
}

export interface DialogueAction {
  type: 'affection' | 'flag' | 'location' | 'ending' | 'day';
  value: string | number | boolean;
  target?: string;
}

export interface Scene {
  id: string;
  location: string;
  background: string;
  availableCharacters: string[];
  dialogues: Record<string, DialogueNode[]>;
  navigationOptions: NavigationOption[];
}

export interface NavigationOption {
  label: string;
  targetScene: string;
  condition?: () => boolean;
}

export interface GameState {
  currentScene: string;
  currentDialogue: string | null;
  dialogueIndex: number;
  selectedCharacter: string | null;
  day: number;
  affection: Record<string, number>;
  flags: Record<string, boolean>;
  seenDialogues: string[];
  ending: string | null;
}

export interface SaveData {
  state: GameState;
  timestamp: number;
}

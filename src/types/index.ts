// ========================================
// Core Game Types
// ========================================

export type SceneId = string;
export type CharacterId = 'keth' | 'solenne' | 'dauro' | 'vell' | 'orrin' | 'player';
export type LocationId = string;

// --- Scene System ---
export interface Scene {
  id: SceneId;
  type: 'dialogue' | 'navigation' | 'maintenance' | 'menu';
  background?: string | null; // null = use placeholder
  characters?: CharacterPlacement[];
  dialogue?: DialogueNode;
  navigation?: NavigationData;
  maintenance?: MaintenanceData;
  onEnter?: () => void;
  onExit?: () => void;
}

export interface CharacterPlacement {
  characterId: CharacterId;
  portrait: string;
  position?: 'left' | 'center' | 'right';
  state?: 'speaking' | 'inactive' | 'normal';
}

// --- Dialogue System ---
export interface DialogueNode {
  speaker?: CharacterId;
  text: string;
  choices?: DialogueChoice[];
  next?: string | null;
  onShow?: () => void;
}

export interface DialogueChoice {
  text: string;
  next: string;
  condition?: () => boolean;
  onSelect?: () => void;
}

export interface DialogueScript {
  id: string;
  nodes: Record<string, DialogueNode>;
  startNode: string;
}

// --- Navigation System ---
export interface NavigationData {
  locationId: LocationId;
  hotspots: NavigationHotspot[];
}

export interface NavigationHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  targetScene: SceneId;
  label?: string;
  condition?: () => boolean;
}

// --- Maintenance System ---
export interface MaintenanceData {
  systemId: string;
  type: 'mechanical' | 'biological' | 'electrical' | 'emergency';
  status: SystemStatus;
  interactions: MaintenanceInteraction[];
}

export interface MaintenanceInteraction {
  id: string;
  label: string;
  action: () => void;
  condition?: () => boolean;
}

export interface SystemStatus {
  name: string;
  health: number; // 0-100
  warnings: string[];
  critical: boolean;
}

// --- Game State ---
export interface GameState {
  currentScene: SceneId;
  visitedScenes: Set<SceneId>;
  relationships: Record<CharacterId, number>;
  flags: Record<string, boolean>;
  systemStatuses: Record<string, SystemStatus>;
  shift: number;
  shiftPhase: ShiftPhase;
  shiftTasksCompleted: string[];
  rumors: string[];
}

// --- Events ---
export interface GameEvent {
  type: GameEventType;
  payload?: unknown;
}

export type EventHandler = (event: GameEvent) => void;

// --- Character Data ---
export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  portraits: Record<string, string>;
  color: string; // For name display
}

// --- Save Data ---
export interface SaveData {
  version: number;
  timestamp: number;
  state: GameState;
}

// --- Shift System ---
export type ShiftPhase = 'briefing' | 'work' | 'downtime' | 'emergency';

export interface ShiftState {
  number: number;
  phase: ShiftPhase;
  tasksCompleted: string[];
  emergencyActive: boolean;
}

// --- Location System ---
export interface Location {
  id: string;
  name: string;
  type: 'crew-quarters' | 'corridor' | 'work-site' | 'exterior' | 'restricted';
  connections: string[];
  description: string;
}

// --- Extended Event Types ---
export type GameEventType =
  | 'scene:enter'
  | 'scene:exit'
  | 'dialogue:start'
  | 'dialogue:choice'
  | 'dialogue:end'
  | 'dialogue:trigger'
  | 'navigation:move'
  | 'maintenance:interact'
  | 'state:change'
  | 'shift:advance'
  | 'shift:phase'
  | 'emergency:start'
  | 'emergency:end'
  | 'save:complete'
  | 'settings:change'
  | 'attack:scheduled';

// --- Settings Types ---
export type TextSpeed = 'fast' | 'normal' | 'slow';

export interface GameSettings {
  textSpeed: TextSpeed;
  autoSave: boolean;
}

import type {
  DreamscapeState,
  FamiliarityLevel,
  RouteData,
  TransitionConfig,
  DreamlogicClue,
} from '@/types';
import { dreamlogicClues } from '@/data/dreamlogicClues';

/**
 * Familiarity thresholds for route traversal counts
 */
const FAMILIARITY_THRESHOLDS: Record<FamiliarityLevel, number> = {
  unknown: 0,
  glimpsed: 1,
  walked: 3,
  familiar: 7,
  known: 15,
};

/**
 * Duration multipliers based on familiarity
 * Base duration is 400ms
 */
const DURATION_MULTIPLIERS: Record<FamiliarityLevel, number> = {
  unknown: 2.5,    // 1000ms
  glimpsed: 1.8,   // 720ms
  walked: 1.2,     // 480ms
  familiar: 0.9,   // 360ms
  known: 0.6,      // 240ms
};

/**
 * Visual effects for each familiarity level
 */
const EFFECT_CLASSES: Record<FamiliarityLevel, string> = {
  unknown: 'dreamscape-unknown',
  glimpsed: 'dreamscape-glimpsed',
  walked: 'dreamscape-walked',
  familiar: 'dreamscape-familiar',
  known: 'dreamscape-known',
};

/**
 * Scene filter CSS for each familiarity level
 */
const SCENE_FILTERS: Record<FamiliarityLevel, string> = {
  unknown: 'blur(2px) saturate(0.7)',
  glimpsed: 'blur(1px) saturate(0.85)',
  walked: 'saturate(0.95)',
  familiar: 'none',
  known: 'none',
};

const BASE_TRANSITION_DURATION = 400;

/**
 * Manages dreamscape navigation mechanics - route familiarity,
 * disorientation effects, and environmental clues
 */
export class DreamscapeSystem {
  private state: DreamscapeState = {
    routes: {},
    currentApproachDirection: null,
    urgencyLevel: 0.2, // Default low urgency
  };

  /**
   * Create a directional route key from two scene IDs
   */
  private getRouteKey(from: string, to: string): string {
    return `${from}->${to}`;
  }

  /**
   * Get or create route data for a specific route
   */
  private getRouteData(routeKey: string): RouteData {
    if (!this.state.routes[routeKey]) {
      this.state.routes[routeKey] = {
        traversals: 0,
        lastTraversed: 0,
        discoveredClues: [],
      };
    }
    return this.state.routes[routeKey];
  }

  /**
   * Calculate familiarity level based on traversal count
   */
  getFamiliarityLevel(routeKey: string): FamiliarityLevel {
    const data = this.getRouteData(routeKey);
    const traversals = data.traversals;

    if (traversals >= FAMILIARITY_THRESHOLDS.known) return 'known';
    if (traversals >= FAMILIARITY_THRESHOLDS.familiar) return 'familiar';
    if (traversals >= FAMILIARITY_THRESHOLDS.walked) return 'walked';
    if (traversals >= FAMILIARITY_THRESHOLDS.glimpsed) return 'glimpsed';
    return 'unknown';
  }

  /**
   * Get familiarity level for a route between two scenes
   */
  getRouteFamiliarity(from: string, to: string): FamiliarityLevel {
    return this.getFamiliarityLevel(this.getRouteKey(from, to));
  }

  /**
   * Prepare transition configuration before navigating
   * Call this before the transition starts
   */
  prepareTransition(from: string, to: string): TransitionConfig {
    const routeKey = this.getRouteKey(from, to);
    const familiarity = this.getFamiliarityLevel(routeKey);

    // Calculate duration with urgency modifier
    // Higher urgency makes routes feel longer (time dilation under stress)
    const urgencyModifier = 1 + (this.state.urgencyLevel * 0.5);
    let duration = BASE_TRANSITION_DURATION * DURATION_MULTIPLIERS[familiarity];
    duration = Math.round(duration * urgencyModifier);

    // Select an appropriate clue
    const clue = this.selectClue(routeKey, familiarity);

    // Store approach direction for environmental hints
    this.state.currentApproachDirection = routeKey;

    return {
      duration,
      effectClass: EFFECT_CLASSES[familiarity],
      sceneFilter: SCENE_FILTERS[familiarity],
      clue,
    };
  }

  /**
   * Record that a transition was completed
   * Call this after the transition finishes
   */
  recordTransition(from: string, to: string): void {
    const routeKey = this.getRouteKey(from, to);
    const data = this.getRouteData(routeKey);

    data.traversals += 1;
    data.lastTraversed = Date.now();
  }

  /**
   * Select an appropriate clue for the current transition
   */
  private selectClue(routeKey: string, familiarity: FamiliarityLevel): DreamlogicClue | null {
    const routeData = this.getRouteData(routeKey);
    const familiarityOrder: FamiliarityLevel[] = ['unknown', 'glimpsed', 'walked', 'familiar', 'known'];
    const currentIndex = familiarityOrder.indexOf(familiarity);

    // Filter clues that are:
    // 1. At or below current familiarity level
    // 2. Not already discovered on this route
    // 3. Either have no route restriction or match this route
    // 4. Pass any additional condition
    const eligibleClues = dreamlogicClues.filter((clue) => {
      const clueIndex = familiarityOrder.indexOf(clue.minFamiliarity);
      if (clueIndex > currentIndex) return false;
      if (routeData.discoveredClues.includes(clue.id)) return false;
      if (clue.routes && !clue.routes.includes(routeKey)) return false;
      if (clue.condition && !clue.condition()) return false;
      return true;
    });

    if (eligibleClues.length === 0) return null;

    // Prefer clues that match the current familiarity level exactly
    const exactMatches = eligibleClues.filter(
      (c) => c.minFamiliarity === familiarity
    );

    const pool = exactMatches.length > 0 ? exactMatches : eligibleClues;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    // Mark as discovered
    routeData.discoveredClues.push(selected.id);

    return selected;
  }

  /**
   * Set urgency level (0-1)
   * Higher urgency makes routes feel longer
   */
  setUrgencyLevel(level: number): void {
    this.state.urgencyLevel = Math.max(0, Math.min(1, level));
  }

  /**
   * Get current urgency level
   */
  getUrgencyLevel(): number {
    return this.state.urgencyLevel;
  }

  /**
   * Get current state for persistence
   */
  getState(): Readonly<DreamscapeState> {
    return this.state;
  }

  /**
   * Restore state from saved data
   */
  restoreState(savedState: DreamscapeState): void {
    this.state = {
      routes: { ...savedState.routes },
      currentApproachDirection: savedState.currentApproachDirection,
      urgencyLevel: savedState.urgencyLevel ?? 0.2,
    };
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.state = {
      routes: {},
      currentApproachDirection: null,
      urgencyLevel: 0.2,
    };
  }

  /**
   * Get statistics about route familiarity for debugging/UI
   */
  getRouteStats(): { total: number; byFamiliarity: Record<FamiliarityLevel, number> } {
    const stats: Record<FamiliarityLevel, number> = {
      unknown: 0,
      glimpsed: 0,
      walked: 0,
      familiar: 0,
      known: 0,
    };

    Object.keys(this.state.routes).forEach((routeKey) => {
      const level = this.getFamiliarityLevel(routeKey);
      stats[level]++;
    });

    return {
      total: Object.keys(this.state.routes).length,
      byFamiliarity: stats,
    };
  }
}

export const dreamscapeSystem = new DreamscapeSystem();

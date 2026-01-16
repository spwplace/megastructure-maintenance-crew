import type { GameEvent, GameEventType, EventHandler } from '@/types';

/**
 * Simple event bus for decoupled communication between game systems
 */
export class EventBus {
  private handlers: Map<GameEventType, Set<EventHandler>> = new Map();

  on(type: GameEventType, handler: EventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => this.off(type, handler);
  }

  off(type: GameEventType, handler: EventHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  emit(type: GameEventType, payload?: unknown): void {
    const event: GameEvent = { type, payload };
    this.handlers.get(type)?.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${type}:`, error);
      }
    });
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const eventBus = new EventBus();

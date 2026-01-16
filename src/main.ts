import { game } from './Game';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => game.init());
} else {
  game.init();
}

// Expose game instance for debugging
if (import.meta.env.DEV) {
  (window as unknown as { game: typeof game }).game = game;
}

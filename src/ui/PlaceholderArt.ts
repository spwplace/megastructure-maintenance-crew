/**
 * Procedural CSS-based placeholder art generator
 * Creates atmospheric visuals without requiring image assets
 */

export type LocationType =
  | 'crew-quarters'
  | 'corridor'
  | 'atmospheric-processing'
  | 'grow-deck'
  | 'fluid-systems'
  | 'electrical-hub'
  | 'the-wound'
  | 'hopper-yard'
  | 'fungal-depths'
  | 'menu';

interface PlaceholderConfig {
  baseColor: string;
  accentColor: string;
  pattern: string;
  overlays: string[];
  label: string;
}

const locationConfigs: Record<LocationType, PlaceholderConfig> = {
  'menu': {
    baseColor: 'var(--color-void)',
    accentColor: 'var(--color-deep-teal)',
    pattern: 'radial-gradient(ellipse at center, var(--color-deep-teal) 0%, var(--color-void) 70%)',
    overlays: [],
    label: '',
  },

  'crew-quarters': {
    baseColor: 'var(--color-deep-teal)',
    accentColor: 'var(--color-amber)',
    pattern: `
      linear-gradient(90deg, transparent 49%, var(--color-teal) 49%, var(--color-teal) 51%, transparent 51%),
      linear-gradient(0deg, transparent 49%, var(--color-teal) 49%, var(--color-teal) 51%, transparent 51%)
    `,
    overlays: [
      'radial-gradient(ellipse at 20% 30%, rgba(212, 162, 76, 0.3) 0%, transparent 30%)',
      'radial-gradient(ellipse at 80% 60%, rgba(212, 162, 76, 0.2) 0%, transparent 25%)',
    ],
    label: 'CREW QUARTERS - BLOCK C',
  },

  'corridor': {
    baseColor: 'var(--color-deep-teal)',
    accentColor: 'var(--color-teal)',
    pattern: `
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 40px,
        rgba(26, 74, 92, 0.5) 40px,
        rgba(26, 74, 92, 0.5) 42px
      )
    `,
    overlays: [
      'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.5) 100%)',
      'radial-gradient(ellipse at 50% 100%, rgba(212, 162, 76, 0.15) 0%, transparent 50%)',
    ],
    label: 'SECTOR 7 - MAIN CORRIDOR',
  },

  'atmospheric-processing': {
    baseColor: '#0d2225',
    accentColor: 'var(--color-grow-light)',
    pattern: `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 20px,
        rgba(92, 168, 106, 0.1) 20px,
        rgba(92, 168, 106, 0.1) 22px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 60px,
        rgba(92, 168, 106, 0.15) 60px,
        rgba(92, 168, 106, 0.15) 64px
      )
    `,
    overlays: [
      'radial-gradient(ellipse at 30% 40%, rgba(92, 168, 106, 0.25) 0%, transparent 40%)',
      'radial-gradient(ellipse at 70% 60%, rgba(92, 168, 106, 0.2) 0%, transparent 35%)',
      'linear-gradient(to top, rgba(92, 168, 106, 0.1) 0%, transparent 30%)',
    ],
    label: 'SECTOR 7-J - ATMOSPHERIC PROCESSING',
  },

  'grow-deck': {
    baseColor: '#0a1f14',
    accentColor: 'var(--color-grow-light)',
    pattern: `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 30px,
        rgba(92, 168, 106, 0.2) 30px,
        rgba(92, 168, 106, 0.2) 32px
      )
    `,
    overlays: [
      'linear-gradient(to bottom, rgba(92, 168, 106, 0.15) 0%, transparent 40%)',
      'radial-gradient(ellipse at 50% 20%, rgba(212, 162, 76, 0.2) 0%, transparent 40%)',
      'repeating-linear-gradient(90deg, transparent 0%, transparent 10%, rgba(61, 122, 74, 0.1) 10%, rgba(61, 122, 74, 0.1) 11%)',
    ],
    label: 'GROW-DECK ALPHA',
  },

  'fluid-systems': {
    baseColor: '#0d1a2a',
    accentColor: 'var(--color-teal)',
    pattern: `
      repeating-linear-gradient(
        45deg,
        transparent 0px,
        transparent 10px,
        rgba(26, 74, 92, 0.15) 10px,
        rgba(26, 74, 92, 0.15) 12px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent 0px,
        transparent 10px,
        rgba(26, 74, 92, 0.1) 10px,
        rgba(26, 74, 92, 0.1) 12px
      )
    `,
    overlays: [
      'radial-gradient(ellipse at 25% 50%, rgba(110, 184, 212, 0.2) 0%, transparent 30%)',
      'radial-gradient(ellipse at 75% 70%, rgba(110, 184, 212, 0.15) 0%, transparent 25%)',
    ],
    label: 'FLUID SYSTEMS - SECONDARY LOOP',
  },

  'electrical-hub': {
    baseColor: '#1a1525',
    accentColor: 'var(--color-violet)',
    pattern: `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 3px,
        rgba(154, 123, 196, 0.1) 3px,
        rgba(154, 123, 196, 0.1) 4px
      )
    `,
    overlays: [
      'radial-gradient(ellipse at 40% 30%, rgba(154, 123, 196, 0.25) 0%, transparent 35%)',
      'radial-gradient(ellipse at 60% 70%, rgba(154, 123, 196, 0.15) 0%, transparent 30%)',
      'linear-gradient(to right, rgba(154, 123, 196, 0.05) 0%, transparent 20%, transparent 80%, rgba(154, 123, 196, 0.05) 100%)',
    ],
    label: 'BLOCK C - ELECTRICAL HUB',
  },

  'the-wound': {
    baseColor: '#0a0a12',
    accentColor: '#443355',
    pattern: `
      repeating-linear-gradient(
        30deg,
        transparent 0px,
        transparent 20px,
        rgba(68, 51, 85, 0.2) 20px,
        rgba(68, 51, 85, 0.2) 22px
      )
    `,
    overlays: [
      'radial-gradient(ellipse at 50% 30%, rgba(100, 80, 120, 0.3) 0%, transparent 50%)',
      'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)',
      'radial-gradient(circle at 50% 20%, rgba(180, 160, 200, 0.1) 0%, transparent 30%)',
    ],
    label: 'THE WOUND - BREACH ZONE',
  },

  'hopper-yard': {
    baseColor: '#141418',
    accentColor: 'var(--color-amber-dim)',
    pattern: `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 50px,
        rgba(138, 104, 48, 0.1) 50px,
        rgba(138, 104, 48, 0.1) 52px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 80px,
        rgba(138, 104, 48, 0.08) 80px,
        rgba(138, 104, 48, 0.08) 84px
      )
    `,
    overlays: [
      'linear-gradient(to top, rgba(138, 104, 48, 0.1) 0%, transparent 20%)',
      'radial-gradient(ellipse at 50% 10%, rgba(180, 160, 140, 0.15) 0%, transparent 50%)',
    ],
    label: 'HOPPER YARD - EXTERIOR',
  },

  'fungal-depths': {
    baseColor: '#0a1210',
    accentColor: '#2a5a4a',
    pattern: `
      radial-gradient(ellipse at 30% 70%, rgba(42, 90, 74, 0.3) 0%, transparent 40%),
      radial-gradient(ellipse at 70% 40%, rgba(42, 90, 74, 0.2) 0%, transparent 35%),
      radial-gradient(ellipse at 50% 90%, rgba(42, 90, 74, 0.25) 0%, transparent 30%)
    `,
    overlays: [
      'radial-gradient(circle at 25% 60%, rgba(100, 180, 140, 0.15) 0%, transparent 20%)',
      'radial-gradient(circle at 65% 35%, rgba(100, 180, 140, 0.1) 0%, transparent 15%)',
      'radial-gradient(circle at 45% 80%, rgba(100, 180, 140, 0.12) 0%, transparent 18%)',
    ],
    label: 'FUNGAL DEPTHS - SECTOR 12',
  },
};

/**
 * Creates a placeholder background element for a location
 */
export function createPlaceholderBackground(locationType: LocationType): HTMLElement {
  const config = locationConfigs[locationType] || locationConfigs['corridor'];

  const container = document.createElement('div');
  container.className = 'placeholder-bg';
  container.style.cssText = `
    position: absolute;
    inset: 0;
    background-color: ${config.baseColor};
    overflow: hidden;
  `;

  // Pattern layer
  const patternLayer = document.createElement('div');
  patternLayer.style.cssText = `
    position: absolute;
    inset: 0;
    background: ${config.pattern};
    background-size: 100px 100px;
  `;
  container.appendChild(patternLayer);

  // Overlay layers
  config.overlays.forEach((overlay) => {
    const overlayLayer = document.createElement('div');
    overlayLayer.style.cssText = `
      position: absolute;
      inset: 0;
      background: ${overlay};
    `;
    container.appendChild(overlayLayer);
  });

  // Animated elements for life
  const ambientLayer = document.createElement('div');
  ambientLayer.className = 'ambient-animation';
  ambientLayer.innerHTML = createAmbientElements(locationType);
  container.appendChild(ambientLayer);

  // Location label
  if (config.label) {
    const label = document.createElement('div');
    label.className = 'location-label';
    label.textContent = config.label;
    container.appendChild(label);
  }

  // Vignette
  const vignette = document.createElement('div');
  vignette.className = 'vignette';
  container.appendChild(vignette);

  return container;
}

function createAmbientElements(locationType: LocationType): string {
  switch (locationType) {
    case 'atmospheric-processing':
    case 'grow-deck':
      // Floating particles / spores
      return `
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
      `;
    case 'fluid-systems':
      // Dripping effect indicators
      return `
        <div class="drip drip-1"></div>
        <div class="drip drip-2"></div>
      `;
    case 'electrical-hub':
      // Flickering light
      return `<div class="flicker-light"></div>`;
    case 'the-wound':
      // Ominous glow
      return `<div class="breach-glow"></div>`;
    default:
      return '';
  }
}

/**
 * Creates a placeholder character portrait
 */
export function createPlaceholderPortrait(characterId: string, speaking: boolean = false): HTMLElement {
  const colors: Record<string, string> = {
    keth: '#d4a24c',
    solenne: '#5ca86a',
    dauro: '#6eb8d4',
    vell: '#9a7bc4',
    orrin: '#c4762c',
  };

  const color = colors[characterId] || '#888';

  const portrait = document.createElement('div');
  portrait.className = `placeholder-portrait ${speaking ? 'speaking' : ''}`;
  portrait.style.cssText = `
    width: 200px;
    height: 280px;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(${hexToRgb(color)}, 0.1) 20%,
      rgba(${hexToRgb(color)}, 0.2) 50%,
      rgba(${hexToRgb(color)}, 0.1) 80%,
      transparent 100%
    );
    border: 2px solid ${color};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  `;

  // Character icon (simple geometric shape)
  const icon = document.createElement('div');
  icon.style.cssText = `
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${color} 0%, transparent 70%);
    border: 2px solid ${color};
    margin-bottom: 20px;
  `;
  portrait.appendChild(icon);

  // Name label
  const name = document.createElement('div');
  name.textContent = characterId.toUpperCase();
  name.style.cssText = `
    font-family: var(--font-display);
    font-size: 14px;
    color: ${color};
    letter-spacing: 0.2em;
  `;
  portrait.appendChild(name);

  return portrait;
}

function hexToRgb(hex: string): string {
  // Handle CSS variables by returning a default
  if (hex.startsWith('var(') || hex.startsWith('#') === false) {
    return '128, 128, 128';
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return '128, 128, 128';
}

export { locationConfigs };

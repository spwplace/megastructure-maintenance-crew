import type { DreamlogicClue } from '@/types';

/**
 * Environmental clues that appear during navigation based on route familiarity.
 * These reinforce the dreamlike, recurring nature of the megastructure.
 */
export const dreamlogicClues: DreamlogicClue[] = [
  // === UNKNOWN routes - disorientation and unfamiliarity ===
  {
    id: 'unknown-echo',
    text: 'Your footsteps echo strangely, returning from angles that make no sense.',
    type: 'sound',
    minFamiliarity: 'unknown',
  },
  {
    id: 'unknown-walls',
    text: 'The walls here seem to breathe. Or is that your imagination?',
    type: 'feeling',
    minFamiliarity: 'unknown',
  },
  {
    id: 'unknown-distance',
    text: 'The corridor stretches longer than it should. Distance feels unreliable.',
    type: 'feeling',
    minFamiliarity: 'unknown',
  },
  {
    id: 'unknown-light',
    text: 'Light bends here in ways you can\'t quite follow.',
    type: 'feeling',
    minFamiliarity: 'unknown',
  },
  {
    id: 'unknown-smell',
    text: 'An unfamiliar scent - machine oil mixed with something organic.',
    type: 'feeling',
    minFamiliarity: 'unknown',
  },

  // === GLIMPSED routes - first recognition ===
  {
    id: 'glimpsed-mark',
    text: 'A scratch on the wall... you might have seen it before.',
    type: 'wear',
    minFamiliarity: 'glimpsed',
  },
  {
    id: 'glimpsed-hum',
    text: 'That hum is familiar. You\'ve heard this particular frequency.',
    type: 'sound',
    minFamiliarity: 'glimpsed',
  },
  {
    id: 'glimpsed-pattern',
    text: 'The pattern of rust here triggers something - a half-memory.',
    type: 'wear',
    minFamiliarity: 'glimpsed',
  },
  {
    id: 'glimpsed-turn',
    text: 'You almost remember which way to turn.',
    type: 'memory',
    minFamiliarity: 'glimpsed',
  },
  {
    id: 'glimpsed-deja',
    text: 'Deja vu. Strong. This place exists in your mind already.',
    type: 'feeling',
    minFamiliarity: 'glimpsed',
  },

  // === WALKED routes - growing familiarity ===
  {
    id: 'walked-shortcut',
    text: 'Your feet know to avoid the loose grating here.',
    type: 'memory',
    minFamiliarity: 'walked',
  },
  {
    id: 'walked-graffiti',
    text: 'Someone scratched "AGAIN" into the wall. Crew humor.',
    type: 'graffiti',
    minFamiliarity: 'walked',
  },
  {
    id: 'walked-drip',
    text: 'The condensation drip from that pipe - you expect it now.',
    type: 'sound',
    minFamiliarity: 'walked',
  },
  {
    id: 'walked-handprint',
    text: 'Your own handprint, faded, on the access panel.',
    type: 'wear',
    minFamiliarity: 'walked',
  },
  {
    id: 'walked-rhythm',
    text: 'Your pace settles into a rhythm. Muscle memory.',
    type: 'feeling',
    minFamiliarity: 'walked',
  },

  // === FAMILIAR routes - the route feels natural ===
  {
    id: 'familiar-auto',
    text: 'You navigate on autopilot. Your mind drifts elsewhere.',
    type: 'memory',
    minFamiliarity: 'familiar',
  },
  {
    id: 'familiar-tally',
    text: 'Tally marks on the wall - someone counts their passages.',
    type: 'graffiti',
    minFamiliarity: 'familiar',
  },
  {
    id: 'familiar-wear',
    text: 'The floor is worn smooth here. Many feet, many cycles.',
    type: 'wear',
    minFamiliarity: 'familiar',
  },
  {
    id: 'familiar-sound',
    text: 'Every creak and hum here is expected. Silence would be alarming.',
    type: 'sound',
    minFamiliarity: 'familiar',
  },
  {
    id: 'familiar-comfort',
    text: 'This route feels almost comfortable. Almost like home.',
    type: 'feeling',
    minFamiliarity: 'familiar',
  },

  // === KNOWN routes - deep familiarity ===
  {
    id: 'known-invisible',
    text: 'You could walk this blind. You have, during power failures.',
    type: 'memory',
    minFamiliarity: 'known',
  },
  {
    id: 'known-groove',
    text: 'Your fingers find the groove in the wall without looking.',
    type: 'wear',
    minFamiliarity: 'known',
  },
  {
    id: 'known-story',
    text: '"DAURO WAS HERE" - faded graffiti from a decade ago.',
    type: 'graffiti',
    minFamiliarity: 'known',
  },
  {
    id: 'known-dream',
    text: 'You\'ve dreamed this corridor. Waking and sleeping blur.',
    type: 'memory',
    minFamiliarity: 'known',
  },
  {
    id: 'known-breath',
    text: 'The megastructure breathes with you here. In. Out. Familiar.',
    type: 'feeling',
    minFamiliarity: 'known',
  },

  // === Special/contextual clues ===
  {
    id: 'bio-spores',
    text: 'Bioluminescent spores drift past, marking your breath in the air.',
    type: 'feeling',
    minFamiliarity: 'glimpsed',
  },
  {
    id: 'mech-vibration',
    text: 'The floor vibrates with a familiar mechanical heartbeat.',
    type: 'sound',
    minFamiliarity: 'walked',
  },
  {
    id: 'crew-whisper',
    text: 'Distant voices. Other crew, somewhere in the structure.',
    type: 'sound',
    minFamiliarity: 'unknown',
  },
  {
    id: 'warning-sign',
    text: 'A warning sign, half-peeled, that you\'ve stopped reading.',
    type: 'wear',
    minFamiliarity: 'familiar',
  },
  {
    id: 'time-marker',
    text: 'A clock face painted on the wall. No hands. Crew joke about time.',
    type: 'graffiti',
    minFamiliarity: 'known',
  },
];

import type { Character, CharacterId } from '@/types';

export const characters: Record<CharacterId, Character> = {
  keth: {
    id: 'keth',
    name: 'Keth',
    role: 'Senior Technician',
    portraits: {
      default: '/assets/portraits/keth-default.png',
      speaking: '/assets/portraits/keth-speaking.png',
    },
    color: '#d4a24c', // amber
  },

  solenne: {
    id: 'solenne',
    name: 'Solenne',
    role: 'Biological Systems',
    portraits: {
      default: '/assets/portraits/solenne-default.png',
      speaking: '/assets/portraits/solenne-speaking.png',
    },
    color: '#5ca86a', // grow-green
  },

  dauro: {
    id: 'dauro',
    name: 'Dauro',
    role: 'Fluid Systems',
    portraits: {
      default: '/assets/portraits/dauro-default.png',
      speaking: '/assets/portraits/dauro-speaking.png',
    },
    color: '#6eb8d4', // light teal
  },

  vell: {
    id: 'vell',
    name: 'Vell',
    role: 'Electrical Systems',
    portraits: {
      default: '/assets/portraits/vell-default.png',
      speaking: '/assets/portraits/vell-speaking.png',
    },
    color: '#9a7bc4', // violet
  },

  orrin: {
    id: 'orrin',
    name: 'Orrin',
    role: 'Damage Response',
    portraits: {
      default: '/assets/portraits/orrin-default.png',
      speaking: '/assets/portraits/orrin-speaking.png',
    },
    color: '#c4762c', // warning amber
  },

  player: {
    id: 'player',
    name: '',
    role: 'Maintenance Crew',
    portraits: {},
    color: '#c8d4d8', // text color
  },
};

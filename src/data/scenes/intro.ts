import type { Scene, DialogueScript } from '@/types';
import { stateManager } from '@/core/StateManager';

// --- Dialogue Scripts ---

export const introDialogue: DialogueScript = {
  id: 'intro-shift-start',
  startNode: 'start',
  nodes: {
    start: {
      speaker: 'keth',
      text: "Shift's starting. Atmospheric readings are off in Sector 7-J again.",
      next: 'keth-2',
    },
    'keth-2': {
      speaker: 'keth',
      text: 'Bio-filters probably. Third time this cycle.',
      choices: [
        {
          text: "I'll check the moss sheets.",
          next: 'response-moss',
          onSelect: () => stateManager.modifyRelationship('keth', 1),
        },
        {
          text: "Shouldn't we prioritize the hull stress readings?",
          next: 'response-hull',
        },
        {
          text: 'What caused it?',
          next: 'response-question',
        },
      ],
    },
    'response-moss': {
      speaker: 'keth',
      text: "Good. Take Solenne—they'll know if it's the filtration culture or something mechanical.",
      next: 'assignment',
    },
    'response-hull': {
      speaker: 'keth',
      text: "Hull stress is chronic. We're not fixing that today. Atmosphere affects everyone in the sector right now.",
      next: 'assignment',
    },
    'response-question': {
      speaker: 'keth',
      text: "Could be anything. Age. Vibration damage from the last attack. Doesn't matter. It needs fixing.",
      next: 'assignment',
    },
    assignment: {
      speaker: 'keth',
      text: 'Solenne, you go with them. Dauro, fluid pressure in the secondary loop. Vell, I need you on sensor calibration in Block C.',
      next: 'solenne-1',
    },
    'solenne-1': {
      speaker: 'solenne',
      text: 'The moss has been stressed lately. Too much vibration, not enough light adjustment. I have a theory—',
      next: 'vell-interrupt',
    },
    'vell-interrupt': {
      speaker: 'vell',
      text: 'Save the theories. Fix the filters. We can discuss moss psychology at meal break.',
      next: 'solenne-2',
    },
    'solenne-2': {
      speaker: 'solenne',
      text: "It's not— fine. Let's go.",
      next: 'end',
    },
    end: {
      text: 'The crew disperses. Another shift begins.',
      next: null,
    },
  },
};

// --- Scenes ---

export const menuScene: Scene = {
  id: 'menu',
  type: 'menu',
};

export const introScene: Scene = {
  id: 'intro',
  type: 'dialogue',
  background: '/assets/backgrounds/crew-quarters.png',
  dialogue: introDialogue.nodes[introDialogue.startNode],
  onEnter: () => {
    console.log('Entering intro scene');
  },
};

export const sector7Entrance: Scene = {
  id: 'sector-7-entrance',
  type: 'navigation',
  background: '/assets/backgrounds/corridor-teal.png',
  navigation: {
    locationId: 'sector-7-entrance',
    hotspots: [
      {
        id: 'to-atmospheric',
        x: 50,
        y: 40,
        targetScene: 'sector-7j-atmospheric',
        label: 'Atmospheric Processing',
      },
      {
        id: 'to-quarters',
        x: 20,
        y: 70,
        targetScene: 'crew-quarters',
        label: 'Back to Quarters',
      },
    ],
  },
};

export const atmosphericProcessing: Scene = {
  id: 'sector-7j-atmospheric',
  type: 'maintenance',
  background: '/assets/backgrounds/atmospheric-processing.png',
  maintenance: {
    systemId: 'atmo-7j',
    type: 'biological',
    status: {
      name: 'Atmospheric Bio-Filter Array',
      health: 67,
      warnings: [
        'Moss Sheet 3 degraded',
        'Humidity variance +12%',
        'CO2 processing below threshold',
      ],
      critical: false,
    },
    interactions: [
      {
        id: 'inspect-moss',
        label: 'Inspect moss sheets',
        action: () => console.log('Inspecting moss...'),
      },
      {
        id: 'check-humidity',
        label: 'Check humidity sensors',
        action: () => console.log('Checking sensors...'),
      },
    ],
  },
};

export const introScenes: Scene[] = [
  menuScene,
  introScene,
  sector7Entrance,
  atmosphericProcessing,
];

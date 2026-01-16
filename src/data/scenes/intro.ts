import type { Scene, DialogueScript } from '@/types';
import { stateManager } from '@/core/StateManager';
import { shiftSystem } from '@/systems/ShiftSystem';
import { dialogueSystem } from '@/systems/DialogueSystem';
import { sceneManager } from '@/systems/SceneManager';

// --- Intro Dialogue (First time playing) ---

export const introDialogue: DialogueScript = {
  id: 'intro-first-shift',
  startNode: 'wake',
  nodes: {
    wake: {
      text: 'You wake to the hum of the structure. It is always there—a low vibration in the walls, the floor, the air itself. The sound of a vast machine breathing.',
      next: 'quarters',
    },
    quarters: {
      text: 'Your bunk is small, efficient, personal in the way that years of habitation make any space personal. The walls are covered with marks from previous occupants—notes, stains, repairs.',
      next: 'alarm',
    },
    alarm: {
      text: 'The shift alert sounds. Soft, rhythmic. Time to work.',
      next: 'briefing-start',
    },
    'briefing-start': {
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
      next: 'orrin-mention',
    },
    'orrin-mention': {
      speaker: 'keth',
      text: "Orrin—stay close. Last night's attack left some structural stress. If something opens up, I want you there fast.",
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
      next: 'dauro-aside',
    },
    'dauro-aside': {
      speaker: 'dauro',
      text: "[quietly, to you] Don't let Vell get to you. They care, they just... express it weirdly.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('dauro', 1),
    },
    end: {
      text: 'The crew disperses. Your first shift with this squad begins.',
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
  background: null,
  dialogue: introDialogue.nodes[introDialogue.startNode],
  onEnter: () => {
    console.log('Entering intro scene');
    shiftSystem.startShift(1);
  },
};

// Re-export for backwards compatibility
export const introScenes: Scene[] = [
  menuScene,
  introScene,
];

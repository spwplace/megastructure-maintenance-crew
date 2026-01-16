import type { Scene, DialogueScript } from '@/types';
import { stateManager } from '@/core/StateManager';
import { shiftSystem } from '@/systems/ShiftSystem';
import { maintenanceSystem, createAtmosphericTask, createFluidSystemTask, createElectricalTask, createEmergencyTask, createHopperYardTask, createGrowDeckTask } from '@/systems/MaintenanceSystem';
import { sceneManager } from '@/systems/SceneManager';
import { dialogueSystem } from '@/systems/DialogueSystem';
import { uiManager } from '@/ui/UIManager';
import { characters } from '@/data/characters';

// ============================================
// CREW QUARTERS - Home base / Downtime location
// ============================================

export const crewQuartersScene: Scene = {
  id: 'crew-quarters',
  type: 'navigation',
  background: null, // Uses placeholder
  navigation: {
    locationId: 'crew-quarters',
    hotspots: [
      {
        id: 'to-corridor',
        x: 50,
        y: 30,
        targetScene: 'sector-7-corridor',
        label: 'Exit to Corridor',
        condition: () => shiftSystem.getPhase() !== 'downtime',
      },
      {
        id: 'talk-keth',
        x: 20,
        y: 60,
        targetScene: 'talk-keth',
        label: 'Talk to Keth',
        condition: () => shiftSystem.getPhase() === 'downtime',
      },
      {
        id: 'talk-solenne',
        x: 40,
        y: 65,
        targetScene: 'talk-solenne',
        label: 'Talk to Solenne',
        condition: () => shiftSystem.getPhase() === 'downtime',
      },
      {
        id: 'talk-vell',
        x: 60,
        y: 55,
        targetScene: 'talk-vell',
        label: 'Talk to Vell',
        condition: () => shiftSystem.getPhase() === 'downtime',
      },
      {
        id: 'talk-dauro',
        x: 75,
        y: 70,
        targetScene: 'talk-dauro',
        label: 'Talk to Dauro',
        condition: () => shiftSystem.getPhase() === 'downtime',
      },
      {
        id: 'talk-orrin',
        x: 30,
        y: 45,
        targetScene: 'talk-orrin',
        label: 'Talk to Orrin',
        condition: () => shiftSystem.getPhase() === 'downtime',
      },
      {
        id: 'rest',
        x: 85,
        y: 50,
        targetScene: 'rest-bunk',
        label: 'Rest (End Shift)',
        condition: () => shiftSystem.getPhase() === 'downtime',
      },
    ],
  },
  onEnter: () => {
    shiftSystem.showIndicator();

    // Show rumors button during downtime if player has collected any
    const rumors = stateManager.getRumors();
    if (shiftSystem.getPhase() === 'downtime' && rumors.length > 0) {
      uiManager.showRumorsButton(rumors);
    } else {
      uiManager.hideRumorsButton();
    }

    // When entering quarters after completing work, transition to downtime
    if (shiftSystem.getPhase() === 'work' && shiftSystem.canProceedToDowntime()) {
      // Start downtime transition dialogue
      const downtimeTransition: import('@/types').DialogueScript = {
        id: 'downtime-transition',
        startNode: 'start',
        nodes: {
          start: {
            text: "You return to the crew quarters. The others are already back, settling into the quiet rhythms of rest period.",
            next: 'observation',
          },
          observation: {
            text: "The hum of the structure feels different here—softer, almost peaceful. The amber lights cast long shadows across familiar bunks.",
            next: 'end',
          },
          end: {
            text: "For a few hours, the endless work can wait.",
          },
        },
      };
      dialogueSystem.startDialogue(downtimeTransition, () => {
        shiftSystem.beginDowntime();
        // Re-render the scene to show downtime options
        sceneManager.goToScene('crew-quarters', false);
      });
    }

    // Show improved downtime UI during rest period
    if (shiftSystem.getPhase() === 'downtime') {
      const crewList = [
        { id: 'keth', name: characters.keth.name, role: characters.keth.role, color: characters.keth.color },
        { id: 'solenne', name: characters.solenne.name, role: characters.solenne.role, color: characters.solenne.color },
        { id: 'vell', name: characters.vell.name, role: characters.vell.role, color: characters.vell.color },
        { id: 'dauro', name: characters.dauro.name, role: characters.dauro.role, color: characters.dauro.color },
        { id: 'orrin', name: characters.orrin.name, role: characters.orrin.role, color: characters.orrin.color },
      ];

      uiManager.showDowntimeUI(
        crewList,
        (crewId) => sceneManager.goToScene(`talk-${crewId}`),
        () => sceneManager.goToScene('rest-bunk')
      );
    }
  },
  onExit: () => {
    uiManager.hideRumorsButton();
    uiManager.hideDowntimeUI();
  },
};

// ============================================
// SECTOR 7 CORRIDOR - Navigation hub
// ============================================

export const sector7CorridorScene: Scene = {
  id: 'sector-7-corridor',
  type: 'navigation',
  background: null,
  navigation: {
    locationId: 'sector-7-corridor',
    hotspots: [
      {
        id: 'to-quarters',
        x: 10,
        y: 50,
        targetScene: 'crew-quarters',
        label: shiftSystem.canProceedToDowntime() ? 'Return to Quarters (End Work)' : 'Crew Quarters',
      },
      {
        id: 'to-atmospheric',
        x: 35,
        y: 30,
        targetScene: 'sector-7j-atmospheric',
        label: 'Atmospheric Processing',
      },
      {
        id: 'to-fluid',
        x: 65,
        y: 30,
        targetScene: 'fluid-systems',
        label: 'Fluid Systems',
      },
      {
        id: 'to-hopper',
        x: 85,
        y: 45,
        targetScene: 'hopper-yard',
        label: 'Hopper Yard',
      },
      {
        id: 'to-growdeck',
        x: 50,
        y: 50,
        targetScene: 'grow-deck',
        label: 'Grow-Deck Alpha',
      },
      {
        id: 'to-electrical',
        x: 25,
        y: 65,
        targetScene: 'electrical-hub',
        label: 'Electrical Hub',
        condition: () => stateManager.getShift() > 1 || stateManager.getFlag('electrical-unlocked'),
      },
      {
        id: 'to-depths',
        x: 75,
        y: 70,
        targetScene: 'fungal-depths',
        label: 'Fungal Depths',
        condition: () => stateManager.getFlag('depths-unlocked'),
      },
    ],
  },
  onEnter: () => {
    shiftSystem.showIndicator();
    // Check if player can proceed to downtime
    if (shiftSystem.canProceedToDowntime() && shiftSystem.getPhase() === 'work') {
      // Show a hint that they can return to quarters to rest
      const hint = document.createElement('div');
      hint.className = 'alert-banner';
      hint.style.animation = 'none';
      hint.style.borderColor = 'var(--color-grow-light)';
      hint.style.color = 'var(--color-grow-light)';
      hint.innerHTML = `
        <div style="font-size: 0.9rem;">Work complete for this shift.</div>
        <div style="font-size: 0.75rem; margin-top: 4px;">Return to quarters to rest.</div>
      `;
      document.getElementById('game')?.appendChild(hint);
      setTimeout(() => {
        hint.classList.add('fade-out');
        setTimeout(() => hint.remove(), 300);
      }, 3000);
    }
  },
};

// ============================================
// ATMOSPHERIC PROCESSING - Bio maintenance
// ============================================

export const atmosphericScene: Scene = {
  id: 'sector-7j-atmospheric',
  type: 'maintenance',
  background: null,
  maintenance: {
    systemId: 'atmo-7j',
    type: 'biological',
    status: {
      name: 'Atmospheric Bio-Filter Array',
      health: 67,
      warnings: ['Moss Sheet 3 degraded', 'Humidity variance +12%', 'CO2 processing below threshold'],
      critical: false,
    },
    interactions: [],
  },
  onEnter: () => {
    shiftSystem.showIndicator();
    const task = createAtmosphericTask();
    maintenanceSystem.startTask(task);
  },
  onExit: () => {
    if (maintenanceSystem.isActive()) {
      maintenanceSystem.finishTask(false); // Don't navigate - scene transition handles it
      shiftSystem.completeTask('atmo-7j');
    }
  },
};

// ============================================
// FLUID SYSTEMS - Mechanical maintenance
// ============================================

export const fluidSystemsScene: Scene = {
  id: 'fluid-systems',
  type: 'maintenance',
  background: null,
  maintenance: {
    systemId: 'fluid-secondary',
    type: 'mechanical',
    status: {
      name: 'Secondary Fluid Loop',
      health: 52,
      warnings: ['Pressure variance detected', 'Valve 7B sticking', 'Minor leak at junction 12'],
      critical: false,
    },
    interactions: [],
  },
  onEnter: () => {
    shiftSystem.showIndicator();
    const task = createFluidSystemTask();
    maintenanceSystem.startTask(task);
  },
  onExit: () => {
    if (maintenanceSystem.isActive()) {
      maintenanceSystem.finishTask(false);
      shiftSystem.completeTask('fluid-secondary');
    }
  },
};

// ============================================
// ELECTRICAL HUB - Electrical maintenance
// ============================================

export const electricalHubScene: Scene = {
  id: 'electrical-hub',
  type: 'maintenance',
  background: null,
  maintenance: {
    systemId: 'elec-blockc',
    type: 'mechanical',
    status: {
      name: 'Block C Sensor Array',
      health: 45,
      warnings: ['Sensors 3-7 offline', 'Power fluctuation detected', 'Data corruption in buffer'],
      critical: false,
    },
    interactions: [],
  },
  onEnter: () => {
    shiftSystem.showIndicator();
    stateManager.setFlag('electrical-unlocked', true);
    const task = createElectricalTask();
    maintenanceSystem.startTask(task);
  },
  onExit: () => {
    if (maintenanceSystem.isActive()) {
      maintenanceSystem.finishTask(false);
      shiftSystem.completeTask('elec-blockc');
    }
  },
};

// ============================================
// HOPPER YARD - Exterior work area
// ============================================

export const hopperYardScene: Scene = {
  id: 'hopper-yard',
  type: 'maintenance',
  background: null,
  maintenance: {
    systemId: 'hopper-yard',
    type: 'mechanical',
    status: {
      name: 'Fluid Transfer Hopper',
      health: 58,
      warnings: ['Transfer rate below optimal', 'Debris accumulation detected', 'Seal wear on hatch 3'],
      critical: false,
    },
    interactions: [],
  },
  onEnter: () => {
    shiftSystem.showIndicator();
    const task = createHopperYardTask();
    maintenanceSystem.startTask(task);

    if (!stateManager.hasVisited('hopper-yard')) {
      setTimeout(() => {
        dialogueSystem.startDialogue(hopperYardIntroDialogue);
      }, 500);
    }
  },
  onExit: () => {
    if (maintenanceSystem.isActive()) {
      maintenanceSystem.finishTask(false);
      shiftSystem.completeTask('hopper-yard');
    }
  },
};

const hopperYardIntroDialogue: DialogueScript = {
  id: 'hopper-yard-intro',
  startNode: 'start',
  nodes: {
    start: {
      text: 'The hopper yard opens before you—a vast exterior space where the structure meets something like sky. Scaffolding and gravel piles stretch into hazy distance.',
      next: 'scale',
    },
    scale: {
      text: "Through gaps in the scaffolding, you can see the outer hull curving away impossibly. The structure is larger than any building should be. Larger than cities.",
      next: 'observation',
    },
    observation: {
      text: "The fluid hoppers loom here—massive containers that somehow supply systems kilometers away. There's no visible connection. The fluid just... arrives where it's needed.",
      choices: [
        { text: 'How does that work?', next: 'impossible' },
        { text: 'Focus on the task at hand.', next: 'end' },
      ],
    },
    impossible: {
      text: "It doesn't. Not by any physics you know. The structure has its own logic, accumulated over generations of desperate repairs. Understanding isn't your job. Maintenance is.",
      next: 'end',
    },
    end: {
      text: 'The wind—or something like wind—carries the smell of metal and fluid. Time to work.',
    },
  },
};

// ============================================
// GROW-DECK ALPHA - Agricultural area
// ============================================

export const growDeckScene: Scene = {
  id: 'grow-deck',
  type: 'maintenance',
  background: null,
  maintenance: {
    systemId: 'grow-deck-alpha',
    type: 'biological',
    status: {
      name: 'Grow-Deck Alpha Hydroponics',
      health: 71,
      warnings: ['Nutrient imbalance in Section 3', 'Light cycle drift detected', 'Root rot risk elevated'],
      critical: false,
    },
    interactions: [],
  },
  onEnter: () => {
    shiftSystem.showIndicator();
    const task = createGrowDeckTask();
    maintenanceSystem.startTask(task);

    if (!stateManager.hasVisited('grow-deck')) {
      setTimeout(() => {
        dialogueSystem.startDialogue(growDeckIntroDialogue);
      }, 500);
    }
  },
  onExit: () => {
    if (maintenanceSystem.isActive()) {
      maintenanceSystem.finishTask(false);
      shiftSystem.completeTask('grow-deck-alpha');
    }
  },
};

const growDeckIntroDialogue: DialogueScript = {
  id: 'grow-deck-intro',
  startNode: 'start',
  nodes: {
    start: {
      text: 'Rows of vegetation stretch into green-lit distance. The air is thick with humidity and the smell of growing things. Life, cultivated against entropy.',
      next: 'solenne',
    },
    solenne: {
      speaker: 'solenne',
      text: "Beautiful, isn't it? This deck has been producing for three generations. Some of these root systems are older than anyone alive.",
      next: 'observation',
    },
    observation: {
      speaker: 'solenne',
      text: "The plants don't just feed us—they process our air, regulate our water, break down our waste. We're not maintaining a garden. We're maintaining a lung.",
      choices: [
        { text: "How do you keep them all alive?", next: 'care' },
        { text: "What happens if they fail?", next: 'failure' },
        { text: "Let's get to work.", next: 'end' },
      ],
    },
    care: {
      speaker: 'solenne',
      text: "Constant attention. They tell you what they need—you just have to learn their language. The curl of a leaf. The color of a stem. Small signs of larger problems.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('solenne', 1),
    },
    failure: {
      speaker: 'solenne',
      text: "Then the mechanical systems have to compensate. And they're already stressed. Everything is connected. Everything depends on everything else.",
      next: 'end',
    },
    end: {
      speaker: 'solenne',
      text: "Let's check the nutrient feeds. I have a bad feeling about Section 3.",
    },
  },
};

// ============================================
// FUNGAL DEPTHS - Special area
// ============================================

export const fungalDepthsScene: Scene = {
  id: 'fungal-depths',
  type: 'navigation',
  background: null,
  navigation: {
    locationId: 'fungal-depths',
    hotspots: [
      {
        id: 'back',
        x: 20,
        y: 80,
        targetScene: 'sector-7-corridor',
        label: 'Back to Corridor',
      },
      {
        id: 'network-1',
        x: 40,
        y: 40,
        targetScene: 'fungal-network',
        label: 'Examine Network',
      },
      {
        id: 'deeper',
        x: 70,
        y: 55,
        targetScene: 'fungal-deeper',
        label: 'Go Deeper',
        condition: () => stateManager.getFlag('touched-fungal') || stateManager.getShift() > 2,
      },
    ],
  },
  onEnter: () => {
    shiftSystem.showIndicator();
    if (!stateManager.hasVisited('fungal-depths')) {
      dialogueSystem.startDialogue(fungalDepthsIntroDialogue);
    }
  },
};

// ============================================
// FUNGAL NETWORK - Interactive scene
// ============================================

export const fungalNetworkScene: Scene = {
  id: 'fungal-network',
  type: 'dialogue',
  background: null,
  dialogue: {
    text: '',
  },
  onEnter: () => {
    dialogueSystem.startDialogue(fungalNetworkDialogue, () => {
      sceneManager.goToScene('fungal-depths');
    });
  },
};

const fungalNetworkDialogue: DialogueScript = {
  id: 'fungal-network',
  startNode: 'start',
  nodes: {
    start: {
      text: 'The fungal network spreads across the wall before you—veins of bioluminescent growth pulsing with soft green light. It follows the old wiring paths, but has grown far beyond them.',
      choices: [
        { text: 'Touch the growth', next: 'touch' },
        { text: 'Listen closely', next: 'listen' },
        { text: 'Step back', next: 'back' },
      ],
    },
    touch: {
      text: 'The surface is cool, slightly tacky. As your fingers make contact, the glow intensifies. Something pulses through the network—a wave of light that spreads outward from your touch.',
      next: 'response',
      onShow: () => stateManager.setFlag('touched-fungal'),
    },
    response: {
      text: 'For a moment, you feel something. Not quite sound, not quite sensation. A presence. Vast and patient and curious. Then the light fades to its normal rhythm.',
      choices: [
        { text: "What are you?", next: 'question' },
        { text: 'Pull your hand away quickly.', next: 'retreat' },
      ],
    },
    question: {
      text: "There's no answer. Of course there isn't—it's fungus, not a person. But something lingers. The impression of being seen. Known. Filed away for later consideration.",
      next: 'end',
      onShow: () => {
        stateManager.addRumor('The fungal networks respond to touch. Something in them is aware—or learning to be.');
        stateManager.modifyRelationship('solenne', 1);
      },
    },
    retreat: {
      text: "Your hand comes away clean. The glow continues its slow pulse, indifferent to your fear. Whatever moment existed between you and the network has passed.",
      next: 'end',
    },
    listen: {
      text: 'You hold still, straining to hear. At first there is only silence. Then, gradually, a sound emerges—not from your ears, but somewhere deeper. A hum. A rhythm. Like breathing.',
      next: 'listen-2',
    },
    'listen-2': {
      text: "The network is carrying signals. Electrical impulses traveling along fungal threads. The old crew systems, rerouted through living tissue. The structure's nervous system, rebuilt by something that grew here in the dark.",
      next: 'end',
      onShow: () => stateManager.addRumor('The fungal networks carry signals now—like a nervous system grown in the dark.'),
    },
    back: {
      text: 'You step away from the growth. Some things are better left unexamined. The glow continues its slow pulse, patient and eternal.',
      next: 'end',
    },
    end: {
      text: 'The depths hum quietly around you. Whatever is happening here has been happening for a long time. It will continue long after you are gone.',
    },
  },
};

// ============================================
// FUNGAL DEEPER - Hidden area
// ============================================

export const fungalDeeperScene: Scene = {
  id: 'fungal-deeper',
  type: 'dialogue',
  background: null,
  dialogue: {
    text: '',
  },
  onEnter: () => {
    dialogueSystem.startDialogue(fungalDeeperDialogue, () => {
      sceneManager.goToScene('fungal-depths');
    });
  },
};

const fungalDeeperDialogue: DialogueScript = {
  id: 'fungal-deeper',
  startNode: 'start',
  nodes: {
    start: {
      text: 'The passage narrows, walls closing in until you have to turn sideways to proceed. The bioluminescence grows stronger here—the fungal growth covers everything.',
      next: 'chamber',
    },
    chamber: {
      text: 'You emerge into a chamber unlike any you have seen. The fungal growth here is different—structured, almost architectural. It has built something. A space. A... room.',
      next: 'observation',
    },
    observation: {
      text: 'In the center of the chamber, fungal tendrils have grown around something mechanical. Old. Pre-siege, maybe. A terminal of some kind, half-absorbed into the living tissue.',
      choices: [
        { text: 'Try to access the terminal.', next: 'terminal' },
        { text: 'Examine the fungal structures.', next: 'structures' },
        { text: "This doesn't feel safe. Leave.", next: 'leave' },
      ],
    },
    terminal: {
      text: 'You brush away fungal growth from the interface. The screen flickers—amber text on black. Corrupted data scrolls past. Coordinates. Dates. A word repeats: ARRIVAL.',
      next: 'terminal-2',
    },
    'terminal-2': {
      text: 'Then the screen dies. The fungal tendrils pulse once, twice, and grow still. Whatever data existed here, the network has been absorbing it for years. Learning from it.',
      next: 'end',
      onShow: () => {
        stateManager.setFlag('found-deep-terminal');
        stateManager.addRumor("There's a terminal in the fungal depths. The word 'ARRIVAL' appears in its corrupted data. The network has been absorbing it.");
      },
    },
    structures: {
      text: "The fungal growth isn't random. It's organized—ribs and buttresses supporting the chamber, conduits channeling nutrients and signals. The network hasn't just grown here. It has engineered this space.",
      next: 'structures-2',
    },
    'structures-2': {
      text: 'You realize with quiet horror that you are standing inside something. Not a room. A organ. Part of a larger system that is still growing, still building, still becoming something new.',
      next: 'end',
      onShow: () => {
        stateManager.setFlag('understood-fungal-architecture');
        stateManager.addRumor('The fungal network is building. Engineering spaces. Growing into something with purpose.');
      },
    },
    leave: {
      text: 'Trust your instincts. Some knowledge comes at too high a cost. You retreat through the narrow passage, the bioluminescent glow dimming behind you.',
      next: 'end',
    },
    end: {
      text: 'The depths release you. But you carry something back—a sense of scale, of time, of slow and patient growth. The structure is alive in ways no one fully understands.',
    },
  },
};

// ============================================
// DIALOGUES
// ============================================

export const fungalDepthsIntroDialogue: DialogueScript = {
  id: 'fungal-depths-intro',
  startNode: 'start',
  nodes: {
    start: {
      text: 'The air here is thick, humid, with a smell like wet earth and something else—something alive. Bioluminescent fungal growths pulse softly along the walls.',
      next: 'observation',
    },
    observation: {
      text: 'The fungal networks have spread further than the last survey reported. Some of the growths seem to follow the old wiring paths, as if they learned from the structure.',
      choices: [
        { text: 'Touch one of the growths', next: 'touch' },
        { text: 'Keep your distance', next: 'distance' },
        { text: 'Look for damage to repair', next: 'work' },
      ],
    },
    touch: {
      text: 'The surface is cool, slightly tacky. As your fingers make contact, you feel a subtle vibration—not quite a sound, but something. The glow intensifies briefly, then fades.',
      next: 'end',
      onShow: () => stateManager.setFlag('touched-fungal'),
    },
    distance: {
      text: 'Probably wise. Solenne says they are becoming something, but nobody knows what. Best not to interfere.',
      next: 'end',
    },
    work: {
      text: 'The fungal networks have actually stabilized some of the older systems down here. Hard to tell what would be repair and what would be damage at this point.',
      next: 'end',
    },
    end: {
      text: 'The depths hum quietly around you. Whatever is happening here, it has been happening for a long time.',
    },
  },
};

// ============================================
// CREW CONVERSATION SCENES
// ============================================

export const talkKethScene: Scene = {
  id: 'talk-keth',
  type: 'dialogue',
  dialogue: {
    speaker: 'keth',
    text: '',
  },
  onEnter: () => {
    dialogueSystem.startDialogue(kethDowntimeDialogue, () => {
      sceneManager.goToScene('crew-quarters');
    });
  },
};

export const kethDowntimeDialogue: DialogueScript = {
  id: 'keth-downtime',
  startNode: 'start',
  nodes: {
    start: {
      speaker: 'keth',
      text: stateManager.getRelationship('keth') > 2
        ? "You did good work today. Don't make a habit of it—I'll start expecting things."
        : "Rest while you can. Tomorrow won't be easier.",
      choices: [
        { text: 'How long have you been doing this?', next: 'history' },
        { text: "What's the enemy doing out there?", next: 'enemy' },
        { text: "I should let you rest.", next: 'end' },
      ],
    },
    history: {
      speaker: 'keth',
      text: "Thirty years, give or take. Started when I was younger than Dauro. Seen a lot of crew come through. Some stayed. Some didn't.",
      next: 'history-2',
      onShow: () => stateManager.modifyRelationship('keth', 1),
    },
    'history-2': {
      speaker: 'keth',
      text: "The structure was different then. Not better—just different. The siege was already old when I started. We thought it might end. We stopped thinking that.",
      choices: [
        { text: "Do you ever think about leaving?", next: 'leaving' },
        { text: "What keeps you going?", next: 'motivation' },
        { text: "Thank you for telling me.", next: 'end' },
      ],
    },
    leaving: {
      speaker: 'keth',
      text: "Leave to where? This is the structure. This is home. The work needs doing. Someone has to do it.",
      next: 'end',
    },
    motivation: {
      speaker: 'keth',
      text: "The crew. The work. The structure needs us. Maybe that's enough. Maybe it has to be.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('keth', 1),
    },
    enemy: {
      speaker: 'keth',
      text: "I don't think about them. Thinking about them doesn't fix anything. They hit, we repair. That's all there is.",
      choices: [
        { text: "But don't you want to know why?", next: 'why' },
        { text: "You're right. Focus on the work.", next: 'end' },
      ],
    },
    why: {
      speaker: 'keth',
      text: "Wanting to know doesn't make it knowable. I've seen people drive themselves mad looking for meaning out there. The meaning is in here. In the work. In each other.",
      next: 'end',
      onShow: () => stateManager.addRumor("Keth says the meaning is in the work, not in understanding the enemy."),
    },
    end: {
      speaker: 'keth',
      text: "Get some rest. Shift starts early.",
    },
  },
};

export const talkSolenneScene: Scene = {
  id: 'talk-solenne',
  type: 'dialogue',
  dialogue: {
    speaker: 'solenne',
    text: '',
  },
  onEnter: () => {
    dialogueSystem.startDialogue(solenneDowntimeDialogue, () => {
      sceneManager.goToScene('crew-quarters');
    });
  },
};

export const solenneDowntimeDialogue: DialogueScript = {
  id: 'solenne-downtime',
  startNode: 'start',
  nodes: {
    start: {
      speaker: 'solenne',
      text: "Oh! I was just thinking about the moss cultures. They've been stressed lately. I think they can feel when an attack is coming.",
      choices: [
        { text: "Plants can't predict attacks.", next: 'skeptic' },
        { text: "What makes you think that?", next: 'curious' },
        { text: "How are you holding up?", next: 'personal' },
      ],
    },
    skeptic: {
      speaker: 'solenne',
      text: "Maybe not predict. But they respond to vibrations, air pressure changes, electromagnetic fluctuations. Things we can't sense. They curl up before the alarms sound, sometimes.",
      next: 'science',
    },
    curious: {
      speaker: 'solenne',
      text: "I've been keeping notes. Three out of the last five attacks, the moss sheets started curling hours before. Not all of them—just the ones in the outer sections.",
      next: 'science',
      onShow: () => stateManager.modifyRelationship('solenne', 1),
    },
    science: {
      speaker: 'solenne',
      text: "I know it sounds silly. Vell thinks I'm projecting. But the bio-systems... they're more connected to the structure than we are. They've been growing here for generations.",
      choices: [
        { text: "Could we use them as an early warning?", next: 'warning' },
        { text: "Tell me about the fungal networks.", next: 'fungal' },
        { text: "You really care about them.", next: 'care' },
      ],
    },
    warning: {
      speaker: 'solenne',
      text: "That's what I've been thinking! If I can map the correlation patterns... but I need more data. More attacks.",
      next: 'sad',
    },
    sad: {
      speaker: 'solenne',
      text: "Which is a terrible thing to want. More attacks. More damage. More work for everyone. Just so I can prove my moss theory.",
      next: 'end',
    },
    fungal: {
      speaker: 'solenne',
      text: "Oh, the fungal networks are fascinating. And a little frightening. They've started carrying signals—electrical impulses, like a nervous system. Some of the old crew think they're becoming aware.",
      next: 'fungal-2',
      onShow: () => stateManager.setFlag('depths-unlocked', true),
    },
    'fungal-2': {
      speaker: 'solenne',
      text: "I don't know if I believe that. But when I work in the depths... sometimes I feel like I'm being watched. Not malevolently. Just... observed.",
      next: 'end',
      onShow: () => stateManager.addRumor("Solenne believes the fungal networks may be developing awareness."),
    },
    care: {
      speaker: 'solenne',
      text: "They're alive. They're working as hard as we are to keep this structure going. Someone should notice. Someone should... appreciate them.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('solenne', 1),
    },
    personal: {
      speaker: 'solenne',
      text: "Me? I'm... okay. Tired. Worried about the cultures. The last attack damaged some of my best specimens. But we'll grow more. We always do.",
      next: 'end',
    },
    end: {
      speaker: 'solenne',
      text: "Sorry, I've been rambling. I should let you rest. Thanks for listening.",
    },
  },
};

export const talkVellScene: Scene = {
  id: 'talk-vell',
  type: 'dialogue',
  dialogue: {
    speaker: 'vell',
    text: '',
  },
  onEnter: () => {
    dialogueSystem.startDialogue(vellDowntimeDialogue, () => {
      sceneManager.goToScene('crew-quarters');
    });
  },
};

export const vellDowntimeDialogue: DialogueScript = {
  id: 'vell-downtime',
  startNode: 'start',
  nodes: {
    start: {
      speaker: 'vell',
      text: "Couldn't sleep anyway. The sensor readings are bothering me. Something's off in the data, but I can't figure out what.",
      choices: [
        { text: "What kind of data?", next: 'data' },
        { text: "You should rest. The data will be there tomorrow.", next: 'rest' },
        { text: "I heard you found something in the old systems.", next: 'old-systems' },
      ],
    },
    data: {
      speaker: 'vell',
      text: "Pattern recognition stuff. The attacks—they're not random. There's a rhythm to them. But it keeps shifting, like something is learning.",
      next: 'pattern',
    },
    pattern: {
      speaker: 'vell',
      text: "Or I'm seeing patterns where there aren't any. Occupational hazard when you spend too much time staring at data.",
      choices: [
        { text: "What if they are learning?", next: 'learning' },
        { text: "You're probably just tired.", next: 'tired' },
      ],
    },
    learning: {
      speaker: 'vell',
      text: "Then we're in trouble. Because that would mean whatever's out there is adapting to our repairs. Testing our responses. Getting smarter while we're just... maintaining.",
      next: 'end',
      onShow: () => stateManager.addRumor("Vell thinks the attack patterns suggest something is learning from our responses."),
    },
    tired: {
      speaker: 'vell',
      text: "Probably. Yeah. It's late. Or early. Time is weird when you live in a machine.",
      next: 'end',
    },
    rest: {
      speaker: 'vell',
      text: "Sleep doesn't come easy. Never has. Better to be useful than to lie there counting ceiling panels.",
      next: 'end',
    },
    'old-systems': {
      speaker: 'vell',
      text: "Who told you that? Dauro?",
      next: 'old-systems-2',
    },
    'old-systems-2': {
      speaker: 'vell',
      text: "...Fine. Yes. I found fragments in the deep archives. Old navigation data, I think. Coordinates labeled 'home.'",
      choices: [
        { text: "Could that be where we came from?", next: 'origin' },
        { text: "Could that be where we're going?", next: 'destination' },
        { text: "Why haven't you told anyone?", next: 'secret' },
      ],
    },
    origin: {
      speaker: 'vell',
      text: "Maybe. The data is fragmentary. But here's the thing—the file was modified recently. Something is still updating it. Something in the structure's core systems.",
      next: 'end',
      onShow: () => {
        stateManager.modifyRelationship('vell', 1);
        stateManager.addRumor("There's navigation data in the old systems, labeled 'home.' Someone or something is still updating it.");
      },
    },
    destination: {
      speaker: 'vell',
      text: "I don't think we're going anywhere. The structure's been in siege mode for generations. But the data... it's still being updated. By something.",
      next: 'end',
      onShow: () => {
        stateManager.modifyRelationship('vell', 1);
        stateManager.addRumor("Navigation data is still being updated by something in the structure's core systems.");
      },
    },
    secret: {
      speaker: 'vell',
      text: "Because hope is dangerous. If people thought there was somewhere to go, someone to reach... it would change things. And not necessarily for the better.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('vell', 1),
    },
    end: {
      speaker: 'vell',
      text: "Anyway. Don't stay up too late on my account. One insomniac per squad is enough.",
    },
  },
};

export const talkDauroScene: Scene = {
  id: 'talk-dauro',
  type: 'dialogue',
  dialogue: {
    speaker: 'dauro',
    text: '',
  },
  onEnter: () => {
    dialogueSystem.startDialogue(dauroDowntimeDialogue, () => {
      sceneManager.goToScene('crew-quarters');
    });
  },
};

export const dauroDowntimeDialogue: DialogueScript = {
  id: 'dauro-downtime',
  startNode: 'start',
  nodes: {
    start: {
      speaker: 'dauro',
      text: "Hey! I've been working on something. Check it out—I'm mapping the structure. Trying to make sense of how things connect.",
      choices: [
        { text: "Can I see?", next: 'map' },
        { text: "Others have tried that before.", next: 'skeptic' },
        { text: "Why bother? We know the routes that work.", next: 'practical' },
      ],
    },
    map: {
      speaker: 'dauro',
      text: "It's still rough, but look—if you follow the fluid lines, they almost make sense. There's a pattern. The structure wasn't always like this. It was modified. Fused, maybe.",
      next: 'theory',
      onShow: () => stateManager.modifyRelationship('dauro', 1),
    },
    skeptic: {
      speaker: 'dauro',
      text: "I know, I know. Vell told me about the three days they lost trying to do the same thing. But I'm approaching it differently. I'm tracking the infrastructure, not the spaces.",
      next: 'theory',
    },
    practical: {
      speaker: 'dauro',
      text: "But why do they work? Doesn't that question bug you? There's a fluid hopper that supplies a machine room three sectors away with no connecting pipe. How?",
      next: 'theory',
    },
    theory: {
      speaker: 'dauro',
      text: "My theory: the structure was originally two separate vessels. They fused somehow—collision, intentional docking, I don't know. That's why the geometry is broken. Two different logics, merged.",
      choices: [
        { text: "That's... actually interesting.", next: 'support' },
        { text: "What would that mean for the siege?", next: 'siege' },
        { text: "Even if true, does it matter?", next: 'matter' },
      ],
    },
    support: {
      speaker: 'dauro',
      text: "Right? Keth thinks I'm wasting time, but understanding the structure could help us work more efficiently. Predict where failures will happen. Maybe even find... something.",
      next: 'something',
      onShow: () => stateManager.modifyRelationship('dauro', 1),
    },
    siege: {
      speaker: 'dauro',
      text: "That's what I keep thinking about. What if the enemy is the other half? What if we merged with them, and they're trying to... un-merge? To take back what was theirs?",
      next: 'end',
      onShow: () => stateManager.addRumor("Dauro thinks the structure might be two fused vessels, and the enemy might be the other half."),
    },
    matter: {
      speaker: 'dauro',
      text: "Everything matters! Or nothing does. I prefer to think everything matters. Otherwise, what's the point of any of this?",
      next: 'end',
    },
    something: {
      speaker: 'dauro',
      text: "A way out. A way to end this. I know the others have given up, but I can't. Not yet.",
      next: 'end',
    },
    end: {
      speaker: 'dauro',
      text: "Anyway, I should get back to the map. Unless you want to help sometime?",
      onShow: () => stateManager.setFlag('dauro-map-offered'),
    },
  },
};

// ============================================
// REST / END SHIFT
// ============================================

export const restBunkScene: Scene = {
  id: 'rest-bunk',
  type: 'dialogue',
  dialogue: {
    text: '',
  },
  onEnter: () => {
    const summary = shiftSystem.getShiftSummary();
    const endShiftDialogue: DialogueScript = {
      id: 'end-shift',
      startNode: 'start',
      nodes: {
        start: {
          text: `Another shift ends. You repaired ${summary.tasksCompleted} system${summary.tasksCompleted !== 1 ? 's' : ''}. The structure is a little more stable. For now.`,
          next: 'sleep',
        },
        sleep: {
          text: 'You lie down on your bunk. The hum of the structure surrounds you—reactors, circulatory systems, life support. The sounds of a living machine.',
          next: 'dreams',
        },
        dreams: {
          text: 'Sleep comes slowly. When it does, you dream of corridors that go nowhere and everywhere. Of distant lights moving with purpose. Of the work that never ends.',
          next: 'wake',
        },
        wake: {
          text: 'You wake to the sound of the shift alert. Time to begin again.',
        },
      },
    };

    dialogueSystem.startDialogue(endShiftDialogue, () => {
      shiftSystem.endShift();
      sceneManager.goToScene('briefing');
    });
  },
};

// ============================================
// BRIEFING - Start of each shift
// ============================================

export const briefingScene: Scene = {
  id: 'briefing',
  type: 'dialogue',
  background: null,
  dialogue: {
    speaker: 'keth',
    text: '',
  },
  onEnter: () => {
    const shift = stateManager.getShift();
    dialogueSystem.startDialogue(getBriefingDialogue(shift), () => {
      shiftSystem.beginWork();
      sceneManager.goToScene('sector-7-corridor');
    });
  },
};

function getBriefingDialogue(shift: number): DialogueScript {
  const briefings: Record<number, DialogueScript> = {
    1: {
      id: 'briefing-1',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'keth',
          text: "Shift's starting. Atmospheric readings are off in Sector 7-J again.",
          next: 'details',
        },
        details: {
          speaker: 'keth',
          text: 'Bio-filters probably. Third time this cycle. Solenne, you go with them.',
          next: 'assign',
        },
        assign: {
          speaker: 'keth',
          text: "Dauro, fluid pressure in the secondary loop. Vell, sensor calibration in Block C. Orrin—stay close. I have a feeling we'll need you.",
          next: 'end',
        },
        end: {
          speaker: 'solenne',
          text: "Let's go. The moss won't fix itself.",
        },
      },
    },
    2: {
      id: 'briefing-2',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'keth',
          text: "Morning. Or whatever this is. Last shift's repairs are holding, but we've got new problems.",
          next: 'problems',
        },
        problems: {
          speaker: 'keth',
          text: "Sensor array in Block C went offline during sleep cycle. And there's a pressure anomaly in the secondary loop that Dauro couldn't fix yesterday.",
          next: 'vell',
        },
        vell: {
          speaker: 'vell',
          text: "I'll take the sensors. Something's been off in that section for days.",
          next: 'assign',
        },
        assign: {
          speaker: 'keth',
          text: "Fine. You two, pick your priorities. We can't do everything, but we can do something.",
          next: 'end',
        },
        end: {
          text: 'The crew disperses. Another shift begins.',
        },
      },
    },
    3: {
      id: 'briefing-3',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'keth',
          text: "Quiet night. Too quiet. Makes me nervous.",
          next: 'observation',
        },
        observation: {
          speaker: 'dauro',
          text: "The fluid systems are behaving strangely. Pressure readings don't match the flow rates. Like the structure's... rerouting things on its own.",
          next: 'vell',
        },
        vell: {
          speaker: 'vell',
          text: "I noticed the same with the electrical grid. Signals appearing in dead sections. Power flowing through conduits that shouldn't exist.",
          next: 'keth-2',
        },
        'keth-2': {
          speaker: 'keth',
          text: "Just focus on what we can fix. The structure's been adapting since before any of us were born. It'll keep adapting after we're gone.",
          next: 'end',
        },
        end: {
          text: "The crew exchanges glances. Something has changed, but no one can say what.",
        },
      },
    },
    4: {
      id: 'briefing-4',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'keth',
          text: "Reports from the outer sections. Fungal growth has spread further than we thought.",
          next: 'solenne',
        },
        solenne: {
          speaker: 'solenne',
          text: "It's not just spreading—it's connecting. I've mapped the growth patterns. They follow the old wiring paths, but they're building something new.",
          next: 'orrin',
        },
        orrin: {
          speaker: 'orrin',
          text: "As long as it's not breaching walls, it's not my problem. Focus on what's broken.",
          next: 'keth-2',
        },
        'keth-2': {
          speaker: 'keth',
          text: "Orrin's right. Whatever the fungus is doing, we've got more pressing issues. Grow-deck's showing nutrient deficiency. Hopper yard needs maintenance.",
          next: 'end',
        },
        end: {
          text: "The briefing ends, but Solenne's words linger. The structure is changing.",
        },
      },
    },
    5: {
      id: 'briefing-5',
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'vell',
          text: "I found something. In the archives. I need to tell you all.",
          next: 'keth',
        },
        keth: {
          speaker: 'keth',
          text: "This isn't the time for research, Vell. We've got—",
          next: 'vell-2',
        },
        'vell-2': {
          speaker: 'vell',
          text: "Navigation data. Active navigation data. Something is still plotting a course. After all these generations under siege, the structure still knows where it's going.",
          next: 'silence',
        },
        silence: {
          text: "Silence falls over the crew quarters. Even Keth has nothing to say.",
          next: 'dauro',
        },
        dauro: {
          speaker: 'dauro',
          text: "Going where?",
          next: 'vell-3',
        },
        'vell-3': {
          speaker: 'vell',
          text: "I don't know. The data's encrypted with systems we don't have access to. But it's labeled 'ARRIVAL.'",
          next: 'end',
        },
        end: {
          speaker: 'keth',
          text: "...We still have work to do. Whatever's happening, it doesn't change the shift.",
        },
      },
    },
  };

  // Varied default briefings for shifts > 5
  const laterShiftBriefings: DialogueScript[] = [
    {
      id: `briefing-${shift}-a`,
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'keth',
          text: "Another attack during rest cycle. Section 14 took a glancing hit—nothing critical, but the stress is building.",
          next: 'status',
        },
        status: {
          speaker: 'orrin',
          text: "I patched what I could while you slept. But the hull integrity in that sector... we're running out of good material for repairs.",
          next: 'end',
        },
        end: {
          speaker: 'keth',
          text: "Then we make do with bad material. We always have. Move out.",
        },
      },
    },
    {
      id: `briefing-${shift}-b`,
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'solenne',
          text: "The moss cultures predicted the last attack. Three hours before it happened, they started curling.",
          next: 'reaction',
        },
        reaction: {
          speaker: 'vell',
          text: "Coincidence. Plants don't have precognition.",
          next: 'solenne-2',
        },
        'solenne-2': {
          speaker: 'solenne',
          text: "No, but they sense vibrations we can't. Pressure changes. Electromagnetic fluctuations. They're listening to the structure—and the structure knows when attacks are coming.",
          next: 'end',
        },
        end: {
          speaker: 'keth',
          text: "Interesting theory. Write it up when you're done with your actual work.",
        },
      },
    },
    {
      id: `briefing-${shift}-c`,
      startNode: 'start',
      nodes: {
        start: {
          speaker: 'dauro',
          text: "I've been thinking about my theory. The two-vessel theory. I think I found proof.",
          next: 'proof',
        },
        proof: {
          speaker: 'dauro',
          text: "The fluid systems in the outer sections—they use a completely different pressure standard. Different pipe gauges. Different seals. It's not just repairs layered on repairs. It's two different engineering philosophies, merged.",
          next: 'reaction',
        },
        reaction: {
          speaker: 'keth',
          text: "Even if that's true—and I'm not saying it is—what does it change? We're still here. The siege is still happening.",
          next: 'end',
        },
        end: {
          speaker: 'dauro',
          text: "It changes everything. If the structure is two things that became one... maybe the enemy is what happens when they try to separate again.",
        },
      },
    },
  ];

  // Return specific briefing or cycle through later ones
  if (briefings[shift]) {
    return briefings[shift];
  }

  // Cycle through the varied briefings for higher shifts
  const index = (shift - 6) % laterShiftBriefings.length;
  const briefing = laterShiftBriefings[index];
  briefing.id = `briefing-${shift}`;
  return briefing;
}

// ============================================
// THE WOUND - Emergency breach zone
// ============================================

export const theWoundScene: Scene = {
  id: 'the-wound',
  type: 'maintenance',
  background: null,
  maintenance: {
    systemId: 'breach-emergency',
    type: 'mechanical',
    status: {
      name: 'Hull Integrity - Section 14',
      health: 25,
      warnings: ['ACTIVE BREACH', 'Atmosphere venting', 'Structural stress critical'],
      critical: true,
    },
    interactions: [],
  },
  onEnter: () => {
    shiftSystem.showIndicator();
    const task = createEmergencyTask();
    maintenanceSystem.startTask(task);

    // Start Orrin context dialogue
    if (!stateManager.hasVisited('the-wound')) {
      setTimeout(() => {
        dialogueSystem.startDialogue(woundIntroDialogue);
      }, 500);
    }
  },
  onExit: () => {
    if (maintenanceSystem.isActive()) {
      maintenanceSystem.finishTask(false);
      shiftSystem.completeTask('breach-emergency');
      shiftSystem.endEmergency('work');
    }
  },
};

const woundIntroDialogue: DialogueScript = {
  id: 'wound-intro',
  startNode: 'start',
  nodes: {
    start: {
      speaker: 'orrin',
      text: "There. You can see it. The hull's peeled back like skin. Something hit us hard.",
      next: 'assessment',
    },
    assessment: {
      speaker: 'orrin',
      text: "Seal first, questions later. I've seen people die from stopping to think.",
      choices: [
        { text: "What's the fastest approach?", next: 'fast' },
        { text: "Is anyone hurt?", next: 'hurt' },
        { text: "Let's get to work.", next: 'work' },
      ],
    },
    fast: {
      speaker: 'orrin',
      text: "Emergency sealant on the breach. Brace the structure. Reroute atmosphere. In that order. Don't improvise.",
      next: 'end',
    },
    hurt: {
      speaker: 'orrin',
      text: "Not yet. But that venting atmosphere isn't going to wait for us to check. Move.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('orrin', 1),
    },
    work: {
      speaker: 'orrin',
      text: "Good. No hesitation. I like that.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('orrin', 1),
    },
    end: {
      text: "The breach gapes before you. Beyond it, a glimpse of something vast and dark. Stars, perhaps. Or something else.",
    },
  },
};


// ============================================
// ORRIN CONVERSATION
// ============================================

export const talkOrrinScene: Scene = {
  id: 'talk-orrin',
  type: 'dialogue',
  dialogue: {
    speaker: 'orrin',
    text: '',
  },
  onEnter: () => {
    dialogueSystem.startDialogue(orrinDowntimeDialogue, () => {
      sceneManager.goToScene('crew-quarters');
    });
  },
};

export const orrinDowntimeDialogue: DialogueScript = {
  id: 'orrin-downtime',
  startNode: 'start',
  nodes: {
    start: {
      speaker: 'orrin',
      text: stateManager.getFlag('breach-contained')
        ? "You did well out there. Didn't freeze. That's rarer than you'd think."
        : "Rest while you can. The next breach won't wait for you to be ready.",
      choices: [
        { text: "You've been doing this a long time.", next: 'history' },
        { text: "What did you see? In the breach?", next: 'breach' },
        { text: "How do you stay calm out there?", next: 'calm' },
      ],
    },
    history: {
      speaker: 'orrin',
      text: "Twenty-three years in damage response. Started young, stayed too long. At some point you stop counting and just... keep going.",
      next: 'history-2',
    },
    'history-2': {
      speaker: 'orrin',
      text: "I've sealed more breaches than I can remember. Pulled people out of collapsing sections. Held hands while... well. You learn to compartmentalize.",
      choices: [
        { text: "How do you keep doing it?", next: 'keep-going' },
        { text: "I don't know if I could.", next: 'doubt' },
      ],
    },
    'keep-going': {
      speaker: 'orrin',
      text: "Someone has to. And I'm still here, which means I'm not done. When I stop being useful, I'll stop. Not before.",
      next: 'end',
    },
    doubt: {
      speaker: 'orrin',
      text: "You already are. You're here, aren't you? The work doesn't ask if you can. It just asks if you will.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('orrin', 1),
    },
    breach: {
      speaker: 'orrin',
      text: "...You want to know what I saw.",
      next: 'breach-2',
    },
    'breach-2': {
      speaker: 'orrin',
      text: "I was young. New to the squad. There was a breach—bad one. Pressure was venting, couldn't see. And through the gap, for just a second...",
      next: 'breach-3',
    },
    'breach-3': {
      speaker: 'orrin',
      text: "A light. Moving. Not random—deliberate. Like it was looking for something. Looking at me. Then the seal went up and it was gone.",
      choices: [
        { text: "What do you think it was?", next: 'theory' },
        { text: "Maybe it was just stars.", next: 'dismiss' },
      ],
    },
    theory: {
      speaker: 'orrin',
      text: "I don't think about it. That's how you stay sane. You don't ask what's out there, you just fix what's in here. The rest is noise.",
      next: 'end',
      onShow: () => stateManager.addRumor("Orrin saw something looking back through a breach. A light, moving with purpose."),
    },
    dismiss: {
      speaker: 'orrin',
      text: "Maybe. I tell myself that sometimes. But stars don't look. Stars don't... track.",
      next: 'end',
      onShow: () => stateManager.addRumor("Orrin is haunted by something he saw during an early breach."),
    },
    calm: {
      speaker: 'orrin',
      text: "I don't. I just act anyway. Fear is fine. Freezing isn't. You can be terrified and still move. That's all the job asks.",
      next: 'calm-2',
    },
    'calm-2': {
      speaker: 'orrin',
      text: "The structure is dying. Has been dying since before I was born. Every repair is temporary. But temporary is enough. Temporary is all we have.",
      next: 'end',
      onShow: () => stateManager.modifyRelationship('orrin', 1),
    },
    end: {
      speaker: 'orrin',
      text: "Get some rest. I'll be here if something opens up.",
    },
  },
};

// ============================================
// NAVIGATION BACK BUTTON FOR MAINTENANCE
// ============================================

export const navBackToCorridorScene: Scene = {
  id: 'nav-back-corridor',
  type: 'navigation',
  navigation: {
    locationId: 'back',
    hotspots: [
      {
        id: 'back',
        x: 50,
        y: 80,
        targetScene: 'sector-7-corridor',
        label: 'Return to Corridor',
      },
    ],
  },
};

// ============================================
// Export all location scenes
// ============================================

export const locationScenes: Scene[] = [
  crewQuartersScene,
  sector7CorridorScene,
  atmosphericScene,
  fluidSystemsScene,
  electricalHubScene,
  hopperYardScene,
  growDeckScene,
  fungalDepthsScene,
  fungalNetworkScene,
  fungalDeeperScene,
  theWoundScene,
  talkKethScene,
  talkSolenneScene,
  talkVellScene,
  talkDauroScene,
  talkOrrinScene,
  restBunkScene,
  briefingScene,
  navBackToCorridorScene,
];

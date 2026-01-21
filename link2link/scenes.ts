import { Scene, DialogueNode } from './types';

export const scenes: Record<string, Scene> = {
  // Hub location - Where do you want to "accidentally" run into Link?
  'hyrule-field': {
    id: 'hyrule-field',
    location: 'Hyrule Field',
    background: 'bg-field',
    availableCharacters: ['link'],
    dialogues: {},
    navigationOptions: [
      { label: 'Stables (Link visits often)', targetScene: 'stable' },
      { label: 'Goron Hot Springs (He bathes here... naked)', targetScene: 'hot-spring' },
      { label: 'Cooking Pot (He eats... a lot)', targetScene: 'cooking-pot' },
      { label: 'Training Grounds', targetScene: 'training-grounds' },
      { label: 'Fairy Fountain', targetScene: 'fairy-fountain' },
      { label: 'His Camp (stalker mode)', targetScene: 'camp' },
      { label: 'Rest for the Day', targetScene: 'end-day' }
    ]
  },

  'stable': {
    id: 'stable',
    location: 'Dueling Peaks Stable',
    background: 'bg-ranch',
    availableCharacters: ['link'],
    dialogues: {
      link: createStableDialogues()
    },
    navigationOptions: [
      { label: 'Return to Hyrule Field', targetScene: 'hyrule-field' }
    ]
  },

  'hot-spring': {
    id: 'hot-spring',
    location: 'Goron Hot Springs',
    background: 'bg-hotspring',
    availableCharacters: ['link'],
    dialogues: {
      link: createHotSpringDialogues()
    },
    navigationOptions: [
      { label: 'Return to Hyrule Field', targetScene: 'hyrule-field' }
    ]
  },

  'cooking-pot': {
    id: 'cooking-pot',
    location: 'Cooking Pot',
    background: 'bg-market',
    availableCharacters: ['link'],
    dialogues: {
      link: createCookingDialogues()
    },
    navigationOptions: [
      { label: 'Return to Hyrule Field', targetScene: 'hyrule-field' }
    ]
  },

  'training-grounds': {
    id: 'training-grounds',
    location: 'Training Grounds',
    background: 'bg-castle',
    availableCharacters: ['link'],
    dialogues: {
      link: createTrainingDialogues()
    },
    navigationOptions: [
      { label: 'Return to Hyrule Field', targetScene: 'hyrule-field' }
    ]
  },

  'fairy-fountain': {
    id: 'fairy-fountain',
    location: 'Great Fairy Fountain',
    background: 'bg-forest',
    availableCharacters: ['link'],
    dialogues: {
      link: createFairyFountainDialogues()
    },
    navigationOptions: [
      { label: 'Return to Hyrule Field', targetScene: 'hyrule-field' }
    ]
  },

  'camp': {
    id: 'camp',
    location: "Link's Campsite",
    background: 'bg-twilight',
    availableCharacters: ['link'],
    dialogues: {
      link: createCampDialogues()
    },
    navigationOptions: [
      { label: 'Return to Hyrule Field', targetScene: 'hyrule-field' }
    ]
  }
};

function createStableDialogues(): DialogueNode[] {
  return [
    // Day 1
    {
      id: 'link-d1-start',
      speaker: 'link',
      text: "*Link is brushing Epona, his tunic sleeves rolled up, forearms glistening with effort. He notices you and tilts his head curiously*",
      emotion: 'happy',
      next: 'link-d1-2'
    },
    {
      id: 'link-d1-2',
      speaker: 'link',
      text: "...",
      emotion: 'happy',
      next: 'link-d1-3'
    },
    {
      id: 'link-d1-3',
      speaker: 'narrator',
      text: "*He gestures toward Epona, offering you a brush. His eyes are impossibly blue up close.*",
      choices: [
        { text: "*Take the brush, fingers brushing his*", next: 'link-d1-touch', affectionChange: 15 },
        { text: "She's beautiful. You must care for her a lot.", next: 'link-d1-compliment', affectionChange: 10 },
        { text: "I'm more of a sand seal person.", next: 'link-d1-wrong', affectionChange: -5 }
      ]
    },
    {
      id: 'link-d1-touch',
      speaker: 'link',
      text: "*His ears twitch - you swear they turn slightly pink. He doesn't pull his hand away.*",
      emotion: 'blush',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-compliment',
      speaker: 'link',
      text: "*A genuine smile crosses his face. He pats Epona proudly, then looks at you with warmth in his eyes*",
      emotion: 'happy',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-wrong',
      speaker: 'link',
      text: "*Link's expression doesn't change, but Epona gives you a LOOK. You've made a powerful enemy today.*",
      emotion: 'sad',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-end',
      speaker: 'link',
      text: "*Link gives a small wave as you leave. Was that... did he watch you walk away?*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // Day 2+
    {
      id: 'link-d2-start',
      speaker: 'narrator',
      text: "*Link's face lights up when he sees you. He actually WAVES. Enthusiastically. The stable workers exchange knowing looks.*",
      emotion: 'happy',
      next: 'link-d2-2'
    },
    {
      id: 'link-d2-2',
      speaker: 'link',
      text: "*He pats the spot next to him on the hay bale. Very close next to him.*",
      emotion: 'blush',
      choices: [
        { text: "*Sit so close your thighs touch*", next: 'link-d2-close', affectionChange: 20 },
        { text: "*Sit down and lean against his shoulder*", next: 'link-d2-lean', affectionChange: 15 },
        { text: "*Stay standing, playing hard to get*", next: 'link-d2-stand', affectionChange: 5 }
      ]
    },
    {
      id: 'link-d2-close',
      speaker: 'link',
      text: "*He doesn't move away. In fact, he shifts CLOSER. His hand finds yours in the hay. He squeezes once.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-lean',
      speaker: 'link',
      text: "*A small content sigh escapes him. He smells like horses and campfire and something uniquely Link. His arm slowly wraps around you.*",
      emotion: 'happy',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-stand',
      speaker: 'link',
      text: "*He looks up at you with those devastating eyes, pats the spot again more insistently. The man knows what he wants.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-end',
      speaker: 'link',
      text: "*As you leave, he catches your hand and presses something into it - a flower. A Silent Princess. He found it. For you.*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // High affection
    {
      id: 'link-high-start',
      speaker: 'narrator',
      text: "*Link is waiting for you. He leads you to a private corner of the stable, hay scattered on the floor, lantern light golden.*",
      emotion: 'blush',
      next: 'link-high-2'
    },
    {
      id: 'link-high-2',
      speaker: 'link',
      text: "*He cups your face in calloused hands. Those eyes search yours, asking a question words never could.*",
      emotion: 'happy',
      choices: [
        { text: "*Kiss him*", next: 'link-confession', affectionChange: 25 },
        { text: "Link, I... we shouldn't...", next: 'link-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'link-confession',
      speaker: 'link',
      text: "*He pulls you into the hay, finally breaking his silence with a single breathless word:* ...Stay.",
      emotion: 'happy',
      action: { type: 'ending', value: 'stable' }
    },
    {
      id: 'link-reject',
      speaker: 'link',
      text: "*His hands drop. For the first time, you see hurt in those eyes. He turns away, shoulders tense. Epona whinnies sadly.*",
      emotion: 'sad',
      action: { type: 'location', value: 'hyrule-field' }
    }
  ];
}

function createHotSpringDialogues(): DialogueNode[] {
  return [
    // Day 1
    {
      id: 'link-d1-start',
      speaker: 'narrator',
      text: "*The volcanic heat of Death Mountain has one benefit: the legendary Goron Hot Springs. And there, neck-deep in steaming water, is Link. Completely. Naked.*",
      emotion: 'surprised',
      next: 'link-d1-2'
    },
    {
      id: 'link-d1-2',
      speaker: 'narrator',
      text: "*His tunic and those tiny Gerudo shorts are piled on a rock. Steam rises off his bronzed skin, water beading down abs that could stop a Lynel mid-charge. He hasn't noticed you yet. He stretches, muscles rippling, and lets out a satisfied groan that echoes off the volcanic rocks.*",
      emotion: 'blush',
      choices: [
        { text: "*Clear your throat before you combust*", next: 'link-d1-polite', affectionChange: 10 },
        { text: "*Memorize every detail. For research.*", next: 'link-d1-stare', affectionChange: 5 },
        { text: "*Strip and slide in next to him*", next: 'link-d1-bold', affectionChange: 15 }
      ]
    },
    {
      id: 'link-d1-polite',
      speaker: 'link',
      text: "*He turns, completely unbothered by his nudity. Those blue eyes travel down your body slowly, appreciatively. He gestures to the water, one eyebrow raised. An invitation. A challenge.*",
      emotion: 'happy',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-stare',
      speaker: 'link',
      text: "*He catches you looking and his lips curl into a knowing smirk. He stands up slowly - VERY slowly - water cascading down his body, flexing deliberately. The Gorons weren't kidding about this spring's healing properties because you're about to pass out.*",
      emotion: 'blush',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-bold',
      speaker: 'link',
      text: "*His eyes go dark with hunger as he watches you undress. The moment you're in the water, he pulls you against him under the surface. Skin on skin. Heat on heat. His breath catches.*",
      emotion: 'blush',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-end',
      speaker: 'link',
      text: "*As you eventually leave on shaky legs, he pulls you back for one moment - presses his wet body against yours and brushes lips against your ear. You feel his smirk. And... other things.*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // Day 2+
    {
      id: 'link-d2-start',
      speaker: 'link',
      text: "*He's already in the spring when you arrive. Clearly waiting. Fire keese petals float on the water - they glow red in the volcanic light. He reaches for you.*",
      emotion: 'happy',
      next: 'link-d2-2'
    },
    {
      id: 'link-d2-2',
      speaker: 'narrator',
      text: "*His hands find you underwater, pulling you into his lap. The heat of the spring is NOTHING compared to the heat between you. You can feel exactly how happy he is to see you.*",
      emotion: 'blush',
      choices: [
        { text: "*Wrap your legs around him*", next: 'link-d2-embrace', affectionChange: 20 },
        { text: "*Pull his hair and expose his throat*", next: 'link-d2-hair', affectionChange: 20 },
        { text: "*Grind against him 'accidentally'*", next: 'link-d2-splash', affectionChange: 15 }
      ]
    },
    {
      id: 'link-d2-embrace',
      speaker: 'link',
      text: "*A guttural groan escapes him as your bodies lock together. His hands grip your hips, guiding your movements. The water churns. His restraint visibly crumbles.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-hair',
      speaker: 'link',
      text: "*His head falls back with a desperate sound, offering himself to you. When you bite down on his exposed throat, his whole body SHUDDERS. His fingers dig into your skin, leaving marks.*",
      emotion: 'happy',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-splash',
      speaker: 'link',
      text: "*His eyes roll back. His hips buck against you instinctively. He looks at you with pure, unbridled WANT. The 'accident' becomes very much on purpose as he returns the favor.*",
      emotion: 'happy',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-end',
      speaker: 'link',
      text: "*Before you leave, he pins you against the hot rock wall, bodies pressed together, forehead against yours. His voice is wrecked:* ...More. Soon.",
      emotion: 'blush',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // High affection - THE SPICY SCENE
    {
      id: 'link-high-start',
      speaker: 'narrator',
      text: "*Midnight at the Goron Hot Springs. The volcanic glow paints everything red. Link is waiting, and he's done pretending this is just bathing. His expression is raw, hungry, FERAL.*",
      emotion: 'blush',
      next: 'link-high-2'
    },
    {
      id: 'link-high-2',
      speaker: 'link',
      text: "*He rises from the water like a god. Steam curls around his body as he stalks toward you, water streaming down every perfect muscle. He's not hiding anything anymore. Not his body. Not his desire. Not the effect you have on him. He pulls you against him, both of you bare, skin burning, and speaks in a voice like gravel:* ...Need you. Now.",
      emotion: 'happy',
      choices: [
        { text: "*Devour him completely*", next: 'link-confession', affectionChange: 25 },
        { text: "Link, we can't...", next: 'link-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'link-confession',
      speaker: 'link',
      text: "*The water ERUPTS around you as he lifts you onto the heated rocks and shows you exactly what a hero with infinite stamina can do. The Gorons will have to rename this place after tonight. That stamina wheel refills three times. THREE. By the time the sun rises, you've both lost count, lost your voices, lost your minds. His silent nature breaks completely - your name is the only word he knows anymore.*",
      emotion: 'happy',
      action: { type: 'ending', value: 'hotspring' }
    },
    {
      id: 'link-reject',
      speaker: 'link',
      text: "*He freezes, chest heaving, body trembling with restrained need. The hurt in those blue eyes is devastating. He sinks back into the water alone, and the steam suddenly feels cold.*",
      emotion: 'sad',
      action: { type: 'location', value: 'hyrule-field' }
    }
  ];
}

function createCookingDialogues(): DialogueNode[] {
  return [
    // Day 1
    {
      id: 'link-d1-start',
      speaker: 'narrator',
      text: "*Link is aggressively cooking. He's thrown a diamond, three apples, and a live frog into the pot. He seems confident.*",
      emotion: 'surprised',
      next: 'link-d1-2'
    },
    {
      id: 'link-d1-2',
      speaker: 'link',
      text: "*He offers you the resulting... dish? It's glowing. That's probably fine.*",
      emotion: 'happy',
      choices: [
        { text: "*Eat it. For him. For love.*", next: 'link-d1-eat', affectionChange: 15 },
        { text: "Maybe I could show you some recipes?", next: 'link-d1-teach', affectionChange: 10 },
        { text: "I'm... not hungry. Ever again.", next: 'link-d1-refuse', affectionChange: -5 }
      ]
    },
    {
      id: 'link-d1-eat',
      speaker: 'link',
      text: "*His face LIGHTS UP as you choke it down. You gain three hearts and lose your dignity. Worth it for that smile.*",
      emotion: 'happy',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-teach',
      speaker: 'link',
      text: "*He nods eagerly, scooting close to watch you cook. VERY close. His chin practically on your shoulder.*",
      emotion: 'blush',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-refuse',
      speaker: 'link',
      text: "*He eats the whole thing himself without breaking eye contact. Power move. The man is immune to poison at this point.*",
      emotion: 'sad',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-end',
      speaker: 'link',
      text: "*He saves you the last bite of his next creation. It's somehow worse. But he's watching so hopefully...*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // Day 2+
    {
      id: 'link-d2-start',
      speaker: 'narrator',
      text: "*Link has prepared a whole feast. It's actually... edible? He looks at you expectantly, ears practically vibrating.*",
      emotion: 'happy',
      next: 'link-d2-2'
    },
    {
      id: 'link-d2-2',
      speaker: 'link',
      text: "*He made your favorite. How did he know? Has he been watching you eat? Is that creepy or romantic? ...Yes.*",
      emotion: 'blush',
      choices: [
        { text: "*Feed him a bite from your fork*", next: 'link-d2-feed', affectionChange: 20 },
        { text: "This is delicious! You learned!", next: 'link-d2-praise', affectionChange: 15 },
        { text: "*Critique the plating*", next: 'link-d2-critique', affectionChange: -5 }
      ]
    },
    {
      id: 'link-d2-feed',
      speaker: 'link',
      text: "*He leans forward to take the bite, maintaining eye contact the entire time. His lips brush your fingers. 'Accidentally.'*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-praise',
      speaker: 'link',
      text: "*He practically glows with pride. Then immediately throws a rock into the pot for his next dish. Baby steps.*",
      emotion: 'happy',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-critique',
      speaker: 'link',
      text: "*He looks at the plate. At you. At the plate. Pushes everything onto the ground and walks away. Deserved.*",
      emotion: 'angry',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-end',
      speaker: 'link',
      text: "*He packs up the leftovers and presses them into your hands, lingering. The way to his heart is through his stomach. Literally.*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // High affection
    {
      id: 'link-high-start',
      speaker: 'narrator',
      text: "*Link has set up a candlelit dinner. There's a tablecloth. Flowers. He's TRYING. The food only glows a little.*",
      emotion: 'blush',
      next: 'link-high-2'
    },
    {
      id: 'link-high-2',
      speaker: 'link',
      text: "*After dinner, he pulls out a small box. Inside is a hearty meal he's clearly been saving. He offers it:* ...Forever?",
      emotion: 'happy',
      choices: [
        { text: "*Take the meal. Take him.*", next: 'link-confession', affectionChange: 25 },
        { text: "I can't accept this, Link.", next: 'link-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'link-confession',
      speaker: 'link',
      text: "*He sweeps everything off the table, pulls you onto it, and shows you that his appetite isn't just for food. Best. Meal. Ever.*",
      emotion: 'happy',
      action: { type: 'ending', value: 'cooking' }
    },
    {
      id: 'link-reject',
      speaker: 'link',
      text: "*He slowly closes the box. Eats the meal himself while staring at you. Spite-eating. Iconic but sad.*",
      emotion: 'sad',
      action: { type: 'location', value: 'hyrule-field' }
    }
  ];
}

function createTrainingDialogues(): DialogueNode[] {
  return [
    // Day 1
    {
      id: 'link-d1-start',
      speaker: 'narrator',
      text: "*Link is training shirtless because of course he is. His sword work is flawless. His form is devastating. Your focus is... elsewhere.*",
      emotion: 'blush',
      next: 'link-d1-2'
    },
    {
      id: 'link-d1-2',
      speaker: 'link',
      text: "*He notices you watching. Throws his sword, catches it behind his back, winks. WINKS. This man knows exactly what he's doing.*",
      emotion: 'happy',
      choices: [
        { text: "Teach me? I want to learn... sword stuff.", next: 'link-d1-teach', affectionChange: 15 },
        { text: "*Slow clap*", next: 'link-d1-clap', affectionChange: 10 },
        { text: "Show-off.", next: 'link-d1-tease', affectionChange: 10 }
      ]
    },
    {
      id: 'link-d1-teach',
      speaker: 'link',
      text: "*He moves behind you, positioning your stance. His chest against your back, hands over yours on the sword. 'Teaching.'*",
      emotion: 'blush',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-clap',
      speaker: 'link',
      text: "*He takes a dramatic bow, then does a backflip for absolutely no reason. Maximum showing off. You're into it.*",
      emotion: 'happy',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-tease',
      speaker: 'link',
      text: "*He grins - actually GRINS - and beckons you forward. Challenge accepted. He likes your attitude.*",
      emotion: 'happy',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-end',
      speaker: 'link',
      text: "*Training ends with both of you breathless. He hands you a water bottle, fingers lingering. Eye contact intense.*",
      emotion: 'blush',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // Day 2+
    {
      id: 'link-d2-start',
      speaker: 'link',
      text: "*Link's waiting with two practice swords. But the way he's looking at you isn't about fighting.*",
      emotion: 'happy',
      next: 'link-d2-2'
    },
    {
      id: 'link-d2-2',
      speaker: 'narrator',
      text: "*The sparring gets intense. You end up pinned beneath him on the training mat, his breath hot on your neck.*",
      emotion: 'blush',
      choices: [
        { text: "*Pull him closer by his hair*", next: 'link-d2-pull', affectionChange: 20 },
        { text: "*Flip positions, pin HIM*", next: 'link-d2-flip', affectionChange: 20 },
        { text: "I yield...", next: 'link-d2-yield', affectionChange: 10 }
      ]
    },
    {
      id: 'link-d2-pull',
      speaker: 'link',
      text: "*A sound escapes him that is DEFINITELY not appropriate for a training ground. His eyes are all pupil.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-flip',
      speaker: 'link',
      text: "*He looks up at you in shock. Then grins. He LET you win and you both know it. But he stays down, waiting.*",
      emotion: 'happy',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-yield',
      speaker: 'link',
      text: "*He stays hovering over you longer than necessary. Much longer. Then slowly helps you up, hand not letting go.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-end',
      speaker: 'link',
      text: "*He walks you home, keeping close. At your door, he tucks a strand of hair behind your ear and just... looks.*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // High affection
    {
      id: 'link-high-start',
      speaker: 'narrator',
      text: "*Late night training. Just you and Link. The tension is thick enough to cut with the Master Sword.*",
      emotion: 'blush',
      next: 'link-high-2'
    },
    {
      id: 'link-high-2',
      speaker: 'link',
      text: "*He drops his sword. Walks toward you with predator's grace. Pulls you close and whispers:* ...Spar differently?",
      emotion: 'happy',
      choices: [
        { text: "*Drop your sword. Drop everything.*", next: 'link-confession', affectionChange: 25 },
        { text: "Link, this isn't... we're here to train.", next: 'link-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'link-confession',
      speaker: 'link',
      text: "*He proves that combat skills translate VERY well to other activities. That stamina isn't just for fighting. Three words: Par. Ry. This.*",
      emotion: 'happy',
      action: { type: 'ending', value: 'training' }
    },
    {
      id: 'link-reject',
      speaker: 'link',
      text: "*He picks up his sword in silence. The rest of training is cold, professional. You've never seen him look so defeated. Not even against Ganon.*",
      emotion: 'sad',
      action: { type: 'location', value: 'hyrule-field' }
    }
  ];
}

function createFairyFountainDialogues(): DialogueNode[] {
  return [
    // Day 1
    {
      id: 'link-d1-start',
      speaker: 'narrator',
      text: "*Link is getting a fairy to heal him. The Great Fairy is being VERY handsy about it. You feel a strange urge to intervene.*",
      emotion: 'surprised',
      next: 'link-d1-2'
    },
    {
      id: 'link-d1-2',
      speaker: 'link',
      text: "*He spots you and immediately escapes the Great Fairy's grasp, looking relieved. He mouths 'help me.'*",
      emotion: 'surprised',
      choices: [
        { text: "*Grab his hand and pull him away*", next: 'link-d1-rescue', affectionChange: 15 },
        { text: "I think she likes you~", next: 'link-d1-tease', affectionChange: 5 },
        { text: "*Just watch. It's kind of funny.*", next: 'link-d1-watch', affectionChange: -5 }
      ]
    },
    {
      id: 'link-d1-rescue',
      speaker: 'link',
      text: "*He squeezes your hand gratefully, pulling you both behind a rock. Close. Hiding. Breathing the same air.*",
      emotion: 'blush',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-tease',
      speaker: 'link',
      text: "*He shoots you a betrayed look. The Great Fairy giggles. Link has seen things. Terrible things. He needs comfort later.*",
      emotion: 'sad',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-watch',
      speaker: 'link',
      text: "*The Great Fairy KISSES him. Link's soul visibly leaves his body. When she releases him, he's traumatized. But sparkly.*",
      emotion: 'angry',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-end',
      speaker: 'link',
      text: "*Later, away from the fountain, he bumps his shoulder against yours. His way of saying thanks. Or sorry. Or both.*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // Day 2+
    {
      id: 'link-d2-start',
      speaker: 'narrator',
      text: "*Link brings you to the fountain at night. It's beautiful. The Great Fairy is asleep. He looks relieved.*",
      emotion: 'happy',
      next: 'link-d2-2'
    },
    {
      id: 'link-d2-2',
      speaker: 'link',
      text: "*He sits by the water's edge, pats the spot next to him. Fairy lights dance around you both.*",
      emotion: 'blush',
      choices: [
        { text: "*Rest your head on his shoulder*", next: 'link-d2-rest', affectionChange: 20 },
        { text: "*Catch a fairy light for him*", next: 'link-d2-fairy', affectionChange: 15 },
        { text: "Why did you bring me here?", next: 'link-d2-ask', affectionChange: 10 }
      ]
    },
    {
      id: 'link-d2-rest',
      speaker: 'link',
      text: "*He rests his head atop yours. You feel him breathe deeply, contentedly. In this moment, there's no Calamity. Just this.*",
      emotion: 'happy',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-fairy',
      speaker: 'link',
      text: "*He watches you with wonder as the light dances on your palm. He cups his hands around yours, trapping the glow between you.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-ask',
      speaker: 'link',
      text: "*He touches his chest, then points to you, then to the beautiful scene around you. Even silent, the message is clear: he wanted to share this with YOU.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-end',
      speaker: 'link',
      text: "*As you leave, he tucks a tiny fairy light into your hair. It glows like a piece of his heart, gifted to you.*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // High affection
    {
      id: 'link-high-start',
      speaker: 'narrator',
      text: "*The fountain glows with magic. Link leads you into the shallow water, fairy lights swirling around you both.*",
      emotion: 'blush',
      next: 'link-high-2'
    },
    {
      id: 'link-high-2',
      speaker: 'link',
      text: "*He places both hands over his heart, then over yours. The fairy magic pulses. He's giving you his blessing. His heart. Him.*",
      emotion: 'happy',
      choices: [
        { text: "*Kiss him in the fairy light*", next: 'link-confession', affectionChange: 25 },
        { text: "I can't accept your heart, Link.", next: 'link-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'link-confession',
      speaker: 'link',
      text: "*The fairy magic explodes around you as you kiss. When it fades, you're both glowing. Bonded. His one word, breathed against your lips:* ...Yours.",
      emotion: 'happy',
      action: { type: 'ending', value: 'fairy' }
    },
    {
      id: 'link-reject',
      speaker: 'link',
      text: "*The fairy lights dim. He withdraws into himself, walking away into the darkness. Even the Great Fairy looks sad. (She was watching. Creepy.)*",
      emotion: 'sad',
      action: { type: 'location', value: 'hyrule-field' }
    }
  ];
}

function createCampDialogues(): DialogueNode[] {
  return [
    // Day 1
    {
      id: 'link-d1-start',
      speaker: 'narrator',
      text: "*You find Link's campsite. He's sleeping by the fire, face peaceful, chest rising slowly. He looks vulnerable. Soft.*",
      emotion: 'happy',
      next: 'link-d1-2'
    },
    {
      id: 'link-d1-2',
      speaker: 'narrator',
      text: "*He stirs, eyes opening. For a moment, pure joy crosses his face at seeing you. Then he remembers to be cool.*",
      emotion: 'blush',
      choices: [
        { text: "Couldn't sleep. Can I join you?", next: 'link-d1-join', affectionChange: 15 },
        { text: "*Sit down without asking*", next: 'link-d1-bold', affectionChange: 10 },
        { text: "I followed you here.", next: 'link-d1-honest', affectionChange: 5 }
      ]
    },
    {
      id: 'link-d1-join',
      speaker: 'link',
      text: "*He lifts his blanket in invitation. It's a two-person sleeping bag. Did he... plan this?*",
      emotion: 'blush',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-bold',
      speaker: 'link',
      text: "*He nods approvingly, scooting over to make room. Throws you an apple from his inventory. Hospitality.*",
      emotion: 'happy',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-honest',
      speaker: 'link',
      text: "*He blinks. Processes that information. Then smiles and pats the ground next to him. Not creeped out. Flattered?*",
      emotion: 'happy',
      next: 'link-d1-end'
    },
    {
      id: 'link-d1-end',
      speaker: 'link',
      text: "*You stay until dawn, watching stars, stealing glances. He 'accidentally' falls asleep on your shoulder. Sure, hero. 'Accidentally.'*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // Day 2+
    {
      id: 'link-d2-start',
      speaker: 'link',
      text: "*He's set up a second bedroll. Next to his. Touching distance. He gestures to it with forced casualness.*",
      emotion: 'blush',
      next: 'link-d2-2'
    },
    {
      id: 'link-d2-2',
      speaker: 'narrator',
      text: "*The fire crackles. Stars wheel overhead. He reaches across the gap between bedrolls, hand searching for yours.*",
      emotion: 'happy',
      choices: [
        { text: "*Intertwine your fingers with his*", next: 'link-d2-hold', affectionChange: 20 },
        { text: "*Scoot your bedroll against his*", next: 'link-d2-closer', affectionChange: 20 },
        { text: "*Just let him find your hand*", next: 'link-d2-find', affectionChange: 15 }
      ]
    },
    {
      id: 'link-d2-hold',
      speaker: 'link',
      text: "*He squeezes tight. His thumb traces circles on your palm. Neither of you sleep, and neither of you mind.*",
      emotion: 'happy',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-closer',
      speaker: 'link',
      text: "*He immediately pulls you against him, your back to his chest, arm wrapped around you. Big spoon energy from the Hero of Hyrule.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-find',
      speaker: 'link',
      text: "*When he finds it, his breath catches. He brings your hand to his lips, presses a kiss to your knuckles. Courtly. Romantic. Devastating.*",
      emotion: 'blush',
      next: 'link-d2-end'
    },
    {
      id: 'link-d2-end',
      speaker: 'link',
      text: "*In the morning, he makes you breakfast in bed(roll). Eggs and mushrooms. No rocks this time. Growth.*",
      emotion: 'happy',
      action: { type: 'location', value: 'hyrule-field' }
    },

    // High affection
    {
      id: 'link-high-start',
      speaker: 'narrator',
      text: "*One bedroll tonight. Link's already in it, holding it open for you. His intent couldn't be clearer.*",
      emotion: 'blush',
      next: 'link-high-2'
    },
    {
      id: 'link-high-2',
      speaker: 'link',
      text: "*He pulls you in, wrapping around you completely. Face inches from yours. He breaks his silence:* ...Stay. Always.",
      emotion: 'happy',
      choices: [
        { text: "*Kiss him under the stars*", next: 'link-confession', affectionChange: 25 },
        { text: "I can't be with you like this, Link.", next: 'link-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'link-confession',
      speaker: 'link',
      text: "*Under the Hyrulean stars, the Hero of Time becomes YOUR hero. Every touch speaks volumes his voice never could. By dawn, you're his. He's yours.*",
      emotion: 'happy',
      action: { type: 'ending', value: 'camp' }
    },
    {
      id: 'link-reject',
      speaker: 'link',
      text: "*He releases you immediately. Rolls over. You hear no sound, but his shoulders shake. You broke the hero. Good job.*",
      emotion: 'sad',
      action: { type: 'location', value: 'hyrule-field' }
    }
  ];
}

export const endings: Record<string, { title: string; text: string; character: string }> = {
  stable: {
    title: 'Wild Hearts',
    text: "You and Link build a life at the stable. By day, you ride across Hyrule together. By night, well... the hay loft sees a lot of action. Epona learns to sleep with earplugs. He never says much, but when he looks at you, you hear every word his heart speaks. The hero of legend chose YOU. And honestly? The silent type is really working for you.",
    character: 'link'
  },
  hotspring: {
    title: 'Steamy Ever After',
    text: "The Goron Hot Springs become YOUR place. You visit so often the Gorons start charging you rent. Link's legendary stamina finds its true purpose - and it's not fighting Ganon. That stamina wheel gets a WORKOUT. The steam, the heat, his hands, his mouth, his everything... you've never been so thoroughly wrecked or so completely satisfied. When he finally gasps 'I love you' against your skin, you're both pruned, breathless, and ruined for anyone else. The Gorons learn to avoid the springs at night. Worth it.",
    character: 'link'
  },
  cooking: {
    title: 'A Recipe for Love',
    text: "You become Link's official taste tester and cooking partner. The food gets better. Mostly. He still occasionally adds rocks 'for crunch.' But the meals cooked together, the mess fights in the kitchen, the way he feeds you his best bites... you've never been so well-fed or so well-loved. He proposes with a dubious meat pie. You say yes anyway.",
    character: 'link'
  },
  training: {
    title: 'Combat Partners',
    text: "You become his sparring partner in every sense. The training ground. The bedroom. The random field when you both get the urge. He teaches you to fight; you teach him to love. Your battles always end the same way - tangled together, breathless, victorious. Nobody defeats you two. In combat or in how disgustingly cute you are together.",
    character: 'link'
  },
  fairy: {
    title: 'Blessed Union',
    text: "The fairy magic bonded you that night, and you feel him always - his joy, his fears, his INTENSE feelings for you. The Great Fairy officiates your wedding and only gets a LITTLE too handsy with the groom. Link speaks his vows in the most words he's ever said: 'Yours. Always. Forever.' Six words. The best six words of your life.",
    character: 'link'
  },
  camp: {
    title: 'Wanderers Together',
    text: "You travel Hyrule together now. Every night under the stars, every morning in each other's arms. The bedroll is too small for two people but you don't mind. He saves you from monsters; you save him from his own cooking. It's a partnership. A love story. An adventure. His silence speaks volumes, and every word says 'I love you.'",
    character: 'link'
  },
  alone: {
    title: 'The One That Got Away',
    text: "Link continues his journey alone. But sometimes, by campfires across Hyrule, he pulls out a small memento and just... stares at it. He had something precious. Someone precious. And you let him slip away. The hero of legend nurses a broken heart, and somewhere in Hyrule, so do you. At least you'll always have the memories of what could have been.",
    character: ''
  }
};

import { Scene, DialogueNode } from './types';

export const scenes: Record<string, Scene> = {
  // Hub location - Castle Town
  'castle-town': {
    id: 'castle-town',
    location: 'Castle Town',
    background: 'bg-market',
    availableCharacters: ['zelda'],
    dialogues: {},
    navigationOptions: [
      { label: 'Hyrule Castle', targetScene: 'hyrule-castle' },
      { label: 'Lon Lon Ranch', targetScene: 'lon-lon-ranch' },
      { label: "Zora's Domain", targetScene: 'zoras-domain' },
      { label: 'Twilight Realm', targetScene: 'twilight-realm' },
      { label: 'Gerudo Town', targetScene: 'gerudo-town' },
      { label: 'Kakariko Village', targetScene: 'kakariko-village' },
      { label: 'Rest for the Day', targetScene: 'end-day' }
    ]
  },

  // Zelda's location
  'hyrule-castle': {
    id: 'hyrule-castle',
    location: 'Hyrule Castle',
    background: 'bg-castle',
    availableCharacters: ['zelda'],
    dialogues: {
      zelda: createZeldaDialogues()
    },
    navigationOptions: [
      { label: 'Return to Castle Town', targetScene: 'castle-town' }
    ]
  },

  // Malon's location
  'lon-lon-ranch': {
    id: 'lon-lon-ranch',
    location: 'Lon Lon Ranch',
    background: 'bg-ranch',
    availableCharacters: ['malon'],
    dialogues: {
      malon: createMalonDialogues()
    },
    navigationOptions: [
      { label: 'Return to Castle Town', targetScene: 'castle-town' }
    ]
  },

  // Mipha's location
  'zoras-domain': {
    id: 'zoras-domain',
    location: "Zora's Domain",
    background: 'bg-zora',
    availableCharacters: ['mipha'],
    dialogues: {
      mipha: createMiphaDialogues()
    },
    navigationOptions: [
      { label: 'Return to Castle Town', targetScene: 'castle-town' }
    ]
  },

  // Midna's location
  'twilight-realm': {
    id: 'twilight-realm',
    location: 'Twilight Realm',
    background: 'bg-twilight',
    availableCharacters: ['midna'],
    dialogues: {
      midna: createMidnaDialogues()
    },
    navigationOptions: [
      { label: 'Return to Castle Town', targetScene: 'castle-town' }
    ]
  },

  // Riju's location
  'gerudo-town': {
    id: 'gerudo-town',
    location: 'Gerudo Town',
    background: 'bg-gerudo',
    availableCharacters: ['riju'],
    dialogues: {
      riju: createRijuDialogues()
    },
    navigationOptions: [
      { label: 'Return to Castle Town', targetScene: 'castle-town' }
    ]
  },

  // Paya's location
  'kakariko-village': {
    id: 'kakariko-village',
    location: 'Kakariko Village',
    background: 'bg-kakariko',
    availableCharacters: ['paya'],
    dialogues: {
      paya: createPayaDialogues()
    },
    navigationOptions: [
      { label: 'Return to Castle Town', targetScene: 'castle-town' }
    ]
  }
};

function createZeldaDialogues(): DialogueNode[] {
  return [
    // Day 1 - First meeting
    {
      id: 'zelda-d1-start',
      speaker: 'zelda',
      text: "Ah, Link! I wasn't expecting visitors in the library today. I've been researching ancient Sheikah texts...",
      emotion: 'surprised',
      next: 'zelda-d1-2'
    },
    {
      id: 'zelda-d1-2',
      speaker: 'zelda',
      text: "These manuscripts speak of technologies lost to time. Fascinating, isn't it? The wisdom of our ancestors...",
      emotion: 'happy',
      choices: [
        { text: "I'd love to hear more about your research.", next: 'zelda-d1-research', affectionChange: 10 },
        { text: "Don't you ever take breaks, Princess?", next: 'zelda-d1-break', affectionChange: 5 },
        { text: "Sounds boring. I prefer action.", next: 'zelda-d1-boring', affectionChange: -5 }
      ]
    },
    {
      id: 'zelda-d1-research',
      speaker: 'zelda',
      text: "You... want to learn? Oh, Link! Most people's eyes glaze over when I discuss ancient technology.",
      emotion: 'blush',
      next: 'zelda-d1-end'
    },
    {
      id: 'zelda-d1-break',
      speaker: 'zelda',
      text: "Breaks? I suppose you have a point. Perhaps we could take a walk in the castle gardens sometime?",
      emotion: 'happy',
      next: 'zelda-d1-end'
    },
    {
      id: 'zelda-d1-boring',
      speaker: 'zelda',
      text: "I... see. Well, not everyone appreciates scholarly pursuits, I suppose.",
      emotion: 'sad',
      next: 'zelda-d1-end'
    },
    {
      id: 'zelda-d1-end',
      speaker: 'zelda',
      text: "Thank you for stopping by, Link. Perhaps we can speak again soon.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+ dialogues
    {
      id: 'zelda-d2-start',
      speaker: 'zelda',
      text: "Link! I was hoping you'd return. I discovered something remarkable in my research.",
      emotion: 'happy',
      next: 'zelda-d2-2'
    },
    {
      id: 'zelda-d2-2',
      speaker: 'zelda',
      text: "A reference to the 'Song of Healing' - said to mend not just wounds, but troubled hearts. Isn't that poetic?",
      choices: [
        { text: "Your heart seems troubled. Want to talk about it?", next: 'zelda-d2-deep', affectionChange: 15 },
        { text: "That's beautiful. Music holds great power.", next: 'zelda-d2-music', affectionChange: 10 },
        { text: "Sounds like fairy tale nonsense.", next: 'zelda-d2-dismiss', affectionChange: -10 }
      ]
    },
    {
      id: 'zelda-d2-deep',
      speaker: 'zelda',
      text: "I... you can tell? Sometimes the weight of the kingdom... of destiny... it's overwhelming. Thank you for seeing me, not just the princess.",
      emotion: 'blush',
      next: 'zelda-d2-end'
    },
    {
      id: 'zelda-d2-music',
      speaker: 'zelda',
      text: "Indeed it does. I've often found solace in playing the harp during difficult times. Perhaps I could play for you someday?",
      emotion: 'happy',
      next: 'zelda-d2-end'
    },
    {
      id: 'zelda-d2-dismiss',
      speaker: 'zelda',
      text: "Fairy tales have a way of preserving truths that history books forget, Link. But I understand skepticism.",
      emotion: 'sad',
      next: 'zelda-d2-end'
    },
    {
      id: 'zelda-d2-end',
      speaker: 'zelda',
      text: "I should return to my studies. But Link... I'm glad you came today.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection dialogue
    {
      id: 'zelda-high-start',
      speaker: 'zelda',
      text: "Link... there's something I must confess. These past days, your visits have become the highlight of my research sessions.",
      emotion: 'blush',
      next: 'zelda-high-2'
    },
    {
      id: 'zelda-high-2',
      speaker: 'zelda',
      text: "I've read countless texts about heroes and destiny, but none prepared me for... these feelings.",
      emotion: 'blush',
      choices: [
        { text: "I feel the same way, Zelda.", next: 'zelda-confession', affectionChange: 20 },
        { text: "We should focus on saving Hyrule first.", next: 'zelda-reject', affectionChange: -15 }
      ]
    },
    {
      id: 'zelda-confession',
      speaker: 'zelda',
      text: "Then perhaps... our story is one the ancient texts never predicted. One we'll write together.",
      emotion: 'happy',
      action: { type: 'ending', value: 'zelda' }
    },
    {
      id: 'zelda-reject',
      speaker: 'zelda',
      text: "You're right, of course. Duty before all else. I... I understand.",
      emotion: 'sad',
      action: { type: 'location', value: 'castle-town' }
    }
  ];
}

function createMidnaDialogues(): DialogueNode[] {
  return [
    {
      id: 'midna-d1-start',
      speaker: 'midna',
      text: "Well, well... look who wandered into the Twilight Realm. Getting lost is a hobby of yours, isn't it, hero?",
      emotion: 'happy',
      next: 'midna-d1-2'
    },
    {
      id: 'midna-d1-2',
      speaker: 'midna',
      text: "Ehehehe! Don't make that face. I'm only teasing. So, what brings you to MY domain?",
      choices: [
        { text: "I came to see you, Midna.", next: 'midna-d1-flirt', affectionChange: 10 },
        { text: "Just exploring. This place is interesting.", next: 'midna-d1-explore', affectionChange: 5 },
        { text: "Got lost, actually.", next: 'midna-d1-lost', affectionChange: 0 }
      ]
    },
    {
      id: 'midna-d1-flirt',
      speaker: 'midna',
      text: "Hmph! Don't think flattery will work on me, hero. ...But I suppose I'll allow you to stay. For now.",
      emotion: 'blush',
      next: 'midna-d1-end'
    },
    {
      id: 'midna-d1-explore',
      speaker: 'midna',
      text: "Interesting? Most light-dwellers find the Twilight unsettling. You're... different.",
      emotion: 'happy',
      next: 'midna-d1-end'
    },
    {
      id: 'midna-d1-lost',
      speaker: 'midna',
      text: "Ha! Typical. What would you do without me? Come on, I'll show you around.",
      emotion: 'happy',
      next: 'midna-d1-end'
    },
    {
      id: 'midna-d1-end',
      speaker: 'midna',
      text: "Don't be a stranger, Link. The Twilight Realm could use more... visitors like you.",
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'midna-d2-start',
      speaker: 'midna',
      text: "Back again? Careful, hero, or I might think you actually LIKE being here.",
      emotion: 'happy',
      next: 'midna-d2-2'
    },
    {
      id: 'midna-d2-2',
      speaker: 'midna',
      text: "...It gets lonely here, you know. Not that I'd ever admit that to anyone else.",
      emotion: 'sad',
      choices: [
        { text: "You don't have to be alone, Midna.", next: 'midna-d2-comfort', affectionChange: 15 },
        { text: "I'll visit whenever you want.", next: 'midna-d2-promise', affectionChange: 10 },
        { text: "That sounds like a personal problem.", next: 'midna-d2-cold', affectionChange: -10 }
      ]
    },
    {
      id: 'midna-d2-comfort',
      speaker: 'midna',
      text: "...Idiot. Don't say things like that unless you mean them. My heart can't... I mean, whatever!",
      emotion: 'blush',
      next: 'midna-d2-end'
    },
    {
      id: 'midna-d2-promise',
      speaker: 'midna',
      text: "You better keep that promise, wolf-boy. Or I'll drag you here myself. Ehehehe!",
      emotion: 'happy',
      next: 'midna-d2-end'
    },
    {
      id: 'midna-d2-cold',
      speaker: 'midna',
      text: "Tch! Fine. Go back to your light world then. See if I care!",
      emotion: 'angry',
      next: 'midna-d2-end'
    },
    {
      id: 'midna-d2-end',
      speaker: 'midna',
      text: "Get going before I change my mind about liking you. ...Wait, I didn't say that!",
      emotion: 'blush',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'midna-high-start',
      speaker: 'midna',
      text: "Link... I need to tell you something. And if you laugh, I'll turn you into a wolf permanently.",
      emotion: 'blush',
      next: 'midna-high-2'
    },
    {
      id: 'midna-high-2',
      speaker: 'midna',
      text: "When I broke the Mirror of Twilight, I thought I was protecting you. But really... I was running away from how I felt.",
      emotion: 'sad',
      choices: [
        { text: "I never wanted us to be separated.", next: 'midna-confession', affectionChange: 20 },
        { text: "We're from different worlds, Midna.", next: 'midna-reject', affectionChange: -15 }
      ]
    },
    {
      id: 'midna-confession',
      speaker: 'midna',
      text: "Then... let's write a new story. One where the hero and the twilight princess don't have to say goodbye.",
      emotion: 'happy',
      action: { type: 'ending', value: 'midna' }
    },
    {
      id: 'midna-reject',
      speaker: 'midna',
      text: "Ha... I knew you'd say that. Go on then. Back to your world of light.",
      emotion: 'sad',
      action: { type: 'location', value: 'castle-town' }
    }
  ];
}

function createMiphaDialogues(): DialogueNode[] {
  return [
    {
      id: 'mipha-d1-start',
      speaker: 'mipha',
      text: "Link! You came to visit... I was just practicing my healing arts. It's so wonderful to see you.",
      emotion: 'happy',
      next: 'mipha-d1-2'
    },
    {
      id: 'mipha-d1-2',
      speaker: 'mipha',
      text: "The waters here are especially restorative today. Would you... like to swim with me?",
      emotion: 'blush',
      choices: [
        { text: "I'd love nothing more, Mipha.", next: 'mipha-d1-swim', affectionChange: 10 },
        { text: "Sure, I could use a break.", next: 'mipha-d1-casual', affectionChange: 5 },
        { text: "I can't stay long today.", next: 'mipha-d1-busy', affectionChange: -5 }
      ]
    },
    {
      id: 'mipha-d1-swim',
      speaker: 'mipha',
      text: "Oh! That makes me so happy. I'll show you my favorite diving spots. Just like when we were children...",
      emotion: 'happy',
      next: 'mipha-d1-end'
    },
    {
      id: 'mipha-d1-casual',
      speaker: 'mipha',
      text: "Wonderful! The water will wash away your fatigue. I'll stay close in case you need anything.",
      emotion: 'happy',
      next: 'mipha-d1-end'
    },
    {
      id: 'mipha-d1-busy',
      speaker: 'mipha',
      text: "I understand. You have important duties. I'll... be here whenever you can return.",
      emotion: 'sad',
      next: 'mipha-d1-end'
    },
    {
      id: 'mipha-d1-end',
      speaker: 'mipha',
      text: "Take care of yourself, Link. And know that I'm always here if you're ever hurt. Always.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'mipha-d2-start',
      speaker: 'mipha',
      text: "You've returned! I... I was hoping you would. I made something for you.",
      emotion: 'blush',
      next: 'mipha-d2-2'
    },
    {
      id: 'mipha-d2-2',
      speaker: 'mipha',
      text: "It's Zora armor. I've been crafting it for... a long time. It's tradition that we make this for someone special.",
      emotion: 'blush',
      choices: [
        { text: "Mipha... this must have taken so long. Thank you.", next: 'mipha-d2-grateful', affectionChange: 15 },
        { text: "Special? What do you mean?", next: 'mipha-d2-curious', affectionChange: 10 },
        { text: "I can't accept something so valuable.", next: 'mipha-d2-refuse', affectionChange: -5 }
      ]
    },
    {
      id: 'mipha-d2-grateful',
      speaker: 'mipha',
      text: "Every stitch was made with thoughts of you. Your safety, your happiness... You mean everything to me, Link.",
      emotion: 'blush',
      next: 'mipha-d2-end'
    },
    {
      id: 'mipha-d2-curious',
      speaker: 'mipha',
      text: "Zora women make this armor for... the one they wish to marry. I know it's forward of me, but...",
      emotion: 'blush',
      next: 'mipha-d2-end'
    },
    {
      id: 'mipha-d2-refuse',
      speaker: 'mipha',
      text: "Please... let me give you this. It would hurt more if you didn't take it.",
      emotion: 'sad',
      next: 'mipha-d2-end'
    },
    {
      id: 'mipha-d2-end',
      speaker: 'mipha',
      text: "Come back soon, Link. I'll be here, watching the waters and thinking of you.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'mipha-high-start',
      speaker: 'mipha',
      text: "Link... there's something I've wanted to tell you since we were children playing by the falls.",
      emotion: 'blush',
      next: 'mipha-high-2'
    },
    {
      id: 'mipha-high-2',
      speaker: 'mipha',
      text: "I love you. I always have. And if Calamity never comes... I want to spend my life with you.",
      emotion: 'happy',
      choices: [
        { text: "I love you too, Mipha.", next: 'mipha-confession', affectionChange: 20 },
        { text: "I care for you, but... I can't.", next: 'mipha-reject', affectionChange: -15 }
      ]
    },
    {
      id: 'mipha-confession',
      speaker: 'mipha',
      text: "Then let's face the future together. Whatever comes, my healing light will always be with you.",
      emotion: 'happy',
      action: { type: 'ending', value: 'mipha' }
    },
    {
      id: 'mipha-reject',
      speaker: 'mipha',
      text: "I understand... I'll treasure the time we've had. And I'll still always be here for you.",
      emotion: 'sad',
      action: { type: 'location', value: 'castle-town' }
    }
  ];
}

function createMalonDialogues(): DialogueNode[] {
  return [
    {
      id: 'malon-d1-start',
      speaker: 'malon',
      text: "Well howdy there, fairy boy! Come to see the horses? Or maybe... you came to see me?",
      emotion: 'happy',
      next: 'malon-d1-2'
    },
    {
      id: 'malon-d1-2',
      speaker: 'malon',
      text: "Hehe, I'm just teasin'! Though Epona sure did perk up when she saw you comin' down the road.",
      choices: [
        { text: "Actually, I came to see you both.", next: 'malon-d1-both', affectionChange: 10 },
        { text: "How's the ranch been treating you?", next: 'malon-d1-ranch', affectionChange: 5 },
        { text: "Is Epona ready for a ride?", next: 'malon-d1-epona', affectionChange: 0 }
      ]
    },
    {
      id: 'malon-d1-both',
      speaker: 'malon',
      text: "Aw shucks, Link! You're gonna make me blush right here in the barn! ...I'm glad you came.",
      emotion: 'blush',
      next: 'malon-d1-end'
    },
    {
      id: 'malon-d1-ranch',
      speaker: 'malon',
      text: "Same as always - hard work and early mornings! But I wouldn't trade it for anything. This land is home.",
      emotion: 'happy',
      next: 'malon-d1-end'
    },
    {
      id: 'malon-d1-epona',
      speaker: 'malon',
      text: "She's always ready when you're around! That horse loves you almost as much as... well, nevermind!",
      emotion: 'blush',
      next: 'malon-d1-end'
    },
    {
      id: 'malon-d1-end',
      speaker: 'malon',
      text: "Don't be a stranger now, fairy boy! And maybe next time, I'll sing you a song.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'malon-d2-start',
      speaker: 'malon',
      text: "Link! I was just about to practice my singing. Want to hear? Mama used to sing this to me...",
      emotion: 'happy',
      next: 'malon-d2-2'
    },
    {
      id: 'malon-d2-2',
      speaker: 'malon',
      text: "*hums Epona's Song softly* ...Sorry, I get emotional. This song means everything to me.",
      emotion: 'sad',
      choices: [
        { text: "Your voice is beautiful, Malon.", next: 'malon-d2-compliment', affectionChange: 15 },
        { text: "Tell me about your mother.", next: 'malon-d2-mother', affectionChange: 10 },
        { text: "That was nice. I should get going.", next: 'malon-d2-leave', affectionChange: -5 }
      ]
    },
    {
      id: 'malon-d2-compliment',
      speaker: 'malon',
      text: "Link... you always know just what to say. My heart's racin' faster than a horse at full gallop!",
      emotion: 'blush',
      next: 'malon-d2-end'
    },
    {
      id: 'malon-d2-mother',
      speaker: 'malon',
      text: "She was wonderful... taught me everything about the ranch and about love. I miss her, but she lives on in this song.",
      emotion: 'happy',
      next: 'malon-d2-end'
    },
    {
      id: 'malon-d2-leave',
      speaker: 'malon',
      text: "Oh... okay then. Safe travels, Link. The ranch'll be here when you're ready to visit again.",
      emotion: 'sad',
      next: 'malon-d2-end'
    },
    {
      id: 'malon-d2-end',
      speaker: 'malon',
      text: "Take care now, fairy boy! The cuccos and I will be waitin' for ya!",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'malon-high-start',
      speaker: 'malon',
      text: "Link... I've been thinkin'. About the future. About... us.",
      emotion: 'blush',
      next: 'malon-high-2'
    },
    {
      id: 'malon-high-2',
      speaker: 'malon',
      text: "When I look at the sunrise over the ranch, I imagine sharin' that view with someone. And that someone's always been you.",
      emotion: 'happy',
      choices: [
        { text: "I want to share every sunrise with you, Malon.", next: 'malon-confession', affectionChange: 20 },
        { text: "The ranch life isn't for me.", next: 'malon-reject', affectionChange: -15 }
      ]
    },
    {
      id: 'malon-confession',
      speaker: 'malon',
      text: "Then stay with me, Link. Here at the ranch, where the land is good and love is simple. That's all I've ever wanted.",
      emotion: 'happy',
      action: { type: 'ending', value: 'malon' }
    },
    {
      id: 'malon-reject',
      speaker: 'malon',
      text: "I reckon I knew that. A hero like you can't be tied down to one place. But I'll always be your friend.",
      emotion: 'sad',
      action: { type: 'location', value: 'castle-town' }
    }
  ];
}

function createRijuDialogues(): DialogueNode[] {
  return [
    {
      id: 'riju-d1-start',
      speaker: 'riju',
      text: "Ah, the Hylian Champion! Welcome to Gerudo Town. Patricia and I were just about to go sand seal surfing.",
      emotion: 'happy',
      next: 'riju-d1-2'
    },
    {
      id: 'riju-d1-2',
      speaker: 'riju',
      text: "You know, being Chief means everyone treats me like I'm made of glass. It's nice to have someone who doesn't bow every two seconds.",
      choices: [
        { text: "You seem plenty capable to me, Chief Riju.", next: 'riju-d1-capable', affectionChange: 10 },
        { text: "Want to race? I bet I'm faster on a sand seal.", next: 'riju-d1-race', affectionChange: 10 },
        { text: "Shouldn't you be doing Chief things?", next: 'riju-d1-duty', affectionChange: -5 }
      ]
    },
    {
      id: 'riju-d1-capable',
      speaker: 'riju',
      text: "You... really think so? Most people just see a child playing at leadership. Thank you, Link.",
      emotion: 'blush',
      next: 'riju-d1-end'
    },
    {
      id: 'riju-d1-race',
      speaker: 'riju',
      text: "Ha! You're ON, Champion! But don't cry when Patricia and I leave you eating our dust!",
      emotion: 'happy',
      next: 'riju-d1-end'
    },
    {
      id: 'riju-d1-duty',
      speaker: 'riju',
      text: "Even Chiefs need breaks, you know. Besides, the council can handle things for an hour.",
      emotion: 'angry',
      next: 'riju-d1-end'
    },
    {
      id: 'riju-d1-end',
      speaker: 'riju',
      text: "Come back soon! I could use more sparring partners who aren't afraid to challenge me.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'riju-d2-start',
      speaker: 'riju',
      text: "Link! Perfect timing. I was just... hiding from my advisors. Don't tell anyone!",
      emotion: 'blush',
      next: 'riju-d2-2'
    },
    {
      id: 'riju-d2-2',
      speaker: 'riju',
      text: "Sometimes I wonder if I can really fill my mother's sandals. She was so strong, so wise...",
      emotion: 'sad',
      choices: [
        { text: "You're strong in your own way, Riju.", next: 'riju-d2-encourage', affectionChange: 15 },
        { text: "Your people believe in you. So do I.", next: 'riju-d2-believe', affectionChange: 10 },
        { text: "Maybe you should listen to your advisors more.", next: 'riju-d2-dismiss', affectionChange: -10 }
      ]
    },
    {
      id: 'riju-d2-encourage',
      speaker: 'riju',
      text: "Link... when you say it, I almost believe it. You have a way of making me feel brave.",
      emotion: 'blush',
      next: 'riju-d2-end'
    },
    {
      id: 'riju-d2-believe',
      speaker: 'riju',
      text: "The Champion believes in me? Ha! Now I HAVE to succeed. Can't let you down.",
      emotion: 'happy',
      next: 'riju-d2-end'
    },
    {
      id: 'riju-d2-dismiss',
      speaker: 'riju',
      text: "I get enough lectures from them already! I thought you were different...",
      emotion: 'angry',
      next: 'riju-d2-end'
    },
    {
      id: 'riju-d2-end',
      speaker: 'riju',
      text: "Thanks for listening, Link. Now, I should probably go face those advisors. See you around!",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'riju-high-start',
      speaker: 'riju',
      text: "Link... I've been thinking. About what happens after Calamity Ganon is defeated.",
      emotion: 'blush',
      next: 'riju-high-2'
    },
    {
      id: 'riju-high-2',
      speaker: 'riju',
      text: "The Gerudo have a saying: 'The desert tests all, but love conquers even the endless sands.' I think I understand it now.",
      emotion: 'happy',
      choices: [
        { text: "I'd cross any desert to be with you, Riju.", next: 'riju-confession', affectionChange: 20 },
        { text: "You'll make a great Chief. That should be your focus.", next: 'riju-reject', affectionChange: -15 }
      ]
    },
    {
      id: 'riju-confession',
      speaker: 'riju',
      text: "Then stay with me. Help me lead. Together, we can build a future as bright as the Gerudo sun!",
      emotion: 'happy',
      action: { type: 'ending', value: 'riju' }
    },
    {
      id: 'riju-reject',
      speaker: 'riju',
      text: "Right... yes, you're right. Duty first. Always duty first.",
      emotion: 'sad',
      action: { type: 'location', value: 'castle-town' }
    }
  ];
}

function createPayaDialogues(): DialogueNode[] {
  return [
    {
      id: 'paya-d1-start',
      speaker: 'paya',
      text: "M-Master Link?! You're here?! I-I wasn't expecting... oh my, I'm such a mess right now!",
      emotion: 'surprised',
      next: 'paya-d1-2'
    },
    {
      id: 'paya-d1-2',
      speaker: 'paya',
      text: "I was just... cleaning Grandmother's shrine. P-please don't look at me, I must look terrible...",
      emotion: 'blush',
      choices: [
        { text: "You look lovely, Paya.", next: 'paya-d1-compliment', affectionChange: 10 },
        { text: "No need to be nervous around me.", next: 'paya-d1-calm', affectionChange: 5 },
        { text: "Where's Impa?", next: 'paya-d1-impa', affectionChange: -5 }
      ]
    },
    {
      id: 'paya-d1-compliment',
      speaker: 'paya',
      text: "L-L-LOVELY?! Oh goddesses, I'm going to faint! No one's ever said... I mean... thank you...",
      emotion: 'blush',
      next: 'paya-d1-end'
    },
    {
      id: 'paya-d1-calm',
      speaker: 'paya',
      text: "I-I know, but you're the HERO! And I'm just... me. But I'll try to be calmer. For you.",
      emotion: 'happy',
      next: 'paya-d1-end'
    },
    {
      id: 'paya-d1-impa',
      speaker: 'paya',
      text: "Grandmother is resting. I-I can help you if you need something! I know a lot about Sheikah history!",
      emotion: 'sad',
      next: 'paya-d1-end'
    },
    {
      id: 'paya-d1-end',
      speaker: 'paya',
      text: "P-please come back anytime, Master Link! I'll... I'll try not to be so nervous next time!",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'paya-d2-start',
      speaker: 'paya',
      text: "Master Link! I've been practicing! Watch - I can say your name without stuttering now... Link!",
      emotion: 'happy',
      next: 'paya-d2-2'
    },
    {
      id: 'paya-d2-2',
      speaker: 'paya',
      text: "I wrote about you in my journal... oh no, I shouldn't have said that! Please forget I mentioned it!",
      emotion: 'blush',
      choices: [
        { text: "What did you write about me?", next: 'paya-d2-journal', affectionChange: 15 },
        { text: "That's sweet, Paya.", next: 'paya-d2-sweet', affectionChange: 10 },
        { text: "You keep a journal about me?", next: 'paya-d2-weird', affectionChange: -10 }
      ]
    },
    {
      id: 'paya-d2-journal',
      speaker: 'paya',
      text: "I-I wrote about how brave you are! And how your eyes shine like... like... I CAN'T SAY IT!",
      emotion: 'blush',
      next: 'paya-d2-end'
    },
    {
      id: 'paya-d2-sweet',
      speaker: 'paya',
      text: "You... you think so? Grandmother says I should express my feelings more. This is my way of trying.",
      emotion: 'happy',
      next: 'paya-d2-end'
    },
    {
      id: 'paya-d2-weird',
      speaker: 'paya',
      text: "I-it's not weird! I keep a journal about everything! You just... come up a lot... oh no...",
      emotion: 'sad',
      next: 'paya-d2-end'
    },
    {
      id: 'paya-d2-end',
      speaker: 'paya',
      text: "Thank you for visiting, Master Link. Each time I see you, my heart feels... fuller.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'paya-high-start',
      speaker: 'paya',
      text: "Master Link... I've decided to be brave. Like you. Even if my voice shakes, I need to say this...",
      emotion: 'blush',
      next: 'paya-high-2'
    },
    {
      id: 'paya-high-2',
      speaker: 'paya',
      text: "I love you! There, I said it! I've loved you since the moment you walked into Kakariko! Please... say something...",
      emotion: 'blush',
      choices: [
        { text: "I love you too, Paya.", next: 'paya-confession', affectionChange: 20 },
        { text: "I'm sorry, Paya. I don't feel the same.", next: 'paya-reject', affectionChange: -15 }
      ]
    },
    {
      id: 'paya-confession',
      speaker: 'paya',
      text: "Y-you do?! I'm not dreaming?! Oh, Master Link... I promise to become someone worthy of your love!",
      emotion: 'happy',
      action: { type: 'ending', value: 'paya' }
    },
    {
      id: 'paya-reject',
      speaker: 'paya',
      text: "I... I understand. Thank you for your honesty. I'll treasure our friendship always...",
      emotion: 'sad',
      action: { type: 'location', value: 'castle-town' }
    }
  ];
}

export const endings: Record<string, { title: string; text: string; character: string }> = {
  zelda: {
    title: 'The Wisdom of Love',
    text: "As dawn breaks over Hyrule Castle, you stand beside Zelda, no longer just as her appointed knight, but as her chosen partner. Together, you'll face whatever the future holds - your courage matched by her wisdom, your bond unbreakable. The kingdom celebrates, for their princess has found not just a protector, but a soulmate.",
    character: 'zelda'
  },
  midna: {
    title: 'Between Light and Shadow',
    text: "The Mirror of Twilight reforms, but this time it becomes a gateway, not a barrier. You step between worlds freely, your heart belonging to both realms. Midna's mischievous laugh echoes through the twilight as you explore your new existence together - the hero who brought light to shadow, and the princess who accepted his heart.",
    character: 'midna'
  },
  mipha: {
    title: "Grace of the Waters",
    text: "The waterfalls of Zora's Domain sing a new melody - one of joy and union. The Zora armor fits perfectly, a symbol of Mipha's love made manifest. Though challenges await, her healing light will always guide you home. In the crystal waters, two souls become one, and a new chapter of Zora history begins.",
    character: 'mipha'
  },
  malon: {
    title: 'Song of the Ranch',
    text: "The simple life calls you home. Each morning, you wake to Malon's gentle singing and Epona's happy neighs. The ranch flourishes under your combined care, and the nights are filled with laughter and love. Sometimes the greatest adventures are found not in far-off lands, but in the arms of the one you love.",
    character: 'malon'
  },
  riju: {
    title: 'Rulers of the Desert',
    text: "Gerudo Town has never been more prosperous. With you by her side, Riju leads with confidence and joy. Patricia the sand seal seems to approve, and the desert winds carry songs of the Chief and her Champion. Together, you'll build a legacy that outshines even the scorching sun.",
    character: 'riju'
  },
  paya: {
    title: 'Keeper of Hearts',
    text: "In the quiet village of Kakariko, love blooms like the eternal plum blossoms. Paya's shyness melts away in your presence, replaced by a gentle confidence. Impa smiles knowingly as you help tend to the shrine together. The Sheikah records will speak of this - the hero who found peace, and the devoted soul who gave him a home.",
    character: 'paya'
  },
  alone: {
    title: 'The Solitary Hero',
    text: "Your journey continues alone, as it always has. The hearts you touched remember you fondly, but your path leads ever onward. Perhaps someday you'll find where you truly belong. Until then, Hyrule's fields await, and adventure never ends for the Chosen Hero.",
    character: ''
  }
};

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
      text: "Link! You startled me... I was just in my private chambers, reading. These ancient texts speak of... forbidden rituals.",
      emotion: 'surprised',
      next: 'zelda-d1-2'
    },
    {
      id: 'zelda-d1-2',
      speaker: 'zelda',
      text: "*adjusts her dress* You know, as your princess, I could command you to stay... but I'd rather you choose to.",
      emotion: 'blush',
      choices: [
        { text: "I'd stay even without a command, Your Highness.", next: 'zelda-d1-flirt', affectionChange: 15 },
        { text: "What kind of forbidden rituals?", next: 'zelda-d1-curious', affectionChange: 10 },
        { text: "I should probably go...", next: 'zelda-d1-leave', affectionChange: -5 }
      ]
    },
    {
      id: 'zelda-d1-flirt',
      speaker: 'zelda',
      text: "*cheeks flushing* Such bold words from my knight... My heart is racing. Is this what the texts meant by 'divine connection'?",
      emotion: 'blush',
      next: 'zelda-d1-end'
    },
    {
      id: 'zelda-d1-curious',
      speaker: 'zelda',
      text: "Ancient bonding ceremonies... between heroes and princesses. The texts say souls can intertwine through... intimate prayer.",
      emotion: 'blush',
      next: 'zelda-d1-end'
    },
    {
      id: 'zelda-d1-leave',
      speaker: 'zelda',
      text: "*catches your hand* Wait... perhaps just a moment longer? It gets lonely in this tower.",
      emotion: 'sad',
      next: 'zelda-d1-end'
    },
    {
      id: 'zelda-d1-end',
      speaker: 'zelda',
      text: "Come back soon, Link. These castle walls feel less cold when you're here... *touches your cheek briefly*",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+ dialogues
    {
      id: 'zelda-d2-start',
      speaker: 'zelda',
      text: "*opens door in a silk nightgown* Link! I... I wasn't expecting you so late. But please, come in...",
      emotion: 'surprised',
      next: 'zelda-d2-2'
    },
    {
      id: 'zelda-d2-2',
      speaker: 'zelda',
      text: "I was just preparing for bed. *sits on the edge of mattress* But suddenly I'm not tired at all...",
      emotion: 'blush',
      choices: [
        { text: "*sits beside her* Neither am I.", next: 'zelda-d2-close', affectionChange: 20 },
        { text: "You look beautiful in the candlelight.", next: 'zelda-d2-compliment', affectionChange: 15 },
        { text: "I should let you rest.", next: 'zelda-d2-leave', affectionChange: -10 }
      ]
    },
    {
      id: 'zelda-d2-close',
      speaker: 'zelda',
      text: "*breath catches* Link... when you're this close, I forget I'm supposed to be proper. I forget everything except wanting to be closer...",
      emotion: 'blush',
      next: 'zelda-d2-end'
    },
    {
      id: 'zelda-d2-compliment',
      speaker: 'zelda',
      text: "*pulls you closer by your tunic* And you look like every fantasy I've had since you first walked into my throne room...",
      emotion: 'blush',
      next: 'zelda-d2-end'
    },
    {
      id: 'zelda-d2-leave',
      speaker: 'zelda',
      text: "*grabs your wrist* Don't. Stay. That's a royal command... and a desperate plea.",
      emotion: 'sad',
      next: 'zelda-d2-end'
    },
    {
      id: 'zelda-d2-end',
      speaker: 'zelda',
      text: "*presses forehead to yours* Promise me you'll come back tomorrow night. I'll leave my door unlocked...",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection dialogue
    {
      id: 'zelda-high-start',
      speaker: 'zelda',
      text: "*pulls you into her chambers and locks the door* No more pretense, Link. No more princess and knight. Just us.",
      emotion: 'blush',
      next: 'zelda-high-2'
    },
    {
      id: 'zelda-high-2',
      speaker: 'zelda',
      text: "*runs fingers through your hair* I've dreamed of this. Of us. Woken up aching for something I couldn't name... until now.",
      emotion: 'happy',
      choices: [
        { text: "*pulls her close* Then let's stop dreaming.", next: 'zelda-confession', affectionChange: 25 },
        { text: "Zelda, we shouldn't...", next: 'zelda-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'zelda-confession',
      speaker: 'zelda',
      text: "*melts into your arms* Yes... Finally, yes. Tonight, you're not my knight. Tonight, you're mine. All mine...",
      emotion: 'happy',
      action: { type: 'ending', value: 'zelda' }
    },
    {
      id: 'zelda-reject',
      speaker: 'zelda',
      text: "*steps back, eyes glistening* I see. Duty over desire. At least I know where your heart truly lies...",
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
      text: "Well, well... my favorite wolf wandered into my bedroom. *stretches languidly* Miss me that much?",
      emotion: 'happy',
      next: 'midna-d1-2'
    },
    {
      id: 'midna-d1-2',
      speaker: 'midna',
      text: "*floats closer, trailing a finger down your chest* You know, I used to ride on your back for hours. I've thought about riding you in... other ways.",
      emotion: 'blush',
      choices: [
        { text: "I've had similar thoughts.", next: 'midna-d1-flirt', affectionChange: 15 },
        { text: "You're very forward, Princess.", next: 'midna-d1-tease', affectionChange: 10 },
        { text: "*steps back* Midna...", next: 'midna-d1-shy', affectionChange: 0 }
      ]
    },
    {
      id: 'midna-d1-flirt',
      speaker: 'midna',
      text: "Ehehehe! Oh I LIKE this boldness. *wraps arms around your neck* The twilight hides nothing from me... including that look in your eyes.",
      emotion: 'blush',
      next: 'midna-d1-end'
    },
    {
      id: 'midna-d1-tease',
      speaker: 'midna',
      text: "Forward? I spent months pressed against your warm fur, feeling your heartbeat. We're past 'forward,' hero.",
      emotion: 'happy',
      next: 'midna-d1-end'
    },
    {
      id: 'midna-d1-shy',
      speaker: 'midna',
      text: "*pouts* Don't tell me you're shy NOW. Not after all the times I've seen you naked in that wolf form. Fur counts, you know.",
      emotion: 'blush',
      next: 'midna-d1-end'
    },
    {
      id: 'midna-d1-end',
      speaker: 'midna',
      text: "*whispers in your ear* Come back soon, wolf-boy. The Twilight Realm gets... very cold at night. I could use something warm.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'midna-d2-start',
      speaker: 'midna',
      text: "*appears in her true form, tall and breathtaking* Surprised? This is what I really look like. Do you like what you see?",
      emotion: 'happy',
      next: 'midna-d2-2'
    },
    {
      id: 'midna-d2-2',
      speaker: 'midna',
      text: "*turns slowly* I wanted you to see ALL of me. The curves I hid in that imp form... *traces her hips* Were worth hiding for this moment.",
      emotion: 'blush',
      choices: [
        { text: "*can't look away* You're stunning, Midna.", next: 'midna-d2-worship', affectionChange: 20 },
        { text: "Come here. Now.", next: 'midna-d2-command', affectionChange: 20 },
        { text: "I preferred the imp form, actually.", next: 'midna-d2-wrong', affectionChange: -15 }
      ]
    },
    {
      id: 'midna-d2-worship',
      speaker: 'midna',
      text: "*purrs and pulls you closer* Then worship me properly, hero. *presses against you* Show me what that Hylian passion feels like...",
      emotion: 'blush',
      next: 'midna-d2-end'
    },
    {
      id: 'midna-d2-command',
      speaker: 'midna',
      text: "Ooh, commanding the Twilight Princess? *obeys with a smirk* I think I like being told what to do... by you. Only you.",
      emotion: 'happy',
      next: 'midna-d2-end'
    },
    {
      id: 'midna-d2-wrong',
      speaker: 'midna',
      text: "...Really? You absolute- ! *turns away* Get out! Come back when you learn to appreciate a goddess standing before you!",
      emotion: 'angry',
      next: 'midna-d2-end'
    },
    {
      id: 'midna-d2-end',
      speaker: 'midna',
      text: "*breathless* Next time you visit... don't bother knocking. Just come straight to my bedroom. I'll be waiting.",
      emotion: 'blush',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'midna-high-start',
      speaker: 'midna',
      text: "*pulls you through a portal into her private chambers* No more games, Link. I need you. Really need you.",
      emotion: 'blush',
      next: 'midna-high-2'
    },
    {
      id: 'midna-high-2',
      speaker: 'midna',
      text: "*voice trembling* I broke that mirror because I was terrified. Of this. Of wanting someone so badly it burns. But I can't run anymore...",
      emotion: 'sad',
      choices: [
        { text: "*kisses her deeply* Then stop running.", next: 'midna-confession', affectionChange: 25 },
        { text: "This can never work between our worlds.", next: 'midna-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'midna-confession',
      speaker: 'midna',
      text: "*moans softly against your lips* Yes... Oh goddesses, yes. Take me, hero. In every way. I'm yours... completely yours.",
      emotion: 'happy',
      action: { type: 'ending', value: 'midna' }
    },
    {
      id: 'midna-reject',
      speaker: 'midna',
      text: "*tears streaming* Then go. Get out! And don't ever come back... because I can't bear to see you and not have you.",
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
      text: "*emerges from the water, glistening* Link! I was bathing in the sacred pool... You're not supposed to see me like this...",
      emotion: 'surprised',
      next: 'mipha-d1-2'
    },
    {
      id: 'mipha-d1-2',
      speaker: 'mipha',
      text: "*doesn't cover herself* ...But I'm glad you did. I've imagined you seeing me... all of me... so many times.",
      emotion: 'blush',
      choices: [
        { text: "*wades into the water with her*", next: 'mipha-d1-join', affectionChange: 15 },
        { text: "You're the most beautiful thing I've ever seen.", next: 'mipha-d1-compliment', affectionChange: 10 },
        { text: "I should turn around!", next: 'mipha-d1-shy', affectionChange: 0 }
      ]
    },
    {
      id: 'mipha-d1-join',
      speaker: 'mipha',
      text: "*gasps as you enter the water* Link... the way you look at me makes my scales tingle. Come closer... let me heal any wounds you have...",
      emotion: 'blush',
      next: 'mipha-d1-end'
    },
    {
      id: 'mipha-d1-compliment',
      speaker: 'mipha',
      text: "*swims closer* Then look your fill, my love. Everything I am... is for you. It's always been for you.",
      emotion: 'happy',
      next: 'mipha-d1-end'
    },
    {
      id: 'mipha-d1-shy',
      speaker: 'mipha',
      text: "*gently turns your face back* Don't. I want you to look. I've hidden my feelings too long... but never my body. Not from you.",
      emotion: 'blush',
      next: 'mipha-d1-end'
    },
    {
      id: 'mipha-d1-end',
      speaker: 'mipha',
      text: "*traces patterns on your chest with wet fingers* The waters here are warmer at night. Come back then... and I'll show you why Zoras make the best lovers.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'mipha-d2-start',
      speaker: 'mipha',
      text: "*waiting in a secluded grotto* I prepared this place for us. Private. Intimate. *the water glows softly* My healing powers can do more than fix wounds...",
      emotion: 'blush',
      next: 'mipha-d2-2'
    },
    {
      id: 'mipha-d2-2',
      speaker: 'mipha',
      text: "*pulls you into the water* They can heighten sensation... pleasure... *hands glowing as she touches you* Feel that?",
      emotion: 'happy',
      choices: [
        { text: "*shudders* That's incredible...", next: 'mipha-d2-sensation', affectionChange: 20 },
        { text: "Teach me everything about Zora intimacy.", next: 'mipha-d2-learn', affectionChange: 15 },
        { text: "This is moving fast, Mipha...", next: 'mipha-d2-slow', affectionChange: -5 }
      ]
    },
    {
      id: 'mipha-d2-sensation',
      speaker: 'mipha',
      text: "*presses against you in the water* And that's just my hands. Imagine... everywhere. Zoras bond deeply, Link. Completely. Would you bond with me?",
      emotion: 'blush',
      next: 'mipha-d2-end'
    },
    {
      id: 'mipha-d2-learn',
      speaker: 'mipha',
      text: "*whispers* We mate for life. When we choose someone, we give ourselves entirely. *nuzzles your neck* I chose you long ago.",
      emotion: 'happy',
      next: 'mipha-d2-end'
    },
    {
      id: 'mipha-d2-slow',
      speaker: 'mipha',
      text: "*gentle but persistent* I've waited a hundred years, Link. Watched you sleep in that shrine, dreaming of this. I can't wait anymore...",
      emotion: 'sad',
      next: 'mipha-d2-end'
    },
    {
      id: 'mipha-d2-end',
      speaker: 'mipha',
      text: "*kisses you softly, healing energy flowing between you* Come back soon. I'll be waiting in the moonlit pool... ready to show you what true devotion feels like.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'mipha-high-start',
      speaker: 'mipha',
      text: "*in the deepest sacred pool* Link... I've prepared the ancient bonding ritual. *water swirls around you both* This will join us forever. Body and soul.",
      emotion: 'blush',
      next: 'mipha-high-2'
    },
    {
      id: 'mipha-high-2',
      speaker: 'mipha',
      text: "*naked under the moonlight, surrounded by glowing water* If you accept me... we'll feel each other's pleasure. Always. Are you ready to be mine eternally?",
      emotion: 'happy',
      choices: [
        { text: "*embraces her in the sacred water* Make me yours.", next: 'mipha-confession', affectionChange: 25 },
        { text: "Forever is a long time, Mipha...", next: 'mipha-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'mipha-confession',
      speaker: 'mipha',
      text: "*the water explodes with light as your souls intertwine* Yes! Oh, Link... I can feel you inside me... your heart, your pleasure... we're one now. Forever one!",
      emotion: 'happy',
      action: { type: 'ending', value: 'mipha' }
    },
    {
      id: 'mipha-reject',
      speaker: 'mipha',
      text: "*the glow fades* I... I understand. A Zora's lifespan is long. Perhaps too long to bind a Hylian... *sinks beneath the water to hide her tears*",
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
      text: "*wiping sweat from her brow, shirt clinging* Whew! Link! Caught me in the middle of hard work... *stretches, fabric riding up* This heat is somethin' else!",
      emotion: 'happy',
      next: 'malon-d1-2'
    },
    {
      id: 'malon-d1-2',
      speaker: 'malon',
      text: "*notices your gaze and smirks* Like what you see, fairy boy? Ranch work keeps a girl fit... *flexes playfully* Wanna feel?",
      emotion: 'blush',
      choices: [
        { text: "*reaches out to touch* I'd love to.", next: 'malon-d1-touch', affectionChange: 15 },
        { text: "You're gorgeous, Malon.", next: 'malon-d1-compliment', affectionChange: 10 },
        { text: "I should help with the work.", next: 'malon-d1-help', affectionChange: 5 }
      ]
    },
    {
      id: 'malon-d1-touch',
      speaker: 'malon',
      text: "*guides your hand* Mmm... strong hands. A girl could get used to these... *leans closer* The hayloft is empty right now, you know...",
      emotion: 'blush',
      next: 'malon-d1-end'
    },
    {
      id: 'malon-d1-compliment',
      speaker: 'malon',
      text: "*fans herself* Well now you're makin' me hotter than the sun! *unbuttons top button* Better. Much better. Your turn to cool off?",
      emotion: 'happy',
      next: 'malon-d1-end'
    },
    {
      id: 'malon-d1-help',
      speaker: 'malon',
      text: "Such a gentleman! *grabs your hand* But first... *pulls you behind the barn* ...let's take a water break. Just the two of us.",
      emotion: 'blush',
      next: 'malon-d1-end'
    },
    {
      id: 'malon-d1-end',
      speaker: 'malon',
      text: "*whispers* Come back after sundown. Dad sleeps early, and my room's right above the stable. I'll leave the window open... *winks*",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'malon-d2-start',
      speaker: 'malon',
      text: "*catches you climbing through the window* You came! *in just a thin nightdress* Lock the door. We don't want any... interruptions.",
      emotion: 'happy',
      next: 'malon-d2-2'
    },
    {
      id: 'malon-d2-2',
      speaker: 'malon',
      text: "*pulls you onto her bed* I've thought about this... about YOU... every night. *runs hands down your chest* Show me what heroes do after saving the world...",
      emotion: 'blush',
      choices: [
        { text: "*pins her gently against the pillows*", next: 'malon-d2-passionate', affectionChange: 20 },
        { text: "You're everything I want, Malon.", next: 'malon-d2-sweet', affectionChange: 15 },
        { text: "Maybe we should talk first...", next: 'malon-d2-slow', affectionChange: -5 }
      ]
    },
    {
      id: 'malon-d2-passionate',
      speaker: 'malon',
      text: "*gasps* Yes, Link! I ain't some delicate princess - don't hold back with me. I want all of you, rough and real...",
      emotion: 'blush',
      next: 'malon-d2-end'
    },
    {
      id: 'malon-d2-sweet',
      speaker: 'malon',
      text: "*melts into your arms* And you're everythin' I've dreamed of since I was a little girl singin' to the horses. Make those dreams come true...",
      emotion: 'happy',
      next: 'malon-d2-end'
    },
    {
      id: 'malon-d2-slow',
      speaker: 'malon',
      text: "*puts finger on your lips* Shh. We've talked enough. *kisses you deeply* Tonight we communicate different...",
      emotion: 'blush',
      next: 'malon-d2-end'
    },
    {
      id: 'malon-d2-end',
      speaker: 'malon',
      text: "*nestled against you, catching breath* Don't you dare leave before sunrise. And tomorrow night? Same time. I'm nowhere near done with you...",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'malon-high-start',
      speaker: 'malon',
      text: "*leads you to a blanket under the stars* Link... I've given you my body. But tonight I want to give you somethin' more.",
      emotion: 'blush',
      next: 'malon-high-2'
    },
    {
      id: 'malon-high-2',
      speaker: 'malon',
      text: "*places your hand over her heart* This. Forever. I want to wake up with you every mornin', make love under every sunset. Be mine, Link. Officially.",
      emotion: 'happy',
      choices: [
        { text: "*kisses her under the stars* I'm yours. Always.", next: 'malon-confession', affectionChange: 25 },
        { text: "I can't settle down yet, Malon.", next: 'malon-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'malon-confession',
      speaker: 'malon',
      text: "*tears of joy* Then make love to me like it's our wedding night. Because in my heart... *pulls you down* ...it already is.",
      emotion: 'happy',
      action: { type: 'ending', value: 'malon' }
    },
    {
      id: 'malon-reject',
      speaker: 'malon',
      text: "*heart breaking* I knew a hero couldn't love a simple farm girl forever. At least I'll have these memories... Go. Before I beg.",
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
      text: "*lounging on silk cushions in revealing Gerudo attire* Champion! Finally, a vai worthy of my attention enters Gerudo Town... Oh wait, you're a voe. Even better.",
      emotion: 'happy',
      next: 'riju-d1-2'
    },
    {
      id: 'riju-d1-2',
      speaker: 'riju',
      text: "*stands, hips swaying as she approaches* The Gerudo have a tradition... we choose the finest voe to continue our bloodline. And you, hero, are VERY fine...",
      emotion: 'blush',
      choices: [
        { text: "And you're the most exotic beauty I've ever seen.", next: 'riju-d1-flirt', affectionChange: 15 },
        { text: "Is the Chief allowed to flirt this openly?", next: 'riju-d1-tease', affectionChange: 10 },
        { text: "I'm flattered, but isn't this forward?", next: 'riju-d1-shy', affectionChange: 0 }
      ]
    },
    {
      id: 'riju-d1-flirt',
      speaker: 'riju',
      text: "*circles you slowly* Exotic? You haven't seen anything yet. *trails finger across your shoulder* Stay one night in Gerudo Town, and I'll show you pleasures that would make goddesses blush.",
      emotion: 'blush',
      next: 'riju-d1-end'
    },
    {
      id: 'riju-d1-tease',
      speaker: 'riju',
      text: "I'm the Chief. I'm EXPECTED to sample the finest the world offers. *winks* Consider it... diplomatic relations.",
      emotion: 'happy',
      next: 'riju-d1-end'
    },
    {
      id: 'riju-d1-shy',
      speaker: 'riju',
      text: "*laughs* Forward? In Gerudo culture, this is demure. If I were truly forward, I'd already have you in my private bath. *pauses* ...Want to see my private bath?",
      emotion: 'blush',
      next: 'riju-d1-end'
    },
    {
      id: 'riju-d1-end',
      speaker: 'riju',
      text: "*whispers hotly in your ear* The desert is cold at night. My chambers are warm. Come after midnight... and leave your clothing at the door.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'riju-d2-start',
      speaker: 'riju',
      text: "*in a steaming bath, only shadows preserving modesty* You're late, Champion. The water's getting cold... come warm it up.",
      emotion: 'happy',
      next: 'riju-d2-2'
    },
    {
      id: 'riju-d2-2',
      speaker: 'riju',
      text: "*extends a bare leg from the water* Gerudo massage techniques are legendary. They're even better when applied to a body as sculpted as yours...",
      emotion: 'blush',
      choices: [
        { text: "*strips and joins her in the bath*", next: 'riju-d2-join', affectionChange: 20 },
        { text: "I want to learn these legendary techniques.", next: 'riju-d2-learn', affectionChange: 15 },
        { text: "This feels like a trap...", next: 'riju-d2-suspicious', affectionChange: -10 }
      ]
    },
    {
      id: 'riju-d2-join',
      speaker: 'riju',
      text: "*wraps legs around you in the water* Mmm, finally. *runs nails down your back* Gerudo women take what we want. And I want you. All night.",
      emotion: 'blush',
      next: 'riju-d2-end'
    },
    {
      id: 'riju-d2-learn',
      speaker: 'riju',
      text: "*pulls you into the water* Then let me teach you. *positions your hands* We start here... and gradually move lower. Much lower...",
      emotion: 'happy',
      next: 'riju-d2-end'
    },
    {
      id: 'riju-d2-suspicious',
      speaker: 'riju',
      text: "*pouts then smirks* The only trap here is between my thighs, hero. Now stop overthinking and get in this water before I drag you in.",
      emotion: 'blush',
      next: 'riju-d2-end'
    },
    {
      id: 'riju-d2-end',
      speaker: 'riju',
      text: "*breathless, water splashing* You've earned a place in my bedchamber, Champion. Come back tomorrow... I have silks that need someone to share them with.",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'riju-high-start',
      speaker: 'riju',
      text: "*on her throne, guards dismissed* Link. I've sampled many pleasures as Chief. But none compare to you. I want more than one night.",
      emotion: 'blush',
      next: 'riju-high-2'
    },
    {
      id: 'riju-high-2',
      speaker: 'riju',
      text: "*stands, letting her royal garments fall* I want every night. *walks to you, fully revealed* Be my king. Rule beside me. Love me until the desert turns to sea.",
      emotion: 'happy',
      choices: [
        { text: "*lifts her onto the throne* My queen. My everything.", next: 'riju-confession', affectionChange: 25 },
        { text: "I can't be tied to one kingdom, Riju.", next: 'riju-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'riju-confession',
      speaker: 'riju',
      text: "*gasps as you claim her on the throne* Yes! My Champion, my king, my love! *screams with pleasure* Let all of Gerudo hear - their Chief has found her mate!",
      emotion: 'happy',
      action: { type: 'ending', value: 'riju' }
    },
    {
      id: 'riju-reject',
      speaker: 'riju',
      text: "*coldly covers herself* Then you're no champion of mine. Guards! Escort this voe out of Gerudo Town. Permanently.",
      emotion: 'angry',
      action: { type: 'location', value: 'castle-town' }
    }
  ];
}

function createPayaDialogues(): DialogueNode[] {
  return [
    {
      id: 'paya-d1-start',
      speaker: 'paya',
      text: "M-Master Link?! *drops the sheet she was folding* I was just... preparing your bed for... I mean, A bed! Not YOUR bed!",
      emotion: 'surprised',
      next: 'paya-d1-2'
    },
    {
      id: 'paya-d1-2',
      speaker: 'paya',
      text: "*face bright red* My birthmark... it's shaped like a papaya, but... it's in a place I can't show anyone! Unless... unless you wanted to see it someday...",
      emotion: 'blush',
      choices: [
        { text: "I'd be honored to see all of you, Paya.", next: 'paya-d1-forward', affectionChange: 15 },
        { text: "You're adorable when you blush.", next: 'paya-d1-sweet', affectionChange: 10 },
        { text: "Where is this birthmark exactly?", next: 'paya-d1-curious', affectionChange: 10 }
      ]
    },
    {
      id: 'paya-d1-forward',
      speaker: 'paya',
      text: "*nearly faints* H-HONORED?! Oh goddesses... *fans herself* I've written about this exact scenario in my diary! I need to go lie down... maybe with you...",
      emotion: 'blush',
      next: 'paya-d1-end'
    },
    {
      id: 'paya-d1-sweet',
      speaker: 'paya',
      text: "*squeaks* A-adorable?! I'm going to write that down! No one's ever... *trembling* ...Master Link, you're making my heart do dangerous things!",
      emotion: 'happy',
      next: 'paya-d1-end'
    },
    {
      id: 'paya-d1-curious',
      speaker: 'paya',
      text: "*voice tiny* It's... on my left... *trails finger down from hip* ...I CAN'T SAY IT! But if you stayed the night, maybe... maybe I could SHOW you?",
      emotion: 'blush',
      next: 'paya-d1-end'
    },
    {
      id: 'paya-d1-end',
      speaker: 'paya',
      text: "*gathers courage* M-Master Link... my room is the one with the papaya carved on the door. If you ever wanted to visit... I sleep without... I mean... GOODBYE!",
      emotion: 'blush',
      action: { type: 'location', value: 'castle-town' }
    },

    // Day 2+
    {
      id: 'paya-d2-start',
      speaker: 'paya',
      text: "*opens door in thin sleeping robe* Y-you came! I thought I dreamed it... *pulls you inside* Quick, before Grandmother wakes!",
      emotion: 'happy',
      next: 'paya-d2-2'
    },
    {
      id: 'paya-d2-2',
      speaker: 'paya',
      text: "*trembling against you* I've never done this before. But I've imagined it... hundreds of times... *looks up with desperate eyes* Will you be gentle with me?",
      emotion: 'blush',
      choices: [
        { text: "*cups her face tenderly* I'll be whatever you need.", next: 'paya-d2-tender', affectionChange: 20 },
        { text: "Show me that birthmark, Paya.", next: 'paya-d2-birthmark', affectionChange: 20 },
        { text: "We should stop before we can't.", next: 'paya-d2-stop', affectionChange: -10 }
      ]
    },
    {
      id: 'paya-d2-tender',
      speaker: 'paya',
      text: "*tears of happiness* Oh, Master Link... *lets robe slip from one shoulder* I've saved myself for you. Only you. Please... make me yours...",
      emotion: 'blush',
      next: 'paya-d2-end'
    },
    {
      id: 'paya-d2-birthmark',
      speaker: 'paya',
      text: "*slowly unties robe with shaking hands* H-here... *reveals papaya-shaped mark on inner thigh* Do you... do you like it? Do you like me?",
      emotion: 'blush',
      next: 'paya-d2-end'
    },
    {
      id: 'paya-d2-stop',
      speaker: 'paya',
      text: "*clings to you* No! Don't stop! I've waited so long! *kisses you desperately* Please, Master Link... I need this. I need you!",
      emotion: 'sad',
      next: 'paya-d2-end'
    },
    {
      id: 'paya-d2-end',
      speaker: 'paya',
      text: "*curled against you, glowing with happiness* That was... I didn't know it could feel like... *giggles* When can we do that again? Tomorrow? Tonight again?",
      emotion: 'happy',
      action: { type: 'location', value: 'castle-town' }
    },

    // High affection
    {
      id: 'paya-high-start',
      speaker: 'paya',
      text: "*meets you at the door, completely changed - confident* Master Link. I'm done being shy. I know what I want now. And it's you.",
      emotion: 'happy',
      next: 'paya-high-2'
    },
    {
      id: 'paya-high-2',
      speaker: 'paya',
      text: "*pushes you onto the bed and straddles you* Grandmother said when a Sheikah finds their soulmate, they must claim them. *leans down* I'm claiming you.",
      emotion: 'blush',
      choices: [
        { text: "*pulls her down for a deep kiss* Claim away.", next: 'paya-confession', affectionChange: 25 },
        { text: "Paya, this is too fast...", next: 'paya-reject', affectionChange: -20 }
      ]
    },
    {
      id: 'paya-confession',
      speaker: 'paya',
      text: "*moans into the kiss* Master Link... no, just Link. MY Link. *moves rhythmically* I'll love you forever. Every day, every night, in every way!",
      emotion: 'happy',
      action: { type: 'ending', value: 'paya' }
    },
    {
      id: 'paya-reject',
      speaker: 'paya',
      text: "*old shyness returning* I... I misread everything. I'm so embarrassed... Please forget this happened. Please just... go.",
      emotion: 'sad',
      action: { type: 'location', value: 'castle-town' }
    }
  ];
}

export const endings: Record<string, { title: string; text: string; character: string }> = {
  zelda: {
    title: 'The Sacred Union',
    text: "In the most private chamber of Hyrule Castle, lit only by moonlight, you and Zelda become one in ways the ancient texts only dreamed of. Crown and duty forgotten, she surrenders completely to you - her hero, her love, her everything. Dawn finds you tangled together, her head on your chest, both knowing that destiny has been rewritten in the most intimate way possible. The bloodline of Hyrule's royalty will continue... and it will carry your strength.",
    character: 'zelda'
  },
  midna: {
    title: 'Eternal Twilight Passion',
    text: "Between realms of light and shadow, you and Midna create a new dimension - one built on insatiable desire and unending love. Her true form writhes with yours nightly, the twilight energies amplifying every sensation until you both scream with pleasure that echoes across worlds. The Twili speak in whispers of their princess and her light-dwelling lover, whose passion is legendary. Neither world can contain you - and neither wants to.",
    character: 'midna'
  },
  mipha: {
    title: 'Depths of Devotion',
    text: "Beneath the sacred waters of Zora's Domain, the bonding ritual is complete. You feel Mipha's pleasure as your own, your souls permanently intertwined in ecstasy that never fades. Each night in the luminescent pools, you explore new depths of intimacy that only a Zora and her eternal mate can achieve. The other Zoras speak enviously of the princess who gasps with pleasure every time her Hylian husband merely thinks of her.",
    character: 'mipha'
  },
  malon: {
    title: 'Harvest of Desire',
    text: "Every sunset on Lon Lon Ranch ends the same way - with you and Malon tumbling into the hay, into her bed, onto any flat surface available. Her appetite for you is as endless as the Hyrulean fields, and you're happy to satisfy her every craving. Nine months later, the first of many children arrives. The ranch will be a dynasty, and every night Malon rewards your hard work in ways that leave you both exhausted and fulfilled.",
    character: 'malon'
  },
  riju: {
    title: 'Desert Heat',
    text: "As King of the Gerudo, your duties are twofold: to lead alongside Riju, and to ensure the tribe's future in the most pleasurable way possible. Every night in the royal chambers is an adventure - Riju's appetite is voracious and her creativity boundless. The Gerudo women whisper jealously about their Chief's stamina and her King's legendary endurance. In the desert heat, your love burns hottest of all.",
    character: 'riju'
  },
  paya: {
    title: 'Blooming Passion',
    text: "Shy Paya transformed into an insatiable lover. Behind Kakariko's peaceful facade, she has become addicted to your touch, needing you multiple times daily. Her diary - now several volumes - chronicles every encounter in breathless detail. Impa pretends not to notice the sounds from her granddaughter's room, or the way you both emerge glowing. The papaya birthmark has become your favorite thing to kiss, right before exploring lower.",
    character: 'paya'
  },
  alone: {
    title: 'The Unsatisfied Hero',
    text: "Your journey continues, but something feels missing. At night, you remember the lovers you could have had - Zelda's gasps, Midna's moans, Mipha's otherworldly pleasure. You chose duty over desire, and now the nights are cold and lonely. Perhaps someday you'll return to one of them. Until then, only memories warm your bed, and your hand is poor company compared to what could have been.",
    character: ''
  }
};

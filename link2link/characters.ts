import { Character } from './types';

// Link - THE love interest. The one. The only. The silent hottie.
export const link: Character = {
  id: 'link',
  name: 'Link',
  title: 'The Silent Hero',
  color: '#4CAF50',
  secondaryColor: '#2E7D32',
  description: 'A brave hero who speaks little but feels deeply. Those blue eyes say what words cannot. Abs you could grate cheese on.',
  personality: ['Silent', 'Brave', 'Loyal', 'Hungry'],
  likes: ['Apples', 'Horses', 'Climbing', 'YOU'],
  dislikes: ['Ganon', 'Rain while climbing', 'Being ignored'],
  sprite: {
    base: '🧝',
    happy: '😊',
    sad: '😢',
    angry: '😠',
    blush: '😳',
    surprised: '😲'
  }
};

// Player persona options - who do YOU want to be while wooing the hero?
export const playerPersonas: Character[] = [
  {
    id: 'traveler',
    name: 'Wandering Traveler',
    title: 'Mysterious Stranger',
    color: '#9C27B0',
    secondaryColor: '#7B1FA2',
    description: 'A traveler from distant lands who crossed paths with destiny... and a very attractive Hylian.',
    personality: ['Mysterious', 'Adventurous', 'Curious'],
    likes: ['New experiences', 'Stargazing', 'The unknown'],
    dislikes: ['Staying in one place', 'Small talk'],
    sprite: {
      base: '🚶',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      blush: '😳',
      surprised: '😲'
    }
  },
  {
    id: 'merchant',
    name: 'Enthusiastic Merchant',
    title: 'Purveyor of Goods',
    color: '#FF9800',
    secondaryColor: '#F57C00',
    description: "A traveling merchant who's noticed this one customer buys A LOT of arrows. And looks VERY good in green.",
    personality: ['Charismatic', 'Observant', 'Enterprising'],
    likes: ['Rupees', 'Good deals', 'Regular customers'],
    dislikes: ['Thieves', 'Bad haggling'],
    sprite: {
      base: '🧑‍💼',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      blush: '😳',
      surprised: '😲'
    }
  },
  {
    id: 'stablehand',
    name: 'Stable Worker',
    title: 'Horse Whisperer',
    color: '#795548',
    secondaryColor: '#5D4037',
    description: 'Works at the stable. Definitely not just hanging around hoping that cute hero shows up again...',
    personality: ['Patient', 'Kind', 'Down-to-earth'],
    likes: ['Horses', 'Open fields', 'Carrots'],
    dislikes: ['Horse thieves', 'City folk'],
    sprite: {
      base: '🧑‍🌾',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      blush: '😳',
      surprised: '😲'
    }
  },
  {
    id: 'fairy',
    name: 'Escaped Fairy',
    title: 'Tiny Admirer',
    color: '#E91E63',
    secondaryColor: '#C2185B',
    description: "A fairy who escaped from a bottle and decided to stick around. For reasons. Definitely not because he's cute.",
    personality: ['Sparkly', 'Devoted', 'Slightly obsessive'],
    likes: ['Freedom', 'Glowing', 'Link'],
    dislikes: ['Bottles', 'Being caught'],
    sprite: {
      base: '🧚',
      happy: '✨',
      sad: '😢',
      angry: '😠',
      blush: '💫',
      surprised: '⭐'
    }
  },
  {
    id: 'knight',
    name: 'Fellow Knight',
    title: 'Sparring Partner',
    color: '#3F51B5',
    secondaryColor: '#303F9F',
    description: 'Trained alongside Link. Lost every match. Won something else entirely... maybe.',
    personality: ['Competitive', 'Honorable', 'Determined'],
    likes: ['Training', 'Swordplay', 'Winning (rare)'],
    dislikes: ['Losing', 'Cowardice'],
    sprite: {
      base: '⚔️',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      blush: '😳',
      surprised: '😲'
    }
  },
  {
    id: 'chef',
    name: 'Traveling Chef',
    title: 'Culinary Artist',
    color: '#F44336',
    secondaryColor: '#D32F2F',
    description: "Discovered Link will eat literally anything. Including rocks. It's weirdly endearing???",
    personality: ['Creative', 'Passionate', 'Horrified'],
    likes: ['Good ingredients', 'Happy eaters', 'NOT rocks'],
    dislikes: ['Food waste', "Link's cooking"],
    sprite: {
      base: '👨‍🍳',
      happy: '😊',
      sad: '😢',
      angry: '😠',
      blush: '😳',
      surprised: '😲'
    }
  },
  {
    id: 'zora',
    name: 'Curious Zora',
    title: 'Aquatic Admirer',
    color: '#00BCD4',
    secondaryColor: '#0097A7',
    description: "A Zora who's fascinated by this Hylian who can swim surprisingly well for a land-dweller. Those legs though... Zoras don't have those.",
    personality: ['Graceful', 'Curious', 'Flirty'],
    likes: ['Swimming', 'Fish', 'Land-dwellers with nice... legs'],
    dislikes: ['Pollution', 'Droughts', 'Electric enemies'],
    sprite: {
      base: '🐟',
      happy: '💙',
      sad: '😢',
      angry: '😠',
      blush: '💗',
      surprised: '🌊'
    }
  },
  {
    id: 'zora-guard',
    name: 'Zora Royal Guard',
    title: 'Protector of the Domain',
    color: '#1565C0',
    secondaryColor: '#0D47A1',
    description: "Tasked with protecting Zora's Domain, but keeps getting distracted by a certain hero who visits to climb waterfalls. Watching him climb is... educational.",
    personality: ['Stoic', 'Duty-bound', 'Secretly romantic'],
    likes: ['Order', 'The Domain', 'Watching Link climb (for security reasons)'],
    dislikes: ['Threats to the Domain', 'Lynel attacks'],
    sprite: {
      base: '🛡️',
      happy: '💙',
      sad: '😢',
      angry: '⚔️',
      blush: '💗',
      surprised: '🌊'
    }
  }
];

export const characters: Record<string, Character> = {
  link,
  ...Object.fromEntries(playerPersonas.map(p => [p.id, p]))
};

export const characterList = playerPersonas;

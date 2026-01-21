import { Character } from './types';

export const characters: Record<string, Character> = {
  zelda: {
    id: 'zelda',
    name: 'Princess Zelda',
    title: 'Bearer of Wisdom',
    color: '#FFD700',
    secondaryColor: '#4A2C7D',
    description: 'The wise and graceful princess of Hyrule. Beneath her royal demeanor lies a curious scholar with a passion for ancient artifacts.',
    personality: ['Intelligent', 'Graceful', 'Determined', 'Caring'],
    likes: ['Ancient texts', 'Silent princesses', 'Research', 'Protecting her kingdom'],
    dislikes: ['Carelessness', 'Shortcuts', 'Being underestimated'],
    sprite: {
      base: 'zelda-neutral',
      happy: 'zelda-happy',
      sad: 'zelda-sad',
      angry: 'zelda-angry',
      blush: 'zelda-blush',
      surprised: 'zelda-surprised'
    }
  },
  midna: {
    id: 'midna',
    name: 'Midna',
    title: 'Twilight Princess',
    color: '#FF6B35',
    secondaryColor: '#1A1A2E',
    description: 'The mischievous ruler of the Twilight Realm. Sharp-tongued and sarcastic, but fiercely loyal to those who earn her trust.',
    personality: ['Sarcastic', 'Playful', 'Fierce', 'Secretly caring'],
    likes: ['Teasing', 'Twilight', 'Clever people', 'Independence'],
    dislikes: ['Being pitied', 'Bright light', 'Boring conversations'],
    sprite: {
      base: 'midna-neutral',
      happy: 'midna-happy',
      sad: 'midna-sad',
      angry: 'midna-angry',
      blush: 'midna-blush',
      surprised: 'midna-surprised'
    }
  },
  mipha: {
    id: 'mipha',
    name: 'Mipha',
    title: 'Zora Princess',
    color: '#E63946',
    secondaryColor: '#457B9D',
    description: 'The gentle Zora princess with healing powers. Known for her kindness and unwavering devotion to those she loves.',
    personality: ['Gentle', 'Devoted', 'Skilled healer', 'Quietly strong'],
    likes: ['Swimming', 'Healing others', 'Quality time', 'Cooking'],
    dislikes: ['Violence', 'Seeing loved ones hurt', 'Being unable to help'],
    sprite: {
      base: 'mipha-neutral',
      happy: 'mipha-happy',
      sad: 'mipha-sad',
      angry: 'mipha-angry',
      blush: 'mipha-blush',
      surprised: 'mipha-surprised'
    }
  },
  malon: {
    id: 'malon',
    name: 'Malon',
    title: 'Ranch Girl',
    color: '#FF8C42',
    secondaryColor: '#4A7C59',
    description: 'The cheerful daughter of Lon Lon Ranch. Her singing can be heard across Hyrule Field, and her heart is as warm as a summer day.',
    personality: ['Cheerful', 'Hardworking', 'Musical', 'Down-to-earth'],
    likes: ['Horses', 'Singing', 'Farm life', 'Honest people'],
    dislikes: ['Cruelty to animals', 'Laziness', 'City pretension'],
    sprite: {
      base: 'malon-neutral',
      happy: 'malon-happy',
      sad: 'malon-sad',
      angry: 'malon-angry',
      blush: 'malon-blush',
      surprised: 'malon-surprised'
    }
  },
  riju: {
    id: 'riju',
    name: 'Riju',
    title: 'Gerudo Chief',
    color: '#C9184A',
    secondaryColor: '#FFB627',
    description: 'The young but capable chief of the Gerudo. Despite her age, she carries the weight of leadership with remarkable poise.',
    personality: ['Confident', 'Responsible', 'Playful in private', 'Brave'],
    likes: ['Sand seals', 'Proving herself', 'Adventure', 'Sweet treats'],
    dislikes: ['Being treated like a child', 'Threats to her people', 'Formal events'],
    sprite: {
      base: 'riju-neutral',
      happy: 'riju-happy',
      sad: 'riju-sad',
      angry: 'riju-angry',
      blush: 'riju-blush',
      surprised: 'riju-surprised'
    }
  },
  paya: {
    id: 'paya',
    name: 'Paya',
    title: 'Sheikah Attendant',
    color: '#9D4EDD',
    secondaryColor: '#E0AAFF',
    description: 'The shy granddaughter of Impa. Her bashful exterior hides a dedicated and hardworking soul devoted to the Sheikah ways.',
    personality: ['Shy', 'Devoted', 'Hardworking', 'Sweet'],
    likes: ['Helping others', 'Sheikah history', 'Quiet moments', 'Journaling'],
    dislikes: ['Being the center of attention', 'Loud noises', 'Rudeness'],
    sprite: {
      base: 'paya-neutral',
      happy: 'paya-happy',
      sad: 'paya-sad',
      angry: 'paya-angry',
      blush: 'paya-blush',
      surprised: 'paya-surprised'
    }
  }
};

export const characterList = Object.values(characters);

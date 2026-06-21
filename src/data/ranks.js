// ── League / Rank system ──
import level1 from '../assets/league/level_1.png'
import level2 from '../assets/league/level_2.png'
import level3 from '../assets/league/level_3.png'
import level4 from '../assets/league/level_4.png'
import level5 from '../assets/league/level_5.png'
import level6 from '../assets/league/level_6.png'
import level7 from '../assets/league/level_7.png'
import level8 from '../assets/league/level_8.png'

export const RANKS = [
  {
    id: 'stone',
    name: 'Каменная лига',
    shortName: 'Камень',
    emoji: '🪨',
    logo: level1,
    color: '#888',
    bgColor: '#f0f0f0',
    minXp: 0,
    desc: 'Начало пути',
  },
  {
    id: 'bronze',
    name: 'Бронзовая лига',
    shortName: 'Бронза',
    emoji: '🥉',
    logo: level2,
    color: '#cd7f32',
    bgColor: '#fdf3e8',
    minXp: 30,
    desc: 'Ты начинаешь летать',
  },
  {
    id: 'silver',
    name: 'Серебряная лига',
    shortName: 'Серебро',
    emoji: '🥈',
    logo: level3,
    color: '#8899aa',
    bgColor: '#eef2f5',
    minXp: 75,
    desc: 'Крылья становятся сильнее',
  },
  {
    id: 'gold',
    name: 'Золотая лига',
    shortName: 'Золото',
    emoji: '🥇',
    logo: level4,
    color: '#d4a017',
    bgColor: '#fdf8e4',
    minXp: 150,
    desc: 'Настоящий орёл',
  },
  {
    id: 'platinum',
    name: 'Платиновая лига',
    shortName: 'Платина',
    emoji: '🏆',
    logo: level5,
    color: '#6b7c8a',
    bgColor: '#f0f2f4',
    minXp: 250,
    desc: 'Элита языков',
  },
  {
    id: 'diamond',
    name: 'Алмазная лига',
    shortName: 'Алмаз',
    emoji: '💎',
    logo: level6,
    color: '#4fb3d9',
    bgColor: '#e6f8fd',
    minXp: 400,
    desc: 'Верхушка небес',
  },
  {
    id: 'obsidian',
    name: 'Обсидиановая лига',
    shortName: 'Обсидиан',
    emoji: '🌑',
    logo: level7,
    color: '#2d2d2d',
    bgColor: '#e8e8ec',
    minXp: 600,
    desc: 'Тёмная звезда',
  },
  {
    id: 'legendary',
    name: 'Легендарная лига',
    shortName: 'Легенда',
    emoji: '👑',
    logo: level8,
    color: '#b8860b',
    bgColor: '#fffbe6',
    minXp: 1000,
    desc: 'Бессмертный орёл Eaglo',
  },
];

export function getCurrentRank(xp) {
  return [...RANKS].reverse().find(r => xp >= r.minXp) || RANKS[0];
}

export function getNextRank(xp) {
  return RANKS.find(r => xp < r.minXp) || null;
}

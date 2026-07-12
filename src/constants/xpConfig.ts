export type XPEventType = 
  | 'daily_login'
  | 'problem_read'
  | 'problem_visualized'
  | 'problem_thinkpad'
  | 'code_submitted'
  | 'problem_solved_easy'
  | 'problem_solved_medium'
  | 'problem_solved_hard';

export const XP_VALUES: Record<XPEventType, number> = {
  daily_login: 5,
  problem_read: 10,
  problem_visualized: 15,
  problem_thinkpad: 20,
  code_submitted: 25,
  problem_solved_easy: 30,
  problem_solved_medium: 75,
  problem_solved_hard: 150,
};

export interface BadgeConfig {
  id: string;
  name: string;
  threshold: number;
  icon: string;
  color: string;
  hexColor: string;
  tier: 1 | 2 | 3 | 4 | 5;
  description: string;
  type: 'xp' | 'activity';
  iconType?: 'sprout' | 'calendar' | 'flame' | 'mountain' | 'trophy';
}

export const XP_BADGES: BadgeConfig[] = [
  { id: 'xp_100', name: 'Rising Coder', threshold: 100, icon: '🥉', color: 'text-orange-600', hexColor: '#a15b3c', tier: 1, description: 'Earned 100 Points', type: 'xp' },
  { id: 'xp_500', name: 'Consistent Learner', threshold: 500, icon: '🥈', color: 'text-slate-400', hexColor: '#8091a5', tier: 2, description: 'Earned 500 Points', type: 'xp' },
  { id: 'xp_1000', name: 'Algorithm Ace', threshold: 1000, icon: '🥇', color: 'text-yellow-500', hexColor: '#dca43b', tier: 3, description: 'Earned 1,000 Points', type: 'xp' },
  { id: 'xp_5000', name: 'Problem Crusher', threshold: 5000, icon: '💎', color: 'text-purple-500', hexColor: '#7b40a5', tier: 4, description: 'Earned 5,000 Points', type: 'xp' },
  { id: 'xp_10000', name: 'DSA Legend', threshold: 10000, icon: '👑', color: 'text-emerald-500', hexColor: '#53a835', tier: 5, description: 'Earned 10,000 Points', type: 'xp' },
];

export const ACTIVITY_BADGES: BadgeConfig[] = [
  { id: 'act_20', name: 'Getting Started', threshold: 20, icon: '📅', color: 'text-green-500', hexColor: '#4d9342', tier: 1, description: 'Active for 20 days', type: 'activity', iconType: 'sprout' },
  { id: 'act_50', name: 'Dedicated Learner', threshold: 50, icon: '🔥', color: 'text-blue-500', hexColor: '#3a72b0', tier: 2, description: 'Active for 50 days', type: 'activity', iconType: 'calendar' },
  { id: 'act_100', name: 'Committed', threshold: 100, icon: '⚡', color: 'text-yellow-500', hexColor: '#d69e32', tier: 3, description: 'Active for 100 days', type: 'activity', iconType: 'flame' },
  { id: 'act_200', name: 'Elite', threshold: 200, icon: '🌟', color: 'text-purple-400', hexColor: '#724b9e', tier: 4, description: 'Active for 200 days', type: 'activity', iconType: 'mountain' },
  { id: 'act_300', name: 'Year Champion', threshold: 300, icon: '🏆', color: 'text-teal-500', hexColor: '#459976', tier: 5, description: 'Active for 300 days', type: 'activity', iconType: 'trophy' },
];

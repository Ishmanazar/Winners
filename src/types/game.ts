export enum GameState {
  IDLE = 'IDLE',
  LOBBY = 'LOBBY',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}

export type GameMode = 'offline' | 'online';
export type OfflineSubMode = 'single' | 'team';

export interface DurationOption {
  value: number;
  label: string;
  emoji: string;
  description: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { value: 15, label: '15s', emoji: '⚡', description: 'Lightning Round' },
  { value: 30, label: '30s', emoji: '🎯', description: 'Classic Sprint' },
  { value: 45, label: '45s', emoji: '🔥', description: 'Extended Battle' },
  { value: 60, label: '60s', emoji: '💪', description: 'Endurance Run' },
  { value: 90, label: '90s', emoji: '🏆', description: 'Marathon Mode' },
];

export interface GameConfig {
  duration: number; // seconds
  scrollPoints: number;
  likePoints: number;
  fastInteractionPoints: number;
  comboDecayMs: number; // ms before combo breaks
  maxComboMultiplier: number;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  duration: 30,
  scrollPoints: 10,
  likePoints: 50,
  fastInteractionPoints: 100,
  comboDecayMs: 2000,
  maxComboMultiplier: 20,
};

export interface ComboState {
  count: number;
  multiplier: number;
  lastInteractionTime: number;
  isActive: boolean;
}

export type GameEventType =
  | 'VIRAL_POST'
  | 'CLICKBAIT'
  | 'BORING_POST'
  | 'INFINITE_LOOP'
  | 'MOM_CALLING'
  | 'NORMAL';

export interface GameEvent {
  type: GameEventType;
  title: string;
  description: string;
  pointsMultiplier: number;
  duration?: number; // ms for timed events
}

export const GAME_EVENTS: Record<Exclude<GameEventType, 'NORMAL'>, GameEvent> = {
  VIRAL_POST: {
    type: 'VIRAL_POST',
    title: '🚀 VIRAL POST!',
    description: 'This post is blowing up! Double points!',
    pointsMultiplier: 2,
  },
  CLICKBAIT: {
    type: 'CLICKBAIT',
    title: '🎣 CLICKBAIT!',
    description: "You won't believe what happens next...",
    pointsMultiplier: 1.5,
  },
  BORING_POST: {
    type: 'BORING_POST',
    title: '😴 BORING POST',
    description: 'This post has zero value. Skip it!',
    pointsMultiplier: 0,
  },
  INFINITE_LOOP: {
    type: 'INFINITE_LOOP',
    title: '🔄 INFINITE LOOP!',
    description: 'You cannot stop scrolling this post!',
    pointsMultiplier: 3,
  },
  MOM_CALLING: {
    type: 'MOM_CALLING',
    title: '📞 YOUR MOM IS CALLING!',
    description: 'Quick, pretend you were studying!',
    pointsMultiplier: 0,
    duration: 2000,
  },
};

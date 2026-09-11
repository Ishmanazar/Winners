import { create } from 'zustand';
import { GameState, DEFAULT_GAME_CONFIG, GameConfig, ComboState } from '../types/game';
import { Player } from '../types/player';
import { rankPlayers } from '../data/mockPlayers';

export interface GameResultSummary {
  score: number;
  previousHighScore: number;
  isNewHighScore: boolean;
  rank: number;
}

interface GameStore {
  // Game state
  gameState: GameState;
  gameConfig: GameConfig;
  timeRemaining: number;

  // Player state
  currentPlayer: Player;
  leaderboardPlayers: Player[];
  lastGameResult: GameResultSummary | null;

  // Score state
  score: number;
  combo: ComboState;
  rank: number;
  totalScrollDistance: number;
  totalLikes: number;
  totalInteractions: number;

  // Paused state (for random events)
  isPaused: boolean;

  // Actions - Game lifecycle
  setGameState: (state: GameState) => void;
  startGame: () => void;
  endGame: () => void;
  tick: () => void;
  resetGame: () => void;

  // Actions - Scoring
  addPoints: (points: number) => void;
  addScrollPoints: () => void;
  batchScrollPoints: (ticks: number, distance: number) => void;
  addLikePoints: () => void;
  addBonusPoints: (multiplier: number) => void;
  incrementCombo: () => void;
  breakCombo: () => void;
  resetScore: () => void;

  // Actions - Players & Leaderboard
  setCurrentPlayer: (player: Player) => void;
  setPlayerName: (name: string, avatar?: string) => void;
  clearPlayer: () => void;
  checkExistingPlayer: (name: string) => { exists: boolean; highestScore?: number; avatar?: string };
  getPlayerBestScore: (name: string) => number;
  addLeaderboardPlayer: (name: string, score: number, avatar?: string) => void;
  removeLeaderboardPlayer: (playerId: string) => void;
  clearLeaderboard: () => void;

  // Actions - Misc
  addScrollDistance: (distance: number) => void;
  setPaused: (paused: boolean) => void;
}

const initialCombo: ComboState = {
  count: 0,
  multiplier: 1,
  lastInteractionTime: 0,
  isActive: false,
};

const defaultPlayer: Player = {
  id: 'player-current',
  name: '',
  score: 0,
  rank: 1,
  avatar: '😎',
  isCurrentPlayer: true,
};

const getStoredPlayer = (): Player => {
  try {
    const saved = localStorage.getItem('doom_current_player');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.name === 'string') {
        return parsed;
      }
    }
  } catch (e) {}
  return defaultPlayer;
};

/**
 * List of known dummy / mock names from previous templates that must be purged.
 */
const ALL_DUMMY_NAMES = [
  'rahul',
  'sarah',
  'alex',
  'priya',
  'jordan',
  'mika',
  'bot rahul',
  'bot sarah',
  'bot alex',
  'bot priya',
  'proscroller',
  'memelord',
  'bedrotter',
  'nightowl',
  'speedswiper',
  'scrollmaster',
  'the final scroll boss',
  'phone zombie',
  'anonymous scroller',
];

/**
 * Reads leaderboard from localStorage and aggressively purges any dummy/mock records.
 */
const getStoredLeaderboard = (): Player[] => {
  try {
    const saved = localStorage.getItem('doom_leaderboard');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Keep ONLY real players actually added by the user
        const cleanList = parsed.filter((p) => {
          if (!p || !p.name || typeof p.name !== 'string') return false;
          const norm = p.name.trim().toLowerCase();
          if (norm.length === 0) return false;

          // Discard any dummy names
          if (ALL_DUMMY_NAMES.includes(norm)) return false;

          // Discard old mock IDs '1', '2', '3', '4', '5', '6', '7'
          if (/^[0-9]+$/.test(String(p.id))) return false;

          return true;
        });

        const ranked = rankPlayers(cleanList);
        // Persist the clean list back immediately so dummy data is removed permanently
        saveLeaderboard(ranked);
        return ranked;
      }
    }
  } catch (e) {}
  return [];
};

const saveLeaderboard = (players: Player[]) => {
  try {
    localStorage.setItem('doom_leaderboard', JSON.stringify(players));
  } catch (e) {}
};

/**
 * Upserts a player into the leaderboard by unique name (case-insensitive).
 * - If name already exists:
 *     - If new score is higher: rewrite to new score (new personal best).
 *     - If new score is lower/equal: keep the existing highest score!
 * - If new player name:
 *     - Create new entry with this score.
 */
function upsertLeaderboard(
  board: Player[],
  name: string,
  score: number,
  avatar: string
): { updatedBoard: Player[]; isNewHighScore: boolean; previousHighScore: number } {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { updatedBoard: board, isNewHighScore: false, previousHighScore: 0 };
  }

  const normalized = trimmedName.toLowerCase();
  const existingIdx = board.findIndex((p) => p.name.trim().toLowerCase() === normalized);

  let updated: Player[];
  let isNewHighScore = false;
  let previousHighScore = 0;

  if (existingIdx !== -1) {
    const existing = board[existingIdx];
    previousHighScore = existing.score;

    if (score > existing.score) {
      // Rewrite with the new higher score
      isNewHighScore = true;
      updated = board.map((p, i) =>
        i === existingIdx
          ? { ...p, name: trimmedName, avatar: avatar || p.avatar, score, isCurrentPlayer: true }
          : { ...p, isCurrentPlayer: false }
      );
    } else {
      // Keep existing highest score
      isNewHighScore = false;
      updated = board.map((p, i) =>
        i === existingIdx
          ? { ...p, name: trimmedName, avatar: avatar || p.avatar, isCurrentPlayer: true }
          : { ...p, isCurrentPlayer: false }
      );
    }
  } else {
    // New player name
    isNewHighScore = true;
    previousHighScore = 0;
    const newEntry: Player = {
      id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmedName,
      score,
      rank: 0,
      avatar: avatar || '😎',
      isCurrentPlayer: true,
    };
    updated = [...board.map((p) => ({ ...p, isCurrentPlayer: false })), newEntry];
  }

  return {
    updatedBoard: rankPlayers(updated),
    isNewHighScore,
    previousHighScore,
  };
}

const initialPlayer = getStoredPlayer();
const initialLeaderboard = getStoredLeaderboard();

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: GameState.IDLE,
  gameConfig: DEFAULT_GAME_CONFIG,
  timeRemaining: DEFAULT_GAME_CONFIG.duration,
  currentPlayer: initialPlayer,
  leaderboardPlayers: initialLeaderboard,
  lastGameResult: null,
  score: 0,
  combo: { ...initialCombo },
  rank: 1,
  totalScrollDistance: 0,
  totalLikes: 0,
  totalInteractions: 0,
  isPaused: false,

  // Game lifecycle
  setGameState: (state) => set({ gameState: state }),

  startGame: () => {
    const { gameConfig, leaderboardPlayers, currentPlayer } = get();
    // Calculate live rank against real players on the leaderboard
    const otherRealPlayers = leaderboardPlayers.filter(
      (p) => p.name.trim().toLowerCase() !== currentPlayer.name.trim().toLowerCase()
    );
    const initialRank = otherRealPlayers.length + 1;

    set({
      gameState: GameState.PLAYING,
      timeRemaining: gameConfig.duration,
      score: 0,
      combo: { ...initialCombo },
      rank: initialRank,
      totalScrollDistance: 0,
      totalLikes: 0,
      totalInteractions: 0,
      lastGameResult: null,
      isPaused: false,
    });
  },

  endGame: () => {
    const { score, currentPlayer, leaderboardPlayers } = get();
    const playerName = currentPlayer.name.trim();

    if (!playerName) {
      set({
        gameState: GameState.FINISHED,
        combo: { ...initialCombo },
      });
      return;
    }

    // Leaderboard persistence: unique by name, keep highest score
    const { updatedBoard, isNewHighScore, previousHighScore } = upsertLeaderboard(
      leaderboardPlayers,
      playerName,
      score,
      currentPlayer.avatar
    );
    saveLeaderboard(updatedBoard);

    // Find rank in the all-time persistent leaderboard
    const allTimeRank =
      updatedBoard.find((p) => p.name.toLowerCase() === playerName.toLowerCase())?.rank ?? 1;

    set({
      gameState: GameState.FINISHED,
      leaderboardPlayers: updatedBoard,
      rank: allTimeRank,
      combo: { ...initialCombo },
      lastGameResult: {
        score,
        previousHighScore,
        isNewHighScore,
        rank: allTimeRank,
      },
    });
  },

  tick: () => {
    const { timeRemaining, gameState } = get();
    if (gameState !== GameState.PLAYING) return;
    if (timeRemaining <= 1) {
      get().endGame();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  resetGame: () => {
    const { gameConfig } = get();
    set({
      gameState: GameState.IDLE,
      timeRemaining: gameConfig.duration,
      score: 0,
      combo: { ...initialCombo },
      rank: 1,
      totalScrollDistance: 0,
      totalLikes: 0,
      totalInteractions: 0,
      isPaused: false,
    });
  },

  // Scoring
  addPoints: (points) => {
    const { score, combo, leaderboardPlayers, currentPlayer } = get();
    const multiplier = combo.isActive ? combo.multiplier : 1;
    const finalPoints = Math.floor(points * multiplier);
    const newScore = score + finalPoints;

    // Calculate real live rank against other players in the leaderboard
    const otherRealPlayers = leaderboardPlayers.filter(
      (p) => p.name.trim().toLowerCase() !== currentPlayer.name.trim().toLowerCase()
    );
    const liveRank = otherRealPlayers.filter((p) => p.score > newScore).length + 1;

    set({ score: newScore, rank: liveRank });
  },

  addScrollPoints: () => {
    get().batchScrollPoints(1, 1);
  },

  batchScrollPoints: (ticks: number, distance: number) => {
    if (ticks <= 0) return;
    const { score, combo, gameConfig, leaderboardPlayers, currentPlayer, totalScrollDistance } = get();
    const now = Date.now();
    const newCount = combo.count + ticks;
    const newMultiplier = Math.min(
      1 + Math.floor(newCount / 5) * 0.5,
      gameConfig.maxComboMultiplier
    );

    const basePointsPerTick = 10;
    const pointsEarned = Math.floor(basePointsPerTick * ticks * (combo.isActive ? combo.multiplier : 1));
    const newScore = score + pointsEarned;

    // Calculate live rank against real leaderboard players
    const otherRealPlayers = leaderboardPlayers.filter(
      (p) => p.name.trim().toLowerCase() !== currentPlayer.name.trim().toLowerCase()
    );
    const liveRank = otherRealPlayers.filter((p) => p.score > newScore).length + 1;

    set({
      score: newScore,
      rank: liveRank,
      totalScrollDistance: totalScrollDistance + distance,
      combo: {
        count: newCount,
        multiplier: newMultiplier,
        lastInteractionTime: now,
        isActive: true,
      },
    });
  },

  addLikePoints: () => {
    const { combo, totalLikes } = get();
    const points = Math.floor(50 * (combo.isActive ? combo.multiplier : 1));
    get().incrementCombo();
    get().addPoints(points);
    set({
      totalLikes: totalLikes + 1,
      totalInteractions: get().totalInteractions + 1,
    });
  },

  addBonusPoints: (multiplier) => {
    const { combo } = get();
    const base = 100;
    const points = Math.floor(base * multiplier * (combo.isActive ? combo.multiplier : 1));
    get().incrementCombo();
    get().addPoints(points);
    set({
      totalInteractions: get().totalInteractions + 1,
    });
  },

  incrementCombo: () => {
    const { combo, gameConfig } = get();
    const now = Date.now();
    const newCount = combo.count + 1;
    const newMultiplier = Math.min(
      1 + Math.floor(newCount / 5) * 0.5,
      gameConfig.maxComboMultiplier
    );

    set({
      combo: {
        count: newCount,
        multiplier: newMultiplier,
        lastInteractionTime: now,
        isActive: true,
      },
    });
  },

  breakCombo: () => {
    set({
      combo: {
        count: 0,
        multiplier: 1,
        lastInteractionTime: Date.now(),
        isActive: false,
      },
    });
  },

  resetScore: () => {
    set({
      score: 0,
      combo: { ...initialCombo },
      rank: 1,
    });
  },

  // Players & Leaderboard
  setCurrentPlayer: (player) => set({ currentPlayer: player }),

  clearPlayer: () => {
    const fresh: Player = {
      id: `player-${Date.now()}`,
      name: '',
      score: 0,
      rank: 1,
      avatar: '😎',
      isCurrentPlayer: true,
    };
    try {
      localStorage.removeItem('doom_current_player');
    } catch (e) {}
    set({ currentPlayer: fresh });
  },

  setPlayerName: (name: string, avatar?: string) => {
    const { currentPlayer } = get();
    const cleanName = name.trim();
    const updatedPlayer = {
      ...currentPlayer,
      name: cleanName,
      avatar: avatar || currentPlayer.avatar,
    };
    try {
      localStorage.setItem('doom_current_player', JSON.stringify(updatedPlayer));
    } catch (e) {}
    set({ currentPlayer: updatedPlayer });
  },

  checkExistingPlayer: (name: string) => {
    const clean = name.trim().toLowerCase();
    if (!clean) return { exists: false };
    const found = get().leaderboardPlayers.find((p) => p.name.trim().toLowerCase() === clean);
    if (found) {
      return { exists: true, highestScore: found.score, avatar: found.avatar };
    }
    return { exists: false };
  },

  getPlayerBestScore: (name: string) => {
    const clean = name.trim().toLowerCase();
    if (!clean) return 0;
    const found = get().leaderboardPlayers.find((p) => p.name.trim().toLowerCase() === clean);
    return found ? found.score : 0;
  },

  addLeaderboardPlayer: (name: string, score: number, avatar = '😎') => {
    const { leaderboardPlayers } = get();
    const { updatedBoard } = upsertLeaderboard(leaderboardPlayers, name, score, avatar);
    saveLeaderboard(updatedBoard);
    set({ leaderboardPlayers: updatedBoard });
  },

  removeLeaderboardPlayer: (playerId: string) => {
    const { leaderboardPlayers } = get();
    const filtered = leaderboardPlayers.filter((p) => p.id !== playerId);
    const ranked = rankPlayers(filtered);
    saveLeaderboard(ranked);
    set({ leaderboardPlayers: ranked });
  },

  clearLeaderboard: () => {
    saveLeaderboard([]);
    set({ leaderboardPlayers: [] });
  },

  // Misc
  addScrollDistance: (distance) => {
    const { totalScrollDistance } = get();
    set({ totalScrollDistance: totalScrollDistance + distance });
  },

  setPaused: (paused) => set({ isPaused: paused }),
}));

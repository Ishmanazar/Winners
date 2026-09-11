import { create } from 'zustand';
import { GameState, DEFAULT_GAME_CONFIG, GameConfig, ComboState } from '../types/game';
import { Player } from '../types/player';
import { LOBBY_PLAYERS, rankPlayers, simulateOpponentScoreUpdate } from '../data/mockPlayers';

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
  players: Player[];
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
  addLikePoints: () => void;
  addBonusPoints: (multiplier: number) => void;
  incrementCombo: () => void;
  breakCombo: () => void;
  resetScore: () => void;

  // Actions - Players & Leaderboard
  setCurrentPlayer: (player: Player) => void;
  setPlayerName: (name: string, avatar?: string) => void;
  clearPlayer: () => void;
  updatePlayerScore: (playerId: string, score: number) => void;
  updateOpponentScores: (elapsedSeconds: number) => void;
  recalculateRanks: () => void;
  checkExistingPlayer: (name: string) => { exists: boolean; highestScore?: number; avatar?: string };
  getPlayerBestScore: (name: string) => number;

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
  id: 'player-1',
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
      return JSON.parse(saved);
    }
  } catch (e) {}
  return defaultPlayer;
};

/**
 * Filter out any legacy dummy players from older localStorage builds.
 */
const LEGACY_DUMMY_NAMES = [
  'proscroller',
  'memelord',
  'bedrotter',
  'nightowl',
  'speedswiper',
  'bot rahul',
  'bot sarah',
  'bot alex',
  'scrollmaster',
];

const getStoredLeaderboard = (): Player[] => {
  try {
    const saved = localStorage.getItem('doom_leaderboard');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Filter out dummy players so board has only real human games
        const cleanList = parsed.filter((p) => {
          if (!p || !p.name || typeof p.name !== 'string') return false;
          const norm = p.name.trim().toLowerCase();
          return norm.length > 0 && !LEGACY_DUMMY_NAMES.includes(norm);
        });
        return rankPlayers(cleanList);
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
      id: `lb-${Date.now()}`,
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
  players: LOBBY_PLAYERS.map((p) => ({ ...p, score: 0 })),
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
    const { gameConfig, currentPlayer } = get();
    set({
      gameState: GameState.PLAYING,
      timeRemaining: gameConfig.duration,
      score: 0,
      combo: { ...initialCombo },
      rank: 1,
      totalScrollDistance: 0,
      totalLikes: 0,
      totalInteractions: 0,
      lastGameResult: null,
      players: LOBBY_PLAYERS.map((p) =>
        p.id === currentPlayer.id || p.isCurrentPlayer
          ? { ...p, name: currentPlayer.name || 'Anonymous Scroller', avatar: currentPlayer.avatar, score: 0, isCurrentPlayer: true }
          : { ...p, score: 0 }
      ),
      isPaused: false,
    });
  },

  endGame: () => {
    const { score, players, currentPlayer, leaderboardPlayers } = get();
    const updatedPlayers = players.map((p) =>
      p.id === currentPlayer.id || p.isCurrentPlayer ? { ...p, score } : p
    );
    const rankedInGame = rankPlayers(updatedPlayers);
    const playerRankInGame = rankedInGame.find((p) => p.isCurrentPlayer)?.rank ?? 1;

    // Leaderboard persistence: unique by name, keep highest score
    const playerName = currentPlayer.name.trim() || 'Anonymous Scroller';
    const { updatedBoard, isNewHighScore, previousHighScore } = upsertLeaderboard(
      leaderboardPlayers,
      playerName,
      score,
      currentPlayer.avatar
    );
    saveLeaderboard(updatedBoard);

    // Find rank in the all-time persistent leaderboard
    const allTimeRank = updatedBoard.find((p) => p.name.toLowerCase() === playerName.toLowerCase())?.rank ?? playerRankInGame;

    set({
      gameState: GameState.FINISHED,
      players: rankedInGame,
      leaderboardPlayers: updatedBoard,
      rank: playerRankInGame,
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
    const { gameConfig, currentPlayer } = get();
    set({
      gameState: GameState.IDLE,
      timeRemaining: gameConfig.duration,
      score: 0,
      combo: { ...initialCombo },
      rank: 1,
      totalScrollDistance: 0,
      totalLikes: 0,
      totalInteractions: 0,
      players: LOBBY_PLAYERS.map((p) =>
        p.id === currentPlayer.id || p.isCurrentPlayer
          ? { ...p, name: currentPlayer.name, avatar: currentPlayer.avatar, score: 0, isCurrentPlayer: true }
          : { ...p, score: 0 }
      ),
      isPaused: false,
    });
  },

  // Scoring
  addPoints: (points) => {
    const { score, combo } = get();
    const multiplier = combo.isActive ? combo.multiplier : 1;
    const finalPoints = Math.floor(points * multiplier);
    set({ score: score + finalPoints });
  },

  addScrollPoints: () => {
    const { score, combo, totalScrollDistance } = get();
    const points = Math.floor(10 * (combo.isActive ? combo.multiplier : 1));
    get().incrementCombo();
    set({
      score: score + points,
      totalScrollDistance: totalScrollDistance + 1,
    });
  },

  addLikePoints: () => {
    const { score, combo, totalLikes } = get();
    const points = Math.floor(50 * (combo.isActive ? combo.multiplier : 1));
    get().incrementCombo();
    set({
      score: score + points,
      totalLikes: totalLikes + 1,
      totalInteractions: get().totalInteractions + 1,
    });
  },

  addBonusPoints: (multiplier) => {
    const { score, combo } = get();
    const base = 100;
    const points = Math.floor(base * multiplier * (combo.isActive ? combo.multiplier : 1));
    get().incrementCombo();
    set({
      score: score + points,
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
    const { currentPlayer, players } = get();
    const cleanName = name.trim();
    const updatedPlayer = {
      ...currentPlayer,
      name: cleanName,
      avatar: avatar || currentPlayer.avatar,
    };
    const updatedPlayers = players.map((p) =>
      p.id === currentPlayer.id || p.isCurrentPlayer
        ? { ...p, name: cleanName, avatar: updatedPlayer.avatar, isCurrentPlayer: true }
        : p
    );
    try {
      localStorage.setItem('doom_current_player', JSON.stringify(updatedPlayer));
    } catch (e) {}
    set({
      currentPlayer: updatedPlayer,
      players: updatedPlayers,
    });
  },

  updatePlayerScore: (playerId, score) => {
    const { players } = get();
    const updated = players.map((p) =>
      p.id === playerId ? { ...p, score } : p
    );
    set({ players: updated });
  },

  updateOpponentScores: (elapsedSeconds) => {
    const { players, currentPlayer, score } = get();
    const withCurrentScore = players.map((p) =>
      p.id === currentPlayer.id || p.isCurrentPlayer ? { ...p, score } : p
    );
    const updated = simulateOpponentScoreUpdate(withCurrentScore, currentPlayer.id, elapsedSeconds);
    const ranked = rankPlayers(updated);
    const playerRank = ranked.find((p) => p.isCurrentPlayer)?.rank ?? 1;
    set({ players: ranked, rank: playerRank });
  },

  recalculateRanks: () => {
    const { players } = get();
    const ranked = rankPlayers(players);
    const playerRank = ranked.find((p) => p.isCurrentPlayer)?.rank ?? 1;
    set({ players: ranked, rank: playerRank });
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

  // Misc
  addScrollDistance: (distance) => {
    const { totalScrollDistance } = get();
    set({ totalScrollDistance: totalScrollDistance + distance });
  },

  setPaused: (paused) => set({ isPaused: paused }),
}));

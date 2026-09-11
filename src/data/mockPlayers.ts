import { Player } from '../types/player';

/**
 * No dummy/mock players in the leaderboard anymore.
 * Leaderboard is built entirely from real localStorage-persisted player scores.
 * LOBBY_PLAYERS still has simulated opponents for the in-game competition.
 */

export const LOBBY_PLAYERS: Player[] = [
  {
    id: '1',
    name: '',
    score: 0,
    rank: 0,
    avatar: '😎',
    isCurrentPlayer: true,
  },
  {
    id: '2',
    name: 'Bot Rahul',
    score: 0,
    rank: 0,
    avatar: '🤓',
  },
  {
    id: '3',
    name: 'Bot Sarah',
    score: 0,
    rank: 0,
    avatar: '💅',
  },
  {
    id: '4',
    name: 'Bot Alex',
    score: 0,
    rank: 0,
    avatar: '🎮',
  },
];

/**
 * Simulates opponent score updates during gameplay.
 * Designed to be replaced by socket.on("player:score", ...) in the future.
 */
export function simulateOpponentScoreUpdate(
  players: Player[],
  currentPlayerId: string,
  elapsedSeconds: number,
): Player[] {
  return players.map((player) => {
    if (player.id === currentPlayerId) return player;

    // Each opponent gets a somewhat random but progressive score
    const baseRate = Math.random() * 300 + 200; // 200-500 points per update
    const variance = Math.sin(elapsedSeconds * Number(player.id)) * 100;
    const newScore = player.score + Math.floor(baseRate + variance);

    return { ...player, score: Math.max(player.score, newScore) };
  });
}

/**
 * Sorts players by score and assigns ranks.
 */
export function rankPlayers(players: Player[]): Player[] {
  return [...players]
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
}

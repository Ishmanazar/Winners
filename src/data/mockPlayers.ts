import { Player } from '../types/player';

/**
 * Ranking and score utility functions.
 * All dummy/mock bots (Rahul, Sarah, Alex, etc.) have been completely eliminated.
 * The game now operates exclusively with real players added by the user.
 */

/**
 * Sorts players by score descending and assigns 1-based ranks.
 */
export function rankPlayers(players: Player[]): Player[] {
  return [...players]
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
}

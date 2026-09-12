import { supabase } from '../lib/supabase';

export interface GlobalLeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  best_score: number;
  total_games: number;
  rank: number;
}

export interface GameScorePayload {
  player_id: string;
  score: number;
  duration: number;
  total_likes: number;
  total_interactions: number;
  max_combo: number;
}

/**
 * Fetch the global leaderboard (sorted by best_score desc)
 */
export async function fetchGlobalLeaderboard(limit = 50): Promise<GlobalLeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('global_leaderboard')
    .select('*')
    .limit(limit);

  if (error) {
    console.error('Error fetching global leaderboard:', error);
    return [];
  }

  return (data || []) as GlobalLeaderboardEntry[];
}

/**
 * Submit a game score — the DB trigger auto-updates profiles.best_score
 */
export async function submitGameScore(payload: GameScorePayload): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('game_scores')
    .insert(payload);

  if (error) {
    console.error('Error submitting game score:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Fetch a specific player's rank from the global leaderboard
 */
export async function fetchPlayerRank(playerId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('global_leaderboard')
    .select('rank')
    .eq('id', playerId)
    .single();

  if (error || !data) return null;
  return data.rank;
}

/**
 * Fetch a player's game history
 */
export async function fetchPlayerGameHistory(playerId: string, limit = 20) {
  const { data, error } = await supabase
    .from('game_scores')
    .select('*')
    .eq('player_id', playerId)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching game history:', error);
    return [];
  }

  return data || [];
}

/**
 * Subscribe to real-time leaderboard updates (profiles table changes)
 */
export function subscribeToLeaderboard(
  callback: (payload: { new: GlobalLeaderboardEntry }) => void
) {
  const channel = supabase
    .channel('leaderboard-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
      },
      (payload) => {
        callback(payload as unknown as { new: GlobalLeaderboardEntry });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}


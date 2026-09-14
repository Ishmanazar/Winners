import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { AppNavbar } from '../components/layout/AppNavbar';
import { Button } from '../components/ui/Button';
import {
  Trophy,
  Play,
  Trash2,
  Globe,
  Users,
  LogIn,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import {
  fetchGlobalLeaderboard,
  subscribeToLeaderboard,
  type GlobalLeaderboardEntry,
} from '../services/onlineService';
import { isSupabaseConfigured } from '../lib/supabase';

export function LeaderboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'local' | 'global'>(
    tabParam === 'global' ? 'global' : 'local'
  );

  const {
    leaderboardPlayers,
    clearLeaderboard,
  } = useGameStore();

  const { user, isAuthenticated } = useAuthStore();



  // Global leaderboard state
  const [globalList, setGlobalList] = useState<GlobalLeaderboardEntry[]>([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  // Sync tab with URL query parameter
  const switchTab = (tab: 'local' | 'global') => {
    setActiveTab(tab);
    setSearchParams(tab === 'global' ? { tab: 'global' } : {});
  };

  // Fetch global leaderboard
  const loadGlobalLeaderboard = useCallback(async () => {
    if (!supabaseReady) return;
    setIsGlobalLoading(true);
    try {
      const data = await fetchGlobalLeaderboard(50);
      setGlobalList(data);
    } catch (err) {
      console.error('Failed to load global leaderboard:', err);
    } finally {
      setIsGlobalLoading(false);
    }
  }, [supabaseReady]);

  useEffect(() => {
    if (activeTab === 'global') {
      loadGlobalLeaderboard();

      // Realtime subscription
      const unsubscribe = subscribeToLeaderboard(() => {
        loadGlobalLeaderboard();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [activeTab, loadGlobalLeaderboard]);

  const top3Local = leaderboardPlayers.slice(0, 3);
  const top3Global = globalList.slice(0, 3);

  const handlePlay = () => {
    if (activeTab === 'global') {
      if (!isAuthenticated) {
        navigate('/auth', { state: { from: '/online/lobby' } });
      } else {
        navigate('/online/lobby');
      }
      return;
    }

    // Offline: go straight to offline lobby, no login needed
    navigate('/offline/lobby');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all players from the local leaderboard?')) {
      clearLeaderboard();
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Header Title */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffc800]/20 border border-[#ffc800]/40 text-[#ffc800] text-xs font-black uppercase tracking-widest mb-2">
            <Trophy size={14} /> OFFICIAL LEADERBOARD
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            DOOM SCROLL LEAGUE
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mt-1">
            {activeTab === 'local'
              ? 'Exclusively real players on this device. No dummy bots or fake accounts.'
              : 'Global rankings across all athletes competing worldwide.'}
          </p>

          {/* Tab Switcher: Local vs Global */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              onClick={() => switchTab('local')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'local'
                  ? 'bg-[#1cb0f6] text-white shadow-lg shadow-[#1cb0f6]/30 border-2 border-white/20 scale-105'
                  : 'bg-[#1b2b34] text-white/70 hover:text-white border-2 border-[#2b3e4a]'
              }`}
            >
              <Users size={15} />
              <span>LOCAL ROSTER ({leaderboardPlayers.length})</span>
            </button>

            <button
              onClick={() => switchTab('global')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'global'
                  ? 'bg-[#58cc02] text-white shadow-lg shadow-[#58cc02]/30 border-2 border-white/20 scale-105'
                  : 'bg-[#1b2b34] text-white/70 hover:text-white border-2 border-[#2b3e4a]'
              }`}
            >
              <Globe size={15} />
              <span>GLOBAL ARENA</span>
              {globalList.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {globalList.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Action Bar */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <Button
              variant="cta"
              size="sm"
              onClick={handlePlay}
              icon={<Play size={14} />}
            >
              {activeTab === 'global' ? 'COMPETE ONLINE 🌐' : 'PLAY MATCH 🚀'}
            </Button>

            {activeTab === 'local' ? (
              <>
                {leaderboardPlayers.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff4b4b]/10 hover:bg-[#ff4b4b]/20 text-[#ff4b4b] border border-[#ff4b4b]/30 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    title="Clear all players from the local leaderboard"
                  >
                    <Trash2 size={13} />
                    <span>CLEAR ALL</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={loadGlobalLeaderboard}
                disabled={isGlobalLoading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ffc800]/15 hover:bg-[#ffc800]/30 text-[#ffc800] border border-[#ffc800]/40 text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={isGlobalLoading ? 'animate-spin' : ''} />
                <span>REFRESH</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: LOCAL LEADERBOARD */}
        {activeTab === 'local' && (
          <>
            {leaderboardPlayers.length === 0 ? (
              <motion.div
                className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-[#ffc800]/15 border-2 border-[#ffc800]/40 flex items-center justify-center text-4xl mb-4">
                  🏆
                </div>
                <h2 className="font-display font-black text-2xl text-white mb-2">
                  NO SCORES RECORDED YET!
                </h2>
                <p className="text-sm text-white/60 mb-6 leading-relaxed">
                  The local leaderboard is clean. Play a match to set your high score and establish the local rankings!
                </p>
                <div className="flex justify-center">
                  <Button
                    variant="cta"
                    size="lg"
                    onClick={handlePlay}
                    icon={<Play size={18} />}
                    className="w-full sm:w-auto px-8"
                  >
                    PLAY FIRST MATCH 🚀
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Top 3 Podium (Local) */}
                <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 pt-4 pb-2">
                  {/* 🥈 2nd Place */}
                  {top3Local[1] ? (
                    <motion.div
                      className="flex-1 max-w-[160px] flex flex-col items-center"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="text-3xl mb-1">{top3Local[1].avatar}</div>
                      <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                        {top3Local[1].name}
                      </p>
                      <span className="text-[11px] font-black text-[#1cb0f6] bg-[#1cb0f6]/10 px-2 py-0.5 rounded-full mt-0.5">
                        {top3Local[1].score.toLocaleString()} PTS
                      </span>
                      <div className="w-full h-24 sm:h-28 bg-[#1b2b34] border-2 border-[#1cb0f6]/50 rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-md">
                        <span className="text-3xl">🥈</span>
                        <span className="text-[10px] font-black text-[#1cb0f6] tracking-wider uppercase mt-1">
                          2ND
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 max-w-[160px]" />
                  )}

                  {/* 🥇 1st Place */}
                  {top3Local[0] && (
                    <motion.div
                      className="flex-1 max-w-[180px] flex flex-col items-center z-10"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="text-4xl mb-1 animate-bounce">👑</div>
                      <div className="text-3xl mb-1">{top3Local[0].avatar}</div>
                      <p className="font-display font-black text-sm sm:text-base text-[#ffc800] truncate max-w-full text-center">
                        {top3Local[0].name}
                      </p>
                      <span className="text-xs font-black text-[#ffc800] bg-[#ffc800]/15 px-2.5 py-0.5 rounded-full mt-0.5 border border-[#ffc800]/30">
                        {top3Local[0].score.toLocaleString()} PTS
                      </span>
                      <div className="w-full h-32 sm:h-36 bg-gradient-to-b from-[#ffc800]/20 to-[#1b2b34] border-2 border-[#ffc800] rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,200,0,0.2)]">
                        <span className="text-4xl">🥇</span>
                        <span className="text-xs font-black text-[#ffc800] tracking-wider uppercase mt-1">
                          CHAMPION
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* 🥉 3rd Place */}
                  {top3Local[2] ? (
                    <motion.div
                      className="flex-1 max-w-[160px] flex flex-col items-center"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-3xl mb-1">{top3Local[2].avatar}</div>
                      <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                        {top3Local[2].name}
                      </p>
                      <span className="text-[11px] font-black text-[#ff9600] bg-[#ff9600]/10 px-2 py-0.5 rounded-full mt-0.5">
                        {top3Local[2].score.toLocaleString()} PTS
                      </span>
                      <div className="w-full h-20 sm:h-24 bg-[#1b2b34] border-2 border-[#ff9600]/50 rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-md">
                        <span className="text-2xl">🥉</span>
                        <span className="text-[10px] font-black text-[#ff9600] tracking-wider uppercase mt-1">
                          3RD
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 max-w-[160px]" />
                  )}
                </div>

                {/* Local Players List */}
                <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl overflow-hidden shadow-md">
                  <div className="px-4 py-3 bg-[#131f24]/50 border-b-2 border-[#2b3e4a] flex items-center justify-between text-xs font-black uppercase tracking-wider text-white/50">
                    <span>RANK &amp; ATHLETE</span>
                    <span>SCORE</span>
                  </div>

                  <div className="divide-y divide-[#2b3e4a]">
                    {leaderboardPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                              player.rank === 1
                                ? 'bg-[#ffc800] text-[#131f24]'
                                : player.rank === 2
                                ? 'bg-[#1cb0f6] text-white'
                                : player.rank === 3
                                ? 'bg-[#ff9600] text-white'
                                : 'bg-[#2b3e4a] text-white/70'
                            }`}
                          >
                            #{player.rank}
                          </span>
                          <span className="text-2xl shrink-0">{player.avatar}</span>
                          <div className="min-w-0">
                            <span className="font-display font-black text-sm text-white truncate">
                              {player.name}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-display font-black text-sm sm:text-base text-[#ffc800]">
                            {player.score.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-white/40 ml-1">PTS</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: GLOBAL LEADERBOARD (SUPABASE) */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            {/* Supabase unconfigured warning */}
            {!supabaseReady && (
              <div className="bg-[#ff4b4b]/10 border-2 border-[#ff4b4b]/30 rounded-3xl p-5 text-center max-w-lg mx-auto">
                <AlertCircle className="w-8 h-8 text-[#ff4b4b] mx-auto mb-2" />
                <h3 className="font-display font-black text-lg text-white mb-1">
                  SUPABASE CREDENTIALS REQUIRED
                </h3>
                <p className="text-xs text-white/70 leading-relaxed mb-3">
                  To view global rankings and compete online, configure your Supabase Project URL and Anon Key in <code className="bg-[#131f24] px-1.5 py-0.5 rounded text-[#ffc800]">.env.local</code>.
                </p>
                <div className="text-[11px] text-white/50 text-left bg-[#131f24] p-3 rounded-xl font-mono">
                  VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                  VITE_SUPABASE_ANON_KEY=your-anon-key
                </div>
              </div>
            )}

            {/* Auth CTA Banner if not signed in */}
            {!isAuthenticated && supabaseReady && (
              <div className="bg-gradient-to-r from-[#1b2b34] to-[#131f24] border-2 border-[#58cc02]/30 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#58cc02]/20 border border-[#58cc02]/40 flex items-center justify-center text-2xl shrink-0">
                    🌐
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white">
                      JOIN THE GLOBAL ARENA!
                    </h3>
                    <p className="text-xs text-white/60">
                      Sign up with your email to climb the world ranks and save your stats.
                    </p>
                  </div>
                </div>
                <Button
                  variant="cta"
                  size="md"
                  onClick={() => navigate('/auth', { state: { from: '/leaderboard?tab=global' } })}
                  icon={<LogIn size={16} />}
                  className="shrink-0"
                >
                  SIGN IN / REGISTER 🚀
                </Button>
              </div>
            )}

            {/* Global Empty State */}
            {globalList.length === 0 && !isGlobalLoading && supabaseReady && (
              <motion.div
                className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-[#58cc02]/15 border-2 border-[#58cc02]/40 flex items-center justify-center text-4xl mb-4">
                  🌐
                </div>
                <h2 className="font-display font-black text-2xl text-white mb-2">
                  NO GLOBAL SCORES YET!
                </h2>
                <p className="text-sm text-white/60 mb-6 leading-relaxed">
                  Be the very first player to set a global benchmark score on the Supabase leaderboard!
                </p>
                <Button
                  variant="cta"
                  size="lg"
                  onClick={handlePlay}
                  icon={<Play size={18} />}
                  className="w-full max-w-xs mx-auto"
                >
                  SET FIRST GLOBAL RECORD 🚀
                </Button>
              </motion.div>
            )}

            {/* Global Top 3 Podium */}
            {globalList.length > 0 && (
              <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 pt-4 pb-2">
                {/* 🥈 2nd Place */}
                {top3Global[1] ? (
                  <motion.div
                    className="flex-1 max-w-[160px] flex flex-col items-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-3xl mb-1">{top3Global[1].avatar}</div>
                    <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                      {top3Global[1].username}
                    </p>
                    <span className="text-[11px] font-black text-[#1cb0f6] bg-[#1cb0f6]/10 px-2 py-0.5 rounded-full mt-0.5">
                      {top3Global[1].best_score.toLocaleString()} PTS
                    </span>
                    <div className="w-full h-24 sm:h-28 bg-[#1b2b34] border-2 border-[#1cb0f6]/50 rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-md">
                      <span className="text-3xl">🥈</span>
                      <span className="text-[10px] font-black text-[#1cb0f6] tracking-wider uppercase mt-1">
                        2ND
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 max-w-[160px]" />
                )}

                {/* 🥇 1st Place */}
                {top3Global[0] && (
                  <motion.div
                    className="flex-1 max-w-[180px] flex flex-col items-center z-10"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="text-4xl mb-1 animate-bounce">👑</div>
                    <div className="text-3xl mb-1">{top3Global[0].avatar}</div>
                    <p className="font-display font-black text-sm sm:text-base text-[#ffc800] truncate max-w-full text-center">
                      {top3Global[0].username}
                    </p>
                    <span className="text-xs font-black text-[#ffc800] bg-[#ffc800]/15 px-2.5 py-0.5 rounded-full mt-0.5 border border-[#ffc800]/30">
                      {top3Global[0].best_score.toLocaleString()} PTS
                    </span>
                    <div className="w-full h-32 sm:h-36 bg-gradient-to-b from-[#ffc800]/20 to-[#1b2b34] border-2 border-[#ffc800] rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,200,0,0.2)]">
                      <span className="text-4xl">🥇</span>
                      <span className="text-xs font-black text-[#ffc800] tracking-wider uppercase mt-1">
                        WORLD CHAMPION
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* 🥉 3rd Place */}
                {top3Global[2] ? (
                  <motion.div
                    className="flex-1 max-w-[160px] flex flex-col items-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-3xl mb-1">{top3Global[2].avatar}</div>
                    <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                      {top3Global[2].username}
                    </p>
                    <span className="text-[11px] font-black text-[#ff9600] bg-[#ff9600]/10 px-2 py-0.5 rounded-full mt-0.5">
                      {top3Global[2].best_score.toLocaleString()} PTS
                    </span>
                    <div className="w-full h-20 sm:h-24 bg-[#1b2b34] border-2 border-[#ff9600]/50 rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-md">
                      <span className="text-2xl">🥉</span>
                      <span className="text-[10px] font-black text-[#ff9600] tracking-wider uppercase mt-1">
                        3RD
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 max-w-[160px]" />
                )}
              </div>
            )}

            {/* Global Table */}
            {globalList.length > 0 && (
              <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl overflow-hidden shadow-md">
                <div className="px-4 py-3 bg-[#131f24]/50 border-b-2 border-[#2b3e4a] flex items-center justify-between text-xs font-black uppercase tracking-wider text-white/50">
                  <span>WORLD RANK &amp; ATHLETE</span>
                  <span>GAMES • BEST SCORE</span>
                </div>

                <div className="divide-y divide-[#2b3e4a]">
                  {globalList.map((entry) => {
                    const isMe = user && entry.id === user.id;

                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between px-4 py-3 transition-colors ${
                          isMe
                            ? 'bg-[#58cc02]/15 border-l-4 border-[#58cc02]'
                            : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                              entry.rank === 1
                                ? 'bg-[#ffc800] text-[#131f24]'
                                : entry.rank === 2
                                ? 'bg-[#1cb0f6] text-white'
                                : entry.rank === 3
                                ? 'bg-[#ff9600] text-white'
                                : 'bg-[#2b3e4a] text-white/70'
                            }`}
                          >
                            #{entry.rank}
                          </span>
                          <span className="text-2xl shrink-0">{entry.avatar}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-display font-black text-sm text-white truncate">
                                {entry.username}
                              </span>
                              {isMe && (
                                <span className="px-2 py-0.5 rounded-full bg-[#58cc02] text-white text-[10px] font-black uppercase tracking-wider shrink-0">
                                  YOU
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-white/40 font-bold hidden sm:inline">
                            {entry.total_games} {entry.total_games === 1 ? 'game' : 'games'}
                          </span>
                          <div className="text-right">
                            <span className="font-display font-black text-sm sm:text-base text-[#ffc800]">
                              {entry.best_score.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-white/40 ml-1">PTS</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>


    </div>
  );
}

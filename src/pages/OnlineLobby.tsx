import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import {
  fetchGlobalLeaderboard,
  subscribeToLeaderboard,
  type GlobalLeaderboardEntry,
} from '../services/onlineService';
import { AppNavbar } from '../components/layout/AppNavbar';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  LogOut,
  Trophy,
  Play,
  Zap,
  Globe,
  Clock,
} from 'lucide-react';

export function OnlineLobby() {
  const navigate = useNavigate();
  const { user, profile, signOut, isLoading: isAuthLoading } = useAuthStore();
  const { setGameMode, setGameDuration, setCurrentPlayer } = useGameStore();

  const [leaderboard, setLeaderboard] = useState<GlobalLeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Auth guard: redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/auth');
    }
  }, [isAuthLoading, user, navigate]);

  // Fetch top 5 global leaderboard on mount & subscribe to real-time updates
  useEffect(() => {
    let isMounted = true;

    const loadLeaderboard = async () => {
      try {
        const data = await fetchGlobalLeaderboard(5);
        if (isMounted) {
          setLeaderboard(data);
          setIsLoadingLeaderboard(false);
        }
      } catch (err) {
        console.error('Error fetching global leaderboard:', err);
        if (isMounted) {
          setIsLoadingLeaderboard(false);
        }
      }
    };

    loadLeaderboard();

    // Subscribe to real-time updates with cleanup
    const unsubscribe = subscribeToLeaderboard(() => {
      loadLeaderboard();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleStartGame = () => {
    setGameMode('online');
    setGameDuration(30);

    if (user && profile) {
      setCurrentPlayer({
        id: user.id,
        name: profile.username,
        score: 0,
        rank: 1,
        avatar: profile.avatar || '😎',
        isCurrentPlayer: true,
      });
    }

    navigate('/online/play');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#131f24] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1cb0f6]/20 border-2 border-[#1cb0f6]/40 flex items-center justify-center text-3xl mb-4 animate-pulse">
            🌐
          </div>
          <p className="text-white/60 text-sm font-bold">Connecting to Online Arena...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="page-viewport relative bg-[#131f24] text-white flex flex-col min-h-screen">
      <AppNavbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Top navigation row: Back & Sign Out */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2b34] hover:bg-[#253945] text-white/70 hover:text-white border border-[#2b3e4a] text-xs font-display font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>MODE SELECT</span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff4b4b]/10 hover:bg-[#ff4b4b]/20 text-[#ff4b4b] border border-[#ff4b4b]/30 text-xs font-display font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogOut size={13} />
              <span>SIGN OUT</span>
            </button>
          </div>

          {/* Header */}
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1cb0f6]/20 border border-[#1cb0f6]/40 text-[#1cb0f6] text-xs font-black uppercase tracking-widest mb-2">
              <Globe size={13} className="animate-spin-slow" />
              <span>GLOBAL RANKED ARENA</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-1 tracking-tight">
              ONLINE LOBBY
            </h1>
            <p className="text-white/60 text-xs font-semibold">
              Compete against verified athletes on the live worldwide leaderboard.
            </p>
          </motion.div>

          {/* 1. Profile Card */}
          <motion.div
            className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-5 shadow-xl mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#58cc02]/15 border-2 border-[#58cc02] shadow-sm mb-3">
              <div className="w-14 h-14 rounded-2xl bg-[#2b3e4a] flex items-center justify-center text-3xl shadow-inner shrink-0">
                {profile.avatar || '😎'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-black text-lg text-white truncate">
                    {profile.username}
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#58cc02] text-white px-2 py-0.5 rounded-full">
                    VERIFIED
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="text-[#ffc800] font-black flex items-center gap-1">
                    <Trophy size={13} />
                    {(profile.best_score || 0).toLocaleString()} PTS
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-[#1cb0f6] font-bold flex items-center gap-1">
                    <Zap size={13} />
                    {profile.total_games || 0} Games
                  </span>
                </div>
              </div>
            </div>

            {/* Fair Play & Standardized Info */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131f24] border border-[#2b3e4a]">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#1cb0f6]" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  MATCH LENGTH
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-[#1cb0f6]/20 border border-[#1cb0f6]/40 text-[#1cb0f6] text-[11px] font-black uppercase tracking-wider">
                30 SECONDS
              </div>
            </div>
          </motion.div>

          {/* 2. Live Top 5 Leaderboard Preview */}
          <motion.div
            className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-5 shadow-xl mb-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-[#ffc800]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  LIVE TOP 5 LEADERS
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#58cc02] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#58cc02]">
                  LIVE SYNC
                </span>
              </div>
            </div>

            {isLoadingLeaderboard ? (
              <div className="space-y-2 py-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl bg-[#131f24] border border-[#2b3e4a] animate-pulse"
                  />
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#131f24] border border-[#2b3e4a] text-center">
                <p className="text-xs text-white/60 font-semibold">
                  No scores recorded yet. Be the first to claim #1! 🏆
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {leaderboard.map((entry, index) => {
                  const isCurrent = entry.id === user.id;
                  const rankNum = entry.rank || index + 1;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                        isCurrent
                          ? 'bg-[#58cc02]/20 border-[#58cc02] font-black'
                          : 'bg-[#131f24] border-[#2b3e4a]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-5 text-center font-black ${
                            rankNum === 1
                              ? 'text-[#ffc800]'
                              : rankNum === 2
                              ? 'text-[#1cb0f6]'
                              : rankNum === 3
                              ? 'text-[#ff9600]'
                              : 'text-white/40'
                          }`}
                        >
                          #{rankNum}
                        </span>
                        <span className="text-base">{entry.avatar || '😎'}</span>
                        <span className="font-bold text-white truncate max-w-[130px]">
                          {entry.username}
                          {isCurrent && (
                            <span className="ml-1 text-[9px] font-black text-[#58cc02] uppercase">
                              (YOU)
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 font-display font-black text-[#ffc800]">
                        <span>{(entry.best_score || 0).toLocaleString()}</span>
                        <span className="text-[10px] text-white/40">PTS</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* 3. CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="cta"
              size="xl"
              fullWidth
              onClick={handleStartGame}
              icon={<Play size={20} />}
              className="py-4 text-lg mb-3"
            >
              START DOOM SCROLLING 🚀
            </Button>

            <p className="text-center text-white/40 text-[10px] font-semibold italic">
              "Standardized 30s match. Scores automatically sync to the global leaderboard."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

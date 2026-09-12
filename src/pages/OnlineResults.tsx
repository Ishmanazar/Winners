import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import {
  fetchGlobalLeaderboard,
  fetchPlayerRank,
  type GlobalLeaderboardEntry,
} from '../services/onlineService';
import { ConfettiEffect } from '../components/ui/ConfettiEffect';
import { Button } from '../components/ui/Button';
import {
  Trophy,
  RotateCcw,
  Home,
  Globe,
  Zap,
  Crown,
  Sparkles,
  Flame,
} from 'lucide-react';

export function OnlineResults() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, profile } = useAuthStore();
  const {
    lastGameResult,
    score: storeScore,
    totalLikes: storeLikes,
    totalInteractions: storeInteractions,
    resetGame,
  } = useGameStore();

  // Get score data from router state or fallback to game store
  const stateData = location.state as {
    score?: number;
    totalLikes?: number;
    totalInteractions?: number;
  } | null;

  const finalScore = stateData?.score ?? lastGameResult?.score ?? storeScore ?? 0;
  const finalLikes = stateData?.totalLikes ?? storeLikes ?? 0;
  const finalInteractions = stateData?.totalInteractions ?? storeInteractions ?? 0;

  const [showConfetti, setShowConfetti] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [top10, setTop10] = useState<GlobalLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Confetti duration
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Animate score number counting up
  useEffect(() => {
    const duration = 1600;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(eased * finalScore));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [finalScore]);

  // 3. Fetch Global Rank & Top 10 Leaderboard
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [board, rank] = await Promise.all([
          fetchGlobalLeaderboard(10),
          user ? fetchPlayerRank(user.id) : Promise.resolve(null),
        ]);

        if (isMounted) {
          setTop10(board);
          setPlayerRank(rank);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching online results data:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // 4. Personal best check
  const isPersonalBest = Boolean(
    lastGameResult?.isNewHighScore ||
    (finalScore > 0 && profile && finalScore >= (profile.best_score || 0))
  );

  const handlePlayAgain = () => {
    resetGame();
    navigate('/online/lobby');
  };

  const handleLeaderboard = () => {
    resetGame();
    navigate('/leaderboard');
  };

  const handleHome = () => {
    resetGame();
    navigate('/');
  };

  const userRankDisplay = playerRank ? `#${playerRank}` : lastGameResult?.rank ? `#${lastGameResult.rank}` : '#--';
  const rankNum = playerRank || lastGameResult?.rank || 999;

  return (
    <div className="page-viewport relative bg-[#131f24] text-white flex flex-col justify-center items-center py-6 px-4 overflow-y-auto min-h-screen">
      <ConfettiEffect active={showConfetti} particleCount={120} duration={5000} />

      <div className="w-full max-w-md my-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-4"
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1cb0f6]/20 border border-[#1cb0f6]/40 text-[#1cb0f6] text-[11px] font-black uppercase tracking-widest mb-2">
            <Globe size={13} /> ONLINE MATCH COMPLETE
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-1 tracking-tight">
            DOOM SCROLL FINISHED!
          </h1>
          <p className="text-white/60 font-semibold text-xs">
            "Your 30 seconds of high-octane scrolling is now etched into world history."
          </p>
        </motion.div>

        {/* Score & Rank Card */}
        <motion.div
          className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-5 sm:p-6 shadow-xl mb-4 text-center relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {/* Medal / Trophy icon */}
          <div className="text-5xl mb-2">
            {rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : '🏅'}
          </div>

          {/* Global Rank */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffc800]/15 border border-[#ffc800]/40 text-[#ffc800] text-xs font-black uppercase tracking-wider mb-3">
            <Crown size={14} className="text-[#ffc800]" />
            <span>GLOBAL RANK {userRankDisplay}</span>
          </div>

          {/* Final Match Score */}
          <p className="text-xs uppercase tracking-widest text-white/50 font-black mb-1">
            MATCH SCORE
          </p>
          <h2 className="score-text text-4xl sm:text-5xl text-white font-black mb-3">
            {animatedScore.toLocaleString()}{' '}
            <span className="text-base text-[#ffc800]">PTS</span>
          </h2>

          {/* Personal Best Check Banner */}
          {isPersonalBest ? (
            <motion.div
              className="p-2.5 rounded-2xl bg-[#58cc02]/20 border-2 border-[#58cc02] text-[#58cc02] font-black text-xs flex items-center justify-center gap-1.5 shadow-sm mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Sparkles size={16} />
              <span>🎉 NEW PERSONAL BEST!</span>
            </motion.div>
          ) : (
            <div className="p-2 rounded-2xl bg-[#131f24] border border-[#2b3e4a] text-white/60 text-xs font-semibold mb-4">
              Personal Best:{' '}
              <span className="text-[#ffc800] font-black">
                {(profile?.best_score || 0).toLocaleString()} PTS
              </span>
            </div>
          )}

          {/* Round Stats Row */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2b3e4a]">
            <div className="bg-[#131f24] p-2.5 rounded-xl border border-[#2b3e4a]">
              <p className="text-[10px] text-white/50 font-bold uppercase flex items-center justify-center gap-1">
                <Flame size={12} className="text-[#ff4b4b]" /> Total Likes
              </p>
              <p className="score-text text-xl text-white font-black mt-0.5">{finalLikes}</p>
            </div>
            <div className="bg-[#131f24] p-2.5 rounded-xl border border-[#2b3e4a]">
              <p className="text-[10px] text-white/50 font-bold uppercase flex items-center justify-center gap-1">
                <Zap size={12} className="text-[#ffc800]" /> Combos &amp; Taps
              </p>
              <p className="score-text text-xl text-[#ffc800] font-black mt-0.5">{finalInteractions}</p>
            </div>
          </div>
        </motion.div>

        {/* 5. Top 10 Global Leaderboard */}
        <motion.div
          className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-5 shadow-xl mb-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Trophy size={14} className="text-[#ffc800]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                TOP 10 WORLD STANDINGS
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1cb0f6]">
              GLOBAL
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 rounded-xl bg-[#131f24] border border-[#2b3e4a] animate-pulse"
                />
              ))}
            </div>
          ) : top10.length === 0 ? (
            <p className="text-center text-xs text-white/50 py-3 font-semibold">
              No online scores recorded yet.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {top10.map((entry, index) => {
                const isCurrent =
                  (user && entry.id === user.id) ||
                  (profile && entry.username.toLowerCase() === profile.username.toLowerCase());
                const r = entry.rank || index + 1;

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                      isCurrent
                        ? 'bg-[#58cc02]/20 border-2 border-[#58cc02] font-black'
                        : 'bg-[#131f24] border border-[#2b3e4a]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5 text-center font-black ${
                          r === 1
                            ? 'text-[#ffc800]'
                            : r === 2
                            ? 'text-[#1cb0f6]'
                            : r === 3
                            ? 'text-[#ff9600]'
                            : 'text-white/40'
                        }`}
                      >
                        #{r}
                      </span>
                      <span className="text-base">{entry.avatar || '😎'}</span>
                      <span className="font-bold text-white truncate max-w-[120px]">
                        {entry.username}
                        {isCurrent && (
                          <span className="ml-1 text-[9px] font-black text-[#58cc02] uppercase">
                            (YOU)
                          </span>
                        )}
                      </span>
                    </div>

                    <span className="score-text text-xs text-[#ffc800] font-black">
                      {(entry.best_score || 0).toLocaleString()} PTS
                    </span>
                  </div>
                );
              })}

              {/* Pinned user row if outside top 10 */}
              {playerRank && playerRank > 10 && user && profile && (
                <div className="pt-2 border-t border-[#2b3e4a]">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#58cc02]/20 border-2 border-[#58cc02] text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 text-center font-black text-white/50">
                        #{playerRank}
                      </span>
                      <span className="text-base">{profile.avatar || '😎'}</span>
                      <span className="font-bold text-white truncate max-w-[120px]">
                        {profile.username}{' '}
                        <span className="text-[9px] text-[#58cc02] uppercase font-black">(YOU)</span>
                      </span>
                    </div>
                    <span className="score-text text-xs text-[#ffc800] font-black">
                      {(profile.best_score || finalScore).toLocaleString()} PTS
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* 6. Action Buttons */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Button
            variant="cta"
            size="lg"
            fullWidth
            onClick={handlePlayAgain}
            icon={<RotateCcw size={18} />}
          >
            PLAY AGAIN 🚀
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="arcade"
              size="md"
              fullWidth
              onClick={handleLeaderboard}
              icon={<Trophy size={16} />}
            >
              GLOBAL LEADERBOARD 🏆
            </Button>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleHome}
              icon={<Home size={16} />}
            >
              HOME 🏠
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

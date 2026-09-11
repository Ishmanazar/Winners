import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../../components/ui/Button';
import { ConfettiEffect } from '../../components/ui/ConfettiEffect';
import { FUNNY_TITLES } from '../../types/player';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Home, Sparkles, Zap, Flame } from 'lucide-react';

export function ResultsScreen() {
  const navigate = useNavigate();
  const {
    score,
    rank,
    players,
    totalLikes,
    totalInteractions,
    resetGame,
    lastGameResult,
    currentPlayer,
  } = useGameStore();

  const [showConfetti, setShowConfetti] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);

  const funnyTitle = FUNNY_TITLES[rank] || 'DOOM SCROLLER';
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const isNewRecord = lastGameResult?.isNewHighScore;
  const prevHighScore = lastGameResult?.previousHighScore ?? 0;

  // Animate score counting up
  useEffect(() => {
    const duration = 1800;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/lobby');
  };

  const handleLeaderboard = () => {
    resetGame();
    navigate('/leaderboard');
  };

  const handleHome = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="page-viewport relative bg-[#131f24] text-white flex flex-col justify-center items-center py-6 px-4 overflow-y-auto">
      <ConfettiEffect active={showConfetti} particleCount={120} duration={6000} />

      <div className="w-full max-w-md my-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58cc02]/20 border border-[#58cc02]/40 text-[#58cc02] text-[11px] font-black uppercase tracking-widest mb-2">
            <Trophy size={13} /> MATCH COMPLETE
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-1">
            DOOM SCROLL FINISHED!
          </h1>
          <p className="text-white/60 font-semibold text-xs">
            "Your thumb did heroic, completely unproductive work."
          </p>
        </motion.div>

        {/* Player Result Card */}
        <motion.div
          className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-5 sm:p-6 shadow-xl mb-4 text-center relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Medal */}
          <div className="text-5xl mb-1">
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅'}
          </div>

          <p className="text-xs uppercase tracking-widest text-white/50 font-black">
            Match Placement
          </p>
          <h2 className="score-text text-4xl text-[#ffc800] mb-2 font-black">
            #{rank}
          </h2>

          {/* Funny title */}
          <div className="bg-[#243945] border border-[#2b3e4a] rounded-full px-3.5 py-0.5 inline-block mb-3">
            <span className="text-xs font-black uppercase text-[#1cb0f6] tracking-wide">
              {funnyTitle}
            </span>
          </div>

          {/* Final Score */}
          <p className="text-xs uppercase tracking-widest text-white/50 font-black">
            Final Score
          </p>
          <h3 className="score-text text-4xl text-white font-black mb-3">
            {animatedScore.toLocaleString()}{' '}
            <span className="text-sm text-[#ffc800]">PTS</span>
          </h3>

          {/* New Record / Score Status Banner */}
          {isNewRecord ? (
            <motion.div
              className="p-2.5 rounded-2xl bg-[#58cc02]/20 border-2 border-[#58cc02] text-[#58cc02] font-black text-xs flex items-center justify-center gap-1.5 shadow-sm mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Sparkles size={16} />
              <span>
                {prevHighScore > 0
                  ? `NEW ALL-TIME RECORD! (Beat ${prevHighScore.toLocaleString()} PTS)`
                  : 'FIRST SCORE SAVED TO LEADERBOARD!'}
              </span>
            </motion.div>
          ) : (
            <div className="p-2 rounded-2xl bg-[#131f24] border border-[#2b3e4a] text-white/60 text-xs font-semibold mb-4">
              All-time record remains:{' '}
              <span className="text-[#ffc800] font-black">{prevHighScore.toLocaleString()} PTS</span>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#2b3e4a]">
            <div className="bg-[#131f24] p-2 rounded-xl border border-[#2b3e4a]">
              <p className="text-[10px] text-white/50 font-bold uppercase flex items-center justify-center gap-1">
                <Flame size={11} className="text-[#ff4b4b]" /> Total Likes
              </p>
              <p className="score-text text-lg text-white font-black">{totalLikes}</p>
            </div>
            <div className="bg-[#131f24] p-2 rounded-xl border border-[#2b3e4a]">
              <p className="text-[10px] text-white/50 font-bold uppercase flex items-center justify-center gap-1">
                <Zap size={11} className="text-[#ffc800]" /> Combos
              </p>
              <p className="score-text text-lg text-[#ffc800] font-black">{totalInteractions}</p>
            </div>
          </div>
        </motion.div>

        {/* Match standings */}
        <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-3 sm:p-4 mb-4">
          <p className="text-xs font-black uppercase text-white/60 tracking-wider mb-2 text-center">
            MATCH STANDINGS
          </p>
          <div className="divide-y divide-[#2b3e4a]">
            {sortedPlayers.map((player, idx) => {
              const isCurrent = player.isCurrentPlayer;
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between py-2 px-2.5 rounded-xl ${
                    isCurrent ? 'bg-[#58cc02]/20 font-black' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-xs text-white/50 font-black">#{idx + 1}</span>
                    <span className="text-lg">{player.avatar}</span>
                    <span className="text-xs text-white font-bold truncate max-w-[140px]">
                      {isCurrent ? currentPlayer.name || 'You' : player.name}
                      {isCurrent && ' (You)'}
                    </span>
                  </div>
                  <span className="score-text text-xs text-[#ffc800] font-black">
                    {player.score.toLocaleString()} PTS
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
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
              LEADERBOARD 🏆
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
        </div>
      </div>
    </div>
  );
}

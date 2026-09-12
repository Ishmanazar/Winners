import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ConfettiEffect } from '../components/ui/ConfettiEffect';
import { Button } from '../components/ui/Button';
import { Trophy, RotateCcw, Home, Medal } from 'lucide-react';

export function OfflineResults() {
  const navigate = useNavigate();
  const { getOfflineResults, resetGame } = useGameStore();
  const [showConfetti, setShowConfetti] = useState(true);

  const results = getOfflineResults();
  const top3 = results.slice(0, 3);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/offline/lobby');
  };

  const handleHome = () => {
    resetGame();
    navigate('/');
  };

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-[#131f24] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-8 text-center max-w-md w-full shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#ffc800]/15 border-2 border-[#ffc800]/40 flex items-center justify-center text-3xl mb-4">
            🏆
          </div>
          <h2 className="font-display font-black text-2xl text-white mb-2">
            NO MATCH RESULTS FOUND
          </h2>
          <p className="text-sm text-white/60 mb-6">
            No offline tournament scores recorded yet. Head over to the pass-and-play lobby to start!
          </p>
          <Button
            variant="cta"
            size="lg"
            fullWidth
            onClick={() => navigate('/offline/lobby')}
            icon={<RotateCcw size={18} />}
          >
            GO TO LOBBY 🎮
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col select-none relative overflow-x-hidden">
      {/* 1. Confetti on mount */}
      <ConfettiEffect active={showConfetti} duration={6000} particleCount={120} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-10">
        {/* 2. Title: '🏆 FINAL RESULTS' with gold styling */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffc800]/20 border border-[#ffc800]/40 text-[#ffc800] text-xs font-black uppercase tracking-widest mb-2 shadow-sm">
            <Trophy size={14} /> TOURNAMENT COMPLETE
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#ffc800] tracking-tight drop-shadow-[0_0_20px_rgba(255,200,0,0.3)]">
            🏆 FINAL RESULTS
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mt-1">
            Pass-and-play thumb marathon showdown results!
          </p>
        </motion.div>

        {/* 3. Podium for top 3 (if 3+ players) */}
        {results.length >= 3 && (
          <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 pt-4 pb-2 mb-8 max-w-lg mx-auto">
            {/* 🥈 2nd Place */}
            {top3[1] && (
              <motion.div
                className="flex-1 max-w-[150px] flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="text-3xl mb-1">{top3[1].avatar || '😎'}</div>
                <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                  {top3[1].name}
                </p>
                <span className="text-[11px] font-black text-[#1cb0f6] bg-[#1cb0f6]/10 px-2 py-0.5 rounded-full mt-0.5 border border-[#1cb0f6]/30">
                  {(top3[1].score || 0).toLocaleString()} PTS
                </span>
                <div className="w-full h-24 sm:h-28 bg-[#1b2b34] border-2 border-[#1cb0f6]/50 rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-md">
                  <span className="text-3xl">🥈</span>
                  <span className="text-[10px] font-black text-[#1cb0f6] tracking-wider uppercase mt-1">
                    2ND
                  </span>
                </div>
              </motion.div>
            )}

            {/* 🥇 1st Place (Tallest, crown, gold accent) */}
            {top3[0] && (
              <motion.div
                className="flex-1 max-w-[170px] flex flex-col items-center z-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="text-4xl mb-1 animate-bounce">👑</div>
                <div className="text-3xl mb-1">{top3[0].avatar || '😎'}</div>
                <p className="font-display font-black text-sm sm:text-base text-[#ffc800] truncate max-w-full text-center">
                  {top3[0].name}
                </p>
                <span className="text-xs font-black text-[#ffc800] bg-[#ffc800]/15 px-2.5 py-0.5 rounded-full mt-0.5 border border-[#ffc800]/30 shadow-[0_0_12px_rgba(255,200,0,0.2)]">
                  {(top3[0].score || 0).toLocaleString()} PTS
                </span>
                <div className="w-full h-32 sm:h-36 bg-gradient-to-b from-[#ffc800]/25 to-[#1b2b34] border-2 border-[#ffc800] rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(255,200,0,0.25)]">
                  <span className="text-4xl">🥇</span>
                  <span className="text-xs font-black text-[#ffc800] tracking-wider uppercase mt-1">
                    CHAMPION
                  </span>
                </div>
              </motion.div>
            )}

            {/* 🥉 3rd Place */}
            {top3[2] && (
              <motion.div
                className="flex-1 max-w-[150px] flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="text-3xl mb-1">{top3[2].avatar || '😎'}</div>
                <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                  {top3[2].name}
                </p>
                <span className="text-[11px] font-black text-[#ff9600] bg-[#ff9600]/10 px-2 py-0.5 rounded-full mt-0.5 border border-[#ff9600]/30">
                  {(top3[2].score || 0).toLocaleString()} PTS
                </span>
                <div className="w-full h-20 sm:h-24 bg-[#1b2b34] border-2 border-[#ff9600]/50 rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-md">
                  <span className="text-2xl">🥉</span>
                  <span className="text-[10px] font-black text-[#ff9600] tracking-wider uppercase mt-1">
                    3RD
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* 2-Player Duel Podium (if exactly 2 players) */}
        {results.length === 2 && (
          <div className="flex items-end justify-center gap-4 sm:gap-6 pt-4 pb-2 mb-8 max-w-sm mx-auto">
            {/* 🥈 2nd Place */}
            <motion.div
              className="flex-1 flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="text-3xl mb-1">{results[1].avatar || '😎'}</div>
              <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                {results[1].name}
              </p>
              <span className="text-[11px] font-black text-[#1cb0f6] bg-[#1cb0f6]/10 px-2 py-0.5 rounded-full mt-0.5 border border-[#1cb0f6]/30">
                {(results[1].score || 0).toLocaleString()} PTS
              </span>
              <div className="w-full h-24 sm:h-28 bg-[#1b2b34] border-2 border-[#1cb0f6]/50 rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-md">
                <span className="text-3xl">🥈</span>
                <span className="text-[10px] font-black text-[#1cb0f6] tracking-wider uppercase mt-1">
                  2ND
                </span>
              </div>
            </motion.div>

            {/* 🥇 1st Place */}
            <motion.div
              className="flex-1 flex flex-col items-center z-10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="text-4xl mb-1 animate-bounce">👑</div>
              <div className="text-3xl mb-1">{results[0].avatar || '😎'}</div>
              <p className="font-display font-black text-sm sm:text-base text-[#ffc800] truncate max-w-full text-center">
                {results[0].name}
              </p>
              <span className="text-xs font-black text-[#ffc800] bg-[#ffc800]/15 px-2.5 py-0.5 rounded-full mt-0.5 border border-[#ffc800]/30 shadow-[0_0_12px_rgba(255,200,0,0.2)]">
                {(results[0].score || 0).toLocaleString()} PTS
              </span>
              <div className="w-full h-32 sm:h-36 bg-gradient-to-b from-[#ffc800]/25 to-[#1b2b34] border-2 border-[#ffc800] rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(255,200,0,0.25)]">
                <span className="text-4xl">🥇</span>
                <span className="text-xs font-black text-[#ffc800] tracking-wider uppercase mt-1">
                  CHAMPION
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* 4. Full Rankings List: All players ranked with position, avatar, name, score */}
        <motion.div
          className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl overflow-hidden shadow-xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="px-4 py-3 bg-[#131f24]/50 border-b-2 border-[#2b3e4a] flex items-center justify-between text-xs font-black uppercase tracking-wider text-white/50">
            <span className="flex items-center gap-1.5">
              <Medal size={14} className="text-[#ffc800]" /> RANK &amp; ATHLETE
            </span>
            <span>SCORE</span>
          </div>

          <div className="divide-y divide-[#2b3e4a]">
            {results.map((player, index) => {
              const rank = index + 1;
              const isWinner = index === 0;

              return (
                <motion.div
                  key={`${player.name}-${index}`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  className={`flex items-center justify-between px-4 py-3.5 transition-colors ${
                    isWinner
                      ? 'bg-[#ffc800]/15 border-l-4 border-[#ffc800]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        rank === 1
                          ? 'bg-[#ffc800] text-[#131f24] shadow-md shadow-[#ffc800]/20'
                          : rank === 2
                          ? 'bg-[#1cb0f6] text-white'
                          : rank === 3
                          ? 'bg-[#ff9600] text-white'
                          : 'bg-[#131f24] text-white/70 border border-[#2b3e4a]'
                      }`}
                    >
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </span>

                    {/* Avatar */}
                    <span className="text-2xl shrink-0">{player.avatar || '😎'}</span>

                    {/* Name & Winner Tag */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`font-display font-black text-sm truncate ${
                            isWinner ? 'text-[#ffc800]' : 'text-white'
                          }`}
                        >
                          {player.name}
                        </p>
                        {isWinner && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#ffc800] text-[#131f24] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            👑 WINNER
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <span
                      className={`score-text text-sm sm:text-base font-black ${
                        isWinner ? 'text-[#ffc800]' : 'text-white'
                      }`}
                    >
                      {(player.score || 0).toLocaleString()} PTS
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 5. Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 pt-2"
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
            className="flex-1"
          >
            PLAY AGAIN 🔄
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleHome}
            icon={<Home size={18} />}
            className="flex-1"
          >
            HOME 🏠
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { AppNavbar } from '../components/layout/AppNavbar';
import { Button } from '../components/ui/Button';
import { Trophy, Play, Sparkles, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { PlayerNameModal } from '../components/ui/PlayerNameModal';

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { leaderboardPlayers, currentPlayer } = useGameStore();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  const top3 = leaderboardPlayers.slice(0, 3);
  const rest = leaderboardPlayers.slice(3);
  const isEmpty = leaderboardPlayers.length === 0;

  const handlePlay = () => {
    if (!currentPlayer.name || currentPlayer.name.trim().length === 0) {
      setIsNameModalOpen(true);
      return;
    }
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Header Title */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffc800]/20 border border-[#ffc800]/40 text-[#ffc800] text-xs font-black uppercase tracking-widest mb-2">
            <Trophy size={14} /> GLOBAL LEADERBOARD
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            DOOM SCROLL LEAGUE
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mt-1">
            Real players only. Unique names with their all-time personal best scores.
          </p>
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <motion.div
            className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-[#ffc800]/15 border-2 border-[#ffc800]/40 flex items-center justify-center text-4xl mb-4">
              🏆
            </div>
            <h2 className="font-display font-black text-2xl text-white mb-2">
              NO CHAMPIONS YET!
            </h2>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              The scoreboard is completely fresh. No dummy bots allowed here! Play a match right now to claim the #1 spot.
            </p>
            <Button
              variant="cta"
              size="lg"
              fullWidth
              onClick={handlePlay}
              icon={<Play size={20} />}
            >
              PLAY YOUR FIRST MATCH 🚀
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 Podium (Duolingo League Style) */}
            <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 pt-4 pb-2">
              {/* 🥈 2nd Place */}
              {top3[1] ? (
                <motion.div
                  className="flex-1 max-w-[160px] flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-3xl mb-1">{top3[1].avatar}</div>
                  <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                    {top3[1].name}
                  </p>
                  <span className="text-[11px] font-black text-[#1cb0f6] bg-[#1cb0f6]/10 px-2 py-0.5 rounded-full mt-0.5">
                    {top3[1].score.toLocaleString()} PTS
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
              {top3[0] && (
                <motion.div
                  className="flex-1 max-w-[180px] flex flex-col items-center z-10"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-4xl mb-1 animate-bounce">👑</div>
                  <div className="text-3xl mb-1">{top3[0].avatar}</div>
                  <p className="font-display font-black text-sm sm:text-base text-[#ffc800] truncate max-w-full text-center">
                    {top3[0].name}
                  </p>
                  <span className="text-xs font-black text-[#ffc800] bg-[#ffc800]/15 px-2.5 py-0.5 rounded-full mt-0.5 border border-[#ffc800]/30">
                    {top3[0].score.toLocaleString()} PTS
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
              {top3[2] ? (
                <motion.div
                  className="flex-1 max-w-[160px] flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-3xl mb-1">{top3[2].avatar}</div>
                  <p className="font-display font-black text-xs sm:text-sm text-white truncate max-w-full text-center">
                    {top3[2].name}
                  </p>
                  <span className="text-[11px] font-black text-[#ff9600] bg-[#ff9600]/10 px-2 py-0.5 rounded-full mt-0.5">
                    {top3[2].score.toLocaleString()} PTS
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

            {/* Rest of the List */}
            <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl overflow-hidden shadow-md">
              <div className="px-4 py-3 bg-[#131f24]/50 border-b-2 border-[#2b3e4a] flex items-center justify-between text-xs font-black uppercase tracking-wider text-white/50">
                <span>RANK &amp; ATHLETE</span>
                <span>HIGH SCORE</span>
              </div>

              <div className="divide-y divide-[#2b3e4a]">
                {leaderboardPlayers.map((player) => {
                  const isCurrent =
                    currentPlayer.name &&
                    player.name.trim().toLowerCase() === currentPlayer.name.trim().toLowerCase();

                  return (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between px-4 py-3 transition-colors ${
                        isCurrent
                          ? 'bg-[#58cc02]/15 border-l-4 border-[#58cc02]'
                          : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
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
                        <span className="text-2xl">{player.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-sm text-white">
                              {player.name}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-[#58cc02] text-white text-[10px] font-black uppercase tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-right">
                        <span className="font-display font-black text-sm sm:text-base text-[#ffc800]">
                          {player.score.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-white/40">PTS</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Play CTA below list */}
            <div className="pt-2 flex justify-center">
              <Button
                variant="cta"
                size="lg"
                onClick={handlePlay}
                icon={<Play size={20} />}
                className="w-full sm:w-auto px-10"
              >
                PLAY &amp; BEAT HIGHEST SCORE 🚀
              </Button>
            </div>
          </div>
        )}
      </main>

      <PlayerNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onConfirm={() => {
          setIsNameModalOpen(false);
          navigate('/lobby');
        }}
        title="ENTER ATHLETE NAME 🎮"
        buttonText="CONTINUE TO ARENA 🚀"
      />
    </div>
  );
}

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { PlayerNameModal } from '../components/ui/PlayerNameModal';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useGameStore } from '../store/gameStore';
import { Play, Edit3, Sparkles, UserPlus, Trophy, Target } from 'lucide-react';

export function Lobby() {
  const navigate = useNavigate();
  const { currentPlayer, leaderboardPlayers, getPlayerBestScore } = useGameStore();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'new'>('edit');

  const playerName = currentPlayer.name?.trim();
  const bestScore = playerName ? getPlayerBestScore(playerName) : 0;

  // Real rivals from the leaderboard (excluding the current player)
  const realRivals = leaderboardPlayers.filter(
    (p) => p.name.trim().toLowerCase() !== playerName.toLowerCase()
  );

  const handleStartGame = () => {
    if (!playerName) {
      setModalMode('new');
      setIsNameModalOpen(true);
      return;
    }
    navigate('/play');
  };

  const handleEditName = () => {
    setModalMode('edit');
    setIsNameModalOpen(true);
  };

  const handleSwitchPlayer = () => {
    setModalMode('new');
    setIsNameModalOpen(true);
  };

  return (
    <div className="page-viewport relative bg-[#131f24] text-white flex flex-col">
      <AppNavbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58cc02]/20 border border-[#58cc02]/40 text-[#58cc02] text-xs font-black uppercase tracking-widest mb-2">
              <span>🎮</span> MATCH ARENA
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-1 tracking-tight">
              DOOM SCROLL SPRINT
            </h1>
            <p className="text-white/60 text-xs font-semibold">
              30 seconds of high-intensity bed-rotting &amp; meme consumption.
            </p>
          </motion.div>

          {/* Current Player Card */}
          <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-5 shadow-xl mb-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#58cc02]/15 border-2 border-[#58cc02] shadow-sm mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#2b3e4a] flex items-center justify-center text-2xl shadow-inner shrink-0">
                {currentPlayer.avatar || '😎'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-display font-black text-base text-white truncate">
                    {playerName || 'Athlete'}
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#58cc02] text-white px-1.5 py-0.5 rounded-full">
                    YOU
                  </span>
                </div>
                <p className="text-xs font-bold text-[#ffc800] flex items-center gap-1 mt-0.5">
                  <Trophy size={12} />
                  <span>Personal Best: {bestScore.toLocaleString()} PTS</span>
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleEditName}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ffc800]/15 hover:bg-[#ffc800]/30 text-[#ffc800] border border-[#ffc800]/40 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Edit3 size={11} />
                  <span>EDIT</span>
                </button>
                <button
                  onClick={handleSwitchPlayer}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1cb0f6]/15 hover:bg-[#1cb0f6]/30 text-[#1cb0f6] border border-[#1cb0f6]/40 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  <UserPlus size={11} />
                  <span>NEW</span>
                </button>
              </div>
            </div>

            {/* Target benchmarks / Real Rivals */}
            {realRivals.length > 0 ? (
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1">
                  <Target size={12} className="text-[#1cb0f6]" /> REAL OPPONENTS TO BEAT
                </p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {realRivals.slice(0, 3).map((rival) => (
                    <div
                      key={rival.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#131f24] border border-[#2b3e4a] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{rival.avatar}</span>
                        <span className="font-bold text-white truncate max-w-[120px]">
                          {rival.name}
                        </span>
                      </div>
                      <span className="font-black text-[#ffc800]">
                        {rival.score.toLocaleString()} PTS
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[#131f24] border border-[#2b3e4a] text-center">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#58cc02] flex items-center justify-center gap-1 mb-1">
                  <Sparkles size={12} /> SOLO RECORD RUN
                </p>
                <p className="text-xs text-white/60">
                  No other players yet. Set the very first high score on the leaderboard!
                </p>
              </div>
            )}
          </div>

          {/* Start button */}
          <Button
            variant="cta"
            size="xl"
            fullWidth
            onClick={handleStartGame}
            icon={<Play size={20} />}
            className="py-4 text-lg"
          >
            START DOOM SCROLLING 🚀
          </Button>

          <p className="text-center text-white/40 text-[10px] font-semibold mt-4 italic">
            "Double-tap memes to like for massive combo multipliers."
          </p>
        </div>
      </div>

      <PlayerNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onConfirm={() => setIsNameModalOpen(false)}
        mode={modalMode}
        title={modalMode === 'new' ? 'CREATE NEW ATHLETE 🆕' : 'EDIT ATHLETE NAME 🏷️'}
        buttonText={modalMode === 'new' ? 'SAVE & PLAY 🎮' : 'SAVE & CONTINUE 🎮'}
      />
    </div>
  );
}

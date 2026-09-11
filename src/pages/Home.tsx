import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { PlayerNameModal } from '../components/ui/PlayerNameModal';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useGameStore } from '../store/gameStore';
import { Sparkles, UserPlus, LogIn, Edit3, Trophy, Zap } from 'lucide-react';

// Import images directly from src/assets for athlete showcase
import addictAsset from '../assets/IMG_5531.PNG';
import cardioAsset from '../assets/IMG_5532.PNG';
import marathonAsset from '../assets/IMG_5533.PNG';

export function Home() {
  const navigate = useNavigate();
  const { currentPlayer, setPlayerName, getPlayerBestScore } = useGameStore();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'new'>('edit');

  const hasSavedUser = currentPlayer.name && currentPlayer.name.trim().length > 0;
  const bestScore = hasSavedUser ? getPlayerBestScore(currentPlayer.name) : 0;

  const handleEnterArena = () => {
    if (!hasSavedUser) {
      setModalMode('new');
      setIsNameModalOpen(true);
      return;
    }
    navigate('/lobby');
  };

  const handleNewPlayer = () => {
    setModalMode('new');
    setIsNameModalOpen(true);
  };

  const handleEditPlayer = () => {
    setModalMode('edit');
    setIsNameModalOpen(true);
  };

  const handleModalConfirm = (name: string, avatar: string) => {
    setIsNameModalOpen(false);
    setPlayerName(name, avatar);
    navigate('/lobby');
  };

  return (
    <div className="page-viewport relative bg-[#131f24] text-white">
      {/* Top Gamified Navbar */}
      <AppNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 relative z-10">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          {/* Top Pill */}
          <motion.div
            className="mb-2 sm:mb-3"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="px-3.5 py-1 rounded-full bg-[#58cc02]/20 border border-[#58cc02]/40 text-[#58cc02] text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <span>🎮</span> SOCIAL MEDIA OLYMPICS • GAME #1
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none text-center mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260 }}
          >
            <span className="text-[#ff4b4b]">DOOM</span>{' '}
            <span className="text-[#1cb0f6]">SCROLL</span>
            <br />
            <span className="text-[#ffc800]">&amp; WIN</span>
            <span className="inline-block ml-2 text-3xl sm:text-5xl">📱🏆</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xs sm:text-sm text-white/70 font-semibold max-w-md mx-auto mb-4 text-center leading-snug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            "Two players. Two phones. One extremely useless victory."
            <br />
            <span className="text-[#58cc02] font-bold">
              The world's first competitive bed-rotting &amp; thumb marathon simulator.
            </span>
          </motion.p>

          {/* Athlete Showcase Strip using src/assets */}
          <motion.div
            className="w-full mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-2.5 sm:gap-3 justify-center px-1">
              {[
                { src: addictAsset, label: '3AM BOSS', border: 'border-[#ffc800]/60' },
                { src: cardioAsset, label: 'CARDIO PRO', border: 'border-[#1cb0f6]/60' },
                { src: marathonAsset, label: 'MARATHON', border: 'border-[#58cc02]/60' },
              ].map((athlete) => (
                <div
                  key={athlete.label}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 ${athlete.border} bg-[#1b2b34] relative shadow-md group`}
                >
                  <img
                    src={athlete.src}
                    alt={athlete.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="eager"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-[#131f24]/85 py-0.5 text-center">
                    <span className="text-[8px] sm:text-[9px] font-black text-white tracking-wider uppercase">
                      {athlete.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* User Selection & Action Card */}
          <motion.div
            className="w-full max-w-md mx-auto relative z-20"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-5 shadow-xl">
              {hasSavedUser ? (
                /* Returning Athlete Profile */
                <>
                  <div className="flex items-center gap-3 mb-3 p-2.5 rounded-2xl bg-[#131f24] border border-[#2b3e4a]">
                    <div className="w-12 h-12 rounded-xl bg-[#2b3e4a] flex items-center justify-center text-2xl shadow-inner">
                      {currentPlayer.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-black text-sm sm:text-base text-white truncate">
                        {currentPlayer.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#ffc800] font-black">
                        <Zap size={12} className="text-[#ffc800]" />
                        <span>BEST: {bestScore.toLocaleString()} PTS</span>
                      </div>
                    </div>
                    <button
                      onClick={handleEditPlayer}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#ffc800]/15 hover:bg-[#ffc800]/30 text-[#ffc800] border border-[#ffc800]/40 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Edit3 size={11} />
                      EDIT
                    </button>
                  </div>

                  {/* Continue Button */}
                  <Button
                    variant="cta"
                    size="xl"
                    fullWidth
                    onClick={handleEnterArena}
                    icon={<LogIn size={20} />}
                    className="py-3.5 mb-2.5"
                  >
                    CONTINUE AS {currentPlayer.name.toUpperCase().slice(0, 12)} 🚀
                  </Button>

                  {/* Play as New Player Option */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleNewPlayer}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-[#131f24] hover:bg-[#1a2830] border-2 border-[#2b3e4a] text-white/80 hover:text-[#1cb0f6] text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <UserPlus size={14} />
                      <span>NEW PLAYER</span>
                    </button>

                    <button
                      onClick={() => navigate('/leaderboard')}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-[#ffc800]/10 hover:bg-[#ffc800]/20 border-2 border-[#ffc800]/30 text-[#ffc800] text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Trophy size={14} />
                      <span>LEADERBOARD</span>
                    </button>
                  </div>
                </>
              ) : (
                /* New Athlete Prompt */
                <>
                  <div className="text-center mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1cb0f6] flex items-center justify-center gap-1.5">
                      <span>🏷️</span> CHOOSE ATHLETE NAME TO PLAY
                    </span>
                  </div>

                  <Button
                    variant="cta"
                    size="xl"
                    fullWidth
                    onClick={handleEnterArena}
                    icon={<span>🚀</span>}
                    className="py-4 mb-2.5"
                  >
                    ENTER THE ARENA
                  </Button>

                  <button
                    onClick={() => navigate('/leaderboard')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#ffc800]/10 hover:bg-[#ffc800]/20 border-2 border-[#ffc800]/30 text-[#ffc800] text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Trophy size={15} />
                    <span>VIEW GLOBAL LEADERBOARD</span>
                  </button>
                </>
              )}
            </div>

            <p className="text-center text-[10px] text-[#ffc800]/90 font-black tracking-wider uppercase mt-2.5 flex items-center justify-center gap-1">
              <Sparkles size={11} /> 100% Free • No Real Life Productivity Required <Sparkles size={11} />
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 text-center border-t-2 border-[#2b3e4a] bg-[#131f24] z-10 relative shrink-0">
        <p className="text-white/40 text-[11px] font-display font-bold">
          SOCIAL MEDIA OLYMPICS • "DOOM SCROLL &amp; WIN"
        </p>
        <p className="text-white/25 text-[9px] mt-0.5">
          No thumbs were harmed. Remember to touch grass afterward. 🌱
        </p>
      </footer>

      {/* Player Name Modal */}
      <PlayerNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onConfirm={handleModalConfirm}
        mode={modalMode}
        title={modalMode === 'new' ? 'CREATE ATHLETE PROFILE 🆕' : 'EDIT ATHLETE NAME 🏷️'}
        buttonText={modalMode === 'new' ? 'CREATE & ENTER ARENA 🚀' : 'SAVE & CONTINUE 🎮'}
      />
    </div>
  );
}

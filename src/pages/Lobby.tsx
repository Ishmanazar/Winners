import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { PlayerNameModal } from '../components/ui/PlayerNameModal';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../types/game';
import { LOBBY_PLAYERS } from '../data/mockPlayers';
import { Users, Play, Edit3, Sparkles, UserPlus } from 'lucide-react';

export function Lobby() {
  const navigate = useNavigate();
  const { setGameState, currentPlayer } = useGameStore();
  const [visiblePlayers, setVisiblePlayers] = useState<typeof LOBBY_PLAYERS>([]);
  const [allJoined, setAllJoined] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'new'>('edit');

  useEffect(() => {
    setGameState(GameState.LOBBY);

    LOBBY_PLAYERS.forEach((player, index) => {
      setTimeout(() => {
        setVisiblePlayers((prev) => [...prev, player]);
        if (index === LOBBY_PLAYERS.length - 1) {
          setTimeout(() => setAllJoined(true), 400);
        }
      }, 400 + index * 400);
    });
  }, [setGameState]);

  const handleStartGame = () => {
    // If player has no name yet, prompt before starting!
    if (!currentPlayer.name || currentPlayer.name.trim().length === 0) {
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
              <span>🎮</span> MATCH LOBBY
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-1 tracking-tight">
              DOOM SCROLL ARENA
            </h1>
            <p className="text-white/60 text-xs font-semibold">
              Connecting opponents with questionable life choices...
            </p>
          </motion.div>

          {/* Player List Card */}
          <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-5 shadow-xl mb-4">
            <div className="space-y-2.5">
              <AnimatePresence>
                {visiblePlayers.map((player) => {
                  const isCurrent = player.isCurrentPlayer;
                  const displayName = isCurrent ? currentPlayer.name : player.name;
                  const displayAvatar = isCurrent ? currentPlayer.avatar : player.avatar;

                  return (
                    <motion.div
                      key={player.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                        isCurrent
                          ? 'bg-[#58cc02]/15 border-2 border-[#58cc02] shadow-sm'
                          : 'bg-[#131f24] border-2 border-[#2b3e4a]'
                      }`}
                      initial={{ opacity: 0, x: -30, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                    >
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-[#2b3e4a] flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {displayAvatar}
                      </div>

                      {/* Name and Tag */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-display font-black text-sm sm:text-base text-white truncate">
                            {displayName || 'Anonymous Scroller'}
                          </p>
                          {isCurrent && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-[#58cc02] text-white px-1.5 py-0.5 rounded-full">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-white/50">
                          {isCurrent ? 'Thumb Ready & Stretched' : 'Bot Challenger'}
                        </p>
                      </div>

                      {/* Edit buttons or green ready dot */}
                      {isCurrent ? (
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
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-[#58cc02] shadow-[0_0_8px_rgba(88,204,2,0.8)]" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Waiting slots */}
              {visiblePlayers.length < LOBBY_PLAYERS.length && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#131f24]/50 border-2 border-dashed border-[#2b3e4a] animate-pulse">
                  <div className="w-11 h-11 rounded-xl bg-[#131f24] flex items-center justify-center text-white/30 text-base">
                    ?
                  </div>
                  <p className="text-white/40 text-xs font-bold">Summoning competitor...</p>
                </div>
              )}
            </div>
          </div>

          {/* Connection counter */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-white/70 mb-1">
              <Users size={14} className="text-[#58cc02]" />
              <span className="font-display font-black text-xs uppercase tracking-wider">
                {visiblePlayers.length} of {LOBBY_PLAYERS.length} Competitors Connected
              </span>
            </div>
            {allJoined && (
              <p className="text-[#58cc02] text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                <Sparkles size={12} /> Arena is full! Ready for battle!
              </p>
            )}
          </div>

          {/* Start button */}
          <Button
            variant="cta"
            size="xl"
            fullWidth
            onClick={handleStartGame}
            disabled={!allJoined}
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

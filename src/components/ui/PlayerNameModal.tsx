import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Button } from './Button';
import { Sparkles, X, Trophy, UserCheck } from 'lucide-react';

const AVATARS = ['😎', '😴', '🧟‍♀️', '🤳', '🤡', '💀', '🫠', '🤖', '👽', '🦊', '🐱', '🤪', '⚡', '🔥', '👑'];

interface PlayerNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, avatar: string) => void;
  title?: string;
  buttonText?: string;
  /** 'edit' keeps current values; 'new' starts with a blank slate */
  mode?: 'edit' | 'new';
}

export function PlayerNameModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'ENTER YOUR ATHLETE NAME 📱',
  buttonText = 'LET\'S SCROLL 🚀',
  mode = 'edit',
}: PlayerNameModalProps) {
  const { setPlayerName, clearPlayer, checkExistingPlayer } = useGameStore();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😎');
  const [error, setError] = useState('');

  // Live lookup of whether typed name already exists on leaderboard
  const [existingInfo, setExistingInfo] = useState<{ exists: boolean; highestScore?: number; avatar?: string }>({
    exists: false,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'new') {
      clearPlayer();
      setName('');
      setSelectedAvatar('😎');
      setExistingInfo({ exists: false });
    } else {
      const player = useGameStore.getState().currentPlayer;
      const initialName = player.name || '';
      setName(initialName);
      setSelectedAvatar(player.avatar || '😎');
      if (initialName.trim()) {
        setExistingInfo(checkExistingPlayer(initialName));
      }
    }
    setError('');
  }, [isOpen, mode, clearPlayer, checkExistingPlayer]);

  // Check existing player when typing
  const handleNameChange = (val: string) => {
    setName(val);
    if (error) setError('');
    const trimmed = val.trim();
    if (trimmed.length >= 2) {
      const info = checkExistingPlayer(trimmed);
      setExistingInfo(info);
      if (info.exists && info.avatar) {
        setSelectedAvatar(info.avatar);
      }
    } else {
      setExistingInfo({ exists: false });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a player name!');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    setPlayerName(trimmed, selectedAvatar);
    onConfirm(trimmed, selectedAvatar);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Card — Duolingo minimal style */}
          <motion.div
            className="relative w-full max-w-md bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-6 md:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <span className="text-[11px] font-black uppercase tracking-widest bg-[#1cb0f6]/20 text-[#1cb0f6] px-3 py-1 rounded-full border border-[#1cb0f6]/40">
                {mode === 'new' ? 'NEW ATHLETE' : 'PLAYER PROFILE'}
              </span>
              <h3 className="font-display font-black text-2xl text-white mt-2">
                {title}
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Your score will be recorded directly on the public scoreboard!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1cb0f6] mb-1.5">
                  Player Name:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl select-none">
                    {selectedAvatar}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    maxLength={20}
                    placeholder="Enter athlete name..."
                    autoFocus
                    className="w-full bg-[#131f24] border-2 border-[#2b3e4a] focus:border-[#58cc02] rounded-2xl py-3 pl-12 pr-4 text-white font-display font-bold text-lg outline-none placeholder-white/30 transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-xs text-[#ff4b4b] font-bold mt-1 ml-1">{error}</p>
                )}

                {/* Unique name feedback banner */}
                {existingInfo.exists && existingInfo.highestScore !== undefined && (
                  <motion.div
                    className="mt-2 p-2.5 rounded-xl bg-[#ffc800]/15 border border-[#ffc800]/40 flex items-center gap-2 text-xs text-[#ffc800]"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Trophy size={16} className="shrink-0 text-[#ffc800]" />
                    <p className="font-semibold leading-tight">
                      <span className="font-black">Returning Player!</span> High score:{' '}
                      <span className="font-black text-white">{existingInfo.highestScore.toLocaleString()} PTS</span>. Beat it to update the leaderboard!
                    </p>
                  </motion.div>
                )}

                {!existingInfo.exists && name.trim().length >= 2 && (
                  <motion.div
                    className="mt-2 p-2 rounded-xl bg-[#58cc02]/15 border border-[#58cc02]/30 flex items-center gap-2 text-xs text-[#58cc02]"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <UserCheck size={14} className="shrink-0" />
                    <p className="font-semibold leading-tight">
                      New athlete name! Ready to set your first score.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-white/70 mb-1.5">
                  Select Mascot / Avatar:
                </label>
                <div className="flex flex-wrap gap-2 justify-center p-2 bg-[#131f24] rounded-2xl border border-[#2b3e4a]">
                  {AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-[#58cc02] scale-110 shadow-[0_0_12px_rgba(88,204,2,0.8)] border-2 border-white'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  fullWidth
                  icon={<Sparkles size={18} />}
                  className="py-3.5"
                >
                  {buttonText}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

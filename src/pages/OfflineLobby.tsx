import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Users, Clock, Play, User, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useGameStore, OfflinePlayer } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { DURATION_OPTIONS, OfflineSubMode } from '../types/game';

const AVATAR_OPTIONS = [
  '😎', '😴', '🧟‍♀️', '🤳', '🤡',
  '💀', '🫠', '🤖', '👽', '🦊',
  '🐱', '🤪', '⚡', '🔥', '👑',
];

export function OfflineLobby() {
  const navigate = useNavigate();
  const {
    setGameMode,
    setGameDuration,
    setOfflinePlayers,
    setPlayerName,
    setOfflineSubMode,
    offlineSubMode,
    gameDuration,
    soloHighScore,
  } = useGameStore();

  const [subMode, setSubMode] = useState<OfflineSubMode>(offlineSubMode || 'single');
  const [players, setPlayers] = useState<OfflinePlayer[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [selectedDuration, setSelectedDuration] = useState(gameDuration || 30);
  const [errorMessage, setErrorMessage] = useState('');

  // Single mode: initialize with previously saved entry if available
  const [singleName, setSingleName] = useState(() => {
    try {
      const saved = localStorage.getItem('doom_single_player_name');
      if (saved && saved.trim()) return saved.trim();
    } catch (e) {}
    const storeName = useGameStore.getState().currentPlayer?.name?.trim();
    if (storeName && !['player', 'player 1', 'solo player', 'solo athlete'].includes(storeName.toLowerCase())) {
      return storeName;
    }
    const profileName = useAuthStore.getState().profile?.username?.trim();
    if (profileName) return profileName;
    return '';
  });

  const [singleAvatar, setSingleAvatar] = useState(() => {
    try {
      const saved = localStorage.getItem('doom_single_player_avatar');
      if (saved) return saved;
    } catch (e) {}
    const storeAvatar = useGameStore.getState().currentPlayer?.avatar;
    if (storeAvatar) return storeAvatar;
    const profileAvatar = useAuthStore.getState().profile?.avatar;
    if (profileAvatar) return profileAvatar;
    return AVATAR_OPTIONS[0];
  });

  const [singleError, setSingleError] = useState('');

  const handleSubModeChange = (mode: OfflineSubMode) => {
    setSubMode(mode);
    setOfflineSubMode(mode);
  };

  const handleSingleNameChange = (val: string) => {
    setSingleName(val);
    if (singleError) setSingleError('');
    try {
      localStorage.setItem('doom_single_player_name', val);
    } catch (e) {}
  };

  const handleSingleAvatarChange = (avatar: string) => {
    setSingleAvatar(avatar);
    try {
      localStorage.setItem('doom_single_player_avatar', avatar);
    } catch (e) {}
  };

  const handleAddPlayer = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setErrorMessage('Please enter a player name');
      return;
    }

    if (players.length >= 8) {
      setErrorMessage('Maximum 8 players reached');
      return;
    }

    const isDuplicate = players.some(
      (p) => p.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMessage('A player with this name already exists');
      return;
    }

    setErrorMessage('');
    const newPlayer: OfflinePlayer = {
      name: trimmedName,
      avatar: selectedAvatar,
    };

    const updated = [...players, newPlayer];
    setPlayers(updated);
    setNameInput('');

    // Rotate to next avatar for convenience
    const currentIndex = AVATAR_OPTIONS.indexOf(selectedAvatar);
    const nextAvatar = AVATAR_OPTIONS[(currentIndex + 1) % AVATAR_OPTIONS.length];
    setSelectedAvatar(nextAvatar);
  };

  const handleRemovePlayer = (indexToRemove: number) => {
    setPlayers(players.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDurationChange = (val: number) => {
    setSelectedDuration(val);
    setGameDuration(val);
  };

  const handleStartSingle = () => {
    const trimmed = singleName.trim();
    if (!trimmed) {
      setSingleError('Please enter your athlete name');
      return;
    }

    try {
      localStorage.setItem('doom_single_player_name', trimmed);
      localStorage.setItem('doom_single_player_avatar', singleAvatar);
    } catch (e) {}

    setGameMode('offline');
    setOfflineSubMode('single');
    setGameDuration(selectedDuration);

    const soloPlayer: OfflinePlayer = { name: trimmed, avatar: singleAvatar };
    setOfflinePlayers([soloPlayer]);
    setPlayerName(soloPlayer.name, soloPlayer.avatar);
    navigate('/offline/play');
  };

  const handleStartTeam = () => {
    if (players.length === 0) return;

    setGameMode('offline');
    setOfflineSubMode('team');
    setGameDuration(selectedDuration);
    setOfflinePlayers(players);
    setPlayerName(players[0].name, players[0].avatar);
    navigate('/offline/play');
  };

  const isSingle = subMode === 'single';

  return (
    <div className="page-viewport relative bg-[#131f24] text-white flex flex-col min-h-screen">
      <AppNavbar />

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 relative z-10 w-full">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
          {/* Back button & Header */}
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b2b34] hover:bg-[#253945] border-2 border-[#2b3e4a] text-white/80 hover:text-white text-xs font-display font-black uppercase tracking-wider transition-all mb-3 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>BACK</span>
            </button>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1cb0f6]/20 border border-[#1cb0f6]/40 text-[#1cb0f6] text-xs font-black uppercase tracking-wider mb-2">
                <span>🎮</span> OFFLINE ARENA
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                {isSingle ? 'SOLO CHALLENGE' : 'TEAM BATTLE'}
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-semibold mt-1">
                {isSingle
                  ? 'Beat your personal high score!'
                  : 'Pass the phone and battle friends for the highest scroll score!'}
              </p>
            </motion.div>
          </div>

          {/* Single / Team Toggle */}
          <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-3 sm:p-4 shadow-xl">
            <div className="grid grid-cols-2 p-1 bg-[#131f24] rounded-2xl border-2 border-[#2b3e4a] shadow-inner">
              <button
                type="button"
                onClick={() => handleSubModeChange('single')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isSingle
                    ? 'bg-[#ffc800] text-[#131f24] shadow-md border-b-[3px] border-[#d4a600]'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border-b-[3px] border-transparent'
                }`}
              >
                <User size={14} />
                <span>SINGLE</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubModeChange('team')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  !isSingle
                    ? 'bg-[#1cb0f6] text-white shadow-md border-b-[3px] border-[#1899d6]'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border-b-[3px] border-transparent'
                }`}
              >
                <Users size={14} />
                <span>TEAM</span>
              </button>
            </div>
          </div>

          {/* Solo High Score Banner (single mode only) */}
          {isSingle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1b2b34] border-2 border-[#ffc800]/40 rounded-3xl p-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ffc800]/15 border-2 border-[#ffc800]/30 flex items-center justify-center text-2xl shadow-sm">
                    🏆
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#ffc800]">
                      PERSONAL BEST
                    </p>
                    <p className="font-display font-black text-2xl text-white">
                      {soloHighScore.toLocaleString()}{' '}
                      <span className="text-sm text-[#ffc800]">PTS</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffc800]/15 border border-[#ffc800]/30 text-[#ffc800] text-[10px] font-black uppercase tracking-wider">
                  <Zap size={12} />
                  <span>BEAT IT!</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Solo Athlete Card (Single mode) */}
          {isSingle && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-6 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2b3e4a]">
                <User size={18} className="text-[#ffc800]" />
                <h2 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide">
                  ATHLETE PROFILE
                </h2>
              </div>

              <div className="space-y-4">
                {/* Avatar selection */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">
                    1. CHOOSE AVATAR
                  </label>
                  <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                    {AVATAR_OPTIONS.map((emoji) => {
                      const isSelected = singleAvatar === emoji;
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleSingleAvatarChange(emoji)}
                          className={`text-2xl h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#ffc800]/20 border-2 border-[#ffc800] scale-110 shadow-md ring-2 ring-[#ffc800]/40'
                              : 'bg-[#131f24] border border-[#2b3e4a] hover:border-white/40 hover:bg-[#1a2830]'
                          }`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">
                    2. ATHLETE NAME (MAX 20 CHARS)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={20}
                      value={singleName}
                      onChange={(e) => handleSingleNameChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleStartSingle();
                        }
                      }}
                      placeholder="e.g. Master Scroller"
                      className="w-full h-12 px-4 rounded-2xl bg-[#131f24] border-2 border-[#2b3e4a] focus:border-[#ffc800] text-white placeholder-white/40 font-bold text-sm focus:outline-none transition-colors"
                    />
                    <span className="absolute right-3 top-3.5 text-[11px] text-white/40 font-bold">
                      {singleName.length}/20
                    </span>
                  </div>
                  {singleError && (
                    <p className="text-[#ff4b4b] text-xs font-bold mt-1.5 flex items-center gap-1">
                      ⚠️ {singleError}
                    </p>
                  )}
                  {singleName.trim() && (
                    <p className="text-[#58cc02] text-[11px] font-bold mt-1.5 flex items-center gap-1">
                      ✓ Ready as <span className="font-black text-white">{singleName.trim()}</span> {singleAvatar}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Team Player Management (team mode only) */}
          <AnimatePresence mode="wait">
            {!isSingle && (
              <motion.div
                key="team-section"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-6 shadow-xl">
                  {/* Header with Player Count */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2b3e4a]">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-[#1cb0f6]" />
                      <h2 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide">
                        ATHLETES ({players.length}/8)
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#131f24] border border-[#2b3e4a] text-[#ffc800] text-xs font-display font-black tracking-wider">
                      {players.length}/8 PLAYERS
                    </span>
                  </div>

                  {/* Add Player Form */}
                  <div className="space-y-4 mb-5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">
                        1. CHOOSE AVATAR
                      </label>
                      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                        {AVATAR_OPTIONS.map((emoji) => {
                          const isSelected = selectedAvatar === emoji;
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setSelectedAvatar(emoji)}
                              className={`text-2xl h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#1cb0f6]/20 border-2 border-[#1cb0f6] scale-110 shadow-md ring-2 ring-[#1cb0f6]/40'
                                  : 'bg-[#131f24] border border-[#2b3e4a] hover:border-white/40 hover:bg-[#1a2830]'
                              }`}
                            >
                              {emoji}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">
                        2. ENTER PLAYER NAME (MAX 20 CHARS)
                      </label>
                      <div className="flex flex-col sm:row gap-2.5 sm:flex-row">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            maxLength={20}
                            value={nameInput}
                            onChange={(e) => {
                              setNameInput(e.target.value);
                              if (errorMessage) setErrorMessage('');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddPlayer();
                              }
                            }}
                            placeholder="e.g. Master Scroller"
                            disabled={players.length >= 8}
                            className="w-full h-12 px-4 rounded-2xl bg-[#131f24] border-2 border-[#2b3e4a] focus:border-[#1cb0f6] text-white placeholder-white/40 font-bold text-sm focus:outline-none transition-colors"
                          />
                          <span className="absolute right-3 top-3.5 text-[11px] text-white/40 font-bold">
                            {nameInput.length}/20
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          onClick={handleAddPlayer}
                          disabled={players.length >= 8 || !nameInput.trim()}
                          icon={<Plus size={18} />}
                          className={`h-12 px-6 shrink-0 ${
                            players.length >= 8 || !nameInput.trim()
                              ? 'opacity-50 cursor-not-allowed shadow-none'
                              : ''
                          }`}
                        >
                          ADD PLAYER
                        </Button>
                      </div>
                      {errorMessage && (
                        <p className="text-[#ff4b4b] text-xs font-bold mt-1.5 flex items-center gap-1">
                          ⚠️ {errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* List of Added Players */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-white/60 mb-2">
                      ROSTER ({players.length} OF 8)
                    </label>

                    {players.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[#131f24] border border-[#2b3e4a] text-center">
                        <p className="text-3xl mb-2">👥</p>
                        <p className="text-white/80 font-display font-black text-sm uppercase tracking-wide">
                          NO PLAYERS ADDED YET
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          Add at least 1 player (up to 8) to start the local competition!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        <AnimatePresence initial={false}>
                          {players.map((player, idx) => (
                            <motion.div
                              key={`${player.name}-${idx}`}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                              className="flex items-center justify-between p-3 rounded-2xl bg-[#131f24] border border-[#2b3e4a] hover:border-white/20 transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-[#2b3e4a] flex items-center justify-center text-xl shadow-inner shrink-0">
                                  {player.avatar}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider">
                                      #{idx + 1}
                                    </span>
                                    <p className="font-display font-black text-sm sm:text-base text-white truncate">
                                      {player.name}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                                    Player {idx + 1}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemovePlayer(idx)}
                                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-[#ff4b4b]/20 border border-white/10 hover:border-[#ff4b4b]/50 text-white/50 hover:text-[#ff4b4b] flex items-center justify-center transition-all cursor-pointer shrink-0 ml-2"
                                title="Remove player"
                              >
                                <X size={16} />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Duration Selector Section */}
          <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2b3e4a]">
              <Clock size={18} className="text-[#ffc800]" />
              <h2 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide">
                SELECT DURATION
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = selectedDuration === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleDurationChange(opt.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer select-none text-center ${
                      isSelected
                        ? 'bg-[#ffc800]/15 border-[#ffc800] text-white ring-2 ring-[#ffc800]/40 shadow-lg shadow-[#ffc800]/10 scale-102'
                        : 'bg-[#131f24] border-[#2b3e4a] text-white/70 hover:border-white/30 hover:bg-[#18262f]'
                    }`}
                  >
                    <span className="text-2xl mb-1">{opt.emoji}</span>
                    <span className="font-display font-black text-sm text-white">
                      {opt.label}
                    </span>
                    <span className="text-[10px] font-bold text-white/50 mt-0.5 line-clamp-1">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <div>
            <Button
              variant="cta"
              size="xl"
              fullWidth
              disabled={isSingle ? !singleName.trim() : players.length === 0}
              onClick={isSingle ? handleStartSingle : handleStartTeam}
              icon={<Play size={22} className="fill-current" />}
              className={`py-4 text-base sm:text-lg ${
                (isSingle ? !singleName.trim() : players.length === 0)
                  ? 'opacity-40 cursor-not-allowed shadow-none active:translate-y-0'
                  : ''
              }`}
            >
              {isSingle ? 'START SOLO CHALLENGE 🚀' : 'START DOOM SCROLLING 🚀'}
            </Button>

            {isSingle && !singleName.trim() && (
              <p className="text-center text-white/40 text-xs font-semibold mt-2">
                Enter your athlete name above to start the challenge.
              </p>
            )}

            {!isSingle && players.length === 0 && (
              <p className="text-center text-white/40 text-xs font-semibold mt-2">
                Add at least 1 player above to unlock the start button.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default OfflineLobby;

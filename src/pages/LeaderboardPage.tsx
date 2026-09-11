import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { AppNavbar } from '../components/layout/AppNavbar';
import { Button } from '../components/ui/Button';
import { Trophy, Play, UserPlus, Trash2, RotateCcw, Plus, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PlayerNameModal } from '../components/ui/PlayerNameModal';

const AVATARS = ['😎', '😴', '🧟‍♀️', '🤳', '🤡', '💀', '🫠', '🤖', '👽', '🦊', '🐱', '🤪', '⚡', '🔥', '👑'];

export function LeaderboardPage() {
  const navigate = useNavigate();
  const {
    leaderboardPlayers,
    currentPlayer,
    removeLeaderboardPlayer,
    clearLeaderboard,
    addLeaderboardPlayer,
  } = useGameStore();

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);

  // Form state for adding player manually
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('😎');
  const [newPlayerScore, setNewPlayerScore] = useState('');
  const [addError, setAddError] = useState('');

  const top3 = leaderboardPlayers.slice(0, 3);
  const isEmpty = leaderboardPlayers.length === 0;

  const handlePlay = () => {
    if (!currentPlayer.name || currentPlayer.name.trim().length === 0) {
      setIsNameModalOpen(true);
      return;
    }
    navigate('/lobby');
  };

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) {
      setAddError('Please enter a player name.');
      return;
    }
    const scoreNum = parseInt(newPlayerScore, 10);
    if (isNaN(scoreNum) || scoreNum < 0) {
      setAddError('Please enter a valid positive score.');
      return;
    }

    addLeaderboardPlayer(trimmed, scoreNum, newPlayerAvatar);
    setNewPlayerName('');
    setNewPlayerScore('');
    setAddError('');
    setIsAddPlayerModalOpen(false);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all players from the leaderboard?')) {
      clearLeaderboard();
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Header Title */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffc800]/20 border border-[#ffc800]/40 text-[#ffc800] text-xs font-black uppercase tracking-widest mb-2">
            <Trophy size={14} /> OFFICIAL LEADERBOARD
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            DOOM SCROLL LEAGUE
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mt-1">
            Exclusively real players added by you. No dummy bots or fake accounts.
          </p>

          {/* Quick Action Bar */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="cta"
              size="sm"
              onClick={handlePlay}
              icon={<Play size={14} />}
            >
              PLAY MATCH 🚀
            </Button>

            <button
              onClick={() => setIsAddPlayerModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1cb0f6]/15 hover:bg-[#1cb0f6]/30 text-[#1cb0f6] border border-[#1cb0f6]/40 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>ADD PLAYER</span>
            </button>

            {!isEmpty && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff4b4b]/10 hover:bg-[#ff4b4b]/20 text-[#ff4b4b] border border-[#ff4b4b]/30 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                title="Clear all players from the leaderboard"
              >
                <Trash2 size={13} />
                <span>CLEAR ALL</span>
              </button>
            )}
          </div>
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
              NO PLAYERS ADDED YET!
            </h2>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              All dummy bots have been removed! The leaderboard is completely clean and waiting for real scores.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="cta"
                size="lg"
                onClick={handlePlay}
                icon={<Play size={18} />}
                className="flex-1"
              >
                PLAY FIRST MATCH 🚀
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsAddPlayerModalOpen(true)}
                icon={<Plus size={18} />}
                className="flex-1"
              >
                ADD PLAYER ➕
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 Podium */}
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
                <span>SCORE &amp; ACTION</span>
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
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
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
                        <span className="text-2xl shrink-0">{player.avatar}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-sm text-white truncate">
                              {player.name}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-[#58cc02] text-white text-[10px] font-black uppercase tracking-wider shrink-0">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-display font-black text-sm sm:text-base text-[#ffc800]">
                            {player.score.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-white/40 ml-1">PTS</span>
                        </div>

                        {/* Remove player button */}
                        <button
                          onClick={() => removeLeaderboardPlayer(player.id)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-[#ff4b4b] hover:bg-[#ff4b4b]/10 transition-colors cursor-pointer"
                          title={`Remove ${player.name} from leaderboard`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Manual Add Player Modal */}
      <AnimatePresence>
        {isAddPlayerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddPlayerModalOpen(false)}
            />

            <motion.div
              className="relative w-full max-w-md bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-6 shadow-2xl z-10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <button
                onClick={() => setIsAddPlayerModalOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded-full hover:bg-white/10"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-5">
                <span className="text-[11px] font-black uppercase tracking-widest bg-[#1cb0f6]/20 text-[#1cb0f6] px-3 py-1 rounded-full border border-[#1cb0f6]/40">
                  MANUAL ENTRY
                </span>
                <h3 className="font-display font-black text-2xl text-white mt-2">
                  ADD ATHLETE SCORE 🏆
                </h3>
              </div>

              <form onSubmit={handleAddPlayerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white/70 mb-1">
                    Player Name:
                  </label>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => {
                      setNewPlayerName(e.target.value);
                      if (addError) setAddError('');
                    }}
                    maxLength={20}
                    placeholder="e.g. John, Alex..."
                    className="w-full bg-[#131f24] border-2 border-[#2b3e4a] focus:border-[#1cb0f6] rounded-2xl py-2.5 px-4 text-white font-display font-bold text-base outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white/70 mb-1">
                    Score (PTS):
                  </label>
                  <input
                    type="number"
                    value={newPlayerScore}
                    onChange={(e) => {
                      setNewPlayerScore(e.target.value);
                      if (addError) setAddError('');
                    }}
                    placeholder="e.g. 15000"
                    className="w-full bg-[#131f24] border-2 border-[#2b3e4a] focus:border-[#ffc800] rounded-2xl py-2.5 px-4 text-white font-display font-bold text-base outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white/70 mb-1">
                    Select Avatar:
                  </label>
                  <div className="flex flex-wrap gap-2 justify-center p-2 bg-[#131f24] rounded-2xl border border-[#2b3e4a]">
                    {AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => setNewPlayerAvatar(av)}
                        className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                          newPlayerAvatar === av
                            ? 'bg-[#1cb0f6] scale-110 border-2 border-white'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                {addError && (
                  <p className="text-xs text-[#ff4b4b] font-bold text-center">{addError}</p>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<Sparkles size={18} />}
                  >
                    ADD TO LEADERBOARD 🏆
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

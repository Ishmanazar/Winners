import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import {
  Sparkles,
  Trophy,
  WifiOff,
  Globe,
  Play,
  LogOut,
} from 'lucide-react';

// Import images directly from src/assets for athlete showcase
import addictAsset from '../assets/IMG_5531.PNG';
import cardioAsset from '../assets/IMG_5532.PNG';
import marathonAsset from '../assets/IMG_5533.PNG';

type PlayMode = 'offline' | 'online';

export function Home() {
  const navigate = useNavigate();
  const { setGameMode } = useGameStore();
  const { isAuthenticated, profile, signOut } = useAuthStore();

  const [selectedMode, setSelectedMode] = useState<PlayMode>('offline');

  const handlePlay = () => {
    setGameMode(selectedMode);
    if (selectedMode === 'offline') {
      navigate('/offline/lobby');
    } else {
      if (isAuthenticated) {
        navigate('/online/lobby');
      } else {
        navigate('/auth', { state: { from: '/online/lobby' } });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setSelectedMode('offline');
  };

  const isOffline = selectedMode === 'offline';

  return (
    <div className="page-viewport relative bg-[#131f24] text-white h-[100dvh] max-h-[100dvh] overflow-hidden">
      {/* Top Gamified Navbar */}
      <AppNavbar />

      {/* Main Content — flex-1 centered, no scroll */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 relative z-10 overflow-hidden">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          {/* Top Pill */}
          <motion.div
            className="mb-1.5"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <span className="px-3 py-0.5 rounded-full bg-[#58cc02]/20 border border-[#58cc02]/40 text-[#58cc02] text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <span>🎮</span> SOCIAL MEDIA OLYMPICS
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-none text-center mb-1"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 260 }}
          >
            <span className="text-[#ff4b4b]">DOOM</span>{' '}
            <span className="text-[#1cb0f6]">SCROLL</span>
            <br />
            <span className="text-[#ffc800]">&amp; WIN</span>
            <span className="inline-block ml-1.5 text-2xl sm:text-4xl">📱🏆</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-[10px] sm:text-xs text-white/60 font-semibold max-w-xs mx-auto mb-3 text-center leading-snug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
          >
            <span className="text-[#58cc02] font-bold">
              The world's first competitive doom-scrolling simulator.
            </span>
          </motion.p>

          {/* Athlete Showcase Strip */}
          <motion.div
            className="w-full mb-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="flex gap-2 sm:gap-3 justify-center">
              {[
                { src: addictAsset, label: '3AM BOSS', border: 'border-[#ffc800]/60' },
                { src: cardioAsset, label: 'CARDIO PRO', border: 'border-[#1cb0f6]/60' },
                { src: marathonAsset, label: 'MARATHON', border: 'border-[#58cc02]/60' },
              ].map((athlete) => (
                <div
                  key={athlete.label}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 ${athlete.border} bg-[#1b2b34] relative shadow-md group`}
                >
                  <img
                    src={athlete.src}
                    alt={athlete.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="eager"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-[#131f24]/85 py-px text-center">
                    <span className="text-[7px] sm:text-[8px] font-black text-white tracking-wider uppercase">
                      {athlete.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Card — Switcher + Play Button */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-4 sm:p-5 shadow-xl">
              {/* Logged-in indicator (compact, only when online selected & logged in) */}
              {isAuthenticated && profile && selectedMode === 'online' && (
                <motion.div
                  className="flex items-center justify-between gap-2 mb-3 px-3 py-2 rounded-2xl bg-[#58cc02]/10 border border-[#58cc02]/40"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{profile.avatar || '😎'}</span>
                    <div className="min-w-0">
                      <p className="font-display font-black text-xs text-white truncate leading-tight">
                        {profile.username}
                      </p>
                      <p className="text-[9px] text-[#58cc02] font-black uppercase tracking-wider">
                        {(profile.best_score || 0).toLocaleString()} PTS
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-[#ff4b4b]/15 text-white/40 hover:text-[#ff4b4b] text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0"
                  >
                    <LogOut size={10} />
                  </button>
                </motion.div>
              )}

              {/* Mode Switcher Toggle */}
              <div className="grid grid-cols-2 p-1 bg-[#131f24] rounded-2xl border-2 border-[#2b3e4a] mb-4 shadow-inner">
                {/* Offline Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('offline')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isOffline
                      ? 'bg-[#1cb0f6] text-white shadow-md border-b-[3px] border-[#1899d6]'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border-b-[3px] border-transparent'
                  }`}
                >
                  <WifiOff size={14} />
                  <span>OFFLINE</span>
                </button>

                {/* Online Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedMode('online')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    !isOffline
                      ? 'bg-[#58cc02] text-white shadow-md border-b-[3px] border-[#46a302]'
                      : 'text-white/50 hover:text-white hover:bg-white/5 border-b-[3px] border-transparent'
                  }`}
                >
                  <Globe size={14} />
                  <span>ONLINE</span>
                </button>
              </div>

              {/* Mode description */}
              <p className="text-center text-white/50 text-[10px] font-semibold mb-3 leading-snug">
                {isOffline
                  ? '🎮 Play with friends on the same device. No login needed.'
                  : '🌐 Compete worldwide on the global leaderboard. Login required.'}
              </p>

              {/* Play Button */}
              <Button
                variant="cta"
                size="xl"
                fullWidth
                onClick={handlePlay}
                icon={<Play size={20} className="fill-current" />}
                className="py-3.5"
              >
                {isOffline
                  ? 'PLAY OFFLINE 🎮'
                  : isAuthenticated
                  ? 'ENTER ONLINE ARENA 🌐'
                  : 'LOGIN & PLAY ONLINE 🔐'}
              </Button>

              {/* Leaderboard link */}
              <button
                onClick={() => navigate('/leaderboard')}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-2xl bg-[#ffc800]/10 hover:bg-[#ffc800]/20 border border-[#ffc800]/25 text-[#ffc800] text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                <Trophy size={13} />
                <span>LEADERBOARD</span>
              </button>
            </div>
          </motion.div>

          {/* Tip */}
          <motion.p
            className="text-center text-[9px] text-[#ffc800]/80 font-black tracking-wider uppercase mt-2.5 flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <Sparkles size={10} /> 100% Free • No Real Life Productivity Required <Sparkles size={10} />
          </motion.p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-2 text-center border-t-2 border-[#2b3e4a] bg-[#131f24] z-10 relative shrink-0">
        <p className="text-white/40 text-[10px] font-display font-bold">
          SOCIAL MEDIA OLYMPICS • "DOOM SCROLL &amp; WIN"
        </p>
        <p className="text-white/25 text-[8px] mt-0.5">
          No thumbs were harmed. Touch grass afterward. 🌱
        </p>
      </footer>
    </div>
  );
}

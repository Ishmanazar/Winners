import { motion, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, ArrowLeft, Lock, Users, Globe, Sparkles, Check } from 'lucide-react';
import { AppNavbar } from '../components/layout/AppNavbar';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';

export function ModeSelect() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setGameMode } = useGameStore();

  const handleSelectOffline = () => {
    setGameMode('offline');
    navigate('/offline/lobby');
  };

  const handleSelectOnline = () => {
    setGameMode('online');
    if (isAuthenticated) {
      navigate('/online/lobby');
    } else {
      navigate('/auth', { state: { from: '/online/lobby' } });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 24,
      },
    },
  };

  return (
    <div className="page-viewport min-h-screen relative bg-[#131f24] text-white flex flex-col selection:bg-[#58cc02] selection:text-black">
      {/* Top Gamified Navbar */}
      <AppNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Back Button */}
          <div className="w-full flex justify-start mb-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1b2b34] hover:bg-[#233742] border-2 border-[#2b3e4a] hover:border-[#1cb0f6] text-white/70 hover:text-white text-xs font-display font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm active:translate-y-0.5"
            >
              <ArrowLeft size={16} />
              <span>BACK TO HOME</span>
            </button>
          </div>

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Gold Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffc800]/20 border border-[#ffc800]/40 text-[#ffc800] text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
              <Sparkles size={14} />
              <span>SELECT GAME MODE</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-2">
              CHOOSE YOUR <span className="text-[#ffc800]">MODE</span>
            </h1>

            <p className="text-white/60 text-xs sm:text-sm font-semibold max-w-md mx-auto">
              Compete locally with friends or challenge scrolling champions around the globe.
            </p>
          </motion.div>

          {/* Staggered Game Mode Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {/* 🎮 OFFLINE MODE CARD */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSelectOffline}
              className="bg-[#1b2b34] border-2 border-[#2b3e4a] hover:border-[#1cb0f6] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-colors duration-200"
            >
              {/* Subtle accent glow in the corner */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#1cb0f6]/10 rounded-full blur-2xl group-hover:bg-[#1cb0f6]/20 transition-all pointer-events-none" />

              <div>
                {/* Card Top Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#1cb0f6]/20 border-2 border-[#1cb0f6]/40 flex items-center justify-center text-[#1cb0f6] group-hover:scale-110 transition-transform shadow-sm">
                    <Users size={28} />
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#1cb0f6]/20 border border-[#1cb0f6]/40 text-[#1cb0f6] text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                    <WifiOff size={13} /> PASS &amp; PLAY
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-[#1cb0f6] transition-colors mb-2 flex items-center gap-2">
                  <span>🎮</span>
                  <span>OFFLINE MODE</span>
                </h2>

                <p className="text-white/70 text-xs sm:text-sm font-semibold mb-6 leading-relaxed">
                  Play with friends on the same device. Take turns and compare scores!
                </p>

                {/* Features List */}
                <div className="space-y-2.5 mb-6">
                  {['Custom duration', 'Local leaderboard', 'Pass & Play'].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white/80"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#1cb0f6]/20 text-[#1cb0f6] flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Users size={18} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOffline();
                  }}
                >
                  PLAY OFFLINE 🎮
                </Button>
              </div>
            </motion.div>

            {/* 🌐 ONLINE MODE CARD */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSelectOnline}
              className="bg-[#1b2b34] border-2 border-[#2b3e4a] hover:border-[#58cc02] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer group transition-colors duration-200"
            >
              {/* Subtle accent glow in the corner */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#58cc02]/10 rounded-full blur-2xl group-hover:bg-[#58cc02]/20 transition-all pointer-events-none" />

              <div>
                {/* Card Top Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#58cc02]/20 border-2 border-[#58cc02]/40 flex items-center justify-center text-[#58cc02] group-hover:scale-110 transition-transform shadow-sm">
                    <Globe size={28} />
                  </div>

                  {isAuthenticated ? (
                    <span className="px-3 py-1 rounded-full bg-[#58cc02]/20 border border-[#58cc02]/40 text-[#58cc02] text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                      <Wifi size={13} /> READY TO PLAY
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#ff4b4b]/20 border border-[#ff4b4b]/40 text-[#ff4b4b] text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm animate-pulse">
                      <Lock size={13} /> LOGIN REQUIRED
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-[#58cc02] transition-colors mb-2 flex items-center gap-2">
                  <span>🌐</span>
                  <span>ONLINE MODE</span>
                </h2>

                <p className="text-white/70 text-xs sm:text-sm font-semibold mb-6 leading-relaxed">
                  Compete with players worldwide! Climb the global leaderboard!
                </p>

                {/* Features List */}
                <div className="space-y-2.5 mb-6">
                  {['Global rankings', 'Real-time competition', 'Persistent stats'].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white/80"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#58cc02]/20 text-[#58cc02] flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-2">
                <Button
                  variant="cta"
                  size="lg"
                  fullWidth
                  icon={isAuthenticated ? <Globe size={18} /> : <Lock size={18} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOnline();
                  }}
                >
                  {isAuthenticated ? 'ENTER ONLINE ARENA 🌐' : 'LOGIN TO PLAY 🔐'}
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom helper info */}
          <motion.div
            className="mt-8 text-center text-white/40 text-xs font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span>Tip: Online Mode tracks your global PR and earns persistent ranking badges!</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ModeSelect;

import { motion } from 'framer-motion';

export function HeroCharacter() {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto flex items-center justify-center">
      {/* Outer pulsating neon energy rings */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-75 blur-xl -z-10"
        style={{
          background: 'radial-gradient(circle, #f43f5e 0%, #a855f7 50%, #06b6d4 100%)',
        }}
        animate={{
          scale: [0.95, 1.08, 0.95],
          rotate: [0, 4, -4, 0],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Hero Character Card Container */}
      <motion.div
        className="relative w-full h-full rounded-3xl overflow-hidden p-2.5 bg-gradient-to-b from-purple-500/40 via-pink-500/30 to-amber-500/30 border-2 border-white/30 shadow-[0_20px_60px_rgba(236,72,153,0.4)] backdrop-blur-md"
        animate={{
          y: [-8, 8, -8],
          rotate: [-1, 1, -1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Actual High-Res Illustrated Asset from assets folder */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#120f2e]">
          <img
            src="/assets/addict-3am.png"
            alt="The Ultimate Doom Scroller at 3:00 AM"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-110 transition-transform duration-500"
          />

          {/* Glowing screen reflection overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background: 'radial-gradient(circle at 55% 55%, rgba(147, 51, 234, 0.8) 0%, rgba(59, 130, 246, 0.4) 40%, transparent 80%)',
            }}
            animate={{
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Bottom badge */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
            <span className="text-xs font-black text-amber-400 tracking-wider flex items-center gap-1">
              <span>⏰</span> 3:00 AM • 48H STREAK
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              LIVE DOOMING
            </span>
          </div>
        </div>
      </motion.div>

      {/* Floating notification exploding badges around character */}
      <motion.div
        className="absolute -top-3 -right-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.8)] border border-white/40 flex items-center gap-1 z-20"
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 8, -8, 0],
          y: [0, -6, 0],
        }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        <span>🔔</span> 999+ NOTIFS!
      </motion.div>

      <motion.div
        className="absolute top-1/2 -left-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.7)] border border-white/30 flex items-center gap-1 z-20"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -8, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      >
        <span>📱</span> ONE MORE REEL...
      </motion.div>
    </div>
  );
}

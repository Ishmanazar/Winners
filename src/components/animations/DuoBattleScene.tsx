import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const COMIC_CALLOUTS = [
  { text: 'FASTER! 🔥', color: 'from-amber-500 to-red-600', border: 'border-yellow-300' },
  { text: 'COMBO x12! ⚡', color: 'from-cyan-500 to-blue-600', border: 'border-cyan-300' },
  { text: "HE'S CATCHING UP! 🚨", color: 'from-rose-600 to-red-700', border: 'border-rose-400' },
  { text: 'BRO, TOUCH GRASS! 💀', color: 'from-purple-600 to-pink-600', border: 'border-purple-300' },
  { text: 'MY THUMB IS BURNING! 😂', color: 'from-yellow-400 to-orange-500 text-slate-950', border: 'border-yellow-300' },
  { text: 'ONE MORE REEL! 📱', color: 'from-emerald-500 to-teal-600', border: 'border-emerald-300' },
];

export function DuoBattleScene() {
  const [calloutIndex, setCalloutIndex] = useState(0);
  const [side, setSide] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const interval = setInterval(() => {
      setCalloutIndex((prev) => (prev + 1) % COMIC_CALLOUTS.length);
      setSide((prev) => (prev === 'left' ? 'right' : 'left'));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const currentCallout = COMIC_CALLOUTS[calloutIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8 px-2 overflow-hidden">
      {/* Duel Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600/30 to-red-600/30 border border-purple-400/40 text-xs font-black tracking-widest text-purple-200 uppercase mb-2">
          ⚔️ 1V1 MULTIPLAYER SHOWDOWN ⚔️
        </div>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white">
          <span className="text-cyan-400">THE ULTIMATE </span>
          <span className="text-rose-500">DOOM SCROLL DUEL</span>
        </h3>
        <p className="text-sm md:text-base text-white/60 italic mt-1 font-medium">
          "Two players. Two phones. One extremely useless victory."
        </p>
      </div>

      {/* Arena Stage */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#1c133d] to-[#0d0a21] border-2 border-white/20 p-4 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Dynamic Speed Lines background 💨 */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-b from-transparent via-white to-transparent"
              style={{
                width: `${2 + (i % 3)}px`,
                height: '140px',
                left: `${6 + i * 8}%`,
                top: '-140px',
              }}
              animate={{
                y: ['-140px', '500px'],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 0.6 + (i % 3) * 0.2,
                repeat: Infinity,
                delay: (i * 0.1) % 0.8,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Central VS clash & Tug-of-war meter */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 flex items-center justify-center border-4 border-white shadow-[0_0_35px_rgba(244,63,94,0.8)]"
            animate={{
              scale: [1, 1.25, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="font-display font-black text-2xl sm:text-3xl text-white drop-shadow">
              VS
            </span>
          </motion.div>

          <div className="mt-2 text-center">
            <span className="text-xl filter drop-shadow">💨💨💨</span>
            <p className="text-[10px] font-black tracking-widest text-amber-300 uppercase">
              MAX SPEED
            </p>
          </div>
        </div>

        {/* Comic Animated Callout Bubble */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={calloutIndex}
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{
                scale: 1.1,
                opacity: 1,
                y: 0,
                x: side === 'left' ? -80 : 80,
              }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${currentCallout.color} text-white font-display font-black text-xs sm:text-sm border-2 ${currentCallout.border} shadow-[0_8px_25px_rgba(0,0,0,0.5)] whitespace-nowrap`}
            >
              {currentCallout.text}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Combatants Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 items-center relative z-10">
          {/* PLAYER 1: Blue / Purple Identity */}
          <motion.div
            className="flex flex-col items-center text-center p-3 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-transparent border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            animate={{
              x: [0, 6, 0, -4, 0],
              y: [0, -4, 0, 4, 0],
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-black uppercase tracking-wider mb-3">
              <span>🔵</span> PLAYER 1 (YOU)
            </div>

            {/* Combatant Artwork */}
            <div className="relative w-28 h-36 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-cyan-300/60 shadow-[0_0_25px_rgba(56,189,248,0.5)] bg-slate-950">
              <img
                src="/assets/thumb-cardio.png"
                alt="Player 1 Thumb Cardio"
                className="w-full h-full object-cover"
              />
              {/* Speed thumb smoke overlay */}
              <div className="absolute top-2 right-2 text-lg animate-bounce">💨</div>
              <div className="absolute bottom-1 left-1 right-1 bg-black/75 px-2 py-0.5 rounded text-[10px] font-black text-cyan-300">
                SCROLLING CARDIO
              </div>
            </div>

            <div className="mt-3">
              <p className="font-display font-black text-sm sm:text-base text-cyan-300">
                THUMB WARRIOR
              </p>
              <p className="text-xs font-bold text-white/60">Speed: 42 scrolls/sec</p>
            </div>
          </motion.div>

          {/* PLAYER 2: Red / Yellow Identity */}
          <motion.div
            className="flex flex-col items-center text-center p-3 sm:p-5 rounded-2xl bg-gradient-to-bl from-rose-900/40 via-amber-900/30 to-transparent border-2 border-rose-400/50 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
            animate={{
              x: [0, -6, 0, 4, 0],
              y: [0, -4, 0, 4, 0],
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 text-xs font-black uppercase tracking-wider mb-3">
              <span>🔴</span> PLAYER 2 (OPPONENT)
            </div>

            {/* Combatant Artwork */}
            <div className="relative w-28 h-36 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-rose-300/60 shadow-[0_0_25px_rgba(244,63,94,0.5)] bg-slate-950">
              <img
                src="/assets/addict-3am.png"
                alt="Player 2 3AM Addict"
                className="w-full h-full object-cover"
              />
              {/* Speed thumb smoke overlay */}
              <div className="absolute top-2 left-2 text-lg animate-bounce">💨</div>
              <div className="absolute bottom-1 left-1 right-1 bg-black/75 px-2 py-0.5 rounded text-[10px] font-black text-rose-300">
                3:00 AM REEL ADDICT
              </div>
            </div>

            <div className="mt-3">
              <p className="font-display font-black text-sm sm:text-base text-rose-300">
                MIDNIGHT ZOMBIE
              </p>
              <p className="text-xs font-bold text-white/60">Speed: 39 scrolls/sec</p>
            </div>
          </motion.div>
        </div>

        {/* Tug-of-War Score Clash Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between text-xs font-black mb-1.5 px-1">
            <span className="text-cyan-400 flex items-center gap-1">
              <span>🔥</span> 14,250 PTS
            </span>
            <span className="text-white/50 uppercase tracking-widest">LIVE CLASH</span>
            <span className="text-rose-400 flex items-center gap-1">
              13,890 PTS <span>🔥</span>
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-900 border border-white/20 overflow-hidden flex p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-l-full"
              style={{ width: '54%' }}
              animate={{ width: ['52%', '58%', '50%', '54%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="h-full bg-gradient-to-l from-red-500 to-amber-400 rounded-r-full"
              style={{ width: '46%' }}
              animate={{ width: ['48%', '42%', '50%', '46%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';

interface ChampionStickerProps {
  rank: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const RANK_CONFIGS = {
  1: {
    medal: '🥇',
    title: 'THE FINAL SCROLL BOSS',
    image: '/assets/addict-3am.png',
    alt: 'Final Scroll Boss (3:00 AM Addict)',
    bgGradient: 'from-amber-400 via-yellow-500 to-orange-500',
    borderColor: 'border-yellow-300',
    glowColor: 'shadow-[0_0_40px_rgba(250,204,21,0.6)]',
    subtitle: '48H Streak • 3:00 AM',
    badge: '👑 KING OF ROT',
  },
  2: {
    medal: '🥈',
    title: 'CERTIFIED SCROLL ADDICT',
    image: '/assets/thumb-cardio.png',
    alt: 'Certified Scroll Addict (Thumb Cardio)',
    bgGradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    borderColor: 'border-cyan-300',
    glowColor: 'shadow-[0_0_35px_rgba(6,182,212,0.5)]',
    subtitle: 'Thumb Smokin’ • Cardio Pro',
    badge: '⚡ THUMB GYM',
  },
  3: {
    medal: '🥉',
    title: 'PROFESSIONAL TIME WASTER',
    image: '/assets/social-marathon-run.png',
    alt: 'Professional Time Waster (Marathon Runner)',
    bgGradient: 'from-orange-500 via-rose-500 to-red-600',
    borderColor: 'border-orange-300',
    glowColor: 'shadow-[0_0_30px_rgba(251,146,60,0.5)]',
    subtitle: 'Bib INSTA 001 • Endless Lap',
    badge: '🏃 1 MORE SCROLL',
  },
};

const sizeStyles = {
  sm: 'w-32 h-44',
  md: 'w-44 h-60',
  lg: 'w-56 h-72',
};

export function ChampionSticker({ rank, size = 'md', animated = true }: ChampionStickerProps) {
  const config = RANK_CONFIGS[rank];

  return (
    <motion.div
      className={`relative ${sizeStyles[size]} flex flex-col items-center justify-between p-2 rounded-2xl bg-gradient-to-b ${config.bgGradient} ${config.glowColor} border-2 ${config.borderColor} cursor-pointer group`}
      whileHover={{ scale: 1.08, rotate: rank === 1 ? [0, -3, 3, 0] : 2 }}
      animate={
        animated && rank === 1
          ? {
              y: [-4, 4, -4],
              boxShadow: [
                '0 0 30px rgba(250,204,21,0.5)',
                '0 0 55px rgba(250,204,21,0.85)',
                '0 0 30px rgba(250,204,21,0.5)',
              ],
            }
          : undefined
      }
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Dramatic Crown & Sparkles for First Place */}
      {rank === 1 && (
        <>
          <motion.div
            className="absolute -top-7 left-1/2 -translate-x-1/2 text-3xl z-30 select-none filter drop-shadow-md"
            animate={{
              y: [-3, 3, -3],
              rotate: [-5, 5, -5],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👑
          </motion.div>
          {/* Sparkles */}
          <motion.span
            className="absolute -top-3 -left-3 text-xl z-20"
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute -top-2 -right-3 text-xl z-20"
            animate={{ scale: [1.3, 0.8, 1.3], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            🎉
          </motion.span>
        </>
      )}

      {/* Top Medal & Badge */}
      <div className="w-full flex items-center justify-between px-1 z-10">
        <span className="text-xl filter drop-shadow">{config.medal}</span>
        <span className="text-[10px] font-black uppercase tracking-wider bg-black/70 text-white px-2 py-0.5 rounded-full border border-white/20">
          {config.badge}
        </span>
      </div>

      {/* Artwork Container */}
      <div className="relative w-full flex-1 my-1 rounded-xl overflow-hidden bg-slate-950/80 border border-white/30">
        <img
          src={config.image}
          alt={config.alt}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Title & Subtitle */}
      <div className="w-full text-center z-10">
        <p className="font-display font-black text-xs md:text-sm text-white tracking-wider leading-tight drop-shadow-sm uppercase line-clamp-1">
          {config.title}
        </p>
        <p className="text-[10px] font-bold text-white/80 leading-none mt-0.5">
          {config.subtitle}
        </p>
      </div>
    </motion.div>
  );
}

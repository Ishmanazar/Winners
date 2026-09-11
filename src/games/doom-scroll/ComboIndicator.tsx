import { motion, AnimatePresence } from 'framer-motion';

interface ComboIndicatorProps {
  count: number;
  multiplier: number;
  isActive: boolean;
  isBroken?: boolean;
}

export function ComboIndicator({
  count,
  multiplier,
  isActive,
  isBroken = false,
}: ComboIndicatorProps) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isBroken ? (
          <motion.div
            key="broken"
            initial={{ scale: 2, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="arcade-text text-doom-red text-lg md:text-xl"
          >
            💥 COMBO BROKEN!
          </motion.div>
        ) : isActive && count >= 5 ? (
          <motion.div
            key={`combo-${count}`}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1"
          >
            <motion.span
              className="text-xl md:text-2xl"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              🔥
            </motion.span>
            <span className="arcade-text text-doom-gold text-lg md:text-xl">
              COMBO
            </span>
            <motion.span
              key={count}
              className="arcade-text text-doom-pink text-xl md:text-2xl"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              x{count}
            </motion.span>
          </motion.div>
        ) : isActive && count > 0 ? (
          <motion.div
            key="building"
            className="text-white/50 text-sm font-display"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🔥 x{count}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Multiplier badge */}
      {isActive && multiplier > 1 && (
        <motion.div
          className="absolute -top-6 -right-2 bg-doom-gold/20 border border-doom-gold/40 text-doom-gold text-xs font-bold px-2 py-0.5 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          {multiplier}x
        </motion.div>
      )}
    </div>
  );
}

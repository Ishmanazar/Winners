import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GameEventType, GAME_EVENTS } from '../../types/game';

interface RandomEventOverlayProps {
  event: GameEventType | null;
  onDismiss: () => void;
}

export function RandomEventOverlay({ event, onDismiss }: RandomEventOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (event && event !== 'NORMAL') {
      setVisible(true);
      const config = GAME_EVENTS[event];
      const duration = config?.duration || 1500;

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [event, onDismiss]);

  if (!event || event === 'NORMAL') return null;

  const config = GAME_EVENTS[event];
  if (!config) return null;

  const bgColor =
    event === 'VIRAL_POST'
      ? 'from-doom-green/30 to-transparent'
      : event === 'CLICKBAIT'
      ? 'from-doom-gold/30 to-transparent'
      : event === 'BORING_POST'
      ? 'from-white/10 to-transparent'
      : event === 'INFINITE_LOOP'
      ? 'from-doom-purple/30 to-transparent'
      : 'from-doom-red/30 to-transparent';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed inset-0 z-[55] flex items-center justify-center bg-gradient-radial ${bgColor} pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <h2 className="arcade-text text-3xl md:text-5xl mb-2">
              {config.title}
            </h2>
            <p className="text-white/60 text-lg">{config.description}</p>
            {config.pointsMultiplier > 1 && (
              <motion.div
                className="mt-4 inline-block bg-doom-gold/20 text-doom-gold px-4 py-2 rounded-full font-display font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {config.pointsMultiplier}x POINTS!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

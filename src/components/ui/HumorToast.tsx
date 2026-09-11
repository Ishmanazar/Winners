import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const FUNNY_NOTIFICATIONS = [
  { text: 'Welcome back, screen addict. 📱', icon: '🚨' },
  { text: 'Your thumb has been training for this moment. 🏋️', icon: '🔥' },
  { text: '+50. Absolutely meaningless. 🔥', icon: '🏆' },
  { text: 'BRO, GO OUTSIDE 💀', icon: '🌿' },
  { text: 'YOU NEED TO TOUCH GRASS. BUT NOT YET. 😂', icon: '🌱' },
  { text: 'Your screen time report is crying right now. 😭', icon: '📊' },
  { text: 'Battery at 3%. Keep scrolling! 🔋', icon: '⚡' },
  { text: 'Congratulations. You wasted your time professionally. 🏆', icon: '🏅' },
];

export function HumorToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % FUNNY_NOTIFICATIONS.length);
        setVisible(true);
      }, 600);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const current = FUNNY_NOTIFICATIONS[currentIndex];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm pointer-events-none select-none">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-indigo-900/90 backdrop-blur-md border border-pink-500/40 px-4 py-2.5 rounded-full shadow-[0_10px_30px_rgba(236,72,153,0.35)]"
          >
            <span className="text-xl animate-bounce">{current.icon}</span>
            <p className="text-xs md:text-sm font-semibold text-white tracking-wide">
              {current.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

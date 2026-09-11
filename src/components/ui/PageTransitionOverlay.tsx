import { motion } from 'framer-motion';

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (i * 4.2) % 100,
  y: (i * 7.5) % 100,
  color: [
    '#f43f5e',
    '#fb923c',
    '#facc15',
    '#10b981',
    '#06b6d4',
    '#9333ea',
    '#ec4899',
  ][i % 7],
  size: 8 + (i % 5) * 6,
  delay: (i % 6) * 0.04,
}));

export function PageTransitionOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      {/* Colorful radial burst backdrop */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-600/30 to-cyan-500/20 backdrop-blur-[2px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.85, 0] }}
        transition={{ duration: 0.5 }}
      />

      {/* Bursting colorful confetti particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={`burst-${p.id}`}
          className="absolute rounded-full shadow-lg"
          style={{
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.4, 0],
            y: [0, -40, 20],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.5,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.div>
  );
}

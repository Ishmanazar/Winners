import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const SEQUENCE = [
  { value: '3', color: 'text-doom-purple' },
  { value: '2', color: 'text-doom-pink' },
  { value: '1', color: 'text-doom-blue' },
  { value: 'DOOM!', color: 'text-doom-gold', isSpecial: true },
];

export function Countdown({ onComplete }: CountdownProps) {
  const [step, setStep] = useState(0);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; color: string }[]
  >([]);

  const createParticles = useCallback(() => {
    const colors = ['#7c3aed', '#ec4899', '#3b82f6', '#f59e0b', '#10b981'];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      size: Math.random() * 12 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (step >= SEQUENCE.length) {
      onComplete();
      return;
    }

    const timer = setTimeout(
      () => {
        if (step === SEQUENCE.length - 1) {
          // DOOM! stays longer and creates particles
          createParticles();
          setTimeout(() => setStep(step + 1), 1200);
        } else {
          setStep(step + 1);
        }
      },
      step === 0 ? 500 : 800
    );

    return () => clearTimeout(timer);
  }, [step, onComplete, createParticles]);

  if (step >= SEQUENCE.length) return null;

  const current = SEQUENCE[step];

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-doom-bg flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background pulse */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Subtle background athlete image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <img
          src="/assets/thumb-cardio.png"
          alt=""
          className="w-72 md:w-96 opacity-[0.06] object-cover blur-[2px] select-none"
        />
      </div>

      {/* Main counter */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className={`${current.color} font-display font-black select-none`}
          initial={{ scale: 3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            duration: 0.5,
          }}
        >
          <span
            className={`${
              current.isSpecial
                ? 'text-7xl md:text-9xl tracking-wider'
                : 'text-8xl md:text-[12rem]'
            }`}
          >
            {current.value}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Screen shake for DOOM! */}
      {current.isSpecial && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: [-5, 5, -3, 3, -1, 0],
            y: [-3, 3, -5, 2, -1, 0],
          }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Particle burst for DOOM! */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: p.x, y: p.y, scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Subtitle */}
      <motion.p
        className="absolute bottom-1/4 text-white/30 font-display text-sm uppercase tracking-[0.3em]"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {step < 3 ? 'Prepare your thumbs...' : 'START SCROLLING!'}
      </motion.p>
    </motion.div>
  );
}

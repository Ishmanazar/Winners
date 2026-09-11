import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const SEQUENCE = [
  { value: '3', color: 'text-[#ce82ff]' },
  { value: '2', color: 'text-[#1cb0f6]' },
  { value: '1', color: 'text-[#58cc02]' },
  { value: 'SCROLL! 📱', color: 'text-[#ffc800]', isSpecial: true },
];

export function Countdown({ onComplete }: CountdownProps) {
  const [step, setStep] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (step >= SEQUENCE.length) {
      onCompleteRef.current();
      return;
    }

    const duration = step === SEQUENCE.length - 1 ? 700 : 650;
    const timer = setTimeout(() => {
      if (step + 1 >= SEQUENCE.length) {
        onCompleteRef.current();
      } else {
        setStep((s) => s + 1);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [step]);

  const current = SEQUENCE[Math.min(step, SEQUENCE.length - 1)];

  return (
    <div className="fixed inset-0 z-[60] bg-[#131f24] flex items-center justify-center select-none overflow-hidden">
      {/* Background glow pulse */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle, rgba(88,204,2,0.15) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(28,176,246,0.2) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(88,204,2,0.15) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      {/* Main Counter */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className={`${current.color} font-display font-black text-center z-10`}
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 18,
          }}
        >
          <span
            className={`${
              current.isSpecial
                ? 'text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none drop-shadow-[0_0_25px_rgba(255,200,0,0.6)]'
                : 'text-8xl sm:text-9xl md:text-[11rem] leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            }`}
          >
            {current.value}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Subtitle */}
      <motion.p
        className="absolute bottom-1/4 text-white/50 font-display font-black text-xs sm:text-sm uppercase tracking-[0.25em]"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        {step < 3 ? 'WARM UP YOUR THUMBS...' : 'SWIPE RAPIDLY!'}
      </motion.p>
    </div>
  );
}

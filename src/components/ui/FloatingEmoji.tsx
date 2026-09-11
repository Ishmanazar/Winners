import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FloatingEmojiProps {
  emoji: string;
  delay?: number;
  duration?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function FloatingEmoji({
  emoji,
  delay = 0,
  duration = 6,
  size = 'md',
  className = '',
}: FloatingEmojiProps) {
  const randomValues = useMemo(
    () => ({
      x: [0, Math.random() * 40 - 20, Math.random() * -30 + 15, 0],
      y: [0, Math.random() * -30 - 10, Math.random() * 20 - 10, 0],
      rotate: [0, Math.random() * 20 - 10, Math.random() * -15 + 7, 0],
    }),
    []
  );

  return (
    <motion.span
      className={`inline-block select-none pointer-events-none ${sizeMap[size]} ${className}`}
      animate={{
        x: randomValues.x,
        y: randomValues.y,
        rotate: randomValues.rotate,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.span>
  );
}

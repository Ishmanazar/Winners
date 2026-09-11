import { motion } from 'framer-motion';

interface FloatingEmojiItem {
  emoji: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size?: string;
  delay?: number;
  rotateDeg?: number;
  duration?: number;
}

// Positioned strictly along outer borders to prevent overlapping with content when scrolling
const DECORATIVE_EMOJIS: FloatingEmojiItem[] = [
  { emoji: '😂', top: '5%', left: '2%', size: 'text-2xl md:text-3xl', delay: 0, rotateDeg: 15, duration: 4 },
  { emoji: '🔥', top: '8%', right: '2%', size: 'text-2xl md:text-3xl', delay: 0.8, rotateDeg: -12, duration: 3.5 },
  { emoji: '📱', top: '22%', left: '1%', size: 'text-xl md:text-2xl', delay: 1.2, rotateDeg: -18, duration: 4.5 },
  { emoji: '🤯', top: '25%', right: '1%', size: 'text-2xl md:text-3xl', delay: 1.6, rotateDeg: 12, duration: 4.2 },
  { emoji: '💬', top: '45%', left: '2%', size: 'text-xl md:text-2xl', delay: 2, rotateDeg: 8, duration: 5 },
  { emoji: '👀', top: '48%', right: '2%', size: 'text-xl md:text-2xl', delay: 0.5, rotateDeg: -10, duration: 3.8 },
  { emoji: '❤️', top: '65%', left: '2%', size: 'text-2xl md:text-3xl', delay: 2.2, rotateDeg: 14, duration: 4.6 },
  { emoji: '💀', top: '68%', right: '2%', size: 'text-2xl md:text-3xl', delay: 1.4, rotateDeg: -15, duration: 4.8 },
  { emoji: '⚡', top: '85%', left: '2%', size: 'text-xl md:text-2xl', delay: 2.4, rotateDeg: 16, duration: 3.2 },
  { emoji: '🤪', top: '88%', right: '2%', size: 'text-2xl md:text-3xl', delay: 1.1, rotateDeg: -14, duration: 4 },
];

export function FloatingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 hidden lg:block">
      {DECORATIVE_EMOJIS.map((item, idx) => (
        <motion.div
          key={`float-dec-${idx}`}
          className={`absolute select-none cursor-default opacity-40 hover:opacity-70 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] ${item.size}`}
          style={{
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
          }}
          animate={{
            y: [0, -14, 0, 8, 0],
            rotate: [item.rotateDeg || 0, (item.rotateDeg || 0) + 8, (item.rotateDeg || 0) - 8, item.rotateDeg || 0],
          }}
          transition={{
            duration: item.duration || 4,
            repeat: Infinity,
            delay: item.delay || 0,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

import { motion } from 'framer-motion';

interface BubbleItem {
  id: string;
  content: string;
  icon?: string;
  gradient: string;
  borderColor: string;
  position: string;
  delay: number;
  duration: number;
}

// Floating bubbles positioned strictly to the upper sides of the character - zero overlap below
const CHAOS_BUBBLES: BubbleItem[] = [
  {
    id: 'b1',
    icon: '❤️',
    content: '+50',
    gradient: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-400',
    position: 'top-2 -left-4 sm:-left-10',
    delay: 0,
    duration: 3.2,
  },
  {
    id: 'b2',
    icon: '🔥',
    content: 'VIRAL!',
    gradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-yellow-300',
    position: 'top-2 -right-4 sm:-right-10',
    delay: 0.6,
    duration: 3.8,
  },
  {
    id: 'b3',
    icon: '💬',
    content: '"BRO WHAT?"',
    gradient: 'from-sky-500 to-indigo-600',
    borderColor: 'border-cyan-300',
    position: 'top-20 -left-6 sm:-left-14 hidden xs:block',
    delay: 1.2,
    duration: 4.1,
  },
  {
    id: 'b4',
    icon: '👀',
    content: '1,294 views',
    gradient: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-300',
    position: 'top-20 -right-6 sm:-right-14 hidden xs:block',
    delay: 1.8,
    duration: 4.4,
  },
];

export function FloatingSocialElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      {CHAOS_BUBBLES.map((bubble) => (
        <motion.div
          key={bubble.id}
          className={`absolute ${bubble.position}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0.9, 1.12, 0.92, 1.1, 0.9],
            y: [0, -12, 0, 8, 0],
            rotate: [-3, 4, -4, 3, -3],
            opacity: [0.8, 1, 0.85, 1, 0.8],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: 'easeInOut',
          }}
        >
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${bubble.gradient} text-white text-xs font-extrabold shadow-[0_6px_20px_rgba(0,0,0,0.4)] border-2 ${bubble.borderColor} whitespace-nowrap cursor-default`}
          >
            {bubble.icon && <span className="text-sm">{bubble.icon}</span>}
            <span>{bubble.content}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

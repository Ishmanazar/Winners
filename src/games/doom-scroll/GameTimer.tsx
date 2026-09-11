import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GameTimerProps {
  timeRemaining: number;
  totalTime: number;
}

export function GameTimer({ timeRemaining, totalTime }: GameTimerProps) {
  const [isUrgent, setIsUrgent] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    setIsUrgent(timeRemaining <= 10);
    setIsCritical(timeRemaining <= 5);
  }, [timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progress = timeRemaining / totalTime;
  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference * (1 - progress);

  const colorClass = isCritical
    ? 'text-[#ff4b4b]'
    : isUrgent
    ? 'text-[#ffc800]'
    : 'text-white';

  const strokeColor = isCritical
    ? '#ff4b4b'
    : isUrgent
    ? '#ffc800'
    : '#58cc02';

  return (
    <motion.div
      className={`relative flex items-center gap-1.5 ${colorClass}`}
      animate={
        isCritical
          ? { scale: [1, 1.1, 1], x: [-2, 2, -2, 0] }
          : isUrgent
          ? { scale: [1, 1.05, 1] }
          : {}
      }
      transition={{
        duration: isCritical ? 0.3 : 0.5,
        repeat: isCritical || isUrgent ? Infinity : 0,
      }}
    >
      {/* Circular progress */}
      <div className="relative w-10 h-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3.5"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px]">⏱️</span>
        </div>
      </div>

      {/* Time display */}
      <motion.span
        key={timeRemaining}
        className="score-text text-xl md:text-2xl font-black"
        initial={isCritical ? { scale: 1.25 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {timeString}
      </motion.span>
    </motion.div>
  );
}

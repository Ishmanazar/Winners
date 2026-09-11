import { motion } from 'framer-motion';
import { GameTimer } from './GameTimer';
import { ComboIndicator } from './ComboIndicator';
import { Zap, Trophy } from 'lucide-react';

interface DoomScrollHUDProps {
  score: number;
  rank: number;
  comboCount: number;
  comboMultiplier: number;
  comboActive: boolean;
  comboBroken: boolean;
  timeRemaining: number;
  totalTime: number;
  totalPlayers: number;
}

export function DoomScrollHUD({
  score,
  rank,
  comboCount,
  comboMultiplier,
  comboActive,
  comboBroken,
  timeRemaining,
  totalTime,
  totalPlayers,
}: DoomScrollHUDProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-[#131f24]/95 backdrop-blur-md border-b-2 border-[#2b3e4a] shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
    >
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Score */}
          <div className="flex flex-col items-start min-w-[75px]">
            <span className="text-[10px] uppercase tracking-widest text-[#ffc800] font-display font-black flex items-center gap-1">
              <Zap size={12} className="text-[#ffc800]" /> SCORE
            </span>
            <motion.span
              key={score}
              className="score-text text-2xl md:text-3xl font-black text-[#ffc800]"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              {score.toLocaleString()}
            </motion.span>
          </div>

          {/* Combo Indicator in Center */}
          <div className="flex flex-col items-center flex-1">
            <ComboIndicator
              count={comboCount}
              multiplier={comboMultiplier}
              isActive={comboActive}
              isBroken={comboBroken}
            />
          </div>

          {/* Rank */}
          <div className="flex flex-col items-center min-w-[65px]">
            <span className="text-[10px] uppercase tracking-widest text-[#1cb0f6] font-display font-black flex items-center gap-1">
              <Trophy size={12} className="text-[#1cb0f6]" /> RANK
            </span>
            <motion.span
              key={rank}
              className={`score-text text-2xl md:text-3xl font-black ${
                rank === 1
                  ? 'text-[#ffc800]'
                  : rank <= 3
                  ? 'text-[#1cb0f6]'
                  : 'text-white/80'
              }`}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
            >
              #{rank}
            </motion.span>
            <span className="text-[9px] font-bold text-white/40">of {totalPlayers}</span>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-end min-w-[70px]">
            <GameTimer timeRemaining={timeRemaining} totalTime={totalTime} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

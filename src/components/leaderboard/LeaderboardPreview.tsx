import { motion } from 'framer-motion';
import { ChampionSticker } from '../animations/ChampionSticker';
import { GlassCard } from '../ui/GlassCard';
import { useGameStore } from '../../store/gameStore';
import { Player, FUNNY_TITLES } from '../../types/player';
import { useState } from 'react';
import { PlayerNameModal } from '../ui/PlayerNameModal';
import { Edit3 } from 'lucide-react';

interface LeaderboardPreviewProps {
  players?: Player[];
}

export function LeaderboardPreview({ players: propPlayers }: LeaderboardPreviewProps) {
  const storePlayers = useGameStore((state) => state.leaderboardPlayers);
  const activePlayers = propPlayers || storePlayers;
  const top3 = activePlayers.slice(0, 3);
  const rest = activePlayers.slice(3);
  const [firstPlaceRevealed, setFirstPlaceRevealed] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Section title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-purple-500/20 border border-yellow-400/40 text-yellow-300 text-xs font-black uppercase tracking-widest mb-3">
          <span>🏆</span> LIVE ARCADE SCOREBOARD <span>🏆</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-black tracking-tight">
          <span className="text-gradient-rainbow">WHO'S THE BIGGEST DOOM SCROLLER?</span>
        </h2>
        <p className="text-sm md:text-base text-white/60 max-w-md mx-auto mt-2">
          Rankings update live as soon as you enter your athlete name!
        </p>

        {/* Quick button to edit/enter name directly from the scoreboard */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setIsNameModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/35 border border-pink-400/60 text-pink-300 text-xs font-black uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.3)]"
          >
            <Edit3 size={13} />
            <span>ENTER / CHANGE YOUR NAME ON SCOREBOARD</span>
          </button>
        </div>
      </motion.div>

      {/* Top 3 podium with staged dramatic entrances: 3rd -> 2nd -> 1st! */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-10 mb-12 min-h-[380px]">
        {/* 🥈 2nd Place: Enters 2nd (delay 0.5s) */}
        {top3[1] && (
          <motion.div
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.5,
              type: 'spring',
              stiffness: 220,
              damping: 18,
            }}
          >
            <ChampionSticker rank={2} size="sm" />
            <div className="mt-3 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40 inline-flex items-center gap-1">
                {top3[1].name || (top3[1].isCurrentPlayer ? 'YOU (ENTER NAME)' : 'RUNNER UP')}
                {top3[1].isCurrentPlayer && (
                  <span className="text-[9px] bg-cyan-500 text-slate-950 px-1.5 py-0.2 rounded font-black">YOU</span>
                )}
              </span>
              <p className="score-text text-cyan-300 text-lg md:text-2xl mt-1">
                {top3[1].score.toLocaleString()} <span className="text-xs text-white/50">PTS</span>
              </p>
            </div>
            {/* Podium Pillar */}
            <div className="w-24 sm:w-32 md:w-36 h-28 md:h-36 arcade-podium-silver rounded-t-2xl mt-2 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-4xl md:text-5xl filter drop-shadow">🥈</span>
              <span className="text-xs font-black uppercase tracking-widest text-white/80 mt-1">
                2ND PLACE
              </span>
            </div>
          </motion.div>
        )}

        {/* 🥇 1st Place: DRAMATIC OLYMPIC ENTRANCE (delay 1.0s) */}
        {top3[0] && (
          <motion.div
            className="flex flex-col items-center z-20 relative"
            initial={{ opacity: 0, y: -80, scale: 0.4 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            onAnimationComplete={() => setFirstPlaceRevealed(true)}
            transition={{
              delay: 1.0,
              type: 'spring',
              stiffness: 260,
              damping: 14,
            }}
          >
            {/* Olympic Glow Burst Behind 1st Place */}
            <motion.div
              className="absolute -inset-8 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 blur-2xl -z-10 opacity-70"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.85, 0.5],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />

            <ChampionSticker rank={1} size="md" />

            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs md:text-sm font-black uppercase tracking-wider text-yellow-300 bg-yellow-950/90 px-3 py-1 rounded-full border border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                <span>👑</span> {top3[0].name || (top3[0].isCurrentPlayer ? 'YOU (ENTER NAME)' : 'CHAMPION')}
                {top3[0].isCurrentPlayer && (
                  <span className="text-[10px] bg-yellow-400 text-slate-950 px-1.5 py-0.2 rounded font-black">YOU</span>
                )}
              </div>
              <p className="score-text text-yellow-400 text-2xl md:text-4xl mt-1 font-black filter drop-shadow">
                {top3[0].score.toLocaleString()} <span className="text-sm text-yellow-200/60">PTS</span>
              </p>
            </div>

            {/* Tallest Gold Podium Pillar */}
            <div className="w-28 sm:w-36 md:w-44 h-40 md:h-52 arcade-podium-gold rounded-t-2xl mt-2 flex flex-col items-center justify-center relative overflow-hidden">
              <motion.span
                className="text-5xl md:text-6xl filter drop-shadow"
                animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                🥇
              </motion.span>
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-yellow-200 mt-1">
                CHAMPION
              </span>
              <span className="text-[10px] font-bold text-yellow-300/80 tracking-widest">
                THE FINAL BOSS
              </span>
            </div>
          </motion.div>
        )}

        {/* 🥉 3rd Place: Enters 1st (delay 0.2s) */}
        {top3[2] && (
          <motion.div
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 220,
              damping: 18,
            }}
          >
            <ChampionSticker rank={3} size="sm" />
            <div className="mt-3 text-center">
              <span className="text-xs font-black uppercase tracking-wider text-orange-400 bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-500/40 inline-flex items-center gap-1">
                {top3[2].name || (top3[2].isCurrentPlayer ? 'YOU (ENTER NAME)' : '3RD PLACE')}
                {top3[2].isCurrentPlayer && (
                  <span className="text-[9px] bg-orange-500 text-slate-950 px-1.5 py-0.2 rounded font-black">YOU</span>
                )}
              </span>
              <p className="score-text text-orange-300 text-lg md:text-2xl mt-1">
                {top3[2].score.toLocaleString()} <span className="text-xs text-white/50">PTS</span>
              </p>
            </div>
            {/* Podium Pillar */}
            <div className="w-24 sm:w-32 md:w-36 h-20 md:h-28 arcade-podium-bronze rounded-t-2xl mt-2 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-3xl md:text-4xl filter drop-shadow">🥉</span>
              <span className="text-xs font-black uppercase tracking-widest text-white/80 mt-1">
                3RD PLACE
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Rest of the leaderboard scoreboard */}
      <GlassCard variant="vibrant" padding="sm" className="border border-purple-500/30">
        <div className="px-4 py-2.5 bg-purple-950/40 border-b border-white/10 flex items-center justify-between text-xs font-black uppercase tracking-widest text-purple-300">
          <span>RANK &amp; ATHLETE NAME</span>
          <span>SCOREBOARD</span>
        </div>
        <div className="divide-y divide-white/10">
          {rest.map((player, index) => {
            const isMe = player.isCurrentPlayer;
            return (
              <motion.div
                key={player.id}
                className={`flex items-center justify-between py-3.5 px-4 transition-all rounded-xl ${
                  isMe
                    ? 'bg-gradient-to-r from-pink-500/25 via-purple-500/20 to-indigo-500/20 border-2 border-pink-400/60 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                    : 'hover:bg-white/5'
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 * index }}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-display font-black w-8 text-center text-sm py-1 rounded-lg ${
                    isMe ? 'bg-pink-500 text-white font-black' : 'text-white/50 bg-white/5'
                  }`}>
                    #{player.rank}
                  </span>
                  <span className="text-2xl filter drop-shadow">{player.avatar}</span>
                  <div>
                    <p className="font-bold text-sm text-white flex items-center gap-2">
                      <span className={isMe ? 'font-black text-pink-300' : ''}>
                        {player.name || (isMe ? 'YOU (Enter Name Above)' : 'Athlete')}
                      </span>
                      {isMe && (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-yellow-400 text-slate-950 px-2 py-0.5 rounded-full border border-white/40 shadow-sm">
                          YOU
                        </span>
                      )}
                      <span className="text-[10px] font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30 hidden sm:inline">
                        {FUNNY_TITLES[player.rank] || 'Phone Zombie'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="score-text text-base md:text-lg font-black text-amber-400">
                    {player.score.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/40 font-bold">PTS</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Athlete Name Modal Triggered from Scoreboard */}
      <PlayerNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onConfirm={(_name, _avatar) => {
          setIsNameModalOpen(false);
        }}
        title="UPDATE SCOREBOARD NAME 🏷️"
        buttonText="SAVE TO SCOREBOARD 🏆"
      />
    </section>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { GameState } from '../types/game';
import { Countdown } from '../games/doom-scroll/Countdown';
import { DoomScrollGame } from '../games/doom-scroll/DoomScrollGame';
import { Button } from '../components/ui/Button';
import { Trophy, Play, Zap, CheckCircle2 } from 'lucide-react';

interface RoundResult {
  playerName: string;
  avatar: string;
  playerNumber: number;
  score: number;
  hasMore: boolean;
}

export function OfflinePlay() {
  const navigate = useNavigate();
  const {
    gameState,
    score,
    currentPlayer,
    currentOfflinePlayerIndex,
    offlinePlayers,
    startGame,
    nextOfflinePlayer,
  } = useGameStore();

  const [showCountdown, setShowCountdown] = useState(true);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const hasEndedRef = useRef(false);

  // If no offline players configured, redirect or show message
  const hasPlayers = offlinePlayers.length > 0;

  // Track finished game and capture score
  useEffect(() => {
    if (gameState === GameState.FINISHED && !hasEndedRef.current) {
      hasEndedRef.current = true;

      // Capture the score before nextOfflinePlayer() modifies store state
      const capturedScore = score;
      const playerNum = currentOfflinePlayerIndex + 1;
      const finishedPlayer = offlinePlayers[currentOfflinePlayerIndex] || currentPlayer;
      const finishedName = finishedPlayer.name || `Player ${playerNum}`;
      const finishedAvatar = finishedPlayer.avatar || '😎';

      // nextOfflinePlayer() saves current score to offlinePlayers and advances if more players remain
      const hasMore = nextOfflinePlayer();

      setRoundResult({
        playerName: finishedName,
        avatar: finishedAvatar,
        playerNumber: playerNum,
        score: capturedScore,
        hasMore,
      });
    }
  }, [
    gameState,
    score,
    currentOfflinePlayerIndex,
    offlinePlayers,
    currentPlayer,
    nextOfflinePlayer,
  ]);

  const handleCountdownComplete = useCallback(() => {
    startGame();
    setShowCountdown(false);
  }, [startGame]);

  const handleNextPlayer = () => {
    hasEndedRef.current = false;
    setRoundResult(null);
    setShowCountdown(true);
  };

  const handleSeeFinalResults = () => {
    navigate('/offline/results');
  };

  if (!hasPlayers) {
    return (
      <div className="h-[100dvh] bg-[#131f24] flex items-center justify-center p-4 text-white">
        <div className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h2 className="font-display font-black text-xl mb-2">NO PLAYERS CONFIGURED</h2>
          <p className="text-xs text-white/60 mb-5">
            Please set up athletes in the pass-and-play lobby before starting.
          </p>
          <Button
            variant="cta"
            size="md"
            fullWidth
            onClick={() => navigate('/offline/lobby')}
          >
            GO TO LOBBY 🎮
          </Button>
        </div>
      </div>
    );
  }

  // Active player info for the top banner
  const displayPlayerNumber = roundResult
    ? roundResult.playerNumber
    : currentOfflinePlayerIndex + 1;

  const displayPlayerName = roundResult
    ? roundResult.playerName
    : offlinePlayers[currentOfflinePlayerIndex]?.name ||
      currentPlayer.name ||
      `Player ${displayPlayerNumber}`;

  const displayPlayerAvatar = roundResult
    ? roundResult.avatar
    : offlinePlayers[currentOfflinePlayerIndex]?.avatar ||
      currentPlayer.avatar ||
      '😎';

  // Name of the upcoming player when hasMore is true
  const nextPlayer = offlinePlayers[currentOfflinePlayerIndex];

  return (
    <div className="offline-play-wrapper relative h-[100dvh] w-full overflow-hidden bg-[#131f24] flex flex-col text-white select-none">
      {/* CSS adjustments to ensure DoomScrollHUD perfectly aligns under our top banner */}
      <style>{`
        .offline-play-wrapper .fixed.top-0 {
          top: 42px !important;
        }
        .offline-play-wrapper .pt-\\[68px\\] {
          padding-top: 110px !important;
        }
      `}</style>

      {/* Top Banner: PLAYER X's TURN: [name] [avatar] */}
      <div className="fixed top-0 left-0 right-0 h-[42px] z-[70] bg-[#1b2b34] border-b-2 border-[#2b3e4a] px-3 sm:px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-full bg-[#1cb0f6]/20 border border-[#1cb0f6]/40 text-[#1cb0f6] text-[10px] font-black uppercase tracking-wider shrink-0">
            PASS &amp; PLAY
          </span>
          <span className="font-display font-black text-xs sm:text-sm text-white tracking-wide truncate">
            PLAYER {displayPlayerNumber}&apos;s TURN: <span className="text-[#ffc800]">{displayPlayerName}</span> {displayPlayerAvatar}
          </span>
        </div>

        <div className="text-[11px] font-black text-white/60 bg-[#131f24] px-2 py-0.5 rounded-lg border border-[#2b3e4a] shrink-0">
          {displayPlayerNumber} / {offlinePlayers.length}
        </div>
      </div>

      {/* Flow Stage 2: Countdown */}
      {showCountdown && (
        <Countdown onComplete={handleCountdownComplete} />
      )}

      {/* Flow Stage 3: Mount DoomScrollGame when countdown completes */}
      {!showCountdown && !roundResult && (
        <DoomScrollGame />
      )}

      {/* Flow Stage 4: Mini Results Card when round finishes */}
      <AnimatePresence>
        {roundResult && (
          <div className="fixed inset-0 z-[80] bg-[#131f24]/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#1b2b34] border-2 border-[#2b3e4a] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#58cc02]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Round Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58cc02]/20 border border-[#58cc02]/40 text-[#58cc02] text-[11px] font-black uppercase tracking-widest mb-4">
                  <CheckCircle2 size={13} /> ROUND {roundResult.playerNumber} COMPLETE
                </div>

                {/* Player Avatar & Name */}
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#131f24] border-2 border-[#ffc800]/50 flex items-center justify-center text-4xl shadow-inner mb-3">
                  {roundResult.avatar}
                </div>
                <h2 className="font-display font-black text-2xl text-white tracking-tight mb-0.5">
                  {roundResult.playerName}
                </h2>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">
                  Athlete #{roundResult.playerNumber}
                </p>

                {/* Captured Score Box */}
                <div className="bg-[#131f24] border-2 border-[#ffc800]/40 rounded-2xl p-4 mb-6 shadow-inner">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ffc800] flex items-center justify-center gap-1 mb-1">
                    <Zap size={13} className="text-[#ffc800]" /> ROUND SCORE
                  </span>
                  <span className="score-text text-3xl sm:text-4xl font-black text-[#ffc800] tracking-tight">
                    {roundResult.score.toLocaleString()}{' '}
                    <span className="text-lg font-bold text-white/60">PTS</span>
                  </span>
                </div>

                {/* Action Buttons */}
                {roundResult.hasMore ? (
                  <div className="space-y-2.5">
                    <Button
                      variant="cta"
                      size="xl"
                      fullWidth
                      onClick={handleNextPlayer}
                      icon={<Play size={18} />}
                      className="py-4 text-base font-black"
                    >
                      NEXT PLAYER 🚀
                    </Button>
                    {nextPlayer && (
                      <p className="text-xs text-white/60 font-semibold">
                        Pass device to{' '}
                        <span className="text-[#1cb0f6] font-bold">
                          {nextPlayer.name} {nextPlayer.avatar}
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <Button
                      variant="arcade"
                      size="xl"
                      fullWidth
                      onClick={handleSeeFinalResults}
                      icon={<Trophy size={18} />}
                      className="py-4 text-base font-black"
                    >
                      SEE FINAL RESULTS 🏆
                    </Button>
                    <p className="text-xs text-white/60 font-semibold">
                      All athletes have finished their runs!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
